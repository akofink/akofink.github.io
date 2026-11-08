import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4174";
const evidence = process.env.EVIDENCE_DIR;
assert(evidence, "Set EVIDENCE_DIR to an ignored local directory");
await mkdir(evidence, { recursive: true });
const ids = ["frame", "drive", "steering", "wheels", "cockpit", "saddle"];
const browser = await chromium.launch({ headless: true });
const results = [],
  failures = [];
async function fullCapture(page, path) {
  const before = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await page.screenshot({ path, fullPage: true });
  await page.evaluate(
    (p) => scrollTo({ top: p.y, left: p.x, behavior: "instant" }),
    before,
  );
}
async function audit(page, state, size) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  );
  if (overflow)
    failures.push({ state, size, error: "document horizontal overflow" });
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = axe.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  if (violations.length) failures.push({ state, size, violations });
  results.push({ state, size, overflow, axeFindings: violations.length });
}
try {
  for (const [size, width, height] of [
    ["desktop", 1440, 1100],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: size === "mobile",
      hasTouch: size === "mobile",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [],
      external = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (!r.url().startsWith(base)) external.push(r.url());
    });
    await page.goto(base);
    await page.waitForSelector('body[data-mode="assembled"]');
    await fullCapture(page, `${evidence}/${size}-assembled.png`);
    await audit(page, "assembled", size);
    for (const target of await page
      .locator(".part-index a, .part-pin a, #deconstruct, #zoom")
      .all()) {
      if (await target.isVisible()) {
        const box = await target.boundingBox();
        assert(
          box.width >= 44 && box.height >= 44,
          "Primary touch target below 44 CSS pixels",
        );
      }
    }
    await page.keyboard.press("Tab");
    assert(
      await page.locator(".skip").evaluate((e) => e === document.activeElement),
    );
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "main");
    await page.locator("#deconstruct").click();
    await page.waitForSelector('body[data-mode="exploded"]');
    assert(
      await page
        .locator('[data-piece="rear-wheel"]')
        .evaluate((e) => getComputedStyle(e).transform !== "none"),
    );
    assert(
      await page.locator("#bicycle").evaluate((e) =>
        [...e.querySelectorAll("*")].every((x) =>
          getComputedStyle(x)
            .transitionDuration.split(",")
            .every((t) => parseFloat(t) === 0),
        ),
      ),
    );
    await fullCapture(page, `${evidence}/${size}-exploded.png`);
    await audit(page, "exploded", size);
    await page.locator('[data-part="drive"]').click();
    await page.waitForSelector('body[data-mode="inspect"]');
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "plate-title",
    );
    await page.goBack();
    await page.waitForSelector('body[data-mode="exploded"]');
    for (const id of ids) {
      await page.locator(`[data-part="${id}"]`).click();
      assert.equal(
        await page.locator("#workshop").getAttribute("data-part"),
        id,
      );
      assert(
        (await page.locator("#plate-title").innerText()).includes(
          await page
            .locator(`.part-index a[data-part="${id}"] strong`)
            .innerText(),
        ),
        "Inspection toolbar must name the chosen component",
      );
      assert(await page.locator(`#${id}`).isVisible());
      assert(await page.locator(`#plate-${id}`).isVisible());
      assert.equal(await page.locator(".chapter:visible").count(), 1);
      await page.screenshot({ path: `${evidence}/${size}-${id}-viewport.png` });
      await fullCapture(page, `${evidence}/${size}-${id}.png`);
      await page
        .locator(".drawing")
        .screenshot({ path: `${evidence}/${size}-${id}-plate.png` });
      await audit(page, id, size);
      await page.locator("#zoom").click();
      assert.equal(
        await page.locator("#zoom").getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page
          .locator(".drawing-viewport")
          .evaluate((e) => e === document.activeElement),
        true,
      );
      const scrollBefore = await page
        .locator(".drawing-viewport")
        .evaluate((e) => e.scrollLeft);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(150);
      assert(
        await page
          .locator(".drawing-viewport")
          .evaluate((e) => e.scrollWidth > e.clientWidth),
        "larger drawing must expose scrollable detail",
      );
      assert(
        (await page
          .locator(".drawing-viewport")
          .evaluate((e) => e.scrollLeft)) >= scrollBefore,
      );
      if (id === "drive" || id === "steering")
        await page
          .locator(".drawing")
          .screenshot({ path: `${evidence}/${size}-${id}-larger.png` });
      await page.locator("#zoom").click();
    }
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (t) => (window.__copied = t) },
      });
    });
    await page.locator("#saddle .copy-idea").click();
    assert(
      (await page.evaluate(() => window.__copied)).includes(
        "productivity tool",
      ),
    );
    await page.keyboard.press("Escape");
    await page.waitForSelector('body[data-mode="assembled"]');
    assert.equal(
      await page.evaluate(() =>
        document.activeElement.getAttribute("data-part"),
      ),
      "saddle",
    );
    await page.locator('[data-part="cockpit"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator("#workshop").getAttribute("data-part"),
      "cockpit",
    );
    await page.locator("#deconstruct").click();
    await page.waitForSelector('body[data-mode="assembled"]');
    await page.locator(".reading-link").click();
    await page.waitForSelector('body[data-mode="reading"]');
    assert.equal(await page.locator(".chapter:visible").count(), 6);
    assert(!(await page.locator(".drawing").isVisible()));
    assert(!(await page.locator("#deconstruct").isVisible()));
    assert(
      (await page.locator(".inspection").innerText()).includes(
        "Bitbucket Cloud",
      ),
    );
    await fullCapture(page, `${evidence}/${size}-reading.png`);
    await audit(page, "reading", size);
    await page.locator("#return-bike").click();
    await page.waitForSelector('body[data-mode="assembled"]');
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await context.close();
  }
  const standard = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "no-preference",
  });
  const p = await standard.newPage();
  await p.goto(base);
  await p.waitForSelector('body[data-mode="assembled"]');
  const start = await p
    .locator('[data-piece="drive"]')
    .evaluate((e) => getComputedStyle(e).transform);
  await p.locator("#deconstruct").click();
  await p.waitForTimeout(300);
  await p
    .locator(".drawing")
    .screenshot({ path: `${evidence}/desktop-during-deconstruction.png` });
  await p.waitForTimeout(1100);
  const end = await p
    .locator('[data-piece="drive"]')
    .evaluate((e) => getComputedStyle(e).transform);
  assert.notEqual(start, end);
  await fullCapture(p, `${evidence}/desktop-motion-exploded-after-settle.png`);
  await p.locator("#deconstruct").click();
  await p.waitForTimeout(1100);
  assert.equal(
    await p
      .locator('[data-piece="drive"]')
      .evaluate((e) => getComputedStyle(e).transform),
    "none",
  );
  // Rapid reversals cancel the old camera, rather than leaving a stale framing timer.
  for (let i = 0; i < 3; i++) {
    await p.locator("#deconstruct").click();
    await p.waitForTimeout(100);
  }
  await p.waitForTimeout(1100);
  assert.equal(
    await p.locator("#bicycle").getAttribute("viewBox"),
    "-60 -90 1320 910",
  );
  assert(
    !(await p
      .locator("#workshop")
      .evaluate((e) => e.classList.contains("is-shifting"))),
  );
  await p.locator("#deconstruct").click();
  await p.waitForTimeout(100);
  await p.locator("#motion").click();
  assert(
    await p.locator("body").evaluate((e) => e.classList.contains("low-motion")),
  );
  assert.equal(
    await p.locator("#bicycle").getAttribute("viewBox"),
    "40 20 1100 760",
  );
  assert(
    !(await p
      .locator("#workshop")
      .evaluate((e) => e.classList.contains("is-shifting"))),
  );
  await standard.close();
  for (const width of [320, 768, 1024, 1920]) {
    const c = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const p = await c.newPage();
    await p.goto(base);
    for (const id of ["", "exploded", ...ids, "read"]) {
      await p.evaluate((hash) => {
        history.pushState({}, "", hash ? `#${hash}` : "/");
        dispatchEvent(new PopStateEvent("popstate"));
      }, id);
      await p.waitForTimeout(40);
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )),
        `${width} ${id} overflow`,
      );
      if (id === "drive" || id === "exploded")
        await fullCapture(p, `${evidence}/${width}-${id}.png`);
    }
    await c.close();
  }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const np = await nojs.newPage();
  await np.goto(base);
  assert.equal(await np.locator(".chapter:visible").count(), 6);
  await np.locator('[data-part="drive"]').click();
  assert.equal(await np.evaluate(() => location.hash), "#drive");
  assert(await np.locator("#drive").isVisible());
  await fullCapture(np, `${evidence}/mobile-no-script.png`);
  await nojs.close();
  const direct = await browser.newPage();
  await direct.goto(`${base}/#steering`);
  await direct.waitForSelector('body[data-mode="inspect"]');
  assert(await direct.locator("#steering").isVisible());
  await direct.locator("#overview").click();
  await direct.waitForSelector('body[data-mode="assembled"]');
  await direct.close();
  await writeFile(
    `${evidence}/results.json`,
    JSON.stringify(
      {
        revision: execFileSync("git", ["rev-parse", "HEAD"], {
          encoding: "utf8",
        }).trim(),
        generatedAt: new Date().toISOString(),
        results,
        failures,
        scope:
          "Chromium headless desktop/touch-emulated mobile; not physical-device, screen-reader or cross-browser certification",
      },
      null,
      2,
    ),
  );
  if (failures.length) {
    console.log(JSON.stringify(failures, null, 2));
    throw Error(`${failures.length} rendered findings`);
  }
  console.log(
    "PASS: assembled/exploded/six parts/reading, keyboard/back/Escape/reassembly, settled/rapid-reversed motion, reduced motion, copy/zoom, no-script/direct links and 320/768/1024/1920 widths.",
  );
} finally {
  await browser.close();
}
