# 📜 PATCH NOTES & CHANGELOG LOGBOOK

> **Standard Operating Rule**: Always append new patch entries to this document chronologically with date, commit hash, files modified, and technical breakdown of changes.

---

## 📅 [2026-09-05] — Patch v1.7.8: Interactive Zoom In/Out Controls & Magnification Telemetry
- **Commit**: `c298b5d`
- **Components**: `components/BankingFraud3DGraph.tsx`, `components/BrentOil3DManifold.tsx`
- **Changes**:
  - **Zoom In / Zoom Out Controls for Banking 3D Graph (`BankingFraud3DGraph.tsx`)**:
    - Engineered dual zoom interaction paradigms:
      1. High-contrast Cyberpunk HUD toolbar pill with `+ ZOOM IN` and `− ZOOM OUT` buttons flanking a real-time magnification percentage indicator (`Math.round((580 / camera.dist) * 100)%`).
      2. Floating vertical quick-zoom widget (`+` / `−`) anchored on the right canvas margin with glowing neon border, backdrop blur, and hover elevations for rapid, single-click adjustments.
    - Calibrated smooth step intervals ($\Delta d = \pm 75$) constrained within physical bounds ($[180, 1100]$).
    - Hardened click raycasting hit testing using `rect.width / 2` and `rect.height / 2` for sub-pixel accuracy across varied device pixel ratios (DPR 1.0, 1.25, 1.5, 2.0).
  - **Feature Parity for Brent Oil 3D Volatility Manifold (`BrentOil3DManifold.tsx`)**:
    - Added matching `+ ZOOM IN` / `− ZOOM OUT` pill with magnification telemetry to top toolbar and floating quick-zoom widget to right canvas margin.
    - Bound zoom steps ($\Delta z = \pm 0.15$) constrained within $[0.6, 2.5]$, automatically pausing auto-rotation on user engagement.
  - **Verification**:
    - 238/238 passing unit tests across 15 test suites.
    - 33/33 static routes successfully compiled and exported.
    - Both 3D studios verified live on dev server with active zoom controls.

---

## 📅 [2026-09-05] — Patch v1.7.7: 3D Financial Crime Graph & Money Mule Syndicate Studio Launch (#11)
- **Commit**: `2328e68`
- **Components**: `lib/anti-fraud-graph.ts`, `lib/anti-fraud-graph.test.ts`, `components/BankingFraud3DGraph.tsx`, `components/BankingFraud3DToc.tsx`, `app/projects/banking-fraud-3d-network-intelligence/page.tsx`, `content/projects/banking-fraud-3d-network-intelligence.md`, `app/projects/banking-transaction-anti-fraud/page.tsx`, `app/projects/[slug]/page.tsx`, `lib/content.test.ts`, `lib/project-sneak-peek.test.ts`, `lib/interactive-stress.test.ts`, `lib/final-static-integrity.test.ts`
- **Changes**:
  - **3D Financial Crime Knowledge Graph Engine (`lib/anti-fraud-graph.ts`)**:
    - Synthesized 2,512 historical transaction logs across 495 accounts, shared devices, and cash-out endpoints into a directed multigraph $G = (\mathcal{V}, \mathcal{E})$.
    - Modeled 3D Coulomb-Hooke equilibrium physics with simulated annealing to cluster high-risk entities organically into dense crime rings while dissipating legitimate nodes into outer space.
    - Implemented high-performance in-memory graph traversal (`get1HopNeighbors` and `get2HopNeighbors`) delivering sub-15ms neighborhood expansion.
  - **Interactive 60 FPS Native Canvas 3D Studio (`components/BankingFraud3DGraph.tsx`)**:
    - Zero-dependency HTML5 2D Canvas rendering engine computing 3-stage Euler matrix transformations (yaw azimuth $\theta$, pitch elevation $\phi$, focal perspective $f=720$).
    - Interactive 360° mouse drag orbit, mouse wheel zoom, click-to-focus on syndicates, and raycasting node selection with dynamic hit testing.
    - Real-time animated neon laser fund flow particles with velocity-proportional speeds and multi-flag anomaly coloration.
    - Foreground 1-hop and 2-hop neighborhood expansion with 90% background node dimming to eliminate investigator cognitive overload.
    - Holographic HUD overlay featuring active telemetry, instant camera reset, syndicate jumps, and forensic account dossier inspector.
  - **Dedicated Table of Contents & Navigation (`components/BankingFraud3DToc.tsx`)**:
    - Engineered custom 9-section TOC: `01 Studio`, `02 Pipeline`, `03 Coulomb-Hooke`, `04 Syndicates`, `05 Projection`, `06 Diagnostics`, `07 Evidence`, `08 Impact`, `09 Lessons`.
    - Integrated smooth scroll-spy with top-scroll guard and active section highlighting.
  - **Bi-Directional Case Study Integration & Navigation**:
    - Created dedicated route `/projects/banking-fraud-3d-network-intelligence/` with static export configuration (`dynamicParams = false`).
    - Added high-contrast cyber cross-link banners between the 2D SQL Suite (`/projects/banking-transaction-anti-fraud/`) and this new 3D Graph Studio.
    - Normalized portfolio ordering with `order: 11` for the 3D studio, maintaining project order integrity across all 11 portfolio case studies.
  - **Comprehensive Case Study Markdown (`content/projects/banking-fraud-3d-network-intelligence.md`)**:
    - Fully compliant with `.agents/rules/case-study-readability.md`: executive note callout, 4-column structured matrix tables, KaTeX math formulations, ASCII pipeline diagram, and 3 ground-truth criminal syndicates (Ring Alpha: Rapid Balance Drain Mule Funnel, Ring Beta: Device Farm Credential Stuffing, Ring Gamma: Metropolitan ATM Funnel).
  - **Automated Verification & Integrity Hardening**:
    - 238/238 passing unit tests across 15 suites (+4 new graph unit tests).
    - 33/33 static routes successfully compiled and exported in Next.js production build.
    - All 11 project HTML and `index.txt` files verified in `out/projects/`.

