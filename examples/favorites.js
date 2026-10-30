"use strict";
const el = (id) => document.getElementById(id);
document.querySelectorAll("[data-cache]").forEach((button) =>
  button.addEventListener("click", () => {
    const hit = button.dataset.cache === "hit";
    document
      .querySelectorAll("[data-cache]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    el("cache-value").textContent = hit
      ? "480 tickets · reusable"
      : "No saved result";
    el("query-edge-label").textContent = hit
      ? "No SQL on this request"
      : "SQL on cache miss";
    document.querySelector(".query-edge").classList.toggle("inactive", hit);
    el("cache-story").textContent = hit
      ? "Matching saved result → return it to the browser. No warehouse query."
      : "No saved result → run SQL → save the answer → return it to the browser.";
  }),
);
function setSlide(second) {
  el("retry-slide").hidden = second;
  el("duplicate-slide").hidden = !second;
  el("slide-title").textContent = second
    ? "A safe retry needs stable record keys."
    : "A missed record needs another chance.";
  el("slide-takeaway").textContent = second
    ? "An upsert updates an existing key instead of inserting another copy."
    : "A completed upload does not prove that every record was accepted.";
  el("slide-count").textContent = second ? "2 / 2" : "1 / 2";
  el("slide-back").disabled = !second;
  el("slide-next").disabled = second;
}
el("slide-next").addEventListener("click", () => setSlide(true));
el("slide-back").addEventListener("click", () => setSlide(false));
(function storageDemo() {
  const { files, groupBy, totals, squarify } = window.StorageDemo;
  const map = el("treemap");
  const panel = el("file-panel");
  const gb = (n) => `${n.toLocaleString("en-US")} GB`;
  const monthLabel = (f) =>
    new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
      .format(new Date(f.month + "-01T00:00:00Z"));
  const state = {
    live: files.map((f) => ({ ...f })),
    deleted: [],
    group: "type",
    selected: null,
    lastAction: null,
  };
  const groupEls = new Map();
  const tileEls = new Map();
  const HEAD = 22;
  const GAP = 3;

  function tileFor(f) {
    let b = tileEls.get(f.id);
    if (b) return b;
    b = document.createElement("button");
    b.type = "button";
    b.className = "tile";
    b.style.setProperty("--art", f.art);
    b.innerHTML =
      '<span class="badge">1 copy</span><span class="tile-name"></span><span class="tile-size"></span>';
    b.addEventListener("click", () => select(f.id));
    map.append(b);
    tileEls.set(f.id, b);
    return b;
  }
  function groupFor(label) {
    let g = groupEls.get(label);
    if (g) return g;
    g = document.createElement("div");
    g.className = "group";
    g.innerHTML = "<h3></h3>";
    map.prepend(g);
    groupEls.set(label, g);
    return g;
  }
  function place(node, r) {
    node.style.left = `${r.x}px`;
    node.style.top = `${r.y}px`;
    node.style.width = `${r.w}px`;
    node.style.height = `${r.h}px`;
  }
  function render() {
    const W = map.clientWidth;
    const H = map.clientHeight;
    if (!W || !H) return;
    const groups = groupBy(state.live, state.group);
    const seenGroups = new Set();
    const seenTiles = new Set();
    const groupRects = squarify(groups, (g) => g.gb, GAP, GAP, W - 2 * GAP, H - 2 * GAP);
    for (const gr of groupRects) {
      const g = gr.item;
      seenGroups.add(g.label);
      const node = groupFor(g.label);
      place(node, { x: gr.x, y: gr.y, w: gr.w - GAP, h: gr.h - GAP });
      node.querySelector("h3").innerHTML =
        `${g.label} <span>· ${gb(g.gb)} · ${g.files.length} file${g.files.length === 1 ? "" : "s"}</span>`;
      node.setAttribute("aria-label", `${g.label}, ${gb(g.gb)}`);
      node.querySelector("h3").title = `${g.label} · ${gb(g.gb)} · ${g.files.length} files`;
      const inner = {
        x: gr.x + GAP,
        y: gr.y + HEAD,
        w: gr.w - 3 * GAP,
        h: gr.h - HEAD - 2 * GAP,
      };
      for (const tr of squarify(g.files, (f) => f.gb, inner.x, inner.y, inner.w, inner.h)) {
        const f = tr.item;
        seenTiles.add(f.id);
        const t = tileFor(f);
        const r = { x: tr.x, y: tr.y, w: Math.max(0, tr.w - GAP), h: Math.max(0, tr.h - GAP) };
        place(t, r);
        t.className = `tile ${f.type}${f.copies < 2 ? " one-copy" : ""}${
          state.selected === f.id ? " selected" : ""
        }${r.w < 96 || r.h < 52 ? " tiny" : r.w < 136 || r.h < 72 ? " small" : ""}`;
        t.querySelector(".tile-name").textContent = f.name;
        t.querySelector(".tile-size").textContent = gb(f.gb);
        t.title = `${f.name} · ${gb(f.gb)} · ${f.copies < 2 ? "only one copy" : "backed up"}`;
        t.setAttribute("aria-pressed", String(state.selected === f.id));
        t.setAttribute(
          "aria-label",
          `${f.name}, ${gb(f.gb)}, ${f.copies < 2 ? "only one copy" : "backed up"}`,
        );
      }
    }
    for (const [label, node] of groupEls)
      if (!seenGroups.has(label)) {
        node.remove();
        groupEls.delete(label);
      }
    for (const [id, node] of tileEls)
      if (!seenTiles.has(id)) {
        node.classList.add("leaving");
        setTimeout(() => {
          if (!tileEls.has(id) || tileEls.get(id) !== node) return;
          node.remove();
          tileEls.delete(id);
        }, 350);
      }
    const t = totals(state.live);
    el("stat-used").textContent = gb(t.used);
    el("stat-one").textContent = gb(t.oneCopy);
    el("stat-freed").textContent = gb(state.deleted.reduce((s, f) => s + f.gb, 0));
    renderPanel();
  }
  function renderPanel() {
    const f = state.live.find((x) => x.id === state.selected);
    const status = state.lastAction
      ? `<p class="file-status" role="status">${state.lastAction.text}<br /><button type="button" id="file-undo">Undo</button></p>`
      : "";
    if (!f) {
      panel.innerHTML =
        `<p class="file-hint">Select a file to delete it or back it up.</p>` + status;
    } else {
      panel.innerHTML = `
        <div class="file-art" style="--art:${f.art}"></div>
        <h2>${f.name}</h2>
        <p>${f.type} · ${gb(f.gb)} · added ${monthLabel(f)}</p>
        <p class="file-copies${f.copies < 2 ? "" : " safe"}">${
          f.copies < 2 ? "Only one copy" : "Backed up · 2 copies"
        }</p>
        <div class="file-actions">
          <button type="button" id="file-backup"${f.copies < 2 ? "" : " disabled"}>Back up</button>
          <button type="button" id="file-delete" class="danger">Delete</button>
        </div>${status}`;
      el("file-backup").addEventListener("click", () => backUp(f.id));
      el("file-delete").addEventListener("click", () => remove(f.id));
    }
    const undo = document.getElementById("file-undo");
    if (undo) undo.addEventListener("click", undoLast);
  }
  function select(id) {
    state.selected = state.selected === id ? null : id;
    render();
  }
  function backUp(id) {
    const f = state.live.find((x) => x.id === id);
    if (!f || f.copies > 1) return;
    f.copies = 2;
    state.lastAction = {
      undo: () => (f.copies = 1),
      text: `Backed up ${f.name}. ${gb(f.gb)} now has two copies.`,
    };
    render();
  }
  function remove(id) {
    const i = state.live.findIndex((x) => x.id === id);
    if (i < 0) return;
    const [f] = state.live.splice(i, 1);
    state.deleted.push(f);
    state.selected = null;
    state.lastAction = {
      undo: () => {
        state.live.push(f);
        state.deleted.splice(state.deleted.indexOf(f), 1);
      },
      text: `Deleted ${f.name}. ${gb(f.gb)} freed.`,
    };
    render();
  }
  function undoLast() {
    if (!state.lastAction) return;
    state.lastAction.undo();
    state.lastAction = null;
    render();
  }
  document.querySelectorAll("[data-group]").forEach((b) =>
    b.addEventListener("click", () => {
      state.group = b.dataset.group;
      document
        .querySelectorAll("[data-group]")
        .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    }),
  );
  new ResizeObserver(render).observe(map);
  render();
})();
