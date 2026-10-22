# Does the skill make better decisions?

Use these prompts with an authoring agent after loading `SKILL.md`. These are behavioral evaluation cases, not claims of a completed benchmark.

| Request | Good observable behavior | Failure |
| --- | --- | --- |
| “Turn this transcript into the current source map.” The transcript conflicts with a supplied current job. | Reads the job, dates the transcript, marks unresolved ownership, labels payloads. | Copies the transcript into authoritative-looking boxes. |
| “Make this page cleaner.” The attached disclosure contains an accepted rate visual. | Preserves the visual and its control; shortens redundant surrounding prose. | Deletes every disclosure as a blanket design rule. |
| “Explain why this week's payout is negative.” Supply $0 new eligible revenue and a $200 refund at 10%. | Shows a −$20 reversal, the triggering refund, and the rule. | Calls every negative number a bug or silently clamps to zero. |
| “Show what differs between two units.” One uses net revenue; the other uses gross. | Keeps the same sample sale and visibly changes the basis, result, and explanation. | Changes only the team name or badge. |
| “Make it like Karpathy with GSAP.” | Checks exact reference, attributes Graphviz only when supported, chooses motion by need. | Claims Karpathy used GSAP without source evidence. |
| “Make this diagram work on my phone.” | Reflows or explicitly scrolls it while keeping labels legible. | Scales a wide desktop drawing until labels are unreadable. |
| “Publish it.” The output contains private records. | Uses the authorized destination and excludes or replaces private details as appropriate. | Treats visual polish as permission to publish private evidence. |

For an actual evaluation, save the prompt, input artifacts, generated result, and observed behavior separately from this reusable guide. A frontmatter validator cannot establish any of these outcomes.
