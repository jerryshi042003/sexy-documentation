"use strict";
(function () {
  const graph = document.getElementById("graph");
  if (!graph) return;
  const svg = graph.querySelector("svg.edges");
  const layer = svg.querySelector("g");
  const NS = "http://www.w3.org/2000/svg";

  const edges = [
    { from: "n-gatepass", to: "n-warehouse" },
    { from: "n-rates", to: "n-warehouse", dashed: true },
    { from: "n-warehouse", to: "n-payout" },
    { from: "n-warehouse", to: "n-email" },
    { from: "n-payout", to: "n-payroll" },
    { from: "n-forms", to: "n-routes" },
    { from: "n-routes", to: "n-crm" },
  ];

  const trace = [
    { nodes: ["n-gatepass"], edges: [], text: "1 of 4 · Gatepass records order H-104: $1,000 in tickets, then a $200 refund." },
    { nodes: ["n-gatepass", "n-rates", "n-warehouse"], edges: [0, 1], text: "2 of 4 · The warehouse joins H-104 to Harbor FC's rule: net revenue, so $1,000 − $200 = $800." },
    { nodes: ["n-warehouse", "n-payout"], edges: [2], text: "3 of 4 · The payout report applies 10%: $80. Calculated, not approved." },
    { nodes: ["n-payout", "n-payroll"], edges: [4], text: "4 of 4 · Finance reconciles the report and decides whether to pay $80. A refresh is not an approval." },
  ];
  let stage = -1;

  function box(el, origin) {
    const r = el.getBoundingClientRect();
    return { l: r.left - origin.left, r: r.right - origin.left, t: r.top - origin.top, b: r.bottom - origin.top, w: r.width, h: r.height };
  }

  function draw() {
    const origin = graph.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${origin.width} ${origin.height}`);
    layer.replaceChildren();
    const active = stage < 0 ? [] : trace[stage].edges;
    edges.forEach((e, i) => {
      const a = box(document.getElementById(e.from), origin);
      const b = box(document.getElementById(e.to), origin);
      let d;
      if (Math.abs(a.l - b.l) < 4) {
        // same lane: straight down
        const x = a.l + a.w / 2;
        d = `M ${x} ${a.b} V ${b.t - 1}`;
      } else if (b.t > a.b) {
        // target sits lower in the next lane
        const y1 = a.t + a.h / 2, x2 = b.l + b.w / 2 - 30;
        d = `M ${a.r} ${y1} H ${x2} V ${b.t - 1}`;
      } else if (b.b < a.t) {
        // target sits higher in the next lane
        const y1 = a.t + a.h / 2, y2 = b.t + b.h * 0.7, mid = (a.r + b.l) / 2;
        d = `M ${a.r} ${y1} H ${mid} V ${y2} H ${b.l - 1}`;
      } else {
        const y1 = a.t + a.h / 2, y2 = b.t + b.h / 2, mid = (a.r + b.l) / 2;
        d = Math.abs(y1 - y2) < 2 ? `M ${a.r} ${y1} H ${b.l - 1}` : `M ${a.r} ${y1} H ${mid} V ${y2} H ${b.l - 1}`;
      }
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      const on = active.includes(i);
      if (e.dashed) p.classList.add("dashed");
      if (on) p.classList.add("on");
      p.setAttribute("marker-end", on ? "url(#arrow-on)" : "url(#arrow)");
      layer.append(p);
    });
  }

  const status = document.getElementById("trace-status");
  const next = document.getElementById("trace-next");
  const reset = document.getElementById("trace-reset");
  function paint() {
    const on = stage < 0 ? [] : trace[stage].nodes;
    graph.querySelectorAll(".node").forEach((n) => n.classList.toggle("on", on.includes(n.id)));
    status.textContent = stage < 0 ? "" : trace[stage].text;
    next.textContent = stage < 0 ? "Trace order H-104" : stage === trace.length - 1 ? "Start again" : "Next handoff";
    reset.hidden = stage < 0;
    draw();
  }
  next.addEventListener("click", () => { stage = (stage + 1) % trace.length; paint(); });
  reset.addEventListener("click", () => { stage = -1; paint(); });
  new ResizeObserver(draw).observe(graph);
  paint();
})();
