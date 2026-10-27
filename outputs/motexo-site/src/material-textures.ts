import * as T from 'three';
const kinds = ['mineral', 'coating', 'rubber', 'paper', 'wood'] as const;
type Kind = typeof kinds[number];
export async function loadMaterialTextures() {
  const loader = new T.TextureLoader(), loaded: T.Texture[] = [], geometries: T.BufferGeometry[] = [];
  const entries = await Promise.all(kinds.map(async kind => {
    const maps = await Promise.all(['color', 'height', 'roughness'].map(async channel => {
      try {
        const texture = await loader.loadAsync(`/assets/textures/${kind}-${channel}.webp`);
        texture.wrapS = texture.wrapT = T.RepeatWrapping;
        if (channel === 'color') texture.colorSpace = T.SRGBColorSpace;
        loaded.push(texture); return texture;
      } catch { return null; } // A missing optional texture keeps the authored material usable.
    }));
    return [kind, maps] as const;
  }));
  const library = Object.fromEntries(entries) as Record<Kind, (T.Texture | null)[]>;
  function apply(world: T.Object3D) {
    world.updateMatrixWorld(true);
    const uses = new Map<T.BufferGeometry, number>();
    world.traverse(object => { if (object instanceof T.Mesh) uses.set(object.geometry, (uses.get(object.geometry) ?? 0) + 1); });
    const position = new T.Vector3(), normal = new T.Vector3(), normalMatrix = new T.Matrix3();
    world.traverse(object => {
      if (!(object instanceof T.Mesh) || !(object.material instanceof T.MeshStandardMaterial)) return;
      const material = object.material, name = material.name.toLowerCase();
      if (name.includes('red')) return;
      const kind: Kind | null = /timber/.test(name) ? 'wood' : /carton/.test(name) ? 'paper' : /concrete|mineral/.test(name) ? 'mineral' : /rubber|gasket/.test(name) ? 'rubber' : /powdercoat|enamel|coating|steel|graphite/.test(name) ? 'coating' : null;
      if (!kind) return;
      const [color, bump, roughness] = library[kind];
      material.map = color; material.bumpMap = bump; material.roughnessMap = roughness;
      material.bumpScale = kind === 'mineral' ? .022 : kind === 'wood' ? .013 : .004;
      // Keep brand paint and material calibration; neutral image grain tints coated metals.
      if (color && (kind === 'wood' || kind === 'paper')) material.color.setHex(0xffffff);
      if (color && kind === 'rubber') material.color.setHex(0xaaaaaa);
      const scale = kind === 'mineral' ? .55 : kind === 'wood' ? .75 : kind === 'paper' ? 1.4 : 3;
      if (uses.get(object.geometry)! > 1) { object.geometry = object.geometry.clone(); geometries.push(object.geometry); }
      const vertices = object.geometry.attributes.position, normals = object.geometry.attributes.normal;
      const uv = new Float32Array(vertices.count * 2); normalMatrix.getNormalMatrix(object.matrixWorld);
      // Blender batches have no UVs: project each face at a consistent world-space texel scale.
      for (let i = 0; i < vertices.count; i++) {
        position.fromBufferAttribute(vertices, i).applyMatrix4(object.matrixWorld);
        normal.fromBufferAttribute(normals, i).applyMatrix3(normalMatrix).normalize();
        const x = Math.abs(normal.x), y = Math.abs(normal.y), z = Math.abs(normal.z);
        uv[i * 2] = (x > y && x > z ? position.z : position.x) * scale;
        uv[i * 2 + 1] = (y > x && y > z ? position.z : position.y) * scale;
      }
      object.geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));
      material.needsUpdate = true;
    });
  }
  return { apply, warm: (renderer: T.WebGLRenderer) => loaded.forEach(texture => renderer.initTexture(texture)), dispose: () => { loaded.forEach(texture => texture.dispose()); geometries.forEach(geometry => geometry.dispose()); } };
}
