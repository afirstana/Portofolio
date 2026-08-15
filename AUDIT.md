# Architecture Audit — Abimael.Data

## Baseline

The project is a **Next.js App Router static export**. Content is loaded at build time from local Markdown through `lib/content.ts` and `gray-matter`; `next.config.ts` uses `output: "export"`. There are no API routes, databases, authentication layers, cloud storage integrations, or runtime data dependencies.

| Area | Current implementation | Reuse decision |
| --- | --- | --- |
| Routes | Static home page, four static project routes, custom 404 | Extend existing routes and static params |
| Content | Markdown files in `content/` plus project frontmatter | Extend frontmatter and retain local-first editing |
| Hero | Approved client-side preloader, glow, and split-text | Preserve; add only restrained desktop pointer response |
| Motion | CSS hero sequence and `Reveal` observer | Reuse with reduced-motion behavior preserved |
| Visual system | Near-black canvas, technical grid, ember accent, monospace metadata | Preserve and extend with data-product interaction patterns |
| Dependencies | Next.js, React, Tailwind, gray-matter, Vitest only | Keep; use native React, CSS, SVG, and browser APIs before adding packages |

## Strengths to Preserve

The existing foundation already expresses the intended **ABIMAEL.DATA** identity: an editorial black canvas, oversized typography, reserved ember accent, technical grid, cinematic opening, Markdown-authorable content, and a static deployment model. The source bundle script already packages editable source alongside the static output.

## Targeted Gaps

The current project list, skills grid, and timeline are presentational rather than evidence-led. Project frontmatter lacks category, tools, case-study sections, skill relationships, and navigation metadata. The case-study route needs a table of contents, progressive problem/system/impact storytelling, system diagrams, related-work flow, and richer per-page static metadata. The global layout still needs static SEO routes and interaction primitives such as command palette, scroll progress, mobile CTA, and data playground.

## Implementation Guardrails

All new features will run at build time or client side. The project will keep local Markdown and local synthetic data as its only data sources, use SVG/CSS instead of WebGL or heavy charting libraries, and use no database, API route, paid service, analytics script, authentication, storage service, background worker, or real-time layer.

## Final Static-Only Verification

The final source tree was checked across `app/`, `components/`, `content/`, `lib/`, `scripts/`, `package.json`, and `next.config.ts` for database, authentication, cloud-storage, API-server, and backend integration markers. The audit returned **clean**. The legacy fullstack scaffold directories were removed rather than retained as unused source.

`pnpm typecheck`, `pnpm test`, and `NODE_ENV=production pnpm build` complete successfully. The static build prerenders the home page, four project pages, `robots.txt`, `sitemap.xml`, the web manifest, and the SVG icon. The resulting first-load JavaScript is **111 kB**, below the stated 200 kB target. `out/SOURCE_MANIFEST.json` and `out/SOURCE_EXPORT_README.md` document the bundled editable source under `out/source/`.

## Accessibility and Local-State Audit

| Component | Keyboard and focus behavior | Announcements and states | Result |
| --- | --- | --- | --- |
| Project Explorer | Native search and buttons are keyboard reachable; filter buttons expose `aria-pressed`. Every project card is a native link: `Tab` reaches the card in visual order, `:focus-visible` reveals its sneak peek with a visible focus treatment, and `Enter` retains the normal case-study navigation. | The visible-system count is announced with `aria-live`; an explicit resettable empty state appears when search/filter matches nothing. On touch/mobile, each sneak peek is rendered inline so hover is never required. | Pass |
| Data Playground | Filters, sort controls, and reset are native buttons; data table uses labelled column headers. | KPI values announce the active filter result; SVG has a descriptive role/label; explanatory copy identifies the data as synthetic. | Pass |
| Timeline Explorer | Native `<details>/<summary>` provides keyboard-operable progressive disclosure without custom focus code. | Each record maintains a semantic summary and revealed detail; no remote loading or error path exists because all timeline data is local at build time. | Pass |
| Command Palette | Opens with trigger or `Ctrl/Cmd + K`, closes with Escape or backdrop, and restores focus to the trigger after dismissal. | It declares a modal dialog, exposes `aria-expanded`, autofocuses the input, and announces the explicit no-match state. | Pass |
| Amazon Product Intelligence dashboard | The collapsible global-filter button, four native `<select>` controls, reset action, product search, and prediction button are reachable by keyboard in source order. Mobile starts with the filter panel collapsed to reduce initial page density. | The filter button exposes `aria-expanded` and `aria-controls`; the computed KPI strip and category detail use `aria-live`; charts and confusion matrix have descriptive labels; loading, local-artifact error, no-results, and no-search-results states are explicit. Native focus styling uses the ember border and all filter labels remain programmatically associated. | Pass |

All animation-adjacent interactions preserve `prefers-reduced-motion`; the hero bypasses its cinematic sequence and pointer interaction where a user requests reduced motion.

The local dataset and timeline now also have explicit no-data fallbacks. If `playground.json` has no rows, the playground announces the missing local data and names the source file to restore. If `timeline.md` has no entries, the timeline announces the empty state and points to its editable Markdown source. These fallbacks are `role="status"`, require no network retry, and preserve the static-only editing flow.

For the Amazon dashboard, `analysis/amazon/VALIDATION.md` records the explicit artifact assertions and manual control checklist. The dashboard's global filters are intentionally limited to category path, rating, observed discount, and observed discounted price. They update only record-derived KPIs and visualizations; review-language and held-out model sections are labelled **full snapshot** rather than suggesting a filtered re-analysis.

The Project Explorer sneak peek contract is checked in `lib/project-sneak-peek.test.ts` and documented in `analysis/project-sneak-peek-qa.md`. Its source-level verification confirms that every authored project has three content-backed preview signals and a takeaway, the desktop interaction is activated both by pointer hover and keyboard focus, and the mobile rule makes the panel visible without hover.
