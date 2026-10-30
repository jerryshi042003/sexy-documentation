const test = require("node:test");
const assert = require("node:assert/strict");
const { files, groupBy, totals, squarify } = require("../examples/storage.js");
test("inventory totals match the numbers shown on the page", () => {
  assert.deepEqual(totals(files), { used: 1000, oneCopy: 505 });
});
test("every grouping keeps every gigabyte exactly once", () => {
  for (const by of ["type", "copies", "month"]) {
    const groups = groupBy(files, by);
    assert.equal(groups.reduce((s, g) => s + g.gb, 0), 1000);
    assert.equal(groups.flatMap((g) => g.files).length, files.length);
  }
  assert.deepEqual(groupBy(files, "type").map((g) => [g.label, g.gb]),
    [["Video", 600], ["Photos", 250], ["Projects", 100], ["Documents", 50]]);
  assert.deepEqual(groupBy(files, "copies").map((g) => [g.label, g.gb]),
    [["Only one copy", 505], ["Backed up", 495]]);
  assert.throws(() => groupBy(files, "owner"), TypeError);
});
test("deleting or backing up a file moves the totals, not the other files", () => {
  const without = files.filter((f) => f.id !== "playoff");
  assert.deepEqual(totals(without), { used: 820, oneCopy: 325 });
  const backedUp = files.map((f) => (f.id === "playoff" ? { ...f, copies: 2 } : f));
  assert.deepEqual(totals(backedUp), { used: 1000, oneCopy: 325 });
});
test("treemap areas are proportional and stay inside the box", () => {
  const sorted = [...files].sort((a, b) => b.gb - a.gb);
  const rects = squarify(sorted, (f) => f.gb, 0, 0, 800, 480);
  assert.equal(rects.length, files.length);
  let area = 0;
  for (const r of rects) {
    assert.ok(r.x >= -1e-6 && r.y >= -1e-6 && r.x + r.w <= 800 + 1e-6 && r.y + r.h <= 480 + 1e-6);
    assert.ok(Math.abs(r.w * r.h - (r.item.gb / 1000) * 800 * 480) < 1e-6);
    area += r.w * r.h;
  }
  assert.ok(Math.abs(area - 800 * 480) < 1e-6);
  assert.deepEqual(squarify([], (f) => f.gb, 0, 0, 10, 10), []);
});
