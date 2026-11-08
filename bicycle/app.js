const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const chapters = $$("[data-chapter]");
const ids = chapters.map((c) => c.id);
const svg = $("#bicycle"),
  stage = $("#workshop"),
  title = $("#plate-title");
let low = matchMedia("(prefers-reduced-motion: reduce)").matches;
try {
  low = low || sessionStorage.getItem("moving-parts-low-motion") === "true";
} catch {}
let previousOverview = "",
  returnFocus = null,
  cameraFrame = 0;
function frameView(next, animate = false) {
  cancelAnimationFrame(cameraFrame);
  stage.classList.remove("is-shifting");
  const target = next.split(" ").map(Number),
    start = svg.getAttribute("viewBox").split(" ").map(Number);
  if (
    !animate ||
    low ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    svg.setAttribute("viewBox", next);
    return;
  }
  stage.classList.add("is-shifting");
  const began = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - began) / 950),
      ease = 1 - Math.pow(1 - t, 3);
    svg.setAttribute(
      "viewBox",
      start.map((v, i) => v + (target[i] - v) * ease).join(" "),
    );
    if (t < 1) cameraFrame = requestAnimationFrame(tick);
    else {
      svg.setAttribute("viewBox", next);
      stage.classList.remove("is-shifting");
    }
  };
  cameraFrame = requestAnimationFrame(tick);
}
function motion() {
  document.body.classList.toggle("low-motion", low);
  $("#motion").setAttribute("aria-pressed", String(low));
  $("#motion").textContent = low ? "Low motion: on" : "Low motion";
}
motion();
document.body.classList.add("enhanced");
$$("button[disabled]").forEach((b) => (b.disabled = false));
$("#motion").addEventListener("click", () => {
  low = !low;
  motion();
  if (low) render(false);
  try {
    sessionStorage.setItem("moving-parts-low-motion", String(low));
  } catch {}
});
function selected() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return "";
  }
}
function resetZoom() {
  $("#zoom").setAttribute("aria-pressed", "false");
  $("#zoom").textContent = "Larger drawing ↗";
  $(".drawing-viewport").classList.remove("zoomed");
  $(".drawing-viewport").scrollTo(0, 0);
}
function render(focus = false) {
  const oldMode = document.body.dataset.mode;
  const hash = selected();
  const part = ids.includes(hash) ? hash : null;
  const reading = hash === "read";
  const exploded = hash === "exploded";
  document.body.dataset.mode = reading
    ? "reading"
    : part
      ? "inspect"
      : exploded
        ? "exploded"
        : "assembled";
  stage.dataset.part = part || "";
  stage.dataset.exploded = String(exploded);
  frameView(
    part ? "0 0 1100 850" : exploded ? "-60 -90 1320 910" : "40 20 1100 760",
    !part &&
      !reading &&
      ["assembled", "exploded"].includes(oldMode) &&
      oldMode !== document.body.dataset.mode,
  );
  svg.setAttribute(
    "aria-label",
    part
      ? `Enlarged schematic of ${$(`.part-index a[data-part="${part}"] strong`).textContent}`
      : "A steel fixed-gear bicycle with rim brakes; choose a numbered part",
  );
  $("#assembly").style.display = part ? "none" : "";
  $$(".detail-plate").forEach(
    (p) => (p.style.display = p.id === `plate-${part}` ? "block" : "none"),
  );
  chapters.forEach((c) => (c.hidden = !reading && c.id !== part));
  $("#read").hidden = !reading;
  $(".inspection").hidden = !reading && !part;
  $("#overview").hidden = !part && !reading;
  $("#deconstruct").hidden = reading;
  $("#deconstruct").innerHTML = part
    ? 'Reassemble the bicycle <span aria-hidden="true">↙</span>'
    : exploded
      ? 'Reassemble the bicycle <span aria-hidden="true">↙</span>'
      : 'Deconstruct the bicycle <span aria-hidden="true">↗</span>';
  $("#deconstruct").setAttribute("aria-pressed", String(exploded));
  title.textContent = reading
    ? "A more direct route."
    : part
      ? `${$(`.part-index a[data-part="${part}"] span`).textContent} / ${$(`.part-index a[data-part="${part}"] strong`).textContent}`
      : exploded
        ? "Same bicycle. A little more room."
        : "The whole, for now.";
  $("#plate-subtitle").textContent = part
    ? "ENLARGED INSPECTION / FOLLOW THE CONNECTION"
    : reading
      ? "ALL SIX CHAPTERS / ALL PUBLIC SOURCE LINKS"
      : "FIXED GEAR / SINGLE SPEED / STEEL / RIM BRAKES";
  $("#drawing-caption").textContent = part
    ? "A schematic relationship, not a maintenance sequence. Use Larger drawing to look closer."
    : exploded
      ? "The assemblies separate, but the connections remain. Pick a numbered part."
      : "Choose a numbered part, or take the whole bicycle apart.";
  $$("a.part-link").forEach((a) => {
    if (a.getAttribute("href") === `#${part}`)
      a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
  const pinPositions = exploded
    ? {
        frame: [600, 106, "M600 133V183L580 220"],
        drive: [675, 710, "M650 700L600 650"],
        steering: [1100, 208, "M1075 215L839 275"],
        wheels: [1190, 670, "M1168 655L1120 650"],
        cockpit: [1050, -12, "M1025-2L920 25"],
        saddle: [287, -20, "M312-12L389 30"],
      }
    : {
        frame: [600, 106, "M600 133V183L580 220"],
        drive: [675, 635, "M650 624L578 556"],
        steering: [1001, 208, "M976 215L815 280"],
        wheels: [1090, 589, "M1064 578L1010 548"],
        cockpit: [922, 62, "M898 75L836 145"],
        saddle: [287, 82, "M309 98L394 134"],
      };
  for (const [id, [x, y, d]] of Object.entries(pinPositions)) {
    const g = $(`.pin-${id}`);
    g.querySelectorAll("circle").forEach((c) => {
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
    });
    g.querySelector("text").setAttribute("x", x);
    g.querySelector("text").setAttribute("y", y + 5);
    g.querySelector("path").setAttribute("d", d);
  }
  resetZoom();
  if (focus) {
    const target = reading ? $("#read") : title;
    target.focus({ preventScroll: true });
    stage.scrollIntoView({ behavior: "instant", block: "start" });
  }
}
function navigate(hash, focus = true) {
  if (location.hash !== `#${hash}`) {
    history.pushState(
      { movingParts: true },
      "",
      hash ? `#${hash}` : location.pathname + location.search,
    );
  }
  render(focus);
}
$$("a.part-link").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    returnFocus = a;
    if (!ids.includes(selected()))
      previousOverview = selected() === "exploded" ? "exploded" : "";
    navigate(a.hash.slice(1));
  }),
);
$(".reading-link").addEventListener("click", (e) => {
  e.preventDefault();
  returnFocus = e.currentTarget;
  if (!ids.includes(selected()))
    previousOverview = selected() === "exploded" ? "exploded" : "";
  navigate("read");
});
$("#deconstruct").addEventListener("click", () => {
  returnFocus = $("#deconstruct");
  const current = selected();
  navigate(
    ids.includes(current) || current === "exploded" ? "" : "exploded",
    false,
  );
});
$("#overview").addEventListener("click", () => navigate(previousOverview));
$("#return-bike").addEventListener("click", () => navigate(""));
window.addEventListener("popstate", () => render(true));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && selected()) {
    e.preventDefault();
    navigate("", false);
    const visibleOrigin =
      returnFocus?.getClientRects().length &&
      getComputedStyle(returnFocus).visibility !== "hidden"
        ? returnFocus
        : null;
    const equivalent = returnFocus?.getAttribute("href")
      ? $(`.part-index a[href="${returnFocus.getAttribute("href")}"]`)
      : null;
    (visibleOrigin || equivalent || $("#deconstruct")).focus({
      preventScroll: true,
    });
  }
});
$("#zoom").addEventListener("click", () => {
  const on = $("#zoom").getAttribute("aria-pressed") !== "true";
  $("#zoom").setAttribute("aria-pressed", String(on));
  $("#zoom").textContent = on ? "Fit the drawing ↙" : "Larger drawing ↗";
  $(".drawing-viewport").classList.toggle("zoomed", on);
  if (on) {
    $(".drawing-viewport").scrollTo({ left: 120, top: 0 });
    $(".drawing-viewport").focus({ preventScroll: true });
  }
});
$$(".copy-idea").forEach((b) =>
  b.addEventListener("click", async () => {
    const text = b.closest(".takeaway").querySelector("p").textContent;
    const status = b.nextElementSibling;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied. Take it somewhere useful.";
    } catch {
      status.textContent =
        "Select and copy the thought above. Clipboard access is unavailable.";
    }
  }),
);
// Diagram pins duplicate the full-sized native index. Avoid tiny duplicate targets on small screens.
const small = matchMedia("(max-width: 900px)");
function pins() {
  $$(".part-pin a").forEach((a) =>
    a.setAttribute("tabindex", small.matches ? "-1" : "0"),
  );
}
small.addEventListener("change", pins);
pins();
render(false);
