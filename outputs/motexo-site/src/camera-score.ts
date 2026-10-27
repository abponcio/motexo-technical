const fields = ['x', 'y', 'z', 'tx', 'ty', 'tz', 'fov', 'roll'] as const;
type Pose = Record<typeof fields[number], number>;
// One continuous velocity curve; independently eased shots used to brake at every cut.
export const cameraKeys: { time: number; pose: Pose }[] = [
  [0, -1.6, 10.4, 16.8, .6, 9, 0, 40, 0],
  [2, 8.8, 10, 6.6, 5, 9, .6, 33, .035],
  [3.3, 5.3, 5.2, 5.8, 4.95, 4.1, .25, 44, -.035],
  [4.7, .6, 1.9, 19, 2.1, .2, .4, 38, 0],
  [5.8, 4, 1.2, 17, 1.5, 0, .5, 38, 0],
  [6.8, 5.4, -1.2, 8.5, 5.55, -2.3, .3, 40, -.015],
  [7.5, 6.8, -3.2, 7.8, 6.5, -4.8, .3, 40, -.025],
  [8.2, 9, -5.1, 8.4, 8.1, -6.5, .5, 40, -.015],
  [8.7, 9, -5.5, 9.8, 7.6, -7.1, .9, 40, 0],
  [9.6, 1.5, -5, 18.5, 1.6, -7, .6, 38, 0],
  [10.8, 7, -5.9, 9.5, 4.9, -7, .9, 43, .03],
  [11.8, 9, -1, 19, 8, -4, 1, 43, 0],
  [14, 34, 24, 47, 0, -2, 10, 45, 0],
  [15.1, 43, 18, 27, 0, -2, 11, 44, .025],
  [16.4, 25, 30, 7, 0, -4, -28, 44, -.025],
  [18.8, 50, 35, -45, 0, -8, -94, 43, 0],
  [20, 24, 26, -49, 0, -8, -94, 42, 0],
].map(([time, x, y, z, tx, ty, tz, fov, roll]) => ({ time, pose: time <= 11.8
  ? { x: x * .32 + 8, y: y * .32 - 7, z: z * .32, tx: tx * .32 + 8, ty: ty * .32 - 7, tz: tz * .32, fov, roll }
  : { x, y, z, tx, ty, tz, fov, roll } }));
const slopes = cameraKeys.map((key, i) => Object.fromEntries(fields.map(field => {
  if (i === 0 || i === cameraKeys.length - 1) return [field, 0];
  const before = cameraKeys[i - 1], after = cameraKeys[i + 1];
  const h0 = key.time - before.time, h1 = after.time - key.time;
  const d0 = (key.pose[field] - before.pose[field]) / h0, d1 = (after.pose[field] - key.pose[field]) / h1;
  const w0 = 2 * h1 + h0, w1 = h1 + 2 * h0;
  return [field, d0 * d1 <= 0 ? 0 : (w0 + w1) / (w0 / d0 + w1 / d1)];
})) as Pose);
export function cameraAt(time: number): Pose {
  const t = Math.max(0, Math.min(20, time));
  const i = Math.max(0, cameraKeys.findIndex(key => key.time >= t) - 1);
  const a = cameraKeys[i], b = cameraKeys[i + 1], h = b.time - a.time, u = (t - a.time) / h;
  return Object.fromEntries(fields.map(field => [field,
    (2 * u ** 3 - 3 * u ** 2 + 1) * a.pose[field] + (u ** 3 - 2 * u ** 2 + u) * h * slopes[i][field]
    + (-2 * u ** 3 + 3 * u ** 2) * b.pose[field] + (u ** 3 - u ** 2) * h * slopes[i + 1][field],
  ])) as Pose;
}
