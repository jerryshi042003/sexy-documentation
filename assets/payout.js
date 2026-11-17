"use strict";
/* Fictional pay periods for Harbor FC. Amounts are integer cents. */
(function (root) {
  const periods = [
    {
      id: "jan", label: "Jan 6 – Feb 2", comparator: "Prior spreadsheet", total: -120450,
      compared: "Current payable versus the spreadsheet the old process kept for this period. Payroll's manual adjustments are outside this comparison.",
      causes: [
        { short: "Late rows", name: "Late and backfilled source rows", why: "Payable rows that exist now but were missing from the spreadsheet.", cents: 81225 },
        { short: "Review holds", name: "Manual-review holds", why: "Rows the spreadsheet paid that the review rules now hold.", cents: -169000 },
        { short: "Rep changes", name: "Rep attribution", why: "The current owner of the sale differs from the spreadsheet.", cents: -29800 },
        { short: "Allocation", name: "Rounding and allocation net", why: "Category, split and rounding changes, netted together.", cents: -2875 },
      ],
      status: "Reference only. The spreadsheet is not the full payroll total.",
    },
    {
      id: "feb", label: "Feb 3 – Mar 2", comparator: "Sent workbook", total: -64210,
      compared: "Current payable versus the workbook sent to payroll, before later roster corrections.",
      causes: [
        { short: "Late rows", name: "Late and backfilled source rows", why: "Payable rows that arrived after the workbook was sent.", cents: 40540 },
        { short: "Review holds", name: "Manual-review holds", why: "Rows the workbook paid that the review rules now hold.", cents: -88000 },
        { short: "Rep changes", name: "Rep attribution", why: "Corrected rep ownership removes commission the workbook assigned.", cents: -15000 },
        { short: "Allocation", name: "Rounding and allocation net", why: "Split and rounding changes, netted together.", cents: -1750 },
      ],
      status: "Superseded. The sent workbook missed three active reps; later supplements are not folded in.",
    },
    {
      id: "mar", label: "Mar 3 – Mar 30", comparator: "Fixed close snapshot", total: 1240,
      compared: "The snapshot frozen at period close versus a fresh run of the same rules.",
      causes: [
        { short: "Late payment", name: "Late payable activity", why: "One payment posted after the snapshot was frozen.", cents: 1240 },
        { short: "Other late", name: "Other late rows", why: "Two rows arrived late with no payable effect.", cents: 0 },
      ],
      status: "Technical match. Payroll confirmed the format, not the dollar result.",
    },
    {
      id: "apr", label: "Mar 31 – Apr 27", comparator: "Legacy rebuild", total: 631890,
      compared: "Current payable versus a rebuild of the old report, whose source stops on April 18.",
      causes: [
        { short: "After cutoff", name: "Rows after the legacy cutoff", why: "Sales continued after the old report's source stopped.", cents: 610235 },
        { short: "Scope", name: "Current roster scope", why: "Reps included by the current roster but not the old one.", cents: 23180 },
        { short: "Allocation", name: "Allocation change", why: "The same sales split differently between reps.", cents: 1925 },
        { short: "Review holds", name: "Manual-review holds", why: "Rows that are calculated but not yet payable.", cents: -3450 },
      ],
      status: "Checkpoint only. The comparator is incomplete and no payout has been accepted.",
    },
    {
      id: "may", label: "Apr 28 – May 25", comparator: null, total: null, causes: [],
      status: "Open. Freeze the period and roster, then reconcile the snapshot before payout review.",
    },
  ];

  function residual(p) {
    return p.total - p.causes.reduce((s, c) => s + c.cents, 0);
  }

  function money(cents, signed = true) {
    const abs = Math.abs(cents) / 100;
    const s = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (!signed || cents === 0) return "$" + s;
    return (cents < 0 ? "−" : "+") + "$" + s;
  }

  const api = { periods, residual, money };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }
  root.Payout = api;

  const el = (id) => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs, text) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function waterfall(p) {
    const svg = el("waterfall");
    svg.replaceChildren();
    const W = Math.max(320, Math.round(svg.getBoundingClientRect().width) || 760), H = W < 520 ? 220 : 280, top = 28, bottom = 44, left = 0;
    const compact = W < 520;
    const steps = [];
    let run = 0;
    p.causes.forEach((c) => { steps.push({ label: c.short, from: run, to: run + c.cents, cents: c.cents }); run += c.cents; });
    steps.push({ label: "Difference", from: 0, to: p.total, cents: p.total, total: true });
    const vals = [0];
    steps.forEach((s) => vals.push(s.from, s.to));
    let lo = Math.min(...vals), hi = Math.max(...vals);
    if (hi - lo === 0) hi = lo + 1;
    const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    const y = (v) => top + (hi - v) / (hi - lo) * (H - top - bottom);
    const n = steps.length;
    const slot = (W - left) / n;
    const bw = Math.min(88, slot * 0.56);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.append(svgEl("line", { x1: 0, x2: W, y1: y(0), y2: y(0), class: "zero" }));
    steps.forEach((s, i) => {
      const x = left + i * slot + (slot - bw) / 2;
      const y1 = y(Math.max(s.from, s.to)), y2 = y(Math.min(s.from, s.to));
      const h = Math.max(1.5, y2 - y1);
      const cls = "bar" + (s.total ? " total" : s.cents < 0 ? " neg" : "");
      svg.append(svgEl("rect", { x, y: y1, width: bw, height: h, class: cls }));
      if (i < n - 1) {
        const nx = left + (i + 1) * slot + (slot - bw) / 2;
        svg.append(svgEl("line", { x1: x + bw, x2: nx, y1: y(s.to), y2: y(s.to), class: "link" }));
      }
      const above = s.cents >= 0;
      if (!compact || s.total) svg.append(svgEl("text", { x: s.total ? x + bw : x + bw / 2, y: above ? y1 - 8 : y1 + h + 16, "text-anchor": s.total ? "end" : "middle", class: "val" }, money(s.cents)));
      const words = compact ? s.label.split(" ") : [s.label];
      const t = svgEl("text", { x: x + bw / 2, y: H - (words.length > 1 ? 24 : compact ? 16 : 14), "text-anchor": "middle" });
      words.forEach((wd, k) => t.append(svgEl("tspan", { x: x + bw / 2, dy: k ? 15 : 0 }, wd)));
      svg.append(t);
    });
  }

  function render(id) {
    const p = periods.find((q) => q.id === id) || periods[0];
    document.querySelectorAll(".periods button").forEach((b) => {
      const on = b.dataset.id === p.id;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    const closed = p.comparator !== null;
    el("closed").hidden = !closed;
    el("open").hidden = closed;
    if (!closed) { el("open-status").textContent = p.status; return; }
    el("compared").textContent = p.compared;
    waterfall(p);
    const list = el("causes");
    list.replaceChildren();
    p.causes.forEach((c) => {
      const li = document.createElement("li");
      li.innerHTML = `<span><strong></strong><small></small></span><code></code>`;
      li.querySelector("strong").textContent = c.name;
      li.querySelector("small").textContent = c.why;
      li.querySelector("code").textContent = money(c.cents);
      list.append(li);
    });
    const parts = p.causes.map((c, i) => (i === 0 ? money(c.cents) : (c.cents < 0 ? "− " : "+ ") + money(c.cents, false))).join(" ");
    el("equation").textContent = `${money(p.total)} = ${parts}`;
    el("residual").textContent = money(residual(p), false);
    el("status").textContent = p.status;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const tabs = [...document.querySelectorAll(".periods button")];
    tabs.forEach((b, i) => {
      const p = periods.find((q) => q.id === b.dataset.id);
      b.querySelector("span").textContent = p.total === null ? "open" : money(p.total);
      b.addEventListener("click", () => { render(b.dataset.id); history.replaceState(null, "", "#" + b.dataset.id); });
      b.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        const t = tabs[(i + d + tabs.length) % tabs.length];
        t.focus(); t.click();
      });
    });
    render(location.hash.slice(1) || "jan");
    let w = 0;
    new ResizeObserver(() => {
      const nw = Math.round(el("waterfall").getBoundingClientRect().width);
      if (nw && nw !== w) { w = nw; const cur = document.querySelector('.periods [aria-selected="true"]'); if (cur) render(cur.dataset.id); }
    }).observe(el("closed"));
  });
})(typeof window === "undefined" ? globalThis : window);
