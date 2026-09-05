# 📜 PATCH NOTES & CHANGELOG LOGBOOK

> **Standard Operating Rule**: Always append new patch entries to this document chronologically with date, commit hash, files modified, and technical breakdown of changes.

---

## 📅 [2026-09-05] — Patch v1.7.3: Brent Oil 3D Custom TOC & Clean Typography Hardening
- **Commit**: `a110a5f`
- **Components**: `components/BrentOil3DToc.tsx`, `components/MarkdownBody.tsx`, `app/projects/brent-oil-3d-volatility-manifold/page.tsx`, `content/projects/brent-oil-3d-volatility-manifold.md`
- **Changes**:
  - **Dedicated 3D Table of Contents (`BrentOil3DToc.tsx`)**:
    - Created custom TOC matching the real sections of the 3D manifold case study (`01 3D Studio`, `02 Architecture`, `03 Formulation`, `04 Topography`, `05 3D Math`, `06 Diagnostics`, `07 Evidence`, `08 Impact`, `09 Lessons`).
    - Replaced the generic `CaseStudyToc` (`Problem, Data, Approach, System...`) and bound active scroll spy to precise DOM section IDs (`#manifold-studio`, `#pipeline`, `#formulation`, `#topography`, `#projection`, `#diagnostics`, `#evidence`, `#impact`, `#lessons`).
  - **Hardened Math & Currency Typography in `MarkdownBody.tsx`**:
    - Fixed escaped dollar sign pre-processing (`\$22.25` ➔ `$22.25`) so currency symbols display cleanly without leaving raw backslashes or corrupting math regex parsers.
    - Removed `.mono` class and uppercase text transform on inline math expressions, rendering mathematical variables (`t ∈ 𝒯`, `r ∈ ℛ`, `z ∈ ℝ⁺`, `σₜ`, `γₖ`, `δₖ`) in natural, high-readability typography without heavy button badges.
    - Enabled recursive inline formatting within bold tokens (`**$7 crises in 35.5 years$**` and `**5-Sigma (±5σ) Probability**`).
    - Replaced raw LaTeX sum, exp, and fraction artifacts with clean, accessible mathematical Unicode strings (`∑(k=1..7)`, `σₜ²`, `δₖ²`).
  - **Density Elevation Landscape Table & Visual Flowchart Pipeline**:
    - Replaced cluttered mathematical formula bullet points (`EXP(-(R² / 2Σ_T²))` badges) with an intuitive 4-column breakdown table connecting the mathematical engine to physical 3D terrain geometry and real-world economic impacts (Peacetime Calm Spine, Supply Shock Peaks, Demand Shock Canyons).
    - Upgraded the ASCII monospace box diagram into a responsive, high-contrast visual architecture pipeline card (`ARCHITECTURAL PARADIGM COMPARISON • FLOW DIAGRAM`) featuring 4 sequenced nodes with descriptive telemetry badges and directional flow indicators (`➔`).
  - **Historical Era & Crisis Beacon Topography Table Upgrade**:
    - Aligned the 8-row table directly with all 7 interactive 3D crisis beacons (plus peacetime baseline), incorporating color-coded daily shock delta badges (`+8.5% ▲`, `+10.4% ▲`, `+5.8% ▲`, `+9.8% ▲` in crimson, `-6.8% ▼`, `-7.5% ▼`, `-14.2% ▼` in emerald, `0.0% ⚖️` in neutral), clean spot prices ($22.25 to $143.95), and descriptive physical geometry classifications.
  - **Data Table & Executive Summary Cleanup**:
    - Replaced escaped currency strings and cluttered percentage math tags across Historical Era and Tail Risk Diagnostic tables.
    - Replaced raw LaTeX math tags in the executive note with clean text and Unicode symbols.
  - **Verification**:
    - 234/234 unit tests passing across all 14 test suites.
    - 32/32 static routes cleanly generated in Next.js production build.

---

