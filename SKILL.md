---
name: visual-explanations
description: Build or refine visual documentation, system diagrams, and interactive worked examples from verified sources. Use when a reader needs to understand a mechanism, ownership boundary, calculation, or workflow comparison.
---

# Visual explanations

Make the mechanism visible. A reader should be able to follow one real input, explain what changes, and identify who owns the next step.

This is an opinionated synthesis for engineers and analysts. It combines source reconstruction, explanation craft, restrained interface design, and tested examples. It is not an endorsement by the creators credited in [the inspiration notes](references/inspiration.md).

## Start with the confusion

Identify the audience, the question they cannot answer, and the distinction they should understand afterwards. Inspect the existing explanation before changing it. Preserve accepted visuals, working examples, and useful drilldowns.

Use supplied context and connected sources before asking questions. Ask only when a missing business choice changes the result. Do not impose an interview or mandatory quiz on a clear request.

Write a one-sentence answer, then choose the visual that demonstrates it. If the user requested an artifact, deliver a working artifact; otherwise a short explanation may be sufficient.

## Reconstruct before drawing

Read the maintained source: implementation, current configuration, authoritative documentation, and relevant conversations. A transcript names a lead; it does not establish current behavior. Check conflicts against actual code or configuration. Do not convert the user's rough description into a confident architecture diagram.

Build a compact evidence map during research:

| Object | What to establish |
| --- | --- |
| Source | Product name, business activity, representative record, immutable key |
| Connection | Direction, payload, trigger or schedule, retry/deduplication if relevant |
| Transformation | Rule, grain, filter, join, rounding, or consent decision |
| Boundary | Runtime location, responsible team, access approver, downstream consumer |
| Claim | Source reference, observation date, current/proposed/historical/unknown |

Keep credentials and private records out of shareable examples. Use explicitly fictional examples when necessary. Do not invent an owner, schedule, logo, integration, or deployment state to fill a blank. Show an unresolved handoff as unresolved.

## Choose a form that answers the question

| Reader's question | Useful form | Essential detail |
| --- | --- | --- |
| Where does it come from? | Source → transformation → consumer map | Define each source beside its name |
| Who owns this? | Ownership lanes or containment groups | Distinguish operator, business owner, access approver |
| Does it differ by franchise? | Aligned small multiples or a selector | Show exactly which sources and rules change |
| Why is this number different? | Worked rows and reconciliation | Same records, time window, grain, and precision |
| What changed? | Before/after using identical inputs | Show the removed manual step and remaining responsibility |
| What happens next? | Reader-controlled trace | One stable record and a visible state at each hop |

Default to an immediately readable complete picture. Interaction should reveal causality, not act as a toll gate before the answer. Keep the result visible beside its inputs. Use small multiples when readers need to compare states simultaneously.

## Draw real systems clearly

- Label arrows with what moves or happens: “order rows · nightly,” “sign in,” “apply rate.” A generic “data” arrow hides the mechanism.
- Separate source capture, warehouse processing, destination ingestion, and final business acceptance. A successful send is not proof that the audience or report is correct.
- Use real vendor marks from official permitted assets when they improve recognition. Keep a text label and role beside every mark. Use a consistent generic icon for an unknown or fictional product; never fabricate a vendor logo. Track asset origin and usage terms.
- Group by a meaningful boundary: team responsibility, service, account, or environment. Nest only when containment is real. Do not color an external system as if the reader's team owns it.
- Put unit/franchise differences close to the affected source or rule. Do not hide analyst-facing differences under an unrelated engineering heading.
- A numbered trace must keep the same entity, direction, and places throughout. “Record received” and “customer opted in” are different states.

