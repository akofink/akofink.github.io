import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {designs} from './content.mjs';
const load=path=>readFile(new URL(`dist/${path}`,import.meta.url),'utf8');
assert.equal(designs.length,10);
assert.equal(new Set(designs.map(d=>d.id)).size,10);
for(const d of designs){
 const html=await load(`${d.id}/index.html`);
 assert.equal((html.match(/<h1>/g)||[]).length,1,d.id+' has one h1');
 assert.match(html,/<html lang="en">/);
 assert.match(html,/name="viewport"/);
 assert.match(html,/Skip to content/);
 assert.match(html,/Andrew/);
 assert.match(html,/mailto:ajkofink@gmail.com/);
 assert.doesNotMatch(html,/googletagmanager|gtag\(/);
 for(const href of [...html.matchAll(/href="#([^"]+)"/g)].map(x=>x[1])) assert.ok(html.includes(`id="${href}"`),`${d.id}: missing #${href}`);
}
const baseline=await load('baseline/index.html');
assert.doesNotMatch(baseline,/<script|cdn-cgi|googletagmanager/);
assert.match(baseline,/Original copy retained/);
for(const page of ['index.html','compare/index.html','baseline/index.html'])assert.match(await load(page),/<title>/);
console.log('PASS: ten unique designs, semantic structure, local assets, baseline sanitization and anchors.');