---

## 📅 [2026-09-05] — Patch v1.7.6: Cyberpunk Pipeline Diagram Engine & Mathematical Showcase Redesign
- **Commit**: `b1783ac`
- **Components**: `app/interactive.css`, `components/MarkdownBody.tsx`, `content/projects/brent-oil-3d-volatility-manifold.md`, `content/projects/brent-oil-market-dynamics.md`
- **Changes**:
  - **Elevated Pipeline Flowchart Diagram Engine (`app/interactive.css`)**:
    - Replaced rigid 7-column CSS grid with flexible, responsive flexbox layout (`display: flex; align-items: stretch; gap: 8px`), supporting arbitrary step counts (3, 4, 5+ steps) with uniform card heights and clean mobile stacking.
    - Upgraded typography and legibility: boosted `.step-title` from 9.5px to 12.5px bold `#ffffff`, `.step-desc` from unreadable 7.5px to 11px muted `#94a3b8` (line-height 1.45), and `.step-num` to 10px bold cyan.
    - Enhanced card aesthetics with obsidian cyberpunk theme: gradient background `linear-gradient(180deg, var(--panel) 0%, rgba(10, 12, 18, 0.96) 100%)`, cyan border `1px solid rgba(0, 240, 255, 0.2)`, neon glowing arrows, and hover elevations.
    - Added dedicated `.pipeline-lane-card.neutral`, `.lane-type-badge.neutral`, and `.final-node.neutral` cyan accents.
  - **Dynamic Diagram Badges & Parser Hardening (`components/MarkdownBody.tsx`)**:
    - Made top badge dynamic: displays `ARCHITECTURAL PARADIGM COMPARISON • FLOW DIAGRAM` for comparative lanes and `SYSTEM ARCHITECTURE • EXECUTION PIPELINE FLOW` for pipeline flows.
    - Replaced generic `"FLOW"` badge with high-contrast `"⚡ PIPELINE ARCHITECTURE"`.
    - Prioritized step detection before title matching, resolving a silent parser bug where descriptive keywords (such as "legacy") inside step nodes aborted step splitting.
    - Elevated mathematical formula cards with pulsing cyan status dots, inset high-contrast terminal styling, and responsive KaTeX-scale typography.
  - **Case Study Presentation Polish (`content/projects/`)**:
    - Enriched Section 01 Landscape Component table in `brent-oil-3d-volatility-manifold.md` with high-visibility color-coded badges (`0.0% Central Ridge ⚖️`, `+8% to +12% Spires ▲`, `-7% to -14% Chasms ▼`).
    - Stripped redundant number prefixes from step titles across 3D and 2D oil case studies, preventing duplicate `01 01.` badges.
  - **Verification**:
    - 234/234 passing unit tests across all 14 test suites.
    - 32/32 static routes prerendered cleanly in Next.js production build.
    - Both 3D Manifold and 2D Econometrics diagrams verified live on dev server.

