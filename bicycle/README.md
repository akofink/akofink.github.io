# Moving parts

One personal website for Andrew Kofink, built around a bespoke, deconstructable fixed-gear bicycle. A local design preview, not a production deployment.

```sh
cd bicycle
npm ci
npm run build
npm start
```

Open **http://localhost:4174/**. The server binds only to `127.0.0.1`; `PORT` overrides its port. Stop the owning process or use Ctrl-C in the terminal that started it. Rebuild after editing. The earlier exhibitions remain in Git history and source directories, but this server exposes only the single bicycle site.

## One object, six connections

- **Frame:** modular public setup, reusable instructions and private-context boundaries.
- **Drivetrain:** durable task identity, observation and recovery with akagent-cli.
- **Headset and fork:** curiosity, Live Staff and honest prototype limits.
- **Wheels:** interacting rules in Tinderbox and explicit work budgets in Cascade.
- **Cockpit:** professional background and legible constraints.
- **Saddle:** cycling, cooking, gardening, opera, ballet and a life outside the screen.

The complete bicycle is the initial view. Deconstruct separates coherent assemblies; inspection opens a specially drawn component plate and its authored chapter. There is no repeated project-card directory beneath the bicycle. The explicit **Just read** route and no-JavaScript fallback contain the same six chapters and every source link.

## Illustration and mechanics

The geometry is authored in `illustration.mjs`, not a stock image or a runtime model. It depicts a steel double-triangle frame, one chainring, a single fixed cog and lockring, a single chainline, crossed spokes, headset/steerer/fork, drop-bar controls and two cable-operated rim calipers. There is no derailleur, cassette, freewheel mechanism or disc brake. Enlarged plates separate bottom-bracket cups/bearings/spindle/cranks, steering bearings/races, wheel layers, cables/calipers and saddle supports.

The drawings are schematic projections, not dimensioned CAD, engineering validation, riding advice or a service/disassembly sequence. They do not establish ownership of this particular bicycle. Wheel spokes are separated for clarity, not represented as a detachable solid disc. The private context that inspired the site is not published.

## Interaction and access

Native part links, SVG hotspots and URL fragments share the same chapter state. Browser Back works. Escape returns to the assembled bicycle and its originating control. Overview returns to the previous overview; Reassemble always restores the complete bicycle. **Larger drawing** uses native scrollable overflow with keyboard arrows or touch, not mandatory precision dragging. On small screens, large native index links replace tiny SVG hotspots.

Motion is confined to deliberate assembly transitions and synchronized framing, never scroll-driven. Reduced-motion preferences and a session-scoped switch remove transitions. No remote runtime services, fonts, analytics, audio or sensors are used. An explicit Copy thought click writes only that displayed editorial sentence to the clipboard; if access is denied, the selectable text remains available.

## Verification

```sh
npm run build
npm test
# If the browser is absent, do not garbage-collect another task's shared cache:
PLAYWRIGHT_SKIP_BROWSER_GC=1 npx playwright install chromium
# With the preview running, supply an ignored evidence directory:
EVIDENCE_DIR=/your/ignored/evidence npm run test:browser
```

The browser suite exercises assembled, exploded, all six component states, reading, standard/reduced motion, keyboard focus, Back, Escape, reassembly, rapid animation reversal/cancellation, zoom/scroll, copy, direct deep links and no-script content. It renders desktop and touch-emulated mobile, with additional 320/768/1024/1920px checks, axe scans and local-only request assertions. Full-page screenshots are captured from scroll origin so a sticky masthead does not falsely cover offscreen content; viewport and plate captures retain actual interaction context.

Five actual page captures are retained in [EVIDENCE.md](EVIDENCE.md); they are not runtime assets.

This does not establish subjective creative quality, physical accuracy, screen-reader compatibility, physical-device behavior or cross-browser accessibility. See [SOURCES.md](SOURCES.md) for factual scope. No production changes, hosting or deployment automation are included.
