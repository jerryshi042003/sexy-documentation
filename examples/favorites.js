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
el("storage-toggle").addEventListener("click", () => {
  const hidden = document
    .querySelector(".treemap")
    .classList.toggle("hide-status");
  el("storage-toggle").setAttribute("aria-pressed", String(!hidden));
  el("storage-toggle").textContent = hidden
    ? "Show copy status"
    : "Hide copy status";
});