See the runnable [system map](https://jerryshi042003.github.io/visual-explanations/#system) for fictional source records, ownership, and unit differences.

## Teach with concrete examples

Show a normal case, the consequential exception, and the reason for the difference. Choose the number of cases needed for the question; do not pad to a quota.

For a calculation, show the original values, rule, intermediate result, and final value with units. A negative adjustment can be valid; explain the event that caused it. Distinguish a correction from a mistake. Compare on the same cutoff date and record grain. Treat null, zero, and missing data separately.

For an incident, explain the specific failed rule and how it changes one result. Do not substitute a list of checks for a causal example. Synthetic values illustrate the mechanism; they are not production evidence.

For a tutorial, let the reader perform a useful action and see its result. If practice is requested, wrong-answer feedback should explain the misconception rather than merely say “try again.”

## Keep the interface quiet

Use a small, consistent type scale, readable labels, generous separation between concepts, and tight grouping within a concept. Default to one body face, one restrained accent, and a limited emphasis vocabulary. Favor labels, lines, and examples over large cards of prose. Use bold for decisions or essential distinctions, not every noun.

Write short sentences beside the thing they explain. A title should name the question or answer, not advertise “complete,” “real,” or “source-backed.” Keep technical names when they identify something the reader needs.

Preserve useful dropdowns. Keep the main route and conclusion visible; use disclosures for secondary rules, alternate cases, and evidence. Remove redundant wrappers, nested accordions, and text dumps. Do not delete an accepted visual because it happens to live in a disclosure. Inspect it first.

On a phone, recompose a wide diagram vertically or provide a clear scroll affordance. Do not simply shrink its labels. Keyboard focus, semantic buttons, labeled controls, text alternatives, and color-independent meaning are part of the design.

## Choose the implementation deliberately

HTML holds the content and semantics. CSS makes spacing, typography, and visual states consistent. SVG draws sharp geometry. JavaScript ties inputs to a real model. An artifact is the delivery surface; it may already use all of these. Custom HTML is not inherently better than a Claude artifact.

Use the smallest stack that supports the explanation. Native HTML/CSS/SVG is a strong starting point for a portable page. Use a library when it removes a real limitation:

| Need | Candidate | Boundary |
| --- | --- | --- |
| Dense graph layout | Graphviz, ELK, D2 | Layout does not verify architecture; consider build-time SVG |
| Navigable node editor | React Flow | More runtime/state than a small static diagram needs |
| Data-driven comparisons | D3 or Observable Plot | Define units, scale, and denominator explicitly |
| Coordinated sequence or path motion | GSAP | Optional animation engine; not a diagram or evidence engine |
| Maintained architecture views | LikeC4 | Useful when several views must share one model |

Verify current docs and actual host restrictions before selecting a dependency. Do not infer a library from an inspiration's appearance. Avoid adding a dependency merely to say it was used.

Motion must explain change or sequence. Default to no autoplay. Supply step/replay and pause when needed; respect reduced motion. Keep a complete static explanation available. For simple changes CSS or native browser animation may be sufficient. For comparisons, showing both states often works better than moving between them.

## Prompt the author with a contract

Use this brief with Claude, Codex, or another authoring tool. Replace brackets with actual evidence, not wishes:

```text
Build a visual explanation for [audience].
Question: [the exact confusion].
The reader should leave able to distinguish [A] from [B].
Verified mechanism: [sources, record, transformations, destinations].
Ownership and access: [who operates and who grants access at each boundary].
Differences: [unit/franchise-specific rules].
Evidence: [current source links and observations].
Unknowns: [unverified points; do not fill them in].
Example: [one input → rule → output, plus the important exception].
Reference: [specific visual]; borrow [specific useful quality].
Preserve: [accepted visual, controls, examples].
Make the main explanation visible. Use concise labels, consistent typography,
and a working model for controls. Keep useful rule disclosures.
Deliver [format and destination]. Inspect the rendered result at desktop and
phone sizes; verify the mechanism, calculations, controls, and final link.
```

For a revision, name the failure and bounded change:

```text
The diagram shows where data goes, but not what each source records.
Add one source definition and one example record per input. Keep the current
layout, accepted rate dropdown, and calculation. Recheck the affected flow.
```

## Review meaning, then finish

1. **Meaning:** Can a reader name the source, follow one record, explain the rule, and identify the next owner? Is each arrow supported? Are proposed and live states distinct?
2. **Examples:** Independently calculate the displayed results and important exceptions. Check that changing a control updates every dependent label, rule, and result.
3. **Presentation:** Inspect desktop and phone renders for clipped labels, crossings, unreadable text, weak contrast, and hidden main content. Exercise keyboard navigation and useful disclosures. Check reduced motion when motion exists.
4. **Delivery:** Verify the exact published files and working link. A screenshot is evidence of rendering, not correctness or production operation. Do not claim accessibility certification from a spot check.

Fix actual defects in a bounded pass. Recheck changed behavior. Keep reusable teaching content in the artifact; put task logs and private investigation evidence elsewhere. Finish with the working link and a brief statement of what was delivered and any material limit.

## Companion material

- [Live examples](https://jerryshi042003.github.io/visual-explanations/) — source map, commission cases, manual/automated comparison.
- [Inspiration and attribution](references/inspiration.md) — exact sources and what transfers.
- [Tool choices](references/toolkit.md) — implementation layers, GSAP, and artifact delivery.
- [Evaluation cases](tests/evaluation-cases.md) — realistic prompts that test decisions, not phrasing.
