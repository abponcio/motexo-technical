import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Point = [number, number, number];
export function buildServiceWorld(craft: T.Group) {
  const housing = craft.getObjectByName('SwitchHousing'), rocker = craft.getObjectByName('SwitchRocker'), warehouseAsset = craft.getObjectByName('WarehouseCraft');
  if (!housing || !rocker || !warehouseAsset) throw new Error('Craft asset is missing its authored assemblies');
  const world = new T.Group(); world.name = 'Motexo service journey';
  const material = (color: number, metalness = 0, roughness = .55) => new T.MeshStandardMaterial({ color, metalness, roughness });
  const red = material(0xcf110e, .12, .32), wallRed = material(0xb9110c, 0, .62), ink = material(0x111619, .45, .29);
  const gray = material(0x636d72, .65, .35), white = material(0xe9e9e3, .08, .65), wall = material(0xd5d6d1, 0, .95);
  const rubber = material(0x080d10, .02, .65), steel = material(0xaeb5b4, .8, .29), box = material(0x9a8060, 0, .95);
  const blue = material(0x2078b2, .02, .8), green = material(0x437d73, 0, .9), paint = material(0xffffff, 0, .55);
  red.name = 'MTX red cable coating'; ink.name = 'MTX graphite powdercoat'; rubber.name = 'MTX black rubber'; steel.name = 'MTX galvanized steel'; wall.name = 'MTX mineral wall';
  const led = new T.MeshStandardMaterial({ color: 0xc7ffb4, emissive: 0x81ff4a, emissiveIntensity: 0 });
  const lamps = new T.MeshStandardMaterial({ color: 0xf6f5df, emissive: 0xfff7d0, emissiveIntensity: .1 });
  const groups = Object.fromEntries(['wall', 'electrical', 'network', 'warehouse', 'stadium', 'thread'].map(name => { const group = new T.Group(); group.name = name; world.add(group); return [name, group]; })) as Record<string, T.Group>;
  const cube = new T.BoxGeometry(1, 1, 1), cylinder = new T.CylinderGeometry(1, 1, 1, 12);
  function block(parent: T.Group, mat: T.Material, position: Point, size: Point, radius = 0) {
    const geometry = radius ? new RoundedBoxGeometry(...size, 2, radius) : cube;
    const mesh = new T.Mesh(geometry, mat); mesh.position.set(...position); if (!radius) mesh.scale.set(...size);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function rod(parent: T.Group, mat: T.Material, a: Point, b: Point, radius: number) {
    const start = new T.Vector3(...a), end = new T.Vector3(...b), delta = end.clone().sub(start);
    const mesh = new T.Mesh(cylinder, mat); mesh.position.copy(start.add(end).multiplyScalar(.5)); mesh.scale.set(radius, delta.length(), radius); mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize()); parent.add(mesh); return mesh;
  }
  function cable(parent: T.Group, points: Point[], radius = .055, mat: T.Material = red) {
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)), false, 'centripetal');
    const mesh = new T.Mesh(new T.TubeGeometry(curve, Math.max(24, points.length * 8), radius, 7, false), mat); parent.add(mesh); return curve;
  }
  function screw(parent: T.Group, x: number, y: number, z: number) {
    const head = rod(parent, steel, [x, y, z], [x, y, z + .04], .055);
    block(parent, ink, [x, y, z + .025], [.06, .013, .025]); return head;
  }
  // Service wall: the red opening belongs to the architecture, not an overlay.
  const back = block(groups.wall, wall, [0, 2, -.6], [38, 26, .8]);
  const redPanel = block(groups.wall, wallRed, [0, 18, -.12], [38, 32, .12]);
  block(groups.wall, gray, [0, 2, -.015], [38, .045, .08]);
  const electrical = groups.electrical;
  block(electrical, ink, [5, 7.2, .2], [1.4, .22, .4], .025);
  for (let i = 0; i < 8; i++) {
    const x = 4.47 + i * .15;
    cable(electrical, [[x, 7.2, .25], [x, 6, .25], [x, 4.8, .25], [x + .1, 3.2, .3], [x + .1, 2, .3]], .054);
  }
  for (const y of [6, 4.1, 2.7]) block(electrical, ink, [5, y, .34], [1.55, .13, .12], .025);
  // Open distribution cabinet. The hinged cover has its own assembly.
  block(electrical, ink, [5, -.1, .22], [4.25, 4.45, .65], .08);
  block(electrical, gray, [5, -.1, .59], [3.95, 4.1, .12]);
  block(electrical, rubber, [5, -.1, .68], [3.6, 3.8, .12]);
  for (const y of [.7, -.9]) {
    block(electrical, steel, [5, y, .86], [3.5, .18, .1]);
    for (let i = 0; i < 6; i++) {
      const x = 3.65 + i * .54;
      block(electrical, white, [x, y, 1], [.48, 1.08, .45], .026);
      block(electrical, ink, [x, y + .06, 1.26], [.28, .42, .1], .02);
      block(electrical, red, [x, y + .14, 1.32], [.22, .19, .1], .015);
      block(electrical, gray, [x, y - .34, 1.25], [.25, .025, .015]);
      cable(electrical, [[x, y + .5, .94], [x, y + .67, .91], [3.25, y + .69, .82], [3.22, y - .65, .8]], .031);
    }
  }
  // Sidewalls surround the protruding breaker faces; the opaque cover closes ahead of them.
  for (const x of [2.96, 7.04]) block(electrical, ink, [x, -.1, .81], [.17, 4.45, 1.48], .035);
  for (const y of [-2.24, 2.04]) block(electrical, ink, [5, y, .81], [4.25, .17, 1.48], .035);
  const door = new T.Group(); door.name = 'distribution door'; door.position.set(7.12, -.1, 1.65); electrical.add(door);
  block(door, ink, [-2.05, 0, 0], [4.1, 4.42, .17], .055);
  block(door, gray, [-2.05, 0, .1], [3.7, 4, .04]);
  block(door, rubber, [-3.7, -.15, .16], [.14, .5, .1], .02);
  block(door, red, [-2.05, 1.2, .14], [.5, .035, .02]);
  // Separate data installation: no breaker conductor terminates in a data port.
  const network = groups.network;
  block(network, steel, [5, -7.7, .8], [5.5, .15, 2.4]);
  block(network, ink, [5, -7.15, .88], [5.1, .82, 1.8], .08);
  block(network, gray, [5, -7.1, 1.81], [4.9, .66, .05]);
  for (let i = 0; i < 24; i++) block(network, rubber, [3 + i * .17, -6.735, .9], [.055, .012, .65]);
  for (let i = 0; i < 12; i++) {
    const x = 2.87 + i * .386;
    block(network, steel, [x, -7.04, 1.86], [.32, .31, .035]);
    block(network, rubber, [x, -7.04, 1.89], [.25, .24, .04]);
    block(network, led, [x, -6.87, 1.9], [.045, .022, .02]);
    if (i < 8) {
      block(network, red, [x, -7.04, 1.99], [.24, .2, .3], .02);
      const dx = 4.48 + i * .15;
      cable(network, [[x, -7.04, 2.12], [x, -7.55, 2.65], [dx, -9.15, 2.65], [dx + .45, -9.8, 2.4], [dx + 1.5, -10.1, 1.6], [10 + i * .14, -10.1, .875]], .05);
    }
  }
  // The power feed lands in a side inlet; Ethernet patch leads remain separate.
  const feed = cable(network, [[5.55, -2.3, .3], [5.55, -3.3, .3], [6.5, -4.8, .3], [8.1, -4.8, .3], [8.1, -6.5, .3], [8.05, -7.1, .65], [7.6, -7.1, .9]], .075);
  block(network, rubber, [7.6, -7.1, .9], [.3, .3, .38], .035);
  rod(network, rubber, [7.67, -7.1, .9], [7.9, -7.1, .9], .12);
  for (const x of [2.45, 7.55]) { block(network, ink, [x, -7.1, 1.84], [.1, .65, .08]); screw(network, x, -7.1, 1.9); }
  const warehouse = groups.warehouse;
  // Physical APs and CCTV; semantic labels are projected in HTML at the event.
  function cameraUnit(parent: T.Group, p: Point) {
    rod(parent, steel, [p[0], p[1], p[2]], [p[0], p[1] - .45, p[2]], .06);
    const unit = block(parent, white, [p[0], p[1] - .6, p[2] + .25], [.45, .36, .8], .08); unit.rotation.x = -.18;
    block(parent, ink, [p[0], p[1] - .65, p[2] + .66], [.27, .22, .03], .035);
  }
  cameraUnit(warehouse, [-16, 8, 4]); cameraUnit(warehouse, [15, 8, 20]);
  block(warehouse, white, [0, 10.7, 9], [.8, .12, .8], .05);
  // Event venue: an illustrative compact tennis ground, not an exact surveyed site.
  const stadium = groups.stadium; stadium.position.set(0, -11, -94);
  block(stadium, ink, [0, -.45, 0], [63, .65, 47], .3);
  block(stadium, green, [0, -.03, 0], [35, .12, 22]);
  block(stadium, blue, [0, .045, 0], [23.77, .03, 10.97]);
  for (const z of [-5.485, -4.115, 4.115, 5.485]) block(stadium, paint, [0, .068, z], [23.77, .012, .045]);
  for (const x of [-11.885, 11.885]) block(stadium, paint, [x, .068, 0], [.045, .012, 10.97]);
  for (const x of [-6.4, 6.4]) block(stadium, paint, [x, .068, 0], [.045, .012, 8.23]);
  block(stadium, paint, [0, .068, 0], [12.8, .012, .045]);
  for (const z of [-6, 6]) rod(stadium, gray, [0, 0, z], [0, 1.1, z], .04);
  for (let z = -6; z <= 6; z += .3) rod(stadium, rubber, [0, .1, z], [0, 1, z], .007);
  for (const y of [.15, .4, .65, .9, 1]) rod(stadium, y === 1 ? white : rubber, [0, y, -6], [0, y, 6], y === 1 ? .025 : .007);
  for (const side of [-1, 1]) {
    for (let row = 0; row < 9; row++) {
      const y = .6 + row * .62, z = side * (12.3 + row * .95);
      block(stadium, wall, [0, y, z], [43, .4, .95]);
      for (let seat = 0; seat < 50; seat++) {
        if (seat === 12 || seat === 13 || seat === 36 || seat === 37) continue;
        const x = -20.5 + seat * .83;
        block(stadium, row % 4 === 0 ? blue : white, [x, y + .4, z], [.55, .15, .48]);
        block(stadium, row % 4 === 0 ? blue : white, [x, y + .65, z + side * .22], [.55, .52, .09], .03);
      }
    }
    for (let row = 0; row < 6; row++) {
      const x = side * (19.5 + row * .95), y = .6 + row * .62;
      block(stadium, wall, [x, y, 0], [.95, .4, 21]);
      for (let seat = 0; seat < 23; seat++) block(stadium, white, [x, y + .42, -9.5 + seat * .85], [.55, .4, .55], .045);
    }
    for (let x = -23; x <= 23; x += 9.2) {
      rod(stadium, steel, [x, 0, side * 22], [x, 11, side * 22], .11);
      rod(stadium, steel, [x, 11, side * 22], [x, 9, side * 12], .06);
    }
    // Segmented tension canopy, with a gentle rise across each span.
    for (let i = 0; i < 8; i++) {
      const geometry = new T.PlaneGeometry(5.65, 9.3, 8, 6); geometry.rotateX(-Math.PI / 2);
      const positions = geometry.attributes.position;
      for (let vertex = 0; vertex < positions.count; vertex++) positions.setY(vertex, Math.sin((positions.getX(vertex) / 5.65 + .5) * Math.PI) * .7 + side * positions.getZ(vertex) * .12);
      geometry.computeVertexNormals();
      const roof = new T.Mesh(geometry, white); roof.position.set(-20 + i * 5.7, 9.7, side * 18.5); roof.castShadow = true; roof.receiveShadow = true; stadium.add(roof);
    }
  }
  for (const x of [-27, 27]) for (const z of [-18, 18]) {
    rod(stadium, steel, [x, 0, z], [x, 17, z], .15);
    const light = new T.Group(); light.position.set(x, 17, z); light.rotation.y = x > 0 ? -.4 : .4; stadium.add(light);
    block(light, ink, [0, 0, 0], [2.6, 1.4, .3]);
    for (const dx of [-.8, 0, .8]) for (const y of [-.35, .35]) block(light, lamps, [dx, y, .19], [.58, .5, .06]);
  }
  const anchorPositions: Point[] = [[-22, 9, 10], [20, 9, -12], [-19, 9, -13], [13, 7.5, 16], [9, 7.5, -17]];
  anchorPositions.slice(0, 3).forEach(p => cameraUnit(stadium, p));
  anchorPositions.slice(3).forEach(p => block(stadium, white, p, [.75, .2, .75], .08));
  const anchors = anchorPositions.map(p => { const anchor = new T.Object3D(); anchor.position.set(...p); stadium.add(anchor); return anchor; });
  for (let i = 0; i < 5; i++) cable(stadium, [[-30, .4 + i * .13, 23], [-27, .4 + i * .13, 24], [27, .4 + i * .13, 24], [30, .4 + i * .13, 21], [30, .4 + i * .13, -20], [26, .4 + i * .13, -23], [-27, .4 + i * .13, -23]], .05);
  const travelCurve = new T.CatmullRomCurve3([[12.35, 8.82, 23], [20, 8.82, 26], [28, 5, 24], [32, 1, 12], [32, -3, -18], [32, -7, -45], [30, -10.6, -73]].map(p => new T.Vector3(...p)), false, 'centripetal');
  const travelLine = new T.Mesh(new T.TubeGeometry(travelCurve, 240, .095, 8, false), red); groups.thread.add(travelLine);
  const pulse = new T.Mesh(new T.SphereGeometry(.24, 16, 10), new T.MeshBasicMaterial({ color: 0xfff3db, transparent: true }));
  const glow = new T.Mesh(new T.SphereGeometry(.7, 16, 10), new T.MeshBasicMaterial({ color: 0xff5028, transparent: true, opacity: .22, depthWrite: false, blending: T.AdditiveBlending }));
  pulse.add(glow); groups.thread.add(pulse);
  function updateTravel(progress: number, visibility: number) {
    const p = T.MathUtils.clamp(progress, 0, 1), alpha = T.MathUtils.clamp(visibility * 3, 0, 1);
    travelLine.geometry.setDrawRange(0, Math.floor(p * 240) * 8 * 6);
    pulse.position.copy(travelCurve.getPointAt(p)); pulse.visible = alpha > 0;
    pulse.material.opacity = alpha; glow.material.opacity = alpha * .22;
  }
  updateTravel(0, 0);
  // Articulated and progressively drawn meshes retain their own geometry.
  const dynamic = new Set<T.Object3D>([rocker, door, pulse, travelLine]);
  const geometries = new Set<T.BufferGeometry>([cube, cylinder]);
  function batch(group: T.Group) {
    const batches = new Map<T.Material, T.BufferGeometry[]>();
    group.updateMatrixWorld(true);
    const inverse = group.matrixWorld.clone().invert();
    const meshes: T.Mesh[] = [];
    group.traverse(object => {
      if (!(object instanceof T.Mesh) || object === pulse) return;
      let parent: T.Object3D | null = object;
      while (parent && parent !== group) { if (dynamic.has(parent)) return; parent = parent.parent; }
      const source = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
      const geometry = source.applyMatrix4(inverse.clone().multiply(object.matrixWorld));
      const mat = object.material as T.Material;
      if (!batches.has(mat)) batches.set(mat, []); batches.get(mat)!.push(geometry); meshes.push(object); geometries.add(object.geometry);
    });
    for (const mesh of meshes) mesh.removeFromParent();
    for (const [mat, parts] of batches) {
      const merged = mergeGeometries(parts); parts.forEach(part => part.dispose());
      if (!merged) throw new Error('Could not batch service geometry');
      const mesh = new T.Mesh(merged, mat); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); geometries.add(merged);
    }
  }
  // Keep the two independently finished wall surfaces outside static batching.
  groups.wall.remove(back, redPanel); Object.values(groups).forEach(batch); groups.wall.add(back, redPanel);
  electrical.add(housing, rocker); warehouse.add(warehouseAsset);
  // Macro and wide shots share one fixed installation; only the camera changes scale.
  for (const group of [electrical, network]) { group.scale.setScalar(.32); group.position.set(8, -7, 0); }
  redPanel.scale.y = 21.36; redPanel.position.y = -6.36 + redPanel.scale.y / 2;
  const materials = new Set<T.Material>([red, wallRed, ink, gray, white, wall, rubber, steel, box, blue, green, paint, led, lamps]);
  let craftLight: T.MeshStandardMaterial | undefined;
  let meshCount = 0, triangles = 0;
  world.traverse(object => { if (object instanceof T.Mesh) { meshCount++; triangles += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3; geometries.add(object.geometry);
    for (const mat of Array.isArray(object.material) ? object.material : [object.material]) { materials.add(mat); if (mat.name === 'MTX luminaire') craftLight = mat as T.MeshStandardMaterial; }
    object.castShadow = true; object.receiveShadow = true;
  } });
  pulse.castShadow = glow.castShadow = travelLine.castShadow = false;
  return { world, groups, rocker, door, back, redPanel, led, lamps, craftLight, anchors, pulse, travelCurve, travelLine, updateTravel, feed, stats: { meshCount, triangles },
    dispose() { geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose()); },
  };
}