## 📅 [2026-09-05] — Patch v1.7.2: 3D Surface Viewport Centering & Readability Enhancement
- **Commit**: `3505be1`
- **Components**: `components/BrentOil3DManifold.tsx`, `components/MarkdownBody.tsx`, `app/projects/brent-oil-3d-volatility-manifold/page.tsx`, `content/projects/brent-oil-3d-volatility-manifold.md`
- **Changes**:
  - **Fixed 3D Viewport Centering & Upright Orientation**:
    - Re-derived Euler camera perspective projection ($Y_{\text{cam}} = z_{\text{centered}} \cos\phi + y_1 \sin\phi$) so volatility spikes and crisis peaks point naturally upwards into the sky rather than dipping downwards.
    - Centered model coordinates vertically ($z_{\text{centered}} = z - 45$, $cy = \text{height} / 2 - 25$) on an expanded 520px canvas, eliminating bottom crowding and centering the 3D manifold symmetrically across all 3 view presets.
    - Upright crisis beacons: dashed indicator lines and diamond pins hover upright directly above the peaks with clear year labels.
  - **Fixed Raw LaTeX Subtitle & Enhanced Math Typography**:
    - Replaced raw unrendered string `\( \mathcal{M}(t, r) \mapsto z \)` in `page.tsx` with a styled Obsidian cyan monospace badge `ℳ(t, r) ⟶ z`.
    - Upgraded `MarkdownBody.tsx` with multi-line `$$...$$` math block collection and clean Unicode typography (`ℳ`, `𝒯`, `ℛ`, `ℝ⁺`, `⟶`, `θ`, `ϕ`, `δ`, `γ`), eliminating raw `beginaligned` syntax artifacts.
    - Added an intuitive 3-axis Executive Guide table translating mathematical tensor coordinates into plain-English physical landscape analogies.
    - Standardized high-contrast Gaussian Model vs Empirical Reality comparison table (Kurtosis 45.43 vs 3.0, 99% VaR -7.12% vs -2.33%).
    - Added practical institutional risk recommendations for commodity portfolios and trading desks.
  - Passed all 234 unit tests across all 14 test suites.

---

## 📅 [2026-09-05] — Patch v1.7.1: Dedicated Brent Oil 3D Studio (#2) & 10-Project Catalog Split
- **Commit**: `8326ace`
- **Components**: `content/projects/brent-oil-3d-volatility-manifold.md`, `app/projects/brent-oil-3d-volatility-manifold/page.tsx`, `app/projects/brent-oil-market-dynamics/page.tsx`, `app/projects/[slug]/page.tsx`, `content/projects/*.md`, `lib/*.test.ts`
- **Changes**:
  - Split 3D Volatility Manifold into its own standalone, dedicated case study at **Project #2** (`/projects/brent-oil-3d-volatility-manifold/`), focusing 100% on the interactive 3D tensor surface, orbit physics, and crisis beacons without distracting 2D charts.
  - Restored **Project #6** (`/projects/brent-oil-market-dynamics/`) as the comprehensive 2D econometric study with time series exploration, Markov regime switching, and Value-at-Risk distribution charts.
  - Implemented bidirectional quick-jump discovery banners between Project #2 (3D) and Project #6 (2D).
  - Re-indexed all 10 portfolio projects sequentially (1 through 10), maintaining full compliance with `.agents/rules/case-study-readability.md`.
  - Updated all 234 unit tests across `content.test.ts`, `final-static-integrity.test.ts`, `interactive-stress.test.ts`, and `project-sneak-peek.test.ts` (100% pass rate).
  - Verified clean Next.js 15 SSG production build across all 32 static pages.

---

