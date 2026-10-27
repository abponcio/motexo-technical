import type { MeshStandardMaterial } from 'three';

// Fine finish stays in the shader so the close shots need no extra texture payload.
export function applySurfaceFinish(material: MeshStandardMaterial) {
  const name = material.name.toLowerCase();
  if (name.includes('red')) return;
  const wood = name.includes('timber'), paper = name.includes('carton');
  const concrete = name.includes('concrete') || name.includes('mineral');
  if (!wood && !paper && !concrete && !name.includes('powdercoat') && !name.includes('enamel') && !name.includes('steel')) return;
  const kind = wood ? 'wood' : paper ? 'paper' : concrete ? 'concrete' : 'coating';
  material.customProgramCacheKey = () => 'motexo-finish-' + kind;
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vSurface;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvSurface = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = `varying vec3 vSurface;
      float surfaceHash(vec3 p) { p = fract(p * .1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
      float surfaceNoise(vec3 p) {
        vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(surfaceHash(i), surfaceHash(i+vec3(1,0,0)),f.x), mix(surfaceHash(i+vec3(0,1,0)),surfaceHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(surfaceHash(i+vec3(0,0,1)),surfaceHash(i+vec3(1,0,1)),f.x),mix(surfaceHash(i+vec3(0,1,1)),surfaceHash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }\n` + shader.fragmentShader;
    const grain = wood ? 'sin(vSurface.z * 85.0 + surfaceNoise(vSurface * 3.0) * 8.0) * .5 + .5' : 'surfaceNoise(vSurface * 28.0)';
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>\nfloat finishGrain = ${grain}; diffuseColor.rgb *= ${wood ? '.85 + finishGrain * .15' : concrete ? '.94 + finishGrain * .06' : '.97 + finishGrain * .03'};`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + (finishGrain - .5) * .12, .16, .98);');
  };
}
