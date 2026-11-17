const test = require("node:test");
const assert = require("node:assert/strict");
const { periods, residual, money } = require("../assets/payout.js");

test("every closed period reconciles to the cent", () => {
  for (const p of periods.filter((q) => q.comparator)) {
    assert.ok(p.causes.length > 0, p.id);
    p.causes.forEach((c) => assert.ok(Number.isSafeInteger(c.cents), `${p.id} ${c.name}`));
    assert.equal(residual(p), 0, `${p.id} leaves ${residual(p)} cents unexplained`);
  }
});

test("open periods claim no difference", () => {
  for (const p of periods.filter((q) => !q.comparator)) {
    assert.equal(p.total, null);
    assert.equal(p.causes.length, 0);
  }
});

test("money uses true minus signs and two decimals", () => {
  assert.equal(money(-120450), "−$1,204.50");
  assert.equal(money(1240), "+$12.40");
  assert.equal(money(0), "$0.00");
  assert.equal(money(-3450, false), "$34.50");
});
