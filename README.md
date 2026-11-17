# Sexy Documentation

A skill for documentation people can use, and a live site that shows it working.

**[Open the site →](https://jerryshi042003.github.io/sexy-documentation/)**

The site is the data docs of a made-up sports group, Tideline Sports (Harbor FC and Summit HC). The home page is a system graph: three ownership lanes, nine systems, and one order you can trace from ticket sale to payroll review. Every node opens the document that covers it.

## Five document types

Each page follows the structure of a real working document. All content is fictional.

| Page | Type | What it has to do |
| --- | --- | --- |
| [Fan forms to CRM](https://jerryshi042003.github.io/sexy-documentation/docs/forms-to-crm.html) | System page | Route map; behaviour and proof per route; what a success response does not prove |
| [Source status](https://jerryshi042003.github.io/sexy-documentation/docs/source-status.html) | Source catalogue | How far each source reaches; Ready, Limited or Blocked; use now, next gate, start here |
| [Why the payout differs](https://jerryshi042003.github.io/sexy-documentation/docs/payout-differences.html) | Reconciliation | Comparator, dollar causes and an exact equation with no residual; open periods claim nothing |
| [New season setup](https://jerryshi042003.github.io/sexy-documentation/docs/new-season.html) | Runbook | Who does what in order, what runs on its own, when code must change, validation SQL |
| [Duplicate renewal emails](https://jerryshi042003.github.io/sexy-documentation/docs/renewal-email-incident.html) | Incident write-up | Hotfix, durable fix and unrelated cleanup kept apart; chronology; verified versus inferred |

Every page uses the same frame: a one-line answer, the diagram, details in disclosures, and an owner / evidence / last-validated footer.

## The skill

[SKILL.md](SKILL.md) holds the workflow: reconstruct the system from its sources, choose the form that answers the reader's question, keep useful disclosures, and verify the result. To install in Codex:

```sh
git clone https://github.com/jerryshi042003/sexy-documentation.git \
  ~/.codex/skills/sexy-documentation
```

Then invoke `$sexy-documentation`. Any other agent can be pointed at `SKILL.md`.

Supporting notes: [reconstruct, clarify, validate](references/my-workflows.md), [inspiration and attribution](references/inspiration.md), [tool choices](references/toolkit.md), [evaluation cases](tests/evaluation-cases.md).

## Run locally

No build step and no dependencies.

```sh
python3 -m http.server 8000
node --test tests/reconciliation.test.cjs
```

Pages live in `index.html` and `docs/`; styles in `assets/site.css`; the graph in `assets/graph.js`; pay-period data and the waterfall in `assets/payout.js`. The test checks that every closed pay period reconciles to the cent.

MIT licensed original writing and code. Linked sources keep their own terms.
