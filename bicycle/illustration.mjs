// Bespoke schematic geometry. No stock art, runtime renderer or external assets.
const num = (n) => Number(n.toFixed(2));
const circle = (x, y, r, cls, extra = "") =>
  `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}" ${extra}/>`;
const line = (x1, y1, x2, y2, cls) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" class="${cls}"/>`;
const label = (x, y, text, anchor = "start", extra = "") =>
  `<text x="${x}" y="${y}" class="engraving ${extra}" text-anchor="${anchor}">${text}</text>`;
const leader = (d, x, y, text, anchor = "start") =>
  `<path d="${d}" class="leader"/>${label(x, y, text, anchor)}`;
export function gear(x, y, r, teeth, cls = "gear") {
  let d = "";
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2,
      rr = r * (i % 4 === 0 || i % 4 === 3 ? 1 : 0.94);
    d += `${i ? "L" : "M"}${num(x + Math.cos(a) * rr)} ${num(y + Math.sin(a) * rr)}`;
  }
  return `<path d="${d}Z" class="${cls}"/>`;
}
function spokes(cx, cy, r, count = 28, ellipse = 1) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    // Alternating tangential lacing, offset by three flange-hole intervals.
    const crossAngle = (Math.PI * 2 * 3) / (count / 2);
    const hubAngle = angle + (i % 2 ? crossAngle : -crossAngle);
    return line(
      num(cx + Math.cos(hubAngle) * 13 * ellipse),
      num(cy + Math.sin(hubAngle) * 13),
      num(cx + Math.cos(angle) * r * ellipse),
      num(cy + Math.sin(angle) * r),
      "spoke",
    );
  }).join("");
}
function wheel(cx, cy) {
  return `<g class="wheel">${circle(cx, cy, 195, "tire")}${circle(cx, cy, 187, "sidewall")}${circle(cx, cy, 178, "rim")}${circle(cx, cy, 172, "rim-edge")}${spokes(cx, cy, 174)}${circle(cx, cy, 16, "hub-flange")}${circle(cx, cy, 8, "axle")}${circle(cx, cy, 3, "bolt")}${line(cx + 30, cy - 172, cx + 31, cy - 183, "valve")}${circle(cx, cy, 181, "rim-glint", 'stroke-dasharray="90 1100" transform="rotate(-65 ' + cx + " " + cy + ')"')}</g>`;
}
function tube(d) {
  return `<path d="${d}" class="tube-outline"/><path d="${d}" class="tube"/><path d="${d}" class="tube-glint"/>`;
}
const frame = () =>
  `<g class="frame-tubes">${tube("M280 490L450 240L525 510Z")}${tube("M450 240L740 200L765 285L525 510")}${tube("M740 200L765 285")}${circle(525, 510, 19, "bb-shell")}${circle(525, 510, 10, "shell-hole")}<path d="M440 229L461 235L469 263M726 202L742 209L748 232M756 264L772 280L758 300M511 490L530 494L541 513" class="lug"/><path d="M468 237L720 202" class="decal-line"/><text x="575" y="235" class="frame-decal" transform="rotate(-8 575 235)">A. KOFINK</text><path d="M319 483L286 497L274 490" class="dropout"/></g>`;
const fork = () =>
  `<g>${tube("M765 285L774 310Q808 434 870 490")}<path d="M774 310Q821 419 870 490" class="fork-far"/><path d="M759 278L777 273M763 290L781 284" class="headset-silver"/><path d="M780 315L788 323" class="crown"/>${circle(870, 490, 8, "axle")}<path d="M735 180L742 200" class="headset-silver"/></g>`;
const saddle = () =>
  `<g><path d="M450 240L429 157" class="seatpost-shadow"/><path d="M450 240L429 157" class="seatpost"/><path d="M407 146L424 157L448 150" class="saddle-rail"/><path d="M377 128Q401 113 425 126Q447 138 475 133Q480 143 458 146L405 146Q377 146 377 128Z" class="saddle"/><path d="M383 128Q405 119 424 131L465 138" class="leather-stitch"/><path d="M440 221L454 217" class="seat-clamp"/></g>`;
