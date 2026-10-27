import { content } from './content';
import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildServiceWorld } from './story-model';
import { applySurfaceFinish } from './surface-finish';
import { loadMaterialTextures } from './material-textures';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
export type StoryRig = { x: number; y: number; z: number; tx: number; ty: number; tz: number; phase: number; power: number; door: number; travel: number; night: number; flight: number; fov: number; roll: number };
export const openingRig: StoryRig = { x: -1.6, y: 10.4, z: 16.8, tx: .6, ty: 9, tz: 0, phase: 0, power: 0, door: 0, travel: 0, night: 0, flight: 0, fov: 40, roll: 0 };

export async function createStoryScene(host: HTMLElement, markers: HTMLElement[], switchTarget: HTMLButtonElement) {
  const asset = await new GLTFLoader().loadAsync('/assets/motexo-craft.glb');
  asset.scene.traverse(object => {
    if (!(object instanceof T.Mesh)) return;
    let parent: T.Object3D | null = object;
    while (parent && !['SwitchHousing', 'SwitchRocker'].includes(parent.name)) parent = parent.parent;
    if (parent) {
      object.material = (object.material as T.MeshStandardMaterial).clone();
      (object.material as T.MeshStandardMaterial).name = 'MTX smooth switch finish';
    } else for (const material of Array.isArray(object.material) ? object.material : [object.material]) if (material instanceof T.MeshStandardMaterial) applySurfaceFinish(material);
  });
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  const cleanups: (() => void)[] = [() => { renderer.dispose(); renderer.domElement.remove(); }];
  const release = () => cleanups.splice(0).reverse().forEach(cleanup => cleanup());
  try {
    const textures = await loadMaterialTextures(); cleanups.push(textures.dispose);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = .94;
    renderer.info.autoReset = false; renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true'); host.appendChild(renderer.domElement);
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, 1, .08, 300);
    const model = buildServiceWorld(asset.scene); cleanups.push(() => model.dispose()); scene.add(model.world);
    for (const [surface, name] of [[model.back, 'MTX mineral wall'], [model.redPanel, 'MTX signal red enamel']] as const) { const material = surface.material as T.MeshStandardMaterial; material.name = name; applySurfaceFinish(material); }
    textures.apply(model.world);
    const pmrem = new T.PMREMGenerator(renderer);
    let environment: RoomEnvironment | null = null;
    try {
      environment = new RoomEnvironment();
      const env = pmrem.fromScene(environment, .06); cleanups.push(() => env.dispose());
      scene.environment = env.texture; scene.environmentIntensity = .2;
    } finally { environment?.dispose(); pmrem.dispose(); }
    const key = new T.DirectionalLight(0xfff3dc, 4.2); key.position.set(-12, 24, 35); key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536); Object.assign(key.shadow.camera, { left: -35, right: 35, top: 30, bottom: -30, near: .1, far: 170 });
    key.shadow.bias = -.0007; key.shadow.normalBias = .035; key.shadow.radius = 3; scene.add(key, key.target);
    const fill = new T.HemisphereLight(0xd9e9ff, 0x161922, .55); scene.add(fill);
    const rim = new T.DirectionalLight(0xa6c8ff, 1); rim.position.set(30, 18, -30); scene.add(rim);
    const floodlights: T.SpotLight[] = [];
    for (const x of [-27, 27]) for (const z of [-112, -76]) {
      const light = new T.SpotLight(0xdeebff, 0, 85, .7, .65, 1.5); light.position.set(x, 6, z); light.target.position.set(0, -11, -94); scene.add(light, light.target); floodlights.push(light);
    }
    const composer = new EffectComposer(renderer); composer.renderTarget1.samples = 4; composer.renderTarget2.samples = 4; cleanups.push(() => composer.dispose());
    const beauty = new RenderPass(scene, camera), contact = new GTAOPass(scene, camera, 512, 512), output = new OutputPass();
    contact.updateGtaoMaterial({ radius: .65, thickness: 1.2, distanceExponent: 2, samples: 8 });
    contact.blendIntensity = .75;
    composer.addPass(beauty); composer.addPass(contact); composer.addPass(output);
    cleanups.push(() => { contact.dispose(); output.dispose(); });
    const rig = { ...openingRig }, point = new T.Vector3(), red = new T.Color(0xb9110c), pale = new T.Color(0xd9dcd9), dark = new T.Color(0x101c2b);
    const switchBounds = new T.Box3(), switchPoint = new T.Vector3();
    const routeHead = new T.Vector3(), routeAhead = new T.Vector3(), chase = new T.Vector3(), look = new T.Vector3();
    let disposed = false, visible = true, mobile = false, contextLost = false, viewportWidth = 1, viewportHeight = 1;
    function render() {
      if (disposed || !visible || contextLost) return;
      const warehouse = T.MathUtils.smoothstep(rig.phase, 2.7, 3.7), event = T.MathUtils.smoothstep(rig.phase, 3.8, 4.7);
      // Separate mobile camera: hardware below the copy, wide scenes retain their full footprint.
      const close = Math.max(0, 1 - warehouse), copyClearance = T.MathUtils.smoothstep((rig.z - rig.tz) / .32, 9, 16);
      const mobileDistance = (1 + warehouse * .3) * (mobile ? 1 + close * (.28 + .28 * (1 - copyClearance)) + warehouse * .52 : 1);
      const networkFraming = T.MathUtils.smoothstep(rig.phase, 1.6, 2) * (1 - T.MathUtils.smoothstep(rig.phase, 2.2, 2.8));
      const mobileTargetX = T.MathUtils.lerp(rig.tx + close * 4.6 * .32 * copyClearance, 9.6, networkFraming);
      const tx = mobile ? mobileTargetX : rig.tx, ty = rig.ty + (mobile ? close * (2.3 - networkFraming * 1.1) * .32 * copyClearance + warehouse * 4 : 0);
      camera.position.set(tx + (rig.x - rig.tx) * mobileDistance, ty + (rig.y - rig.ty) * mobileDistance, rig.tz + (rig.z - rig.tz) * mobileDistance);
      // Follow the same arc-length position as the light, then lift into the venue wide.
      routeHead.copy(model.travelCurve.getPointAt(T.MathUtils.clamp(rig.travel, 0, 1)));
      routeAhead.copy(model.travelCurve.getPointAt(T.MathUtils.clamp(rig.travel + .035, 0, 1)));
      chase.set(mobile ? 23 : 16, mobile ? 17 : 10, mobile ? 31 : 20).add(routeHead);
      camera.position.lerp(chase, rig.flight);
      look.set(tx, ty, rig.tz).lerp(routeAhead, rig.flight);
      camera.up.set(Math.sin(rig.roll), Math.cos(rig.roll), 0);
      camera.fov = rig.fov; camera.updateProjectionMatrix(); camera.lookAt(look);
      model.rocker.rotation.x = -.12 + rig.power * .26;
      if (model.craftLight) model.craftLight.emissiveIntensity = .15 + rig.power * 1.4;
      model.door.rotation.y = rig.door * 1.65;
      model.led.emissiveIntensity = rig.power * 2;
      model.lamps.emissiveIntensity = .15 + rig.night * 3;
      floodlights.forEach(light => { light.intensity = rig.night * 170; });
      scene.environmentIntensity = .2 - event * .2;
      model.groups.warehouse.visible = rig.phase < 4.7;
      model.groups.electrical.visible = rig.phase < 4.5;
      model.groups.network.visible = rig.phase < 4.5;
      model.groups.wall.visible = rig.phase < 4.5;
      model.groups.stadium.visible = rig.phase > 3.95;
      model.updateTravel(rig.travel, rig.flight);
      scene.background = red.clone().lerp(pale, T.MathUtils.smoothstep(rig.phase, .45, 1.1)).lerp(dark, Math.max(event * .92, rig.flight * .82));
      key.intensity = 4.2 - event * 2.8; fill.intensity = .55 - event * .2;
      const shadowSize = 5 + warehouse * 30 + event * 10;
      Object.assign(key.shadow.camera, { left: -shadowSize, right: shadowSize, top: shadowSize, bottom: -shadowSize }); key.shadow.camera.updateProjectionMatrix();
      key.position.set(-12, 24, 35 - event * 100); key.target.position.set(9.6 * (1 - warehouse), -6 + warehouse * 4, event * -94); key.target.updateMatrixWorld();
      contact.updateGtaoMaterial({ radius: .32 + warehouse * .55 });
      renderer.info.reset(); renderer.shadowMap.needsUpdate = true; composer.render(0);
      host.dataset.frameDraws = String(renderer.info.render.calls); host.dataset.frameTriangles = String(renderer.info.render.triangles);
      switchTarget.hidden = rig.phase > .1;
      switchTarget.setAttribute('aria-pressed', String(rig.power >= .5));
      switchTarget.setAttribute('aria-label', rig.power >= .5 ? content.story.switchOff : content.story.switchOn);
      if (!switchTarget.hidden) {
        switchBounds.setFromObject(model.rocker);
        let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
        for (const x of [switchBounds.min.x, switchBounds.max.x]) for (const y of [switchBounds.min.y, switchBounds.max.y]) for (const z of [switchBounds.min.z, switchBounds.max.z]) {
          switchPoint.set(x, y, z).project(camera);
          const px = (switchPoint.x * .5 + .5) * viewportWidth, py = (-switchPoint.y * .5 + .5) * viewportHeight;
          left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
        }
        switchTarget.style.left = `${(left + right) / 2}px`;
        switchTarget.style.top = `${(top + bottom) / 2}px`;
        switchTarget.style.width = `${Math.max(44, right - left)}px`;
        switchTarget.style.height = `${Math.max(44, bottom - top)}px`;
      }
      const occupied: { x: number; y: number }[] = [];
      model.anchors.forEach((anchor, i) => {
        if (!markers[i]) return;
        anchor.getWorldPosition(point); point.project(camera);
        const x = (point.x * .5 + .5) * 100, y = (-point.y * .5 + .5) * 100;
        const clearOfCopy = mobile ? y > 48 : x > 44 || y > 52;
        const labelX = T.MathUtils.clamp(x, 50 / viewportWidth * 100, 100 - 50 / viewportWidth * 100);
        const overlaps = occupied.some(label => Math.abs(labelX - label.x) * viewportWidth / 100 < 100 && Math.abs(y - label.y) * viewportHeight / 100 < 52);
        const inView = rig.phase >= 4.65 && point.z > -1 && point.z < 1 && Math.abs(point.x) < .87 && Math.abs(point.y) < .83 && clearOfCopy && !overlaps;
        if (inView) occupied.push({ x: labelX, y });
        markers[i].style.setProperty('--marker-x', `${labelX * viewportWidth / 100}px`);
        markers[i].style.setProperty('--marker-y', `${y * viewportHeight / 100}px`);
        markers[i].hidden = !inView;
      });
    }
    const resize = () => { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; viewportWidth = w; viewportHeight = h; mobile = w <= 760; renderer.setSize(w, h, false); composer.setSize(w, h); contact.setSize(Math.round(w * .7), Math.round(h * .7)); camera.aspect = w / h; camera.updateProjectionMatrix(); render(); };
    const sizeObserver = new ResizeObserver(resize); cleanups.push(() => sizeObserver.disconnect()); sizeObserver.observe(host);
    const visibility = new IntersectionObserver(entries => { visible = entries.at(-1)!.isIntersecting; if (visible) render(); }, { rootMargin: '100px' }); cleanups.push(() => visibility.disconnect()); visibility.observe(host);
    function lost(event: Event) { event.preventDefault(); contextLost = true; host.dataset.context = 'lost'; }
    function restored() { contextLost = false; delete host.dataset.context; render(); }
    renderer.domElement.addEventListener('webglcontextlost', lost); renderer.domElement.addEventListener('webglcontextrestored', restored);
    cleanups.push(() => { renderer.domElement.removeEventListener('webglcontextlost', lost); renderer.domElement.removeEventListener('webglcontextrestored', restored); });
    textures.warm(renderer);
    await renderer.compileAsync(scene, camera);
    host.dataset.draws = String(model.stats.meshCount); host.dataset.triangles = String(Math.round(model.stats.triangles)); resize();
    return { rig, render, dispose() { disposed = true; release(); } };
  } catch (error) { release(); throw error; }
}
