# Ten ways to say hello

A local-only exhibition of ten alternative personal websites for Andrew Kofink. This directory is independent of the Jekyll production site. The root homepage, custom domain, layouts and production settings are unchanged. Nothing here is a deployment command.

## Review locally

Requires Node 20 or newer. The build and preview server have no runtime dependencies:

```sh
cd exhibition
npm run build
npm start
```

Open **http://localhost:4173/**. The preview binds to `127.0.0.1` by default. Set `PORT` for a different port; do not bind publicly without permission. WSL localhost forwarding depends on the host setup. For a remote machine, use an authorized SSH tunnel: `ssh -N -L 4173:127.0.0.1:4173 <preview-host>` and open the same URL locally. Stop with Ctrl+C (or send SIGTERM to the server PID if started in the background).

Gallery cards open full-size designs. Prev/Next links cycle through all ten. **Compare two** opens independent, scrollable, responsive previews; **Open** shows one at full browser width. On narrow screens comparisons stack. **Shortlist** saves favorites only in browser local storage, not on a server. Storage-disabled browsers can still explore all designs. `?embed=1` hides exhibition navigation for clean previews.

| ID / route | Direction |
| --- | --- |
| `/01-editorial/` | Sunday edition: serif, portrait, newspaper rhythm |
| `/02-botanical/` | Personal garden: organic illustration, dark green, interests first |
| `/03-city-grid/` | City blocks: modular biography, bold wayfinding |
| `/04-terminal/` | Personal directory: monospace, native expandable interests |
| `/05-program/` | Concert program: symmetrical title page, three acts |
| `/06-coastal/` | Coastal horizon: airy landscape and a flowing origin story |
| `/07-field-notes/` | Field notebook: annotated portrait, paper, interest cards |
| `/08-swiss/` | Swiss poster: oversized type and a numbered index |
| `/09-letter/` | Personal letter: quiet, single-column, literary |
| `/10-orbit/` | Constellation: orbital interest map, linear mobile layout |
| `/baseline/` | Production reference, captured November 7, 2026 (Eastern) |
| `/compare/` | Two-option comparison |

## Content and materials

Edit `content.mjs` to update shared factual copy, interests, public links and curated project stories. Presentation-specific headlines and introductions live in `build.mjs`; `projects.css` gives the shared stories ten design-native treatments. The ten templates deliberately differ in content hierarchy and layout; they are not ten color themes. There are no invented projects, awards, testimonials, or employment claims. Andrew confirmed Atlassian / Bitbucket Cloud / NYC office. Other existing location and biographical facts may still need a freshness review.

Each design includes five public-source project stories: dots and shared agent/skills setup, akagent-cli, Live Staff, Tinderbox, and Cascade. Each distinguishes project status, gives a concrete idea to borrow, and links public source plus applicable documentation/demo. `SOURCES.md` records provenance and qualifications. The private notes repository is described only at the explicitly permitted existence/architectural-role level, with no private links, paths, content or artifacts.

The portrait is the existing repository's `assets/i_voted.jpg`, reused rather than replaced with a random person. Artwork is original CSS/SVG. Fonts are system stacks, so rendering will vary somewhat across platforms. No external font service, tracking, backend, or animation is required. Motion is disabled under reduced-motion preferences; native links, focus outlines and skip links support keyboard access.

`baseline-assets/` preserves a read-only HTML/CSS/icon capture from the live site. The baseline generator removes scripts/analytics, restores a plain email link, localizes assets and adds exhibition navigation/provenance. Otherwise the original copy and layout remain, including potentially dated employer information and original accessibility limitations. It is a comparison reference, not a claim that the original is an accessible redesign. Original repository and production files are untouched.

## Verification

```sh
npm run build
npm test
npm ci                     # dev tools only
npx playwright install chromium  # if no compatible local browser is available
# With the server running, choose a local output directory:
EVIDENCE_DIR=./evidence npm run test:browser
# Optional existing browser: CHROMIUM_PATH=/path/to/chrome
```

The browser check uses headless Chromium and axe WCAG A/AA checks. It captures all ten at desktop (1440px), tablet (768px), and mobile (390px), checks 320px reflow, checks gallery/comparison at desktop/mobile, captures baseline and project-section crops, and tests project jump links, skip links, shortlist persistence, comparison selection, expandable entries, console/network failures and absence of third-party requests. `BASE_URL` can override the local URL. Project-only crops hide the sticky exhibition toolbar and skip-link overlay to show the content cleanly; full-page captures retain the actual page layout. Keep generated evidence outside tracked sources.

Automated checks do not establish complete accessibility or physical-device compatibility. Safari/Firefox, assistive-technology use and current external link destinations need separate review. No Jekyll production build or deployment is needed to review this exhibition. Picking a direction does not authorize publishing it.
