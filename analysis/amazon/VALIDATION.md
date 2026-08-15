# Amazon Dashboard Validation Checklist

This checklist is maintained with the static analysis artifacts. It distinguishes values that are recomputed in the browser from full-snapshot outputs that deliberately remain fixed.

## Automated assertions

`lib/amazon-artifacts.test.ts` parses the same JSON artifacts that the dashboard fetches and asserts the following against `analysis-summary.json`.

| Assertion | Expected source-of-truth result |
| --- | --- |
| Dataset counts | 1,465 clean rows, 1,351 unique products, 211 category paths, 9 top-level groups |
| Quality counts | 0 exact duplicates removed; 1 missing rating; 2 missing rating-count values |
| Rating histogram total | 1,464 rows, reflecting the one missing rating that cannot be binned |
| Discount histogram and category-stat totals | 1,465 rows |
| Product-record artifact | 1,464 filterable rows |
| Model artifact | Matches the best-model name, threshold, all displayed accuracy/F1/ROC-AUC values, and confusion-matrix counts in the analysis summary |

The latest verification ran `pnpm typecheck`, `pnpm test` (**6 tests passed**), and `pnpm build` successfully. The case study route was emitted as a static page and its JSON artifacts were confirmed under both `out/data/amazon/` and `out/source/public/data/amazon/`.

## Manual filter-control verification

| Step | Expected behavior | Result |
| --- | --- | --- |
| Open the case study on desktop | The **Global filters** control is visible and its four labelled selects are keyboard reachable. | Pass |
| Open it at a 390px viewport | The filter panel starts collapsed; activating the native button opens it and changes `aria-expanded`. | Pass |
| Change category, rating, discount, or discounted-price ranges | Active records, unique products, average rating, average discount, histograms, category bars, correlations, scatter plots, and product table all redraw from the same filtered product-record set. | Pass |
| Apply a restrictive combination | A clear no-records state appears instead of misleading zero-height charts. | Pass |
| Use **Reset all** | Every filter and product search return to their initial values; record-derived KPIs return to the initial filterable view of 1,464 rows. | Pass |
| Tab through the dashboard | Visible ember focus indicators appear on select inputs, search, buttons, and textarea; no mouse-only control is required. | Pass |
| Read fixed sections after filtering | Review terms and model evaluation continue to identify themselves as **full snapshot** values, avoiding a claim that the client retrains or recomputes them. | Pass |

## Scope note

The browser has no raw review corpus and never performs model training. The local prediction demo only evaluates the exported TF-IDF plus logistic-regression coefficients against user-entered text. Its result is therefore an illustrative probability from this dataset snapshot, not a product recommendation or operational decision.
