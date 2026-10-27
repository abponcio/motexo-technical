import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const schema = JSON.parse(readFileSync(new URL('content.schema.json', root), 'utf8'));

// Validate the schema keywords used by this project's content contract.
function check(value, rule, path) {
  const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  assert.ok(rule.type === 'integer' ? Number.isInteger(value) : type === rule.type, `${path}: expected ${rule.type}`);
  if (rule.enum) assert.ok(rule.enum.includes(value), `${path}: choose ${rule.enum.join(', ')}`);
  if (type === 'string') assert.ok(value.trim().length >= rule.minLength, `${path}: text cannot be empty`);
  if (type === 'number') assert.ok(value >= rule.minimum, `${path}: must be at least ${rule.minimum}`);
  if (type === 'array') {
    assert.ok(value.length >= rule.minItems && (!rule.maxItems || value.length <= rule.maxItems), `${path}: invalid number of items`);
    value.forEach((item, index) => check(item, rule.items, `${path}[${index}]`));
  }
  if (type === 'object') {
    for (const key of rule.required) assert.ok(Object.hasOwn(value, key), `${path}.${key}: missing required field`);
    for (const [key, item] of Object.entries(value)) {
      assert.ok(Object.hasOwn(rule.properties, key), `${path}.${key}: unknown field`);
      check(item, rule.properties[key], `${path}.${key}`);
    }
  }
}

export function validateContent(content) {
  check(content, schema, 'content');
  const https = (value, path) => {
    const url = new URL(value);
    assert.ok(url.protocol === 'https:' && !url.username && !url.password, `${path}: use an HTTPS URL without credentials`);
  };
  https(content.business.instagram, 'business.instagram');
  assert.match(content.business.whatsappNumber, /^[1-9]\d{6,14}$/, 'business.whatsappNumber: use country code and digits only');
  assert.equal(content.business.phone.replace(/\D/g, ''), content.business.whatsappNumber, 'business.phone and whatsappNumber must refer to the same number');
  for (const [id, item] of [...Object.entries(content.services), ...content.gallery.items.map(item => [item.id, item])]) {
    assert.match(item.image, /^[\w.-]+$/, `${id}.image: use a filename in public/assets`);
    assert.ok(existsSync(new URL(`public/assets/${item.image}`, root)), `${id}.image: asset does not exist`);
    if (item.illustrative === false) assert.ok(item.source, `${id}.source: authentic work needs its source`);
    if (item.source) https(item.source, `${id}.source`);
  }
  const ids = content.gallery.items.map(item => item.id);
  assert.equal(new Set(ids).size, ids.length, 'gallery.items: IDs must be unique');
  for (const faq of content.approach.faqs) assert.equal(!!faq.linkText, !!faq.afterLink, 'approach.faqs: linkText and afterLink must be used together');
  const templates = [
    [content.common.exploreService, 'service'], [content.gallery.imageCount, 'count'], [content.gallery.imagesCount, 'count'],
    [content.gallery.enlarge, 'title'], [content.gallery.imageAlt, 'title'],
    [content.story.cameraLabel, 'number'], [content.story.accessPointLabel, 'number'],
  ];
  for (const [text, key] of templates) assert.deepEqual([...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]), [key], `Template must contain {${key}} exactly once: ${text}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateContent(JSON.parse(readFileSync(new URL('content.json', root), 'utf8')));
  console.log('content.json: valid copy, templates, contact details and assets');
}