---

## 📅 [2026-09-05] — Patch v1.7.5: Brent Oil 2D Dedicated TOC & Navigation Parity
- **Commit**: `887059d`
- **Components**: `components/BrentOilMarketDynamicsToc.tsx`, `components/CaseStudyToc.tsx`, `app/projects/brent-oil-market-dynamics/page.tsx`, `content/projects/brent-oil-market-dynamics.md`
- **Changes**:
  - **Dedicated Table of Contents (`BrentOilMarketDynamicsToc.tsx`)**:
    - Replaced the outdated generic `CaseStudyToc` (`01 Problem, 02 Data, 03 Approach, 04 System, 05 Impact, 06 Lessons`) with a custom 9-section TOC matching the real econometrics study: `01 Pipeline`, `02 Explorer`, `03 Regimes`, `04 Tail Risk`, `05 Telemetry`, `06 Shocks`, `07 Power BI`, `08 Impact`, `09 Lessons`.
    - Bound all 9 sections to exact DOM IDs (`#pipeline`, `#explorer`, `#regimes`, `#risk`, `#telemetry`, `#shocks`, `#powerbi`, `#impact`, `#lessons`), eliminating dead links.
    - Added top-scroll position guard (`window.scrollY < 120`) to prevent premature activation of `#impact`.
  - **Hardened Generic `CaseStudyToc.tsx`**:
    - Added DOM existence filtering on mount to only render links for elements present in the DOM.
    - Added top-scroll guard so fallback pages don't highlight lower sections prematurely.
  - **Page & Content Anchors**:
    - Wrapped `SystemDiagram`, `BrentOilInteractiveShowcase`, `BrentOilRegimesShowcase`, and `BrentOilRiskShowcase` in designated `<section>` blocks with matching IDs.
    - Added custom anchor IDs (`{#telemetry}`, `{#shocks}`, `{#powerbi}`) to `content/projects/brent-oil-market-dynamics.md`.
  - **Verification**:
    - 234/234 unit tests passing across all 14 test suites.
    - 32/32 static routes cleanly generated in Next.js production build.
    - Live server verified for both `/projects/brent-oil-market-dynamics/` and `/projects/brent-oil-3d-volatility-manifold/`.

---

## 📅 [2026-09-05] — Patch v1.7.4: 3D Camera Transformation Table & Mathematical Parser Refinement
- **Commit**: `03a966f`
- **Components**: `components/MarkdownBody.tsx`, `content/projects/brent-oil-3d-volatility-manifold.md`
- **Changes**:
  - **Section 03 3-Stage Coordinate Transformation Matrix Table**:
    - Replaced raw multi-line `\begin{aligned}` formula blocks in Section 03 with an intuitive 4-column structured matrix table (`Step`, `Transformation Stage`, `Mathematical Engine`, `Physical Camera & Screen Effect`).
    - Formatted Horizontal Yaw Orbit (Azimuth $\theta$), Vertical Pitch Centering (Elevation $\phi$), and Perspective Canvas Mapping ($f = 680$) with clean equations and multi-line `<br/>` breaks.
    - Formulated a single unified master projection equation: $P_{\text{screen}}(X_s, Y_s) = ( X_{\text{center}} + X_{\text{cam}} \cdot (f / Z_{\text{cam}}), \; Y_{\text{center}} - Y_{\text{cam}} \cdot (f / Z_{\text{cam}}) )$.
  - **Hardened Math & Table Rendering in `MarkdownBody.tsx`**:
    - Resolved nested fraction and subscript regex collisions, ensuring `\frac{f}{Z_{\text{cam}}}` parses cleanly to `(f / Z_cam)` without redundant double parentheses.
    - Added `<br/>` token rendering inside `formatInline`, enabling multi-equation table cells.
    - Prioritized summation token replacement before generic subscript unnesting, rendering `\sum_{k=1}^{7}` cleanly as `∑(k=1..7)`.
    - Added Unicode subscript conversion for `_s` to `ₛ` ($Xₛ$, $Yₛ$).
  - **Verification**:
    - 234/234 unit tests passing across all 14 test suites.
    - 32/32 static routes cleanly generated in Next.js production build.

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
