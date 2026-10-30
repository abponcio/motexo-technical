import { resolveContent } from './content-module.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transformWithOxc } from 'vite';

const compile = async path => (await transformWithOxc(await readFile(new URL(path, import.meta.url), 'utf8'), path)).code;
const moduleUrl = code => 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
const dataUrl = moduleUrl(resolveContent(await compile('../src/data.ts')));
const data = await import(dataUrl);
const source = resolveContent(await compile('../src/enquiry.ts'));
const dataImport = /from\s*["']\.\/data["']/;
assert.ok(dataImport.test(source), 'Enquiry test must resolve the actual production data import');
const { validateEnquiry, enquiryMessage, whatsappDraft } = await import(moduleUrl(source.replace(dataImport, 'from ' + JSON.stringify(dataUrl))));
const valid = { service: 'networking', space: 'Office', name: 'Test visitor', contact: 'visitor@example.com', project: 'Please discuss the data cabling in our office.' };

test('enquiry validates required details and accepts complete email or international phone', () => {
  assert.deepEqual(validateEnquiry(valid), {});
  assert.deepEqual(validateEnquiry({ ...valid, contact: '+971 (52) 123-4567' }), {});
  assert.deepEqual(Object.keys(validateEnquiry({ ...valid, name: ' ', contact: '', project: '\n' })), ['name', 'contact', 'project']);
  for (const contact of ['visitor@', 'just text', '123', '1234567890123456', '123<script>456789']) assert.ok(validateEnquiry({ ...valid, contact }).contact, contact);
});

test('draft preserves visitor text and URL-encodes it without a send action', () => {
  const value = { ...valid, name: '  Visitor & team  ', project: 'Power & data\nتفاصيل <script>not HTML</script> ? #' };
  const message = enquiryMessage(value);
  assert.ok(message.includes('Service: IT & networking'));
  assert.ok(message.includes('Name: Visitor & team'));
  assert.ok(message.endsWith(value.project));
  const url = new URL(whatsappDraft(message));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/' + data.whatsappNumber);
  assert.equal(url.searchParams.get('text'), message);
  assert.equal([...url.searchParams].length, 1);
});

test('service selection falls back safely and work filters preserve source records', () => {
  assert.equal(data.serviceById('networking').name, 'IT & networking');
  assert.equal(data.serviceById('<script>').id, 'electrical');
  assert.equal(data.serviceById(null).id, 'electrical');
  assert.equal(data.filterWork('all').length, 4);
  assert.deepEqual(data.filterWork('events').map(item => item.id), ['tennis']);
  assert.deepEqual(data.filterWork('spaces').map(item => item.id), ['interiors', 'team']);
  for (const item of data.work) assert.ok(item.source.startsWith('https://www.instagram.com/motexotechnicalservices/p/'));
});

test('smart home automation is selectable and prepares a home enquiry for the configured number', () => {
  const service = data.serviceById('automation');
  assert.equal(service.id, 'automation');
  assert.equal(service.name, 'Smart Home Automation');
  assert.equal(data.services.length, 5);
  const enquiry = { ...valid, service: service.id, space: 'Home', project: 'Please discuss automation for our home.' };
  assert.deepEqual(validateEnquiry(enquiry), {});
  const draft = enquiryMessage(enquiry);
  assert.ok(draft.includes('Service: Smart Home Automation'));
  assert.ok(draft.includes('Space: Home'));
  const url = new URL(whatsappDraft(draft));
  assert.equal(url.pathname, '/' + data.whatsappNumber);
  assert.equal(url.searchParams.get('text'), draft);
});