const cockpit = () =>
  `<g><path d="M740 200L721 132L776 125" class="stem-shadow"/><path d="M740 200L721 132L776 125" class="stem"/><path d="M775 126C818 114 850 141 829 164L816 184Q801 215 834 214L849 205" class="bar-far"/><path d="M783 134C827 120 859 150 838 174L825 194Q810 225 843 224L858 215" class="handlebar"/><path d="M783 134C827 120 859 150 838 174" class="bar-tape"/><path d="M838 151L850 158L843 177L831 170Z" class="hood"/><path d="M847 164Q869 192 848 213" class="brake-lever"/><path d="M825 143L835 151L829 166" class="far-lever"/><path d="M846 163C891 220 817 273 778 300" class="cable"/><path d="M831 150C860 112 889 200 745 198L464 235Q421 245 397 320" class="cable"/><path d="M600 214L605 221M501 229L506 236" class="cable-stop"/>${caliper(397, 320, -0.6)}${caliper(778, 300, 0.7)}</g>`;
function caliper(x, y, rotation = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotation * 25})"><path d="M-14 15Q-17-5 0-5Q17-5 14 15" class="caliper"/><path d="M-13 13L-17 25M13 13L17 25" class="caliper"/><path d="M-21 25H-12M12 25H21" class="brake-pad"/>${circle(0, -4, 4, "bolt")}</g>`;
}
const drive = () =>
  `<g><path d="M280 473L525 468A42 42 0 0 1 525 552L280 507A17 17 0 0 1 280 473Z" class="chain-shadow"/><path d="M280 473L525 468A42 42 0 0 1 525 552L280 507A17 17 0 0 1 280 473Z" class="chain"/>${gear(280, 490, 18, 16)}${circle(280, 490, 10, "lockring")}${circle(280, 490, 4, "bolt")}${gear(525, 510, 44, 46)}${circle(525, 510, 35, "chainring-hole")}${Array.from(
    { length: 5 },
    (_, i) => {
      const a = (i / 5) * Math.PI * 2;
      return `<path d="M525 510L${num(525 + Math.cos(a) * 34)} ${num(510 + Math.sin(a) * 34)}" class="spider"/>${circle(num(525 + Math.cos(a) * 27), num(510 + Math.sin(a) * 27), 2.3, "bolt")}`;
    },
  ).join(
    "",
  )}<path d="M525 510L581 582" class="crank-shadow"/><path d="M525 510L581 582" class="crank"/>${circle(525, 510, 8, "crank-bolt")}<path d="M566 584L603 578L608 587L571 594Z" class="pedal"/><path d="M571 586L600 581" class="pedal-grip"/><path d="M525 510L483 449" class="far-crank"/><path d="M466 446L495 440" class="far-pedal"/></g>`;
const groups = [
  ["rear-wheel", wheel(280, 490)],
  ["front-wheel", wheel(870, 490)],
  ["frame", frame()],
  ["fork", fork()],
  ["saddle", saddle()],
  ["cockpit", cockpit()],
  ["drive", drive()],
];
const pin = (id, n, x, y, d) =>
  `<g class="part-pin pin-${id}"><path d="${d}" class="pin-leader"/><a href="#${id}" class="part-link" aria-label="${n}. Inspect ${id === "steering" ? "headset and fork" : id === "saddle" ? "saddle and off-screen life" : id}"><circle class="pin-hit" cx="${x}" cy="${y}" r="50"/><circle cx="${x}" cy="${y}" r="27"/><text x="${x}" y="${y + 5}" text-anchor="middle">${n}</text></a></g>`;
