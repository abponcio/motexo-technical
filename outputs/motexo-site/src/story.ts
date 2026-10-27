export const storyDuration = 20;
export const storyShots = [
  { name: 'The spark', time: 0, start: 0, end: 3.8, title: ['Built right.', 'Wired clean.'], text: 'Electrical, IT and network infrastructure for offices, warehouses and event spaces.', service: 'electrical' },
  { name: 'Power', time: 5.2, start: 3.8, end: 8.7, title: ['Order in', 'every detail.'], text: 'Electrical work, thoughtfully routed. From the first connection to the finishing detail.', service: 'electrical' },
  { name: 'Connect', time: 9.6, start: 8.7, end: 11.5, title: ['A better', 'connection.'], text: 'IT and networking that brings your workspace together. Clean routes. Considered connections.', service: 'networking' },
  { name: 'The space', time: 14.1, start: 11.5, end: 15.9, title: ['See the', 'whole picture.'], text: 'An office taking shape. A warehouse getting to work. Practical services, considered together.', service: 'spaces' },
  { name: 'The event', time: 18.7, start: 15.9, end: 20, title: ['Behind the', 'big moment.'], text: 'The technical work behind an event. Power, connectivity and care where it counts.', service: 'events' },
] as const;
export function chapterAt(time: number) {
  const index = storyShots.findIndex(shot => time < shot.end);
  return index < 0 ? storyShots.length - 1 : index;
}
export function scrollAt(time: number, start: number, end: number) { return start + Math.min(1, Math.max(0, time / storyDuration)) * (end - start); }

export function copyVisibleAt(time: number) {
  const index = chapterAt(time), shot = storyShots[index];
  return time >= (index === 0 ? 0 : index === 4 ? 18.1 : shot.start + .2) && time <= (index === 0 ? 1.65 : index === 3 ? 15.3 : index === 4 ? storyDuration : shot.end - .35);
}
