"use strict";
const { units, cases, calculate, money } = window.VisualExamples;
let selectedUnit = "harbor";
let stage = -1;
const byId = (id) => document.getElementById(id);
function paintUnit(key) {
  selectedUnit = key;
  const unit = units[key];
  const value = calculate(100000, 20000, unit.basis);
  document
    .querySelectorAll("[data-unit]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.unit === key)),
    );
  byId("unit-description").textContent = unit.description;
  byId("source-name").textContent = unit.source;
  byId("source-role").textContent = unit.role;
  byId("source-record").textContent = `order ${unit.id} · $1,000`;
  byId("rule-record").textContent = `${unit.basis} revenue × 10%`;
  byId("warehouse-record").textContent =
    unit.basis === "net"
      ? "$1,000 − $200 = $800"
      : "$1,000 gross; refund excluded";
  byId("report-record").textContent =
    `${money(value.eligible)} × 10% = ${money(value.commission)}`;
  byId("payroll-record").textContent =
    `review ${money(value.commission)} for ${unit.id}`;
  paintTrace();
}
function paintTrace() {
  document
    .querySelectorAll("[data-stage]")
    .forEach((node) =>
      node.classList.toggle("active", Number(node.dataset.stage) === stage),
    );
  const unit = units[selectedUnit];
  const steps = [
    `1 of 4 · ${unit.source} records order ${unit.id}.`,
    `2 of 4 · The warehouse matches ${unit.id} to the ${unit.basis}-revenue rule.`,
    "3 of 4 · The report shows the calculated commission. It is not yet approved.",
    "4 of 4 · Finance reconciles the report and decides whether to approve the payout.",
  ];
  byId("trace-status").textContent =
    stage < 0
      ? "The complete route is visible. Step through to follow one record."
      : steps[stage];
  byId("trace-next").textContent =
    stage < 0
      ? "Trace one record →"
      : stage === 3
        ? "Replay trace →"
        : "Next handoff →";
}
document
  .querySelectorAll("[data-unit]")
  .forEach((b) => b.addEventListener("click", () => paintUnit(b.dataset.unit)));
byId("trace-next").addEventListener("click", () => {
  stage = (stage + 1) % 4;
  paintTrace();
});
byId("trace-reset").addEventListener("click", () => {
  stage = -1;
  paintTrace();
});
function paintCase() {
  const row = cases[byId("case").value];
  const result = calculate(row.sales, row.refund);
  byId("sales").textContent = money(row.sales);
  byId("refund").textContent = money(-row.refund);
  byId("basis").textContent = money(result.eligible);
  byId("commission").textContent = money(result.commission);
  byId("case-explanation").textContent = row.explanation;
}
byId("case").addEventListener("change", paintCase);
paintUnit("harbor");
paintCase();

function drawEdges() {
  const map = document.querySelector(".system-map");
  const svg = map.querySelector(".flow-edges");
  const origin = map.getBoundingClientRect();
  const sources = [
    map.querySelector('[data-stage="0"]'),
    map.querySelector(".rule-node"),
    map.querySelector('[data-stage="2"]'),
  ];
  const targets = [
    map.querySelector('[data-stage="1"]'),
    map.querySelector('[data-stage="1"]'),
    map.querySelector('[data-stage="3"]'),
  ];
  svg.setAttribute("viewBox", `0 0 ${origin.width} ${origin.height}`);
  const group = svg.querySelector("g");
  group.replaceChildren();
  sources.forEach((source, i) => {
    const a = source.getBoundingClientRect();
    const b = targets[i].getBoundingClientRect();
    const x1 = a.right - origin.left;
    const y1 = a.top + a.height / 2 - origin.top;
    const x2 = b.left - origin.left;
    const y2 = b.top + b.height / 2 - origin.top + (i === 1 ? 18 : 0);
    const mid = (x1 + x2) / 2;
    const edge = document.createElementNS("http://www.w3.org/2000/svg", "path");
    edge.setAttribute("class", "edge");
    edge.setAttribute("d", `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`);
    if (i === 1) edge.setAttribute("stroke-dasharray", "4 3");
    group.append(edge);
  });
}
new ResizeObserver(drawEdges).observe(document.querySelector(".system-map"));
drawEdges();
