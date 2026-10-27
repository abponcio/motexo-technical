import { readFile } from 'node:fs/promises';
import { transformWithOxc } from 'vite';
const copy = JSON.parse(await readFile(new URL('../content.json', import.meta.url), 'utf8'));
const source = (await transformWithOxc(await readFile(new URL('../src/content.ts', import.meta.url), 'utf8'), 'content.ts')).code;
export const contentModuleUrl = 'data:text/javascript;base64,' + Buffer.from(source.replace(/import\s+copy\s+from[^;]+;/, 'const copy = ' + JSON.stringify(copy) + ';')).toString('base64');
export const resolveContent = source => source.replaceAll(/from\s*["'](?:\.\/|\.\/src\/)content(?:\.ts)?["']/g, 'from ' + JSON.stringify(contentModuleUrl));
