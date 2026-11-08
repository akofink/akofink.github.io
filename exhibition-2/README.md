# Ten possible worlds: round two

A local-only second exhibition for Andrew Kofink. Ten implemented experiences, not theme switches. No choice has been made and nothing here deploys the website. Round one remains unchanged in `exhibition/`.

## Run

Requires Node 20+.

```sh
cd exhibition-2
npm ci
npm run build
npm start
```

Open **http://localhost:4174/**. The server binds only to `127.0.0.1`; override with `PORT` if necessary. The gallery’s round-one comparison link expects its separate preview on port 4173. Stop this server with Ctrl-C in its owning terminal, or terminate only its verified process. Rebuild after editing sources. `dist/` and dependencies are ignored.

## Ten different interaction grammars

| World | Implemented experience | Useful piece |
| --- | --- | --- |
| Switchyard | Three lines redraw a connected itinerary and transfer ticket | Contextual project navigation |
| Open the machine | Range-controlled exploded assembly and inspectable parts | Separating reusable setup, records and external actions |
| Silent score | Rotate, reverse and feature project phrases in a five-part arrangement | Content as a composable sequence, without audio |
| Contour atlas | Two editorial trails change the path and reorder five waypoints | Guided exploration without scroll hijacking |
| Idea press | Set one of three principles; print an actual source-linked sheet | A useful, local takeaway without signup |
| Seed garden | Plant squares, change growth rules and advance deterministic seasons | Visible rules and deliberate, inspectable stepping |
| X-ray table | Reveal the local-first choices behind a musical interface | Pair the visible result with invisible constraints |
| Tradeoff hearing | Admit work, spend a chosen budget, compare processing all at once | Honest queue accounting, not a performance claim |
| City windows | Choose an imagined hour and open six rooms of interests | A personal spatial index without real-location collection |
| Folding zine | Read five leaves, each connecting an interest to a public project | A compact narrative instead of an activity feed |

Each world includes a direct, static biography and all five public project descriptions with source links and ideas to borrow. Shared factual content comes from `../exhibition/content.mjs`; each experience has its own composition, controls and narrative. All metaphors are labeled as illustrations, not literal maps, schedules, hardware, ecological models or benchmarks.

## Constraints

No runtime packages, remote fonts, analytics, autoplay, audio playback, camera, microphone or location access. Only the low-motion preference is stored in session storage. It is optional and failure-safe. The press opens the browser print workflow only after an explicit click. Project links intentionally leave the exhibition and may have their own privacy behavior.

Native buttons, links, range inputs and selects support keyboard interaction. The seed plot uses a roving tab stop: arrow keys move, Home/End move within a row, Space plants, Tab exits. Every world honors reduced-motion preferences and has an explicit switch. Without JavaScript, the factual directory is still fully readable. No hidden gesture or animation is required to find the person or projects.

## Verification

```sh
npm run build
npm test
# First browser setup, if needed. Avoid removing other installations from shared caches:
PLAYWRIGHT_SKIP_BROWSER_GC=1 npx playwright install chromium
# Start the preview separately, then supply your own ignored evidence directory:
EVIDENCE_DIR=/your/ignored/evidence npm run test:browser
```

The browser suite exercises 1440px desktop and 390px touch-emulated mobile layouts, initial and interacted axe states, actual control results, skip-link focus, keyboard activation, seed-grid navigation, reduced motion, a standard-motion context, source-linked print styling, no-script directories and a 200%-zoom-equivalent CSS viewport. It captures rendered screenshots and an actual Chromium-generated print PDF. The print invocation is stubbed in automation; the PDF verifies print layout, not an operating-system print dialog or printer.

These are Chromium checks, not a claim of universal accessibility. No physical phone, screen reader, Firefox, Safari, voice-control or motor-accessibility user study has been completed. Screenshots do not establish subjective memorability. The exhibition is for human comparison and can be rejected in favor of the original site.

See [SOURCES.md](SOURCES.md) for facts and privacy boundaries.