const overview = `<g id="assembly"><g aria-hidden="true"><ellipse cx="590" cy="708" rx="485" ry="14" class="ground"/><path d="M280 490L450 240L740 200L765 285L525 510Z M450 240L525 510L280 490" class="assembly-ghost"/>${groups.map(([name, svg]) => `<g data-piece="${name}">${svg}</g>`).join("")}<g class="exploded-axes"><path d="M175 560L280 490M870 490L985 560M525 510L575 625M774 310L839 275M721 132L801 12M429 157L389 52"/></g><path d="M110 748H1060M110 741V755M1060 741V755" class="dimension"/>${label(585, 777, "ONE GEAR. MANY WAYS TO BE CURIOUS.", "middle")}</g>${pin("frame", "01", 600, 106, "M600 133V183L580 220")}${pin("drive", "02", 675, 635, "M650 624L578 556")}${pin("steering", "03", 1001, 208, "M976 215L815 280")}${pin("wheels", "04", 1090, 589, "M1064 578L1010 548")}${pin("cockpit", "05", 922, 62, "M898 75L836 145")}${pin("saddle", "06", 287, 82, "M309 98L394 134")}</g>`;
// Enlarged inspection plates use their own intentional projections, not random floating icons.
function bearing(x, y, rx = 48, ry = 20) {
  return `<g><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="bearing-outer"/><ellipse cx="${x}" cy="${y}" rx="${rx * 0.62}" ry="${ry * 0.62}" class="bearing-inner"/>${Array.from(
    { length: 12 },
    (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return circle(
        num(x + Math.cos(a) * rx * 0.8),
        num(y + Math.sin(a) * ry * 0.8),
        3,
        "bearing-ball",
      );
    },
  ).join("")}</g>`;
}
function cylinder(x, y, w, r) {
  return `<g><path d="M${x} ${y - r}H${x + w}V${y + r}H${x}Z" class="cylinder"/><ellipse cx="${x}" cy="${y}" rx="${r * 0.24}" ry="${r}" class="cylinder-end"/><ellipse cx="${x + w}" cy="${y}" rx="${r * 0.24}" ry="${r}" class="cylinder-end"/></g>`;
}
function sideBearing(x, y) {
  return `<g><ellipse cx="${x}" cy="${y}" rx="20" ry="62" class="bearing-outer"/><ellipse cx="${x}" cy="${y}" rx="10" ry="40" class="bearing-inner"/>${Array.from(
    { length: 10 },
    (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return circle(
        num(x + Math.cos(a) * 15),
        num(y + Math.sin(a) * 51),
        4,
        "bearing-ball",
      );
    },
  ).join("")}</g>`;
}
const drivePlate = `<g class="detail-plate" id="plate-drive" aria-hidden="true"><path d="M110 280H950" class="axis"/><path d="M125 280L45 110" class="large-crank-shadow"/><path d="M125 280L45 110" class="large-crank"/><path d="M16 107L80 94L84 110L21 123Z" class="pedal"/>${cylinder(175, 280, 65, 25)}${sideBearing(312, 280)}${cylinder(395, 280, 170, 64)}${label(480, 285, "FRAME SHELL", "middle")}${sideBearing(650, 280)}${cylinder(712, 280, 40, 25)}${cylinder(125, 280, 650, 8)}<g transform="translate(815 280)">${gear(0, 0, 120, 46)}${circle(0, 0, 94, "chainring-hole")}${Array.from({ length: 5 }, (_, i) => `<g transform="rotate(${i * 72})"><path d="M0 0L83 0" class="large-spider"/>${circle(72, 0, 7, "bolt")}</g>`).join("")}<path d="M0 0L80 170" class="large-crank-shadow"/><path d="M0 0L80 170" class="large-crank"/>${circle(0, 0, 17, "crank-bolt")}<path d="M50 172L132 155L138 178L56 195Z" class="pedal"/></g>${leader("M200 251V163H120", 120, 146, "01 / CUP")}${leader("M312 212V110H360", 360, 96, "02 / CARTRIDGE BEARING")}${leader("M650 212V145H590", 590, 127, "03 / SPINDLE THROUGH THE SHELL", "end")}${leader("M886 180L950 110", 950, 94, "04 / ONE CHAINRING", "end")}<path d="M110 535H1010" class="plate-rule"/>${gear(265, 645, 67, 16)}${circle(265, 645, 38, "chainring-hole")}${circle(265, 645, 18, "axle")}<path d="M265 645H570" class="axis"/>${circle(470, 645, 45, "lockring")}${circle(470, 645, 31, "chainring-hole")}<path d="M435 620L440 625M488 663L493 668" class="lockring-notch"/>${label(265, 749, "FIXED COG", "middle")}${label(470, 749, "LOCKRING", "middle")}<text x="660" y="617" class="plate-statement"><tspan x="660">One chainline.</tspan><tspan x="660" dy="39">No freewheel.</tspan></text>${label(660, 710, "SCHEMATIC / NOT A SERVICE SEQUENCE")}</g>`;
const steeringPlate = `<g class="detail-plate" id="plate-steering" aria-hidden="true"><path d="M550 65V730" class="axis"/><ellipse cx="550" cy="90" rx="44" ry="14" class="cylinder-end"/>${circle(550, 90, 5, "bolt")}<path d="M550 145V630" class="steerer"/>${bearing(550, 238)}<path d="M497 315V438Q550 461 603 438V315" class="head-tube-shell"/><ellipse cx="550" cy="315" rx="53" ry="20" class="head-tube-top"/><path d="M503 340L429 360M503 411L411 469" class="cut-tube"/>${label(551, 387, "HEAD TUBE", "middle", "on-paint")}${bearing(550, 505, 58, 23)}<ellipse cx="550" cy="578" rx="56" ry="16" class="crown-race"/><path d="M505 643Q550 612 595 643" class="fork-crown"/><path d="M508 640Q473 690 455 761M592 640Q625 690 645 761" class="fork-blade"/><path d="M455 761H645" class="axis"/>${leader("M595 90H754", 770, 94, "TOP CAP")}${leader("M595 238H815", 830, 242, "UPPER BEARING")}${leader("M603 438H760", 777, 445, "STEERER RUNS THROUGH")}${leader("M610 505H815", 830, 510, "LOWER BEARING")}${leader("M606 578H754", 770, 583, "CROWN RACE")}${leader("M495 645H310", 293, 649, "FORK CROWN", "end")}${leader("M530 168H310", 293, 172, "CONTINUOUS STEERER", "end")}${label(550, 810, "TWO BEARING POSITIONS. ONE DIRECTION AT A TIME.", "middle")}</g>`;
const wheelsPlate = `<g class="detail-plate" id="plate-wheels" aria-hidden="true"><path d="M70 395H1030" class="axis"/><g transform="translate(230 395)"><ellipse rx="132" ry="224" class="tire"/><ellipse rx="127" ry="214" class="sidewall"/><ellipse rx="119" ry="201" class="wheel-empty"/></g><g transform="translate(465 395)"><ellipse rx="119" ry="201" class="rim"/><ellipse rx="113" ry="195" class="wheel-empty"/><path d="M20-198L23-219" class="valve"/></g><g>${spokes(700, 395, 192, 28, 0.6)}<ellipse cx="700" cy="395" rx="10" ry="17" class="hub-flange"/></g>${cylinder(908, 395, 82, 15)}<ellipse cx="908" cy="395" rx="12" ry="47" class="hub-flange"/><ellipse cx="990" cy="395" rx="12" ry="47" class="hub-flange"/>${cylinder(875, 395, 148, 6)}${leader("M180 203V115H130", 130, 98, "01 / TIRE")}${leader("M463 196V97H420", 420, 80, "02 / RIM & BRAKE TRACK")}${leader("M706 199V126H670", 670, 109, "03 / CROSSED SPOKES")}${leader("M949 347V235H1020", 1020, 215, "04 / HUB", "end")}<path d="M110 680H1020" class="plate-rule"/><text x="120" y="737" class="plate-statement">A system held in tension.</text>${label(120, 785, "LAYERS SEPARATED FOR CLARITY / NOT A WHEEL-BUILDING GUIDE")}</g>`;
const cockpitPlate = `<g class="detail-plate" id="plate-cockpit" aria-hidden="true"><path d="M532 130V224" class="stem-shadow"/><path d="M532 130V224" class="stem"/><path d="M532 200H340Q250 200 260 275L275 350M532 200H725Q815 200 805 275L790 350" class="large-bar"/><path d="M340 200Q250 200 260 275L275 350M725 200Q815 200 805 275L790 350" class="large-tape"/><path d="M273 251L296 254L306 293L285 295Z M792 251L769 254L759 293L780 295Z" class="hood"/><path d="M293 274L320 338M772 274L745 338" class="large-lever"/><path d="M286 274C420 368 242 409 285 527M779 274C647 368 830 409 785 527" class="large-cable"/>${[285, 785].map((x) => `<g transform="translate(${x} 585)"><path d="M-16-70H16V110H-16Z" class="brake-track"/><path d="M-60 12Q-75-52 0-52Q75-52 60 12" class="large-caliper"/><path d="M-58 10L-28 50M58 10L28 50" class="large-caliper"/><path d="M-35 50H-18M18 50H35" class="large-pad"/>${circle(0, -46, 9, "bolt")}</g>`).join("")}${label(285, 754, "FRONT RIM CALIPER", "middle")}${label(785, 754, "REAR RIM CALIPER", "middle")}${leader("M365 200V109H220", 220, 91, "HANDLEBAR / TWO LEVERS")}${leader("M532 158H723", 740, 162, "STEM CLAMP")}${label(535, 811, "CABLE → CALIPER → PAD → RIM", "middle")}</g>`;
const framePlate = `<g class="detail-plate" id="plate-frame" aria-hidden="true"><g transform="translate(-100 30) scale(1.15)">${frame()}</g><circle cx="900" cy="200" r="122" class="magnifier"/><g transform="translate(900 200) rotate(-18)">${tube("M-100 30H80M0 30V-100")}<path d="M-40 16L-8 16L-8-30M8-30V16H40" class="large-lug"/></g><path d="M778 250L690 310" class="magnifier-line"/>${leader("M333 335H150V165", 150, 145, "SEAT STAYS / CHAIN STAYS")}${leader("M612 272V115H460", 460, 96, "THIN STEEL TUBES")}${label(900, 375, "A JOINT, ENLARGED", "middle")}<path d="M130 645H1020" class="plate-rule"/><text x="140" y="707" class="plate-statement"><tspan x="140">Useful pieces.</tspan><tspan x="140" dy="47">Thoughtful connections.</tspan></text>${label(140, 806, "ILLUSTRATIVE LUGGED STEEL FRAME")}</g>`;
const saddlePlate = `<g class="detail-plate" id="plate-saddle" aria-hidden="true"><path d="M295 195Q390 120 509 176Q600 225 769 200Q807 249 724 266L405 266Q296 260 295 195Z" class="large-saddle"/><path d="M318 198Q401 149 504 198Q620 241 751 226" class="large-stitch"/><path d="M380 350L500 385L667 343M390 365L500 401L676 357" class="large-rails"/><path d="M500 485L560 724" class="large-post-shadow"/><path d="M500 485L560 724" class="large-post"/><path d="M471 465H533L541 487H475Z" class="rail-clamp"/><path d="M500 277V340M500 405V460" class="axis"/>${leader("M304 196V98H191", 191, 80, "SHELL / THE CONTACT POINT")}${leader("M663 346H870", 890, 350, "SUPPORTING RAILS")}${leader("M543 635H832", 852, 639, "SEATPOST")}${label(551, 816, "MAKE ROOM FOR THE PERSON.", "middle")}</g>`;
export const bicycleSVG = `<svg id="bicycle" viewBox="-60 -90 1320 910" role="group" aria-label="A deconstructable steel fixed-gear bicycle, with rim brakes"><defs><linearGradient id="shaft-metal" gradientUnits="userSpaceOnUse" x1="537" x2="563" y1="0" y2="0"><stop stop-color="#526c59"/><stop offset=".3" stop-color="#e5e9d9"/><stop offset=".65" stop-color="#a9b8a0"/><stop offset="1" stop-color="#556f54"/></linearGradient><linearGradient id="metal" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#faf9ed"/><stop offset=".25" stop-color="#bcc7c4"/><stop offset=".5" stop-color="#6e807e"/><stop offset=".75" stop-color="#e4e8db"/><stop offset="1" stop-color="#798a89"/></linearGradient><linearGradient id="paint" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#4384ed"/><stop offset=".45" stop-color="#1e56bb"/><stop offset="1" stop-color="#153876"/></linearGradient></defs>${overview}${framePlate}${drivePlate}${steeringPlate}${wheelsPlate}${cockpitPlate}${saddlePlate}</svg>`;
