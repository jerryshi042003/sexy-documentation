# Reconstruct, clarify, validate

One workflow I run on every data-engineering request, in three passes. It is a public summary of local instructions; the private systems and records stay private. Each pass below has a worked example with the request as it arrived, what a literal reading would have produced, and what the pass produced instead.

## 1. Reconstruct the business before drawing it

Read the actual conversations, jobs and configuration. A transcript names a lead; the current job defines the behavior. Draw only what the evidence supports and show an unresolved handoff as unresolved.

**Request, as typed:** "document the commission pipeline for the new analyst, the recording from tuesday has everything"

**Literal reading:** turn the recording into boxes and arrows. The recording said the warehouse applies "the rate," that the Membership desk "sends files Friday," and that finance "gets an email."

**What the pass found:**

| Claim in the recording | Checked against | Result |
| --- | --- | --- |
| Warehouse applies "the rate" | The scheduled job and its rate workbook | Two rates. Harbor FC uses net revenue (sales less refunds); Summit HC uses gross. The recording never mentioned the split. |
| Membership desk "sends files Friday" | The ingestion schedule | A nightly export, not a Friday file. The Friday step was a manual check that stopped in July. |
| Finance "gets an email" | The report refresh and payroll review | The refresh sends nothing. Finance opens the report and approves in a separate step. A refresh is not an approval. |

**Output:** a source map with one example order traced end to end, one rule shown per business unit, and the finance approval drawn as a separate owned step. The Friday check appears as "retired July," not as a live arrow. The live version of that map is the [system example](https://jerryshi042003.github.io/sexy-documentation/#system).

## 2. Clarify what was actually asked

Recover the intended outcome from a rough request. Do not replace it with a generic task, and do not ask questions the context already answers.

**Request, as typed:** "the storage thing is too abstract, i want to see the actual files and group them and delete stuff"

**Literal reading:** add a "group by" dropdown to the four-tile diagram.

**What the pass concluded:**

- "Actual files" means every file visible as its own item, with a thumbnail, not four category tiles.
- "Group them" means the grouping must visibly rearrange those items, not relabel them.
- "Delete stuff" means a real action with a consequence the reader can see: the file leaves, the totals move, and it can be undone.
- Nothing in the request asks for a new page, a backend, or real data. Fictional files keep it publishable.

**Output:** the [storage example](https://jerryshi042003.github.io/sexy-documentation/examples/favorites.html#storage): thirteen fictional files, three groupings that animate the regroup, and Delete / Back up / Undo with totals that respond. Questions that were not asked: none. The request already said what "done" looks like.

## 3. Validate the change, and say which kind of done it is

Test the affected behavior, inspect the real deployed result, and keep four states separate: edited, tested, deployed, observed working on a real record. A green test is the second state, not the fourth.

**Request, as typed:** "commission shows -$20 for a refund, fix it"

**Literal reading:** clamp negative values to zero.

**What the pass established:**

| Step | Evidence | State |
| --- | --- | --- |
| Reproduce | A $200 refund on a $1,000 sale paid last month at 10% gives −$20. The rule says a refund reverses the commission on that refund. | Not a bug. The display was correct; the label "Commission" hid that it was a reversal. |
| Edit | Label the row "Commission change" and show the refund line above it. | Edited |
| Test | `node --test` covers sale, refund, mixed period, gross versus net, rounding symmetry and bad input. | Tested |
| Deploy | Published files on the live page match the commit. | Deployed |
| Observe | Opened the refund case on the live page; the row reads −$20 with the $200 refund beside it. | Observed on the real page |

**Output:** the [calculation example](https://jerryshi042003.github.io/sexy-documentation/#calculation). The request was wrong about the defect and the pass said so, with the rule and the number, before changing anything. Clamping to zero would have hidden a correct reversal.

The reusable visual workflow built on these passes is [SKILL.md](../SKILL.md). These are summaries of method, not installed packages, and they do not enforce themselves.
