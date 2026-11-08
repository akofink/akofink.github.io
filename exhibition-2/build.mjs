import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { projects } from "../exhibition/content.mjs";
export const concepts = [
  [
    "switchyard",
    "The interesting route",
    "A transit map for a mind that refuses a single line.",
    "Choose a line. Follow its connections.",
    "Route selection redraws a project itinerary. Borrow the contextual navigation.",
    "Spatial diagram / electric cream & cobalt",
  ],
  [
    "machine",
    "Open the machine",
    "A working life, taken apart on the table.",
    "Slide the casing apart. Inspect the parts.",
    "An exploded assembly reveals the boundaries between tools and records. Borrow the separation of concerns.",
    "Technical illustration / apricot & graphite",
  ],
  [
    "score",
    "A score for curiosity",
    "Engineering has rhythm. So does a life outside it.",
    "Arrange five ideas into your own silent score.",
    "Move project phrases into a sequence, then read the resulting composition. No sound. Borrow the compositional interaction.",
    "Music manuscript / ink & vermilion",
  ],
  [
    "contours",
    "Take the long way",
    "Not a career ladder. A landscape of things worth exploring.",
    "Choose a trail; visit its waypoints.",
    "Two trails cross a handmade contour map. Borrow the guided discovery without scroll hijacking.",
    "Topographic field atlas / pine & acid yellow",
  ],
  [
    "press",
    "Make something worth passing on",
    "A personal website that becomes a small public printing press.",
    "Choose a principle. Print a keepsake.",
    "Compose and locally print an idea sheet with real source links. Borrow the useful takeaway.",
    "Letterpress / ultramarine & butter",
  ],
  [
    "garden",
    "Small rules. Living worlds.",
    "An engineer’s curiosity, planted in a tiny ecosystem.",
    "Plant seeds. Change a rule. Advance one season.",
    "A deterministic toy shows how rules change outcomes. Borrow the visible rules and deliberate stepping.",
    "Ecological quilt / plum & lime",
  ],
  [
    "xray",
    "Nothing up my sleeve",
    "Look at the work. Then look through it.",
    "Switch from the surface to its underlying decisions.",
    "A conservation table pairs a visual artifact with its exposed design constraints. Borrow the two-layer explanation.",
    "Light table / cyan & carbon",
  ],
  [
    "hearing",
    "The tradeoff hearing",
    "Good engineering is not a string of perfect answers.",
    "Give the work a budget. Hear what waits.",
    "An actual queue illustrates bounded work without pretending to benchmark. Borrow an honest, inspectable tradeoff.",
    "Civic chamber / burgundy & pink",
  ],
  [
    "windows",
    "A few lights still on",
    "A small city of things I care about.",
    "Open a window. Find a different side of Andrew.",
    "A cutaway city changes with your chosen hour, not your location or clock. Borrow the intimate spatial index.",
    "Architectural cutaway / midnight & tangerine",
  ],
  [
    "zine",
    "Please unfold",
    "A pocket-sized manifesto for being more than your job.",
    "Turn the leaves. Make room for another interest.",
    "A five-leaf folding publication links professional practice and playful work. Borrow the compact editorial object.",
    "Folded paper / grass & lilac",
  ],
];
const out = new URL("./dist/", import.meta.url);
await mkdir(out, { recursive: true });
for (const file of ["style.css", "experience.js"])
  await copyFile(new URL(file, import.meta.url), new URL(file, out));
await mkdir(new URL("previews/", out), { recursive: true });
for (const [id] of concepts)
  await copyFile(
    new URL(`previews/${id}.webp`, import.meta.url),
    new URL(`previews/${id}.webp`, out),
  );
const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const buttons = (labels, attr = "pick") =>
  labels
    .map(
      (l, i) =>
        `<button type="button" data-${attr}="${i}" aria-pressed="${i === 0}"><span class="serial">0${i + 1}</span> ${l}</button>`,
    )
    .join("");
const svg = (inner, cls = "", viewBox = "0 0 1000 620") =>
  `<svg class="${cls}" viewBox="${viewBox}" aria-hidden="true">${inner}</svg>`;
