import {readFile,readdir,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
const dir=new URL('./dist/',import.meta.url);
const ids=['switchyard','machine','score','contours','press','garden','xray','hearing','windows','zine'];
const projects=JSON.parse(await readFile(new URL('projects.json',dir),'utf8'));
assert.equal(projects.length,5);
for(const id of ['index',...ids]){
 const html=await readFile(new URL(`${id}.html`,dir),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert(html.includes('lang="en"'));assert(html.includes('width=device-width'));
 assert(!/(?:getUserMedia|geolocation|AudioContext|analytics|Resume\.pdf|420 W|29H|240.9295|\/home\/|\/mnt\/c\/|Peter Singer|Attitash|Wildcat|sophomore)/i.test(html));
 const anchors=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(anchors).size,anchors.length,`${id} duplicate ids`);
 for(const match of html.matchAll(/href="#([^"]+)"/g))assert(anchors.includes(match[1]),`${id} missing anchor ${match[1]}`);
 if(id!=='index'){
  for(const project of projects)assert(html.includes(`id="project-${project.id}"`));
  assert(html.includes('<noscript>'));assert(html.includes('tabindex="-1"'));
  assert(html.includes('Atlassian'));assert(html.includes('Bitbucket Cloud'));
 }
}
const js=await readFile(new URL('experience.js',dir),'utf8');
assert(!/getUserMedia|geolocation|AudioContext|localStorage|https?:\/\//.test(js));
const css=await readFile(new URL('style.css',dir),'utf8');assert(css.includes('prefers-reduced-motion'));assert(!css.includes('@import'));
const sizes=await Promise.all((await readdir(dir)).filter(x=>/\.(html|css|js|json)$/.test(x)).map(async f=>[f,(await stat(new URL(f,dir))).size]));
for(const [file,bytes] of sizes)assert(bytes<60000,`${file} unexpectedly large`);
console.log(`PASS: ten alternatives, factual directories, privacy markers, unique anchors, local-only runtime, reduced motion and <60KB text assets. Total text: ${sizes.reduce((n,x)=>n+x[1],0)} bytes.`);
