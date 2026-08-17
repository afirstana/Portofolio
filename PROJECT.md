# Project: Olist Payment Behavior Analytics Synthesis & Portfolio Site QA

## Architecture
- Next.js 14 / TypeScript / Tailwind CSS / Radix UI / Lucide React / Vitest portfolio site.
- Dynamic project narrative rendering from markdown content files located in `content/projects/`.
- Interactive data showcase and analytics components in `components/`.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Source Synthesis | Synthesize `payment_behavior_analysis.md` into `olist-payment-behavior-analytics.md` with Section 04 and full narrative depth | M1, M2 | User Request R1 | DONE |
| 2 | Formula & Metrics Accuracy | Pearson $r = 0.37$, $3.3\times$ AOV surge, 5,328 orders 10x spike, category elasticity matrix | M2 | User Request R1 | DONE |
| 3 | Cross-Project Audit | Inspect all markdown files in `content/projects/` for completeness, frontmatter, and no empty sections | M2, M3 | User Request R2 | DONE |
| 4 | Component QA Audit | Inspect interactive showcases for error handling, empty states, and layout shift | M3 | User Request R2 | DONE |
| 5 | Automated Verification | `pnpm typecheck`, `pnpm test`, `pnpm build` | M4 | User Request R3 | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Survey & Codebase Exploration | Examine source analytical doc, target markdown, components, and tests | none | DONE |
| 2 | Content Synthesis & Implementation | Synthesize `olist-payment-behavior-analytics.md` and address UI findings | M1 | DONE |
| 3 | Multi-Perspective Review & Challenge | Comprehensive review, adversarial stress tests, route deduplication | M2 | DONE |
| 4 | Forensic Integrity Audit & Final Verification | Binary veto integrity audit, typecheck, vitest test runner, Next.js build | M3 | DONE |

## Code Layout
- `content/projects/` : Markdown files for all portfolio case studies.
- `components/` : React UI and interactive chart/showcase components.
- `scripts/` : Build and static source export scripts.
- `__tests__/` : Vitest test suites.
- `.agents/` : Agent metadata, plans, reports, and coordination files.