const map = svg(
  `<path class="route r0" d="M80 480H280V180H560V400H900"/><path class="route r1" d="M80 100H410V480H720V160H900"/><path class="route r2" d="M120 570V310H850V70"/>${[
    [280, 480],
    [280, 180],
    [560, 180],
    [560, 400],
    [850, 400],
    [410, 100],
    [410, 310],
    [720, 310],
  ]
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="12"/><text x="${x > 700 ? x - 20 : x + 20}" y="${x === 850 ? y + 36 : y - 22}" text-anchor="${x > 700 ? "end" : "start"}">${["PUBLIC SETUP", "DURABLE WORK", "LOCAL MUSIC", "LIVING SYSTEMS", "BOUNDED WORK", "NEW YORK", "CURIOSITY", "PLAY"][i]}</text>`,
    )
    .join("")}`,
);
const contours = svg(
  Array.from(
    { length: 17 },
    (_, i) =>
      `<ellipse cx="${470 + i * 5}" cy="${300 - i * 2}" rx="${80 + i * 24}" ry="${40 + i * 15}" transform="rotate(-24 500 300)"/>`,
  ).join("") +
    '<path class="trail" d="M130 500L320 400L390 230L610 180L760 300L880 130"/><g class="waypoints">' +
    [
      [130, 500],
      [320, 400],
      [390, 230],
      [610, 180],
      [760, 300],
    ]
      .map(
        ([x, y], i) =>
          `<circle cx="${x}" cy="${y}" r="19"/><text x="${x}" y="${y + 6}" text-anchor="middle">${i + 1}</text>`,
      )
      .join("") +
    "</g>",
);
const machine = svg(
  `<g class="housing"><path d="M180 110L530 30L850 185L500 280Z"/><path d="M180 110V235L500 405V280M500 405L850 310V185"/><text x="310" y="160">ANDREW / OPEN SYSTEM</text></g><g class="wiring"><path d="M220 300L480 230L800 380L520 460Z"/><path d="M320 320L520 275L690 360L500 410Z"/><text x="390" y="355">RECORD ≠ ACTION</text></g><g class="base"><path d="M180 410L500 320L850 480L520 580Z"/><path d="M180 410V440L520 610L850 510V480M520 580V610"/><text x="300" y="470">GIT · TMUX · PROVIDER TOOLS</text></g>`,
  "",
  "0 0 1000 740",
);
function stage(id) {
  switch (id) {
    case "switchyard":
      return `<div class="map-board">${map}<div class="map-key">● A PERSONAL NETWORK<br>Not a commute. A connection.</div></div><div class="route-controls" role="group" aria-label="Choose a route">${buttons(["Make tools", "Make room for play", "Keep things local"], "route")}</div><div id="itinerary" class="ticket" aria-live="polite"></div>`;
    case "machine":
      return `<div class="machine-board">${machine}</div><label class="slider">Compact view <input id="explode" type="range" min="0" max="100" value="65"> Exploded view</label><div class="parts">${buttons(["Public modules", "Durable registry", "External actions"])}</div><div id="reveal" class="inspection" aria-live="polite"></div>`;
    case "score":
      return `<div class="score-strip" role="group" aria-label="Your silent composition">${projects.map((p, i) => `<div class="measure"><span>${["I", "II", "III", "IV", "V"][i]}</span><div class="note" aria-hidden="true">${["♩", "♫", "♩", "♬", "♩"][i]}</div><strong data-slot="${i}">${p.name}</strong></div>`).join("")}</div><div class="score-tools"><button id="rotate">Move first phrase to the end</button><button id="reverse">Reverse the score</button><button id="score-reset">Original score</button><label>Feature a phrase <select id="featured-phrase">${projects.map((p, i) => `<option value="${i}">${p.name}</option>`).join("")}</select></label><button id="feature-phrase">Move this phrase to the beginning</button></div><div id="composition" class="libretto" aria-live="polite"></div><p class="caption">An arrangement of projects, not a transcription or audio player. Silence is intentional.</p>`;
    case "contours":
      return `<div class="atlas"><div class="map-caption">FIELD ATLAS / NYC ↔ IDEAS<br>SCHEMATIC, NOT A REAL LOCATION</div>${contours}<span class="north">N ↑</span></div><div class="trail-controls">${buttons(["The toolmaker’s trail", "The playful trail"], "trail")}</div><ol id="trail-list" class="trail-list" aria-live="polite"></ol>`;
    case "press":
      return `<div class="press-layout"><div class="type-cabinet"><p>SET THE TYPE</p>${buttons(["Make the rules visible", "Keep personal data local", "Leave something to borrow"], "principle")}<button id="print">Print the idea sheet ↗</button></div><article id="impression" class="impression" aria-live="polite"></article></div><p class="caption">Print opens your browser’s print dialog. No upload, signup or tracking. Cancel freely.</p>`;
    case "garden":
      return `<div class="garden-layout"><div><div id="garden-grid" class="garden-grid" role="group" aria-label="Seed plot"></div><p class="caption">Click a square to plant or remove a seed. Keyboard: arrow keys move, Space plants, Tab leaves the plot. This is a toy, not ecological science.</p></div><div class="seed-packet"><span>EXPERIMENT 06</span><h2>What if the rules changed?</h2><label>Growth rule <select id="rule"><option value="spread">Spread to the right</option><option value="shelter">Grow only beside two neighbors</option></select></label><button id="season">Advance one season</button><button id="garden-reset">Reseed the plot</button><p id="garden-status" role="status"></p><p>In Tinderbox, interacting materials make a world worth exploring. Here, a smaller question: what changes when one rule does?</p><a href="https://github.com/akofink/tinderbox">Explore Tinderbox’s real rules ↗</a></div></div>`;
    case "xray":
      return `<div class="xray-controls">${buttons(["Surface", "Under the surface"], "layer")}</div><div class="light-table"><div class="artifact"><span class="specimen-label">SPECIMEN 07 / LIVE STAFF</span><div class="staff-art" aria-hidden="true"><i>♩</i><i>♩</i><i>♩</i></div><p id="surface-caption">A note appears. A sound becomes something you can see.</p></div><div id="underlay" class="underlay"><h2>The invisible decisions</h2><ol><li>Keep microphone audio on the device.</li><li>Start with one sustained note, not a whole band.</li><li>Say when a detector can get the octave wrong.</li></ol></div></div><div id="xray-reading" class="xray-reading" aria-live="polite"></div>`;
    case "hearing":
      return `<div class="chamber"><div class="docket"><span>CASE 008</span><h2>The queue<br>versus<br>the frame.</h2><p>You cannot do everything at once without a cost. Which work gets to wait?</p></div><div class="queue-bench"><div id="queue" class="queue" role="img" aria-label="Pending work"></div><label>Work credits per step <input id="budget" type="range" min="1" max="8" value="3"><output id="budget-value">3</output></label><div class="hearing-controls"><button id="admit">Add 8 jobs</button><button id="step">Spend one bounded step</button><button id="all-step">Compare: process all at once</button><button id="queue-reset">Reset hearing</button></div><p id="verdict" role="status"></p></div></div><p class="caption">A tiny deterministic queue illustration, not a Cascade benchmark. One square costs one credit.</p><blockquote>Make overload a visible design decision, not a hidden surprise.</blockquote>`;
    case "windows":
      return `<div class="hour-controls" role="group" aria-label="Choose an imagined hour">${buttons(["Morning", "Evening", "Late"], "hour")}</div><div class="city"><div class="city-name">NEW<br>YORK<br><span>ANDREW’S SMALL WORLD</span></div><div class="building">${buttons(["At the workbench", "In the music room", "In the garden", "At the theater", "Inside an experiment", "On the street"], "window")}</div><div id="window-story" class="window-story" aria-live="polite"></div></div><p class="caption">An imagined cutaway, not Andrew’s home or schedule. The hour is yours to choose.</p>`;
    case "zine":
      return `<div class="zine-desk"><div class="fold-shadow"></div><article id="leaf" class="leaf" aria-live="polite"></article><div class="zine-controls"><button id="prev-leaf">← Previous leaf</button><span id="page-number"></span><button id="next-leaf">Next leaf →</button></div></div><p class="caption">Five leaves. No infinite scroll. All projects also have a plain reading route below.</p>`;
  }
}
const directory = () =>
  `<section id="reading" class="reading"><div class="bio"><p class="eyebrow">The person behind the experiment</p><h2>Andrew Kofink</h2><p>I’m a software engineer at Atlassian, working on Bitbucket Cloud in the NYC office. My background spans electrical engineering and full-stack software, including work at Red Hat.</p><p>Outside the screen: opera, ballet, cycling, cooking and gardening. I like things that reward a closer look, whether that’s a musical phrase, a living system or a small tool that makes the next day better.</p><a href="https://github.com/akofink">Find me on GitHub ↗</a></div><div class="project-directory"><h2>Open work. Useful ideas.</h2>${projects.map((p) => `<article id="project-${p.id}"><span class="eyebrow">${p.status}</span><h3>${p.name}</h3><p>${p.description}</p><p><strong>Something to borrow:</strong> ${p.idea}</p><a href="${p.source}">Inspect source & licensing ↗</a> · <a href="${p.extra[1]}">${p.extra[0]} ↗</a></article>`).join("")}</div></section>`;
const head = (title, body, cls = "") =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(title)} · Andrew Kofink</title><link rel="stylesheet" href="./style.css"></head><body class="${cls}">${body}</body></html>`;
for (const [i, c] of concepts.entries()) {
  const [id, name, desc, instruction] = c;
  await writeFile(
    new URL(`${id}.html`, out),
    head(
      name,
      `<a class="skip" href="#main">Skip to experience</a><header class="exhibition-bar"><a href="./index.html">← Ten experiments</a><span>${String(i + 1).padStart(2, "0")} / 10</span><a href="#reading">Read Andrew & projects ↓</a><button id="motion" aria-pressed="false">Low motion</button></header><main id="main" tabindex="-1" data-exhibit="${id}"><div class="title"><p class="eyebrow">ANDREW KOFINK / ${c[5]}</p><h1>${name}</h1><p class="dek">${desc}</p><p class="instruction">↳ ${instruction}</p></div><noscript><p class="script-notice">The interactive layer needs JavaScript. <a href="#reading">Read all facts and projects without it ↓</a></p></noscript><section class="experience" aria-label="${esc(name)} interactive experience">${stage(id)}</section>${directory()}</main><footer><a href="./${concepts[(i + 1) % 10][0]}.html">Next experiment: ${concepts[(i + 1) % 10][1]} →</a><a href="./index.html">Compare all ten</a><p>Local-first experiments. No tracking, audio, sensors or remote runtime services.</p></footer><script type="module" src="./experience.js"></script>`,
      id,
    ),
  );
}
await writeFile(
  new URL("index.html", out),
  head(
    "Ten ways to stay curious",
    `<a class="skip" href="#main">Skip to exhibition</a><header class="gallery-header"><a href="http://localhost:4173/">Compare with round one (port 4173)</a><span>LOCAL EXHIBITION / ROUND TWO</span></header><main id="main" tabindex="-1" class="gallery"><div class="gallery-intro"><p class="eyebrow">ANDREW KOFINK / TEN POSSIBLE WORLDS</p><h1>Don’t just<br>look.<br><em>Get into it.</em></h1><div><p>Software engineer at Atlassian. New York City. A life with more than one line of inquiry.</p><p>Ten different doors into the same person and his open work. Not ten color schemes. Pick a world, touch its rules, take an idea with you.</p><a href="#comparison">Compare the experiences ↓</a></div></div><p class="caption">Actual rendered previews, including interacted states. Open any world to explore it yourself.</p><section class="exhibition-grid" aria-label="Ten implemented alternatives">${concepts.map((c, i) => `<a class="exhibit-preview preview-${c[0]}" href="./${c[0]}.html"><span class="preview-number">${String(i + 1).padStart(2, "0")}</span><div class="mini" aria-hidden="true"><img src="./previews/${c[0]}.webp" width="700" height="440" alt="" loading="lazy"></div><h2>${c[1]} ↗</h2><p>${c[2]}</p><span class="preview-action">${c[3]}</span></a>`).join("")}</section><section id="comparison" class="comparison"><h2>Choose by experience, not by color.</h2><div class="comparison-scroll"><table><thead><tr><th>World</th><th>What you do / what you can borrow</th><th>Tradeoff</th></tr></thead><tbody>${concepts.map((c, i) => `<tr><th><a href="./${c[0]}.html">${c[1]}</a></th><td>${c[4]}</td><td>${["Best for connecting ideas; diagrams need a little orientation.", "Best for technical storytelling; metaphor is intentionally mechanical.", "Best for playful composition; not an actual music application.", "Best for exploratory reading; route order is editorial, not chronology.", "Best for a useful takeaway; printing is optional.", "Best for hands-on curiosity; a tiny toy, not a full simulation.", "Best for explaining invisible choices; deliberately restrained interaction.", "Best for making a technical tradeoff concrete; not performance evidence.", "Best for a personal, intimate introduction; fictional architecture.", "Best for concise narrative; one leaf at a time asks for deliberate reading."][i]}</td></tr>`).join("")}</tbody></table></div><p>Every world has the same factual project directory, native controls, a low-motion switch and a no-script reading route. None asks for microphone access. These experiences interpret the work; they do not reproduce or benchmark it.</p></section></main><footer><p>Ten alternatives for local comparison. No option has been selected or deployed.</p><a href="./switchyard.html#reading">Just read about Andrew & the projects →</a></footer>`,
    "gallery-page",
  ),
);
await writeFile(new URL("projects.json", out), JSON.stringify(projects));
console.log("Built ten independent experiences and comparison gallery.");
