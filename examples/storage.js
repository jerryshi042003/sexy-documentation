/* Fictional files and sizes. Pure data and layout; no DOM. */
(function (root) {
  "use strict";
  const files = [
    { id: "playoff", name: "Playoff highlights · raw", type: "Video", gb: 180, copies: 1, month: "2026-10", art: "linear-gradient(135deg,#1f3a5f,#8fb3d9)" },
    { id: "senior", name: "Senior night cut.mov", type: "Video", gb: 140, copies: 1, month: "2026-09", art: "linear-gradient(135deg,#5a2d3c,#d9a08f)" },
    { id: "drone", name: "Spring drone footage", type: "Video", gb: 110, copies: 2, month: "2026-05", art: "linear-gradient(135deg,#2f5d50,#a9d6b0)" },
    { id: "grad", name: "Graduation 4K", type: "Video", gb: 95, copies: 1, month: "2026-06", art: "linear-gradient(135deg,#6b4e2e,#e8c58a)" },
    { id: "lake", name: "Lake trip clips", type: "Video", gb: 75, copies: 2, month: "2026-08", art: "linear-gradient(135deg,#1d5c6b,#9bd4de)" },
    { id: "japan", name: "Japan 2025", type: "Photos", gb: 90, copies: 2, month: "2026-01", art: "linear-gradient(135deg,#b4536a,#f3c0cc)" },
    { id: "roll", name: "Camera roll 2024", type: "Photos", gb: 80, copies: 2, month: "2025-12", art: "linear-gradient(135deg,#3f4a6b,#c3cbe6)" },
    { id: "family", name: "Family albums", type: "Photos", gb: 50, copies: 2, month: "2025-11", art: "linear-gradient(135deg,#7b6a4a,#efe0b8)" },
    { id: "scans", name: "Negative scans", type: "Photos", gb: 30, copies: 1, month: "2026-09", art: "linear-gradient(135deg,#444,#bbb)" },
    { id: "render", name: "Render cache", type: "Projects", gb: 60, copies: 1, month: "2026-10", art: "linear-gradient(135deg,#2b2b2b,#6e6e6e)" },
    { id: "builds", name: "Site builds", type: "Projects", gb: 40, copies: 2, month: "2026-10", art: "linear-gradient(135deg,#355070,#6d8fb3)" },
    { id: "tax", name: "Tax archive", type: "Documents", gb: 30, copies: 2, month: "2026-02", art: "linear-gradient(135deg,#8a7f6a,#d8cfbf)" },
    { id: "notes", name: "Course notes", type: "Documents", gb: 20, copies: 2, month: "2026-08", art: "linear-gradient(135deg,#4f6b5e,#b9d1c4)" },
  ];
  const monthName = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  const groupers = {
    type: { label: "Type", key: (f) => f.type },
    copies: { label: "Copies", key: (f) => (f.copies > 1 ? "Backed up" : "Only one copy") },
    month: { label: "Month added", key: (f) => (f.month < "2026-03" ? "Earlier" : monthName.format(new Date(f.month + "-01T00:00:00Z"))) },
  };
  function groupBy(items, by) {
    const grouper = groupers[by];
    if (!grouper) throw new TypeError("Unknown grouping.");
    const map = new Map();
    for (const f of items) {
      const k = grouper.key(f);
      if (!map.has(k)) map.set(k, { label: k, files: [], gb: 0 });
      const g = map.get(k);
      g.files.push(f);
      g.gb += f.gb;
    }
    const groups = [...map.values()];
    for (const g of groups) g.files.sort((a, b) => b.gb - a.gb);
    return groups.sort((a, b) => b.gb - a.gb);
  }
  function totals(items) {
    const used = items.reduce((s, f) => s + f.gb, 0);
    const oneCopy = items.filter((f) => f.copies < 2).reduce((s, f) => s + f.gb, 0);
    return { used, oneCopy };
  }
  function worst(row, side) {
    const sum = row.reduce((s, r) => s + r.area, 0);
    const max = Math.max(...row.map((r) => r.area));
    const min = Math.min(...row.map((r) => r.area));
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  }
  /* Squarified treemap (Bruls, Huizing, van Wijk). items must be sorted by value desc. */
  function squarify(items, value, x, y, w, h) {
    const total = items.reduce((s, i) => s + value(i), 0);
    if (!total || w <= 0 || h <= 0) return [];
    const scale = (w * h) / total;
    let rest = items.map((item) => ({ item, area: value(item) * scale }));
    const out = [];
    let cx = x, cy = y, cw = w, ch = h;
    while (rest.length) {
      const vertical = cw >= ch;
      const side = vertical ? ch : cw;
      let row = [rest[0]];
      let best = worst(row, side);
      let n = 1;
      while (n < rest.length) {
        const cand = row.concat(rest[n]);
        const r = worst(cand, side);
        if (r > best) break;
        row = cand; best = r; n++;
      }
      rest = rest.slice(n);
      const rowArea = row.reduce((s, r) => s + r.area, 0);
      const thick = rowArea / side;
      let off = 0;
      for (const r of row) {
        const len = r.area / thick;
        out.push(vertical
          ? { item: r.item, x: cx, y: cy + off, w: thick, h: len }
          : { item: r.item, x: cx + off, y: cy, w: len, h: thick });
        off += len;
      }
      if (vertical) { cx += thick; cw -= thick; } else { cy += thick; ch -= thick; }
    }
    return out;
  }
  const storage = { files, groupers, groupBy, totals, squarify };
  if (typeof module !== "undefined" && module.exports) module.exports = storage;
  else root.StorageDemo = storage;
})(typeof window === "undefined" ? globalThis : window);