## 📅 [2026-09-05] — Patch v1.7.0: Brent Oil 3D Volatility Manifold & Project #2 Elevation
- **Commit**: `850ad78`
- **Components**: `components/BrentOil3DManifold.tsx`, `app/projects/brent-oil-market-dynamics/page.tsx`, `app/projects/[slug]/page.tsx`, `content/projects/*.md`, `lib/interactive-stress.test.ts`, `lib/final-static-integrity.test.ts`
- **Changes**:
  - Engineered zero-dependency Native HTML5 Canvas 3D Interactive Engine rendering the **3D Volatility & Crisis Manifold (Terrain Surface)** across 35.5 years (1987–2024), 9,011 trading days, and 7 geopolitical shock beacons.
  - Implemented 360° orbit drag, mouse wheel/pinch zoom, Painter's depth sorting, elevation color ramps (Cyan ➔ Amber ➔ Crimson), and 3 camera presets (`3D Orbit`, `Top-Down Heatmap`, `Fat-Tail Profile`).
  - Created standalone dedicated route: `app/projects/brent-oil-market-dynamics/page.tsx` with customized telemetry strip (35.5Y, 9,011 Days, \$9.10–\$143.95 spread, 45.43 Kurtosis, -7.12% VaR).
  - Promoted Brent Crude Oil Market Dynamics to **Project #2** in the portfolio catalog, updating orders across all 9 project files.
  - Expanded test suite to 234/234 passing tests verifying 3D crisis pins and dedicated route integrity.

---

