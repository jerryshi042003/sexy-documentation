/* Fictional rules and values. No business system or customer data. */
(function (root) {
  "use strict";
  const units = {
    harbor: {
      name: "Harbor FC",
      source: "Ticket desk",
      role: "Sales and refunds",
      id: "H-104",
      basis: "net",
      description:
        "Harbor uses ticket sales less refunds as its commission basis.",
    },
    summit: {
      name: "Summit HC",
      source: "Membership desk",
      role: "Membership purchases",
      id: "S-208",
      basis: "gross",
      description:
        "Summit uses gross membership purchases; refunds are reviewed separately.",
    },
  };
  const cases = {
    sale: {
      sales: 100000,
      refund: 0,
      explanation: "A $1,000 eligible sale creates $100 in commission.",
    },
    refund: {
      sales: 0,
      refund: 20000,
      explanation:
        "A $200 refund reverses $20 of a previously paid commission. The negative adjustment is expected.",
    },
    mixed: {
      sales: 100000,
      refund: 20000,
      explanation:
        "$1,000 of sales less a $200 refund gives an $800 eligible change and $80 commission.",
    },
  };
  function calculate(sales, refund, basis = "net") {
    if (![sales, refund].every((n) => Number.isSafeInteger(n) && n >= 0))
      throw new TypeError("Use nonnegative integer cents.");
    if (basis !== "net" && basis !== "gross")
      throw new TypeError("Unknown basis.");
    const eligible = sales - (basis === "net" ? refund : 0);
    // Fictional 10% rate. Round half away from zero, symmetrically for reversals.
    const commission =
      Math.sign(eligible) * Math.round(Math.abs(eligible) / 10);
    return { eligible, commission: commission || 0 };
  }
  function money(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: cents % 100 ? 2 : 0,
      maximumFractionDigits: 2,
    })
      .format((cents || 0) / 100)
      .replace("-", "−");
  }
  const model = { units, cases, calculate, money };
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  else root.VisualExamples = model;
})(typeof window === "undefined" ? globalThis : window);
