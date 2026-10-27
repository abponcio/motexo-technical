import { content } from './src/content.ts';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export function renderContentHtml(html: string, route: keyof typeof content.meta, copy = content) {
  return html.replaceAll(/\{\{([\w.]+)\}\}/g, (_match, key: string) => {
    if (key === 'meta.title') return escapeHtml(copy.meta[route].title);
    if (key === 'meta.description') return escapeHtml(copy.meta[route].description);
    const [group, field] = key.split('.');
    const sections = { business: copy.business, common: copy.common, fallback: copy.fallback };
    const section = sections[group as keyof typeof sections];
    if (!section || !(field in section)) throw new Error(`Unknown HTML content key: ${key}`);
    return escapeHtml(String(section[field as keyof typeof section]));
  });
}
