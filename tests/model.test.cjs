const test = require("node:test");
const assert = require("node:assert/strict");
const { calculate, money } = require("../examples/model.js");
test("normal sale, refund reversal, and mixed period", () => {
  assert.deepEqual(calculate(100000, 0), {
    eligible: 100000,
    commission: 10000,
  });
  assert.deepEqual(calculate(0, 20000), {
    eligible: -20000,
    commission: -2000,
  });
  assert.deepEqual(calculate(100000, 20000), {
    eligible: 80000,
    commission: 8000,
  });
});
test("same records produce distinct results for gross and net rules", () => {
  assert.equal(calculate(100000, 20000, "gross").commission, 10000);
  assert.equal(calculate(100000, 20000, "net").commission, 8000);
});
test("zero and rounding are symmetric for a reversal", () => {
  assert.equal(calculate(0, 0).commission, 0);
  assert.equal(calculate(5, 0).commission, 1);
  assert.equal(calculate(0, 5).commission, -1);
  assert.equal(calculate(4, 0).commission, 0);
  assert.equal(calculate(0, 4).commission, 0);
});
test("missing, non-finite, fractional, or negative input is not silently zero", () => {
  for (const bad of [null, undefined, NaN, Infinity, -1, 2.5])
    assert.throws(() => calculate(bad, 0), TypeError);
  assert.throws(() => calculate(100, 0, "unknown"), TypeError);
});
test("display preserves cents and uses an explicit minus for reversal", () => {
  assert.equal(money(-2000), "−$20");
  assert.equal(money(101), "$1.01");
  assert.equal(money(0), "$0");
  assert.equal(money(-0), "$0");
});
