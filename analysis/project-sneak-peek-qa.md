# Project Explorer Sneak Peek QA

## Keyboard verification

The Project Explorer keeps every project row as one native case-study link. The expected tab order moves from search and category controls to the visible project cards in their rendered order. When a card receives keyboard focus, the `.project-row:focus-visible` rule reveals the same sneak peek shown by pointer hover; the arrow also receives the ember focus treatment. Pressing `Enter` follows the normal static case-study route, and `Shift+Tab` returns to the preceding control without a focus trap.

## Touch and mobile verification

At the `720px` breakpoint, the sneak peek changes from an overlay to an inline grid below the project summary. This makes the workflow snapshot, three data points, and takeaway available on touch devices without any hover interaction. The 390px responsive review confirmed that all five project cards retain these inline previews in a single-column reading flow.

## Metadata contract

| Requirement | Verification |
| --- | --- |
| Every project has a preview | `lib/project-sneak-peek.test.ts` checks that all five local Markdown projects supply an eyebrow, exactly three metrics, and a takeaway. |
| No unsupported project claims | Each metric is authored in the relevant project Markdown. Amazon's 1,465-row count, F1 of 0.7414, and ROC-AUC of 0.8369 match the local analysis artifact. |
| Keyboard has parity with hover | The test asserts desktop CSS selectors for both `.project-row:hover` and `.project-row:focus-visible`. |
| Touch does not depend on hover | The test asserts the mobile rule that makes `.project-sneak` static and fully visible. |

This interaction is presentation-only. It adds no remote data fetch, tracking, database, or client-side state beyond the existing Project Explorer filters.
