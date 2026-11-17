"use strict";
(function () {
  // Open the disclosure a link points at.
  function openTarget() {
    const id = location.hash.slice(1);
    if (!id) return;
    const t = document.getElementById(id);
    if (t && t.tagName === "DETAILS") t.open = true;
  }
  window.addEventListener("hashchange", openTarget);
  document.addEventListener("DOMContentLoaded", () => {
    openTarget();
    document.querySelectorAll(".code-block").forEach((block) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "copy";
      b.textContent = "Copy";
      b.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(block.querySelector("code").textContent);
          b.textContent = "Copied";
        } catch (e) {
          b.textContent = "Select and copy";
        }
        setTimeout(() => (b.textContent = "Copy"), 1600);
      });
      block.append(b);
    });
  });
})();
