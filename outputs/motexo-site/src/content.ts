import copy from '../content.json' with { type: 'json' };
export const content = copy;

export function formatText(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
