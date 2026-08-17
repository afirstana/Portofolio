# PORTFOLIO VERSION HISTORY & RELEASE LOG

---

## 📌 [Version 2.2.0] — Dedicated OPINION Section with High-Res Editorial Artworks
- **Release Date:** August 17, 2026
- **Git Tag:** `v2.2.0-stable`
- **Status:** Production Deployed (19/19 Static Pages)

### ✨ Major Features & Innovations:
1. **Dedicated Standalone OPINION Section (`/opinion` & `/opinion/[slug]`)**:
   - Long-form thought leadership and systems essays.
   - Real-time search and topic filtering (*Data Philosophy*, *E-Commerce & Fintech*, *Builder Pragmatism*).
   - Article cards with visual concept thumbnails, reading times, publication dates, and Executive Thesis teasers.
2. **Deep Reader Experience**:
   - Full-width hero editorial concept artwork banners.
   - **Executive Thesis (TL;DR Callout Box)** summarizing central argument upfront.
   - Rich Markdown narrative supporting LaTeX formulas, comparison tables, code blocks, and blockquotes.
   - Previous and Next Perspective pager for continuous reading.
3. **3 Inaugural Thought Leadership Essays (100% International English)**:
   - *Why Most Dashboards Fail to Drive Decisions*
   - *The Vanity Metric Trap in E-Commerce & Growth Analytics*
   - *Pragmatic Engineering: Why Simple Tools Beat Bloated Stacks*
4. **Header Navigation Order Alignment**:
   - Navigation links ordered: `WORK` ➔ `METHOD` ➔ `SKILLS` ➔ `PATH` ➔ `OPINION` ➔ `CONTACT`.
   - Command Palette (`⌘K`) shortcut: `Read opinions & essays`.

---

## 📌 [Version 2.1.0] — Brent Oil Econometrics & Olist Payment Narrative Synthesis
- **Release Date:** August 17, 2026
- **Git Commit:** `a9af7f2`
- **Git Tag:** `v2.1.0-stable`
- **Status:** Production Deployed (15/15 Static Pages)

### ✨ Major Features & Deliverables:
1. **Brent Crude Oil Market Dynamics & Geopolitical Econometrics (7th Case Study)**:
   - 35.5-year macroeconomic dataset (9,011 trading days, 1987–2022).
   - 4 macro regime classifications, 7 geopolitical crises modeled with $\pm \text{window}$ before/after metrics.
   - Non-Gaussian fat-tail analysis (Kurtosis 45.43, VaR 95% at -3.57%, VaR 99% at -6.13%).
   - Interactive SVG price timeline with decade filtering, moving average overlays (MA-30, MA-365), dynamic KPI cards, and crisis simulator (`BrentOilInteractiveShowcase.tsx`).
2. **Olist Payment Behavior Analysis (Section 04 Narrative Repair)**:
   - Synthesized complete 308-line (~25.5 KB) econometric narrative in `olist-payment-behavior-analytics.md`.
   - Multi-payment sequential aggregation, 4-channel wallet share (Credit Card 78.4% GMV, Boleto 17.9% GMV), 3.33x installment AOV elasticity model ($r = 0.37$), and 10x checkout anomaly diagnosis.
3. **End-to-End QA & Build Verification**:
   - 36/36 unit tests passed across 5 test suites (`vitest run`).
   - 100% static export prerendered into `out/` with zero TypeScript or runtime errors.

---

## 📌 [Version 2.0.0] — Dual Theme Engine & Trust Blue Architecture
- **Release Date:** August 16, 2026
- **Git Commit:** `2556282`
- **Git Tag:** `v2.0.0-stable`
- **Status:** Production Deployed

### ✨ Major Features & Innovations:
1. **Dual Theme Engine (Dark & Light Mode)**:
   - **Dark Mode (Default)**: Deep obsidian canvas (`#050506`), dark surfaces, and High-Voltage Orange accent (`#ff4d1c`).
   - **Light Mode**: Crisp alabaster canvas (`#f8fafc`), pure white card surfaces (`#ffffff`), midnight slate text (`#0f172a`), and **Trust Blue accent** (`#0284c7` / `#0369a1`).
2. **Adaptive Accent Shift**:
   - All glowing ambient beams, focus rings, tag badges, polyline charts, vector map paths, and button hover states dynamically shift from Orange to Trust Blue in Light Mode.
3. **Theme Persistence & Zero-FOUT**:
   - Minimalist toggle (`☀ LIGHT` / `☾ DARK`) in desktop navigation header and mobile drawer.
   - Synchronized with `localStorage` and system preferences with an inline anti-flicker blocking script in `<head>`.
4. **100% High-Contrast Typography & Component Audit**:
   - Fixed Career Timeline (`06 / Where I've been`) role titles (`Data Analyst`, `Independent Builder`) to high-contrast slate.
   - Refactored 35-nation country matrix, 15 cancer classification matrix, and economic tiers table for maximum legibility.
   - Audited all 6 interactive project terminals and showcase components.

---

## 📌 [Version 1.3.0] — Olist Interactive Payment Showcase & UI Refinements
- **Release Date:** August 16, 2026
- **Git Tag:** `v1.3.0-stable`

### ✨ Key Deliverables:
1. **Olist Payment Method Mix & Installment Elasticity Engine**:
   - 4-channel fintech payment telemetry (Credit Card, Boleto Bancário, Voucher, Debit Card).
   - 3.3x AOV installment escalation curve (1x to 24x).
   - Category financing sensitivity matrix.
2. **Career Timeline Refinement**:
   - Updated copy for Data Analyst and Independent Builder roles.
3. **Scrollable Work Explorer**:
   - Scrollable container for `02 / Selected systems` to maintain consistent page height as projects expand.
4. **Minimalist Floating Back to Top**:
   - Minimalist floating button in bottom-right corner triggering smooth scroll to top.

---

## 📌 [Version 1.2.0] — Cancer Epidemiology Intelligence & Part 2 Playgrounds
- **Release Date:** August 15, 2026
- **Git Tag:** `v1.2.0-stable`

### ✨ Key Deliverables:
1. **Interactive Cancer Data Playgrounds (Part 1 & 2)**:
   - Annual mortality trend polyline charts (1990–2019).
   - Comparative 35-country age-standardized mortality matrix.
   - 15-cancer 5-year clinical survival rate matrix.
   - Socio-economic income tier correlation table.

---

## 📌 [Version 1.1.0] — Production Visual Evidence & Geospatial Maps
- **Release Date:** August 15, 2026
- **Git Tag:** `v1.1.0-stable`

### ✨ Key Deliverables:
1. **Olist Brazil Geospatial Logistics Map**:
   - 27-state interactive SVG vector map with lead time disparity analysis.
2. **Olist 9-Tier RFM Retention Matrix**:
   - 4-quadrant customer intelligence and revenue risk segmentation.
3. **Certificate Generator Simulator**:
   - 300-DPI vector canvas preview and batch compilation runner.

---

## 📌 [Version 1.0.0] — Initial Core Portfolio Architecture
- **Release Date:** August 15, 2026
- **Git Tag:** `v1.0.0-stable`

### ✨ Key Deliverables:
1. Complete Next.js App Router architecture with static site generation (SSG).
2. Amazon Product Intelligence Lab with client-side TF-IDF ML inference.
3. 6 core case studies with system diagrams and quantitative evidence.
4. Fast keyboard navigation (`⌘K` command palette).
