import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import { parts } from "./content.mjs";
const dir = new URL("./dist/", import.meta.url);
const html = await readFile(new URL("index.html", dir), "utf8");
const css = await readFile(new URL("style.css", dir), "utf8");
const js = await readFile(new URL("app.js", dir), "utf8");
assert.equal(parts.length, 6);
assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
assert(html.includes('lang="en"'));
assert(html.includes("width=device-width"));
assert(html.includes("<noscript>"));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate ids");
for (const m of html.matchAll(/href="#([^"]+)"/g))
  assert(ids.includes(m[1]), `Missing anchor ${m[1]}`);
for (const p of parts) {
  assert(ids.includes(p.id));
  assert(ids.includes(`plate-${p.id}`));
  assert(p.projects.length);
  assert(p.idea.length > 30);
}
for (const repo of [
  "dots",
  "akagent-cli",
  "live-staff",
  "tinderbox",
  "cascade-game-demo",
])
  assert(html.includes(`https://github.com/akofink/${repo}`));
for (const fact of ["Andrew Kofink", "Atlassian", "Bitbucket Cloud", "NYC"])
  assert(html.includes(fact));
assert(
  !/420\s*W|29H|240.9295|\/home\/|\/mnt\/|Resume\.pdf|Peter Singer|Attitash|Wildcat|sophomore|2012/.test(
    html,
  ),
);
assert(
  !/getUserMedia|geolocation|AudioContext|analytics|fetch\(|https?:\/\//.test(
    js,
  ),
);
assert(css.includes("prefers-reduced-motion"));
assert(!/@import|url\(['"]?https?:/.test(css));
assert(html.includes("FIXED GEAR / SINGLE SPEED / STEEL / RIM BRAKES"));
assert(html.includes("FIXED COG"));
assert(html.includes("LOCKRING"));
assert(html.includes("CONTINUOUS STEERER"));
assert(html.includes("UPPER BEARING"));
assert(html.includes("LOWER BEARING"));
for (const forbidden of [
  'data-piece="derailleur"',
  'data-piece="cassette"',
  'data-piece="freewheel"',
  'class="disc-brake"',
])
  assert(!html.includes(forbidden));
let bytes = 0;
for (const f of ["index.html", "style.css", "app.js"])
  bytes += (await stat(new URL(f, dir))).size;
assert(bytes < 160000, "Unexpectedly large initial text payload");
console.log(
  `PASS: six real chapters, all public projects, unique anchors, fixed-gear/rim-brake drawing anatomy, privacy markers, no remote runtime, static fallback and motion controls. Initial uncompressed HTML/CSS/JS: ${bytes} bytes.`,
);
