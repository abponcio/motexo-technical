import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transformWithOxc } from 'vite';
import { validateContent } from '../scripts/check-content.mjs';
import { contentModuleUrl, resolveContent } from './content-module.mjs';
const { content, formatText } = await import(contentModuleUrl);
const compiled = (await transformWithOxc(await readFile(new URL('../html-content.ts', import.meta.url), 'utf8'), 'html-content.ts')).code;
const { renderContentHtml } = await import('data:text/javascript;base64,' + Buffer.from(resolveContent(compiled)).toString('base64'));

test('editorial content is complete and rejects broken structures, links, assets and templates', () => {
  assert.doesNotThrow(() => validateContent(content));
  const invalid = change => { const copy = structuredClone(content); change(copy); assert.throws(() => validateContent(copy)); };
  invalid(copy => delete copy.story.chapters.power.title);
  invalid(copy => copy.contact.errors.name = ' ');
  invalid(copy => copy.business.instagram = 'javascript:alert(1)');
  invalid(copy => copy.business.whatsappNumber = '+971 52 000');
  invalid(copy => copy.services.electrical.image = '../content.json');
  invalid(copy => copy.services.electrical.image = 'missing-photo.png');
  invalid(copy => copy.gallery.items[0].category = 'unknown');
  invalid(copy => copy.gallery.items[1].id = copy.gallery.items[0].id);
  invalid(copy => copy.story.chapters.spark.title.push('unexpected third line'));
  invalid(copy => copy.gallery.imagesCount = '{amount} images');
  invalid(copy => copy.services.electrical.illustrative = false);
  const changed = structuredClone(content);
  changed.business.phone = '+971 50 111 2222'; changed.business.whatsappNumber = '971501112222';
  changed.story.chapters.spark.title = ['A new heading.', 'Still two lines.'];
  changed.gallery.items.push({...changed.gallery.items[0], id:'new-work', title:'New work'});
  assert.doesNotThrow(() => validateContent(changed));
});

test('all four HTML entries use content metadata and escape edited text without HTML injection', async () => {
  for (const route of ['home', 'expertise', 'work', 'contact']) {
    const path = route === 'home' ? '../index.html' : `../${route}/index.html`;
    const html = await readFile(new URL(path, import.meta.url), 'utf8');
    const rendered = renderContentHtml(html, route);
    assert.ok(rendered.includes(`<title>${content.meta[route].title}</title>`));
    assert.ok(!rendered.includes('{{'), 'Every HTML placeholder is resolved');
  }
  const changed = structuredClone(content);
  changed.meta.home.title = 'Power & data </title><script>alert(1)</script>';
  changed.meta.home.description = 'A "quoted" description';
  const rendered = renderContentHtml('<title>{{meta.title}}</title><meta content="{{meta.description}}">', 'home', changed);
  assert.ok(rendered.includes('&amp; data &lt;/title&gt;&lt;script&gt;'));
  assert.ok(rendered.includes('&quot;quoted&quot;'));
  assert.ok(!rendered.includes('<script>'));
  assert.throws(() => renderContentHtml('{{unknown.field}}', 'home'));
  assert.equal(formatText(content.gallery.imagesCount, {count:4}), '4 work images shown.');
  assert.equal(formatText('{title}', {title:'<script>literal text</script>'}), '<script>literal text</script>');
});
