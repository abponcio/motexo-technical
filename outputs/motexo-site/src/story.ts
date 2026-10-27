import { content } from './content';
export const storyDuration = 20;
const chapters = content.story.chapters;
export const storyShots = [
  { ...chapters.spark, time: 0, start: 0, end: 3.8, service: 'electrical' },
  { ...chapters.power, time: 5.2, start: 3.8, end: 8.7, service: 'electrical' },
  { ...chapters.connect, time: 9.6, start: 8.7, end: 11.5, service: 'networking' },
  { ...chapters.space, time: 14.1, start: 11.5, end: 15.9, service: 'spaces' },
  { ...chapters.event, time: 18.7, start: 15.9, end: 20, service: 'events' },
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
