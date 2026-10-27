import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transformWithOxc } from 'vite';
import { Vector3, Box3, TextureLoader, Texture } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const compile = async file => (await transformWithOxc(await readFile(new URL(file, import.meta.url), 'utf8'), file)).code;
const url = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const story = await import(url(await compile('../src/story.ts')));
const modelSource = (await compile('../src/story-model.ts')).replaceAll(/from\s*["'](three(?:\/[^"']*)?)["']/g, (_, path) => 'from ' + JSON.stringify(import.meta.resolve(path)));
const { buildServiceWorld } = await import(url(modelSource));
const textureSource = (await compile('../src/material-textures.ts')).replace(/from ["']three["']/, 'from ' + JSON.stringify(import.meta.resolve('three')));
const { loadMaterialTextures } = await import(url(textureSource));
test('scroll chapters cover the complete clock and chapter navigation reaches each service', () => {
  assert.equal(story.storyShots[0].start, 0);
  assert.equal(story.storyShots.at(-1).end, story.storyDuration);
  story.storyShots.forEach((shot, index) => { assert.equal(story.chapterAt(shot.time), index); if (index) assert.equal(story.storyShots[index - 1].end, shot.start); });
  assert.equal(story.scrollAt(-1, 84, 1084), 84); assert.equal(story.scrollAt(100, 84, 1084), 1084); assert.equal(story.chapterAt(20), 4);
});
test('service world has articulated hardware, separate networking and five event anchors within a mesh budget', async () => {
  const bytes = await readFile(new URL('../public/assets/motexo-craft.glb', import.meta.url));
  const asset = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  assert.equal(asset.scenes.length, 1, 'Export excludes unrelated Blender scenes');
  assert.ok(bytes.length < 3 * 1024 * 1024, 'Authored asset payload stays bounded');
  assert.ok(!asset.scene.getObjectByName('Cube'), 'Default Blender cube is not shipped');
  const warehouse = asset.scene.getObjectByName('WarehouseCraft');
  assert.ok(warehouse);
  const bounds = new Box3().setFromObject(warehouse).getSize(new Vector3());
  assert.ok(bounds.x > 36 && bounds.x < 40 && bounds.y > 23 && bounds.z > 25, 'Fresh import matches world axes and scale');
  const model = buildServiceWorld(asset.scene);
  assert.ok(model.rocker.parent === model.groups.electrical); assert.ok(model.door.parent === model.groups.electrical); assert.notEqual(model.groups.network, model.groups.electrical); assert.equal(model.anchors.length, 5);
  assert.ok(model.stats.meshCount < 95, JSON.stringify(model.stats)); assert.ok(model.stats.triangles < 500000, JSON.stringify(model.stats));
  assert.equal(model.groups.electrical.scale.x, .32); assert.equal(model.groups.network.scale.x, .32);
  assert.deepEqual(model.groups.electrical.position.toArray(), [8, -7, 0]);
  assert.ok(!model.groups.routes, 'No disappearing macro-only cable routes');
  model.world.updateMatrixWorld(true);
  for (const anchor of model.anchors) { const p = anchor.getWorldPosition(new Vector3()); assert.ok(p.z < -65 && p.z > -120); }
  model.world.traverse(object => { if (object.isMesh) assert.ok(object.geometry.attributes.position.array.every(Number.isFinite), 'Finite mesh vertices'); });
  assert.deepEqual(model.feed.getPoint(0).toArray(), [5.55, -2.3, .3]);
  assert.deepEqual(model.feed.getPoint(1).toArray().map(n => +n.toFixed(2)), [7.6, -7.1, .9]);
  assert.ok(model.travelCurve.getLength() > 75);
  const load = TextureLoader.prototype.loadAsync;
  let disposed = 0;
  TextureLoader.prototype.loadAsync = async path => {
    if (path.includes('rubber-height')) throw new Error('Optional image unavailable');
    const texture = new Texture(); texture.addEventListener('dispose', () => disposed++); return texture;
  };
  try {
    const textures = await loadMaterialTextures(); textures.apply(model.world);
    let uploads = 0; textures.warm({ initTexture: () => uploads++ }); assert.equal(uploads, 14);
    let mapped = 0;
    model.world.traverse(object => { if (object.isMesh && object.material.map) {
      mapped++; assert.ok(object.geometry.attributes.uv.array.every(Number.isFinite));
      assert.equal(object.geometry.attributes.uv.count, object.geometry.attributes.position.count);
    } });
    assert.ok(mapped > 15, 'Generated maps reach actual scene surfaces');
    assert.equal(model.redPanel.material.map, null, 'Brand red wall retains its smooth satin finish');
    model.rocker.traverse(object => { if (object.isMesh && object.material.name.includes('red')) assert.equal(object.material.bumpMap, null); });
    assert.notEqual(model.back.geometry, model.redPanel.geometry, 'Wall faces have independent UVs');
    textures.dispose(); assert.equal(disposed, 14, 'Every loaded map is released even with an optional failure');
  } finally { TextureLoader.prototype.loadAsync = load; model.dispose(); }
});

test('macro camera moments remove hidden copy from the focusable scene', () => {
  assert.equal(story.copyVisibleAt(0), true);
  assert.equal(story.copyVisibleAt(2.2), false);
  assert.equal(story.copyVisibleAt(5.2), true);
  assert.equal(story.copyVisibleAt(18.7), true);
  assert.equal(story.copyVisibleAt(16.8), false, "Wire travel keeps copy out of the shot");
});

const camera = await import(url(await compile('../src/camera-score.ts')));
test('camera passes through its score continuously without overshoot or velocity jumps', () => {
  const { cameraKeys, cameraAt } = camera;
  for (const key of cameraKeys) for (const field of Object.keys(key.pose)) assert.ok(Math.abs(cameraAt(key.time)[field] - key.pose[field]) < 1e-8);
  for (let i = 0; i < cameraKeys.length - 1; i++) {
    const a = cameraKeys[i], b = cameraKeys[i + 1];
    for (let j = 0; j <= 30; j++) for (const [field, value] of Object.entries(cameraAt(a.time + (b.time - a.time) * j / 30))) {
      assert.ok(Number.isFinite(value));
      assert.ok(value >= Math.min(a.pose[field], b.pose[field]) - 1e-8 && value <= Math.max(a.pose[field], b.pose[field]) + 1e-8, field);
    }
  }
  const e = 1e-5;
  for (const key of cameraKeys.slice(1, -1)) for (const field of Object.keys(key.pose)) {
    const left = (cameraAt(key.time)[field] - cameraAt(key.time - e)[field]) / e;
    const right = (cameraAt(key.time + e)[field] - cameraAt(key.time)[field]) / e;
    assert.ok(Math.abs(left - right) < .02, `Velocity discontinuity at ${key.time} ${field}`);
  }
  assert.deepEqual(cameraAt(-10), cameraAt(0)); assert.deepEqual(cameraAt(50), cameraAt(20));
});

test('opaque cabinet cover clears the contents, and event trail grows behind its travelling head', async () => {
  const bytes = await readFile(new URL('../public/assets/motexo-craft.glb', import.meta.url));
  const asset = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const model = buildServiceWorld(asset.scene);
  try {
    model.world.updateMatrixWorld(true);
    let contentsFront = -Infinity;
    model.groups.electrical.traverse(object => {
      if (!object.isMesh) return;
      let parent = object; while (parent && parent !== model.door) parent = parent.parent;
      if (!parent) contentsFront = Math.max(contentsFront, new Box3().setFromObject(object).max.z);
    });
    for (const angle of [0, .2, .8, 1.65]) {
      model.door.rotation.y = angle; model.world.updateMatrixWorld(true);
      assert.ok(new Box3().setFromObject(model.door).min.z > contentsFront, 'Cover remains in front of internal hardware');
    }
    model.door.traverse(object => { if (object.isMesh) assert.equal(object.material.opacity, 1); });
    assert.deepEqual(model.travelCurve.getPointAt(0).toArray(), [12.35, 8.82, 23]);
    assert.deepEqual(model.travelCurve.getPointAt(1).toArray().map(n => +n.toFixed(2)), [30, -10.6, -73]);
    model.updateTravel(0, 0);
    assert.equal(model.travelLine.geometry.drawRange.count, 0); assert.equal(model.pulse.visible, false);
    model.updateTravel(.5, 1);
    assert.ok(model.pulse.position.distanceTo(model.travelCurve.getPointAt(.5)) < 1e-8);
    assert.ok(model.travelLine.geometry.drawRange.count > 0 && model.travelLine.geometry.drawRange.count < model.travelLine.geometry.index.count);
    model.updateTravel(1, 1);
    assert.equal(model.travelLine.geometry.drawRange.count, model.travelLine.geometry.index.count);
    model.updateTravel(0, 0);
    assert.equal(model.travelLine.geometry.drawRange.count, 0, 'Reverse scrolling removes the trail');
  } finally { model.dispose(); }
});
