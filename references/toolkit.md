# What actually makes an artifact better?

The improvement comes from an explicit model, consistent design rules, and revision against real examples. “HTML instead of an artifact” is a false distinction: an artifact can render HTML.

| Layer | Job | Why a reader cares |
| --- | --- | --- |
| HTML | Content, headings, controls, and semantic structure | The explanation remains readable and navigable |
| CSS | Shared spacing, type, colors, and responsive layout | Similar things look similar; phone labels stay readable |
| SVG | Crisp shapes, paths, labels, and diagrams | Relationships remain clear when resized |
| JavaScript | State and calculations | Changing a case changes the actual result |
| GSAP | Coordinated animation timelines and path motion | Useful when seeing the sequence resolves the confusion |
| Artifact viewer or website | Hosts the work | Sharing, persistence, scripts, and asset restrictions depend on the host |

[MDN's web introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website) explains the basic layers. [GSAP's documentation](https://gsap.com/docs/v3/) covers its animation engine, timelines, and optional plugins.

## What to tell a colleague

“I give the model verified source facts, a specific confusion, one worked example, and a visual reference with reasons. I ask for a consistent HTML/CSS interface, a diagram that shows the actual mechanism, and controls only where changing an input teaches something. Then I check the calculations and the rendered result. GSAP is optional when a sequence needs animation.”

This is a reusable pitch, not a claim about which tools a particular earlier artifact used.

## A practical selection guide

Start with the simplest implementation that carries the idea. These examples use plain HTML, CSS, original SVG symbols, credited product marks, and a small JavaScript model. They have no build step, CDN, analytics, font download, or runtime package dependency.

For more complex work, inspect current primary documentation:

- [Graphviz](https://graphviz.org/documentation/) or [ELK](https://github.com/kieler/elkjs): automatic graph layout. Compile ahead of time when the graph does not need editing.
- [D2](https://d2lang.com/): diagrams defined as text. Review the resulting geometry.
- [React Flow](https://reactflow.dev/): custom interactive nodes and edges. Use when navigation or editing earns the runtime complexity.
- [LikeC4](https://likec4.dev/): consistent architecture views from a maintained model.
- [D3](https://d3js.org/) or [Observable Plot](https://observablehq.com/plot/): data-driven visual comparisons.
- [GSAP MotionPath](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/): move along a path when a reader-controlled trace helps. It does not discover the path or verify the system.

Do not pin a library version from this document; verify the current API and licensing when integrating it. Browser and artifact-host restrictions change. Test inside the actual delivery surface.