## 📅 [2026-09-03] — Patch v1.6.7: Minimalist Refinement of Career Timeline
- **Commit**: `a28024a`
- **Components**: `content/timeline.md`, `components/TimelineExplorer.tsx`, `app/interactive.css`
- **Changes**:
  - Streamlined Section 06 (*Where I've Been — A Career in Motion*) to a minimalist, uncluttered layout per user direction.
  - Stripped out heavy callout boxes, status badges, secondary tags, and extra links, returning to the sleek Obsidian typography.
  - Kept all rows collapsed by default with lean, punchy 1-sentence role summaries and concise focus details.

---

## 📅 [2026-09-03] — Patch v1.6.6: Career Timeline & System Trajectory Overhaul
- **Commit**: `9e2ca58`
- **Components**: `content/timeline.md`, `components/TimelineExplorer.tsx`, `app/interactive.css`
- **Changes**:
  - Overhauled Section 06 (*Where I've Been — A Career in Motion*) from 2 generic placeholders into a concrete 3-phase professional trajectory:
    1. **Lead Data & Systems Analyst (2024 — PRESENT)**: PT. Depoguna Bangunan Online (DBO Group) financial reconciliation automation (1 week to 1 day) and 6-model ML SKU mapping (95.4% precision across DBC Group brands).
    2. **Applied Data Science & Machine Learning Practitioner (2023 — 2024)**: DataCamp Certified Data Analyst Associate, 3 Komdigi SKKNI national certifications (100.00/100.00 exam score), 8-point SQL anti-fraud surveillance, and Brent oil risk modeling.
    3. **Systems Automation & Desktop Software Developer (2022 — 2023)**: Python desktop software (CustomTkinter, ReportLab) generating 500 print-grade 300-DPI certificates in 24.8s (20.2 certs/sec) with zero layout drift.
  - Set active role (`index === 0`) to open by default (`open={index === 0 ? true : undefined}`) so visitors immediately see rich achievements upon scrolling.
  - Added real-time glowing pulse badge (`● CURRENT`) for active roles and direct link to case studies (`INSPECT CASE STUDIES ↓`).
  - Adjusted summary column grid widths (150px) to comfortably fit multi-character year ranges without wrapping.

---

## 📅 [2026-09-03] — Patch v1.6.5: Streamline Homepage — Remove Clinical Survival Matrix Section
- **Commit**: `ac86c3c`
- **Components**: `app/page.tsx`
- **Changes**:
  - Removed Section 05.2 (`DataPlaygroundPart2` — *Global Benchmarks & Clinical Survival Matrix*) from the homepage per user directive.
  - Retained Section 05.1 (`DataPlayground` — *Global Cancer Epidemiology & Trends*) and the full dedicated case study at `/projects/global-cancer-epidemiology-surveillance/`.
  - Decreased homepage JS payload from 9.81 kB to 6.62 kB while keeping all 232 test cases and 31 static routes passing 100%.

---

## 📅 [2026-09-03] — Patch v1.6.4: Universal Project Readability Standard & Architecture Flow Standardization
- **Commit**: `1434277`
- **Components**: `content/projects/*.md`
- **Changes**:
  - Conducted systematic QA audit across all 9 project case studies against the 5 Readability Invariants (`case-study-readability.md`).
  - Standardized dynamic Mermaid architecture flowcharts across all projects, upgrading previous ASCII box drawings in Amazon Product Intelligence, ML Product Mapping, Revenue Reconciliation, Certificate Generator, Cancer Surveillance, and Olist Logistics.
  - Added proactive vs reactive pipeline flow to Banking Transaction Anti-Fraud and parcelamento elasticity flow to Olist Payment Analytics.
  - Sanitized currency dollar signs and mathematical ranges across frontmatter and body copy for 100% clean LaTeX KaTeX rendering.
  - All 9 projects now achieve 100% compliance across Executive Callouts, Numbered Descriptive Headings, Markdown Tables, Mermaid Flows, and Escaped Currency.

---

## 📅 [2026-09-03] — Patch v1.6.3: SEO, Crawler Metadata, PWA Manifest & Full LLMS Specification Overhaul
- **Commit**: `1ae6fb8`
- **Components**: `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `public/llms.txt`
- **Changes**:
  - Expanded `sitemap.xml` dynamic generator to index all core landing pages, 9 project case studies, 7 certification tracks, and 4 opinion essays (23 canonical indexed URLs with priority and changeFrequency tuning).
  - Upgraded `robots.txt` with explicit AI crawler permissions (GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, Google-Extended), admin route isolation (`disallow: ["/admin", "/admin/"]`), canonical Host, and Sitemap reference.
  - Enhanced `manifest.webmanifest` PWA metadata with app shortcuts (Selected Work, Certifications, Opinions), high-resolution icons (180px Apple touch, 512px SVG), and portrait display mode.
  - Overhauled `llms.txt` following standard LLMS.txt specification, incorporating all 9 projects, 7 certifications with IDs/URLs, 4 technical essays, and author contact provenance.

---

## 📅 [2026-09-02] — Patch v1.6.2: Restrict Footer Widget Exclusively to Active Ongoing Cohorts
- **Commit**: `a5a2fe7`
- **Components**: `components/SiteFooter.tsx`
- **Changes**:
  - Reconfigured the footer widget to strictly feature active in-progress cohorts (`AWS AI Academy 2026`), preserving the footer as an exclusive telemetry strip for ongoing studies.
  - Retained all completed/verified certifications in the primary catalog at `/learning/` with direct cross-navigation from the popover footer.

---

## 📅 [2026-09-02] — Patch v1.6.1: Footer Popover Multi-Track Synchronization & Badge Header Overhaul
- **Commit**: `1400957`
- **Components**: `components/SiteFooter.tsx`, `app/interactive.css`
- **Changes**:
  - Updated footer popover header to display `CERTIFICATIONS & ACADEMIES (7 TRACKS)`.
  - Fixed merged text glitch (`DATACAMP DATA ANALYST ASSOCIATE100%`) by implementing flex spacing, dedicated `.track-group-status` pill badges, and separated header layouts.
  - Added multi-track syllabus modules for Komdigi DTS, DQLab, DataCamp, and AWS into the interactive hover accordion.

---

## 📅 [2026-09-02] — Patch v1.6.0: Comprehensive Certification Catalog Expansion (7 Tracks & Multi-Authority Kredensial)
- **Commit**: `e5a2545`
- **Components**:
  - `content/learning/datacamp-data-analyst-associate.md` (Updated to 100% Certified & Verified)
  - `content/learning/komdigi-project-management-fundamental.md` (New 100% Verified Track)
  - `content/learning/komdigi-associate-data-scientist.md` (New SKKNI BNSP 12-Unit Track)
  - `content/learning/komdigi-data-scientist-supervisor.md` (New SKKNI BNSP 20 JP Track)
  - `content/learning/komdigi-data-scientist-nasional.md` (New SKKNI 299/2020 100.00% Score Track)
  - `content/learning/dqlab-data-science-ai-foundations.md` (New 5 Verified DQLab Credentials Track)
  - `components/SiteFooter.tsx`, `public/certificates/*.pdf`, `lib/learning.test.ts`
- **Changes**:
  - Expanded catalog from 2 tracks to **7 comprehensive learning and credential tracks** across DataCamp, Komdigi DTS (SKKNI BNSP), DQLab, and AWS.
  - Linked official PDF certificate assets in `public/certificates/` for direct stakeholder download.
  - Updated footer telemetry and ongoing credential strip with 100% verified progress.
  - All 232 test cases and Next.js 31-page static builds passed 100%.

---

## 📅 [2026-08-31] — Patch v1.5.6: Balanced Equal-Height Layout for Skill Matrix & Evidence Console
- **Components**: `app/globals.css`, `components/SkillMatrix.tsx`
- **Changes**:
  - Implemented 1:1 vertical symmetry between the left skill groups and right evidence console (`min-height: 480px`, `align-self: stretch`).
  - Added inner flexible scrollpane (`flex: 1`, `min-height: 0`) ensuring consistent card proportions regardless of item count (2 vs 9 items).
  - Fine-tuned row heights and category badges for zero-jitter selection transitions.

---

## 📅 [2026-08-31] — Patch v1.5.5: Unified High-Density Card & Purged Legacy CSS Override for Skill Matrix
- **Components**: `app/interactive.css`, `app/globals.css`, `components/SkillMatrix.tsx`
- **Changes**:
  - Purged conflicting legacy `.skill-evidence` CSS rules from `app/interactive.css` that were overriding modern styles.
  - Upgraded right-side evidence container into `.skill-evidence-card` featuring obsidian topbar telemetry (`EVIDENCE / PYTHON — 09 SYSTEMS`), high-density row cells with category tags (`Healthcare Analytics`, `Fintech`, etc.), numbered prefix chips (`01.`, `02.`), and a bounded smooth-scroll pane (`max-height: 380px`).
  - Added bottom instruction bar (`Click to open technical case study ↗`).

---

## 📅 [2026-08-31] — Patch v1.5.4: Compact High-Density Skill Evidence Box with Sticky Viewport Scroll
- **Components**: `components/SkillMatrix.tsx`, `app/globals.css`
- **Changes**:
  - Restructured `.skill-evidence` into a compact, fixed-height (`max-height: 480px`) container with smooth custom scrollbar and `sticky: top: 90px`.
  - Added header badge count (`EVIDENCE / PYTHON — 09 SYSTEMS`) and numbered index indicators (`01.`, `02.`, etc.).
  - Reduced item height and padding, eliminating long vertical page expansion when multiple evidence items are linked.

---

## 📅 [2026-08-31] — Patch v1.5.3: Capability Evidence Synchronization & Project Ordering Normalization
- **Components**: `content/skills.md`, `content/projects/*.md`
- **Changes**:
  - Synced all 9 project case studies into `content/skills.md` (`Python`, `Power BI`, `SQL`, `Predictive Analytics`, `Scikit-learn`, `Data Quality`, `Automation Design`), resolving unlinked evidence cards in the Skill Matrix (`#skills`).
  - Standardized sequential 1-to-9 project ordering across all case study frontmatters (`banking-transaction-anti-fraud` #1, `global-cancer-epidemiology-surveillance` #2, `olist-e-commerce-logistics-analysis` #3, `olist-payment-behavior-analytics` #4, `brent-oil-market-dynamics` #5, `amazon-product-intelligence` #6, `ml-product-mapping-system` #7, `revenue-reconciliation-automation` #8, `certificate-generator-desktop-app` #9).
  - All 232 test cases and static typechecks passed 100%.

---

## 📅 [2026-08-31] — Patch v1.5.2: Footer Streamlining & Redundancy Removal
- **Commit**: `bd656c3`
- **Component**: `components/SiteFooter.tsx`
- **Changes**:
  - Removed static `BACK TO TOP ↑` text link from footer meta row.
  - Retained `FloatingBackToTop` (`Top ↑`) floating button as the single source of truth for viewport return navigation.
  - Eliminated visual overlap and redundancy in the footer section.

---

## 📅 [2026-08-31] — Patch v1.5.1: CV Download Trigger Eye-Catcher
- **Commit**: `39f25dc`
- **Components**: `components/SiteHeader.tsx`, `app/globals.css`
- **Changes**:
  - Added live pulsing emerald green dot (`.cv-live-dot`) next to the `CV` button in navbar.
  - Implemented subtle glowing green border animation (`cv-border-pulse`) to catch user attention.
  - Maintained instant 2-item download popover (`English EN` & `Indonesia ID`).

---

## 📅 [2026-08-31] — Patch v1.5.0: Standardisation of Monochrome Catalogs & Navigation Overhaul
- **Commit**: `c0d2e4f`
- **Components**:
  - `app/learning/page.tsx`, `app/learning/[slug]/page.tsx`
  - `app/opinion/page.tsx`, `components/OpinionExplorer.tsx`
  - `components/SiteHeader.tsx`, `app/certifications/page.tsx`
  - `app/globals.css`, `.agents/rules/certification-catalog-standards.md`
  - `HANDOFF-2026-08-31.md`, `NOTES.md`
- **Changes**:
  - **Certification Catalog (`/learning/`)**: Rebuilt landing page into a **Compact Monochrome Data Table** with telemetry stats (`TRACKS`, `ACTIVE COHORTS`, `TOTAL MODULES`, `STANDARDS`).
  - **Opinion Explorer (`/opinion/`)**: Converted into an ultra-minimalist Compact Monochrome Data Table, removing bulky cover images.
  - **Navbar Refinement**:
    - Renamed `01 CASE STUDIES` ➔ `01 PROJECTS`.
    - Removed `02 INTERACTIVE LABS` from `PORTFOLIO ▾`.
    - Renamed `02 OPINIONS & ESSAYS` ➔ `02 OPINION`.
    - Removed `03 CAREER TIMELINE` from `RESOURCES ▾`.
    - Added right-flyout submenu for `03 CURRICULUM VITAE ▸` (`ENGLISH (EN) ↓` & `INDONESIA (ID) ↓`).
    - Removed duplicate standalone `OPINION` link from top-level navbar.
  - **Route Aliasing**: Added `/certifications/` automatic permanent redirect to `/learning/`.
  - **Standards & Handover**: Codified `.agents/rules/certification-catalog-standards.md` and created dated `HANDOFF-2026-08-31.md`.

---

## 📅 [2026-08-30] — Patch v1.4.0: Interactive Revenue Reconciliation Showcase
- **Commit**: `8ec491b`
- **Component**: `components/RevenueReconciliationShowcase.tsx`, `content/projects/revenue-reconciliation-automation.md`
- **Changes**:
  - Built interactive 4-tier discrepancy visual reconciliation pipeline (Exact Match, Timestamp Drift, Gateway Fee Discrepancy, Unreconciled Orphan).
  - Added interactive filtering, search, and instant Excel export preview inspector.

---

## 📅 [2026-08-30] — Patch v1.3.0: Amazon Product Intelligence NLP Suite
- **Commit**: `7564634`
- **Components**: `components/AmazonProductDashboard.tsx`, `content/projects/amazon-product-intelligence.md`
- **Changes**:
  - Implemented 1-click NLP review preset analyzer (`runInference`).
  - Added filter chips, confusion matrix inspection, and sortable product dataset explorer.

---

## 📅 [2026-08-30] — Patch v1.2.0: Case Study Readability & Standards Sweep
- **Commit**: `3fe5b66`
- **Rule**: `.agents/rules/case-study-readability.md`
- **Changes**:
  - Overhauled all 9 portfolio project markdown files with executive summaries (`> [!NOTE]`), numbered headings (`## 01. ...`), aligned tables, KaTeX math formatting, and escaped currency symbols.

---

## 📅 [2026-08-27] — Patch v1.1.0: DataCamp Data Analyst Associate Integration
- **Commit**: `36ec685`
- **Content**: `content/learning/datacamp-data-analyst-associate.md`
- **Changes**:
  - Added structured syllabus and certification track for DataCamp DAA (Timed SQL assessments, EDA, Business Exam).

---

## 📅 [2026-08-25] — Patch v1.0.0: Banking Transaction Anti-Fraud Suite
- **Commit**: `9e91345`
- **Component**: `components/AntiFraudShowcase.tsx`, `content/projects/banking-transaction-anti-fraud.md`
- **Changes**:
  - Delivered 6 interactive fraud detection dashboards with Isolation Forest anomaly scoring and live transaction inspection.
