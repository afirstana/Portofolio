# 🛡️ HANDOFF MANUAL — 3D TRANSACTION ANOMALY FEATURE MANIFOLD & DECISION HYPERPLANE STUDIO

> **Document Type**: Master Technical Architecture & Operations Handoff  
> **Effective Date**: September 5, 2026 (2026-09-05 15:20:00 +07:00 WIB)  
> **System**: Abimael.Data Portfolio & Interactive Analytical Engine  
> **Case Study**: Banking Anti-Fraud — 3D Financial Crime Graph & Mule Network  
> **Route**: `/projects/banking-fraud-3d-network-intelligence/`  
> **Project Directory**: `C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project`  
> **Active Git Commit**: `2ccb0da` (Patch v1.7.9)  
> **Live Local Preview**: `http://localhost:3000/projects/banking-fraud-3d-network-intelligence/`  

---

## 01. EXECUTIVE SYSTEM OVERVIEW & ARCHITECTURAL PURPOSE

### 1.1 The Dual 3D Paradigm for Banking Anti-Fraud
In modern banking compliance and anti-money laundering (AML) operations, fraud investigators suffer from two distinct blind spots when using traditional 2D tabular SQL interfaces:
1. **Relational Blind Spot (Network Structure)**: Tabular logs hide multi-hop money mule funnels, shared device credential stuffing botnets, and geographic ATM cash-out rings.
   - *Solution*: **Studio 01: 3D Force-Directed Graph Studio** (`BankingFraud3DGraph.tsx`), mapping 495 accounts into a Coulomb-Hooke physics equilibrium ($G = (V, E)$).
2. **Latent Feature Space Blind Spot (Decision Boundaries)**: Traditional rules engines use fixed hardcoded cutoffs (e.g. `Amount > $10,000`), failing to capture non-linear interactions between transaction volume, diurnal timing, and multi-flag risk severity.
   - *Solution*: **Studio 02: 3D Transaction Anomaly Feature Manifold & Decision Hyperplane Studio** (`BankingFraud3DAnomalyManifold.tsx`), embedding all 2,512 transactions into Euclidean $\mathbb{R}^3$ space and slicing it with an interactive 3D Decision Hyperplane $\mathcal{H}(\tau)$.

---

## 02. MATHEMATICAL ARCHITECTURE & FORMULATIONS

### 2.1 Latent Feature Space Embedding in $\mathbb{R}^3$
Each of the 2,512 transactions $i$ generated from the deterministic banking dataset is mapped into a continuous 3D coordinate vector $\mathbf{x}_i = (x_i, y_i, z_i)^T \in \mathbb{R}^3$:

$$\mathbf{x}_i = \begin{pmatrix} x_i \\ y_i \\ z_i \end{pmatrix} = \begin{pmatrix} \text{Log-Scaled Monetary Amount: } \log_{10}(\text{Amount}_i) \\ \text{Diurnal Circadian Hour: } \text{Hour}_i \in [0, 24) \text{ UTC} \\ \text{Normalized Anomaly Severity: } \mathcal{R}_i = \frac{\text{RiskScore}_i}{6} \in [0.0, 1.0] \end{pmatrix}$$

#### Spatial Coordinate Mapping Rules:
- **$X$-Axis (Amount Volume)**: Normalizes $\log_{10}(\text{Amount}_i)$ across $[\log_{10}(20), \log_{10}(1920)] \approx [1.30, 3.28]$ and maps it to $[-240, 240]$ canvas pixels:
  $$x_i = \left(\frac{\log_{10}(\text{Amount}_i) - 1.30}{1.98} - 0.5\right) \times 480$$
- **$Y$-Axis (Diurnal Hour)**: Maps circadian hour $\text{Hour}_i \in [0.0, 24.0]$ to $[-200, 200]$ canvas pixels:
  $$y_i = \left(\frac{\text{Hour}_i}{24.0} - 0.5\right) \times 400$$
  - *Twilight Zone*: Transactions occurring between 01:00 and 04:00 UTC are flagged as anomalous odd-hour operations with a tinted floor shadow.
- **$Z$-Axis (Risk Severity Elevation)**: Maps discrete risk flags (0 to 6) to vertical elevation $[0, 240]$ pixels:
  $$z_i = \left(\frac{\text{RiskScore}_i}{6}\right) \times 240$$

---

### 2.2 Linear Anomaly Scoring Function & Dynamic Decision Hyperplane
To separate legitimate transactions from illicit operations, the studio implements a multi-variate composite scoring function $S(\mathbf{x}_i) \in [0.0, 1.0]$:

$$S(\mathbf{x}_i) = w_r \cdot \left(\frac{\text{RiskScore}_i}{6}\right) + w_a \cdot \left(\frac{\log_{10}(\text{Amount}_i) - 1.30}{1.98}\right) + w_t \cdot \mathbb{I}(\text{Hour}_i \in [1, 4])$$

Where weights are empirically calibrated to:
- $w_r = 0.45$ (Multi-flag risk severity)
- $w_a = 0.35$ (Monetary volume exposure)
- $w_t = 0.20$ (Circadian odd-hour twilight indicator)

#### Dynamic 3D Decision Hyperplane $\mathcal{H}(\tau)$:
An adjustable decision threshold $\tau \in [0.10, 0.85]$ (default $\tau = 0.45$) defines a planar surface in $\mathbb{R}^3$:

$$\mathcal{H}(\tau) = \{ \mathbf{x} \in \mathbb{R}^3 \mid S(\mathbf{x}) = \tau \}$$

$$\text{Classification}(\mathbf{x}_i) = \begin{cases} \text{BLOCKED ANOMALY } (\text{Crimson } \#f43f5e), & \text{if } S(\mathbf{x}_i) \ge \tau \\ \text{APPROVED TRANSACTION } (\text{Cyan } \#00f0ff), & \text{if } S(\mathbf{x}_i) < \tau \end{cases}$$

---

### 2.3 Live Confusion Matrix & Financial Exposure Telemetry
Every time the user drags the threshold slider $\tau$, the engine performs an in-memory pass over all 2,512 transactions, evaluating performance against ground-truth flags ($\text{isFlagged} \iff \text{RiskScore}_i \ge 2$):

| Confusion Metric | Mathematical Definition | Financial Compliance Meaning |
|---|---|---|
| **True Positives (TP)** | $\sum \mathbb{I}(S_i \ge \tau \land \text{isFlagged}_i)$ | Illicit transactions successfully intercepted. |
| **False Positives (FP)** | $\sum \mathbb{I}(S_i \ge \tau \land \neg\text{isFlagged}_i)$ | False alarms causing customer checkout friction. |
| **False Negatives (FN)** | $\sum \mathbb{I}(S_i < \tau \land \text{isFlagged}_i)$ | Undetected fraud slipping through to settlement. |
| **True Negatives (TN)** | $\sum \mathbb{I}(S_i < \tau \land \neg\text{isFlagged}_i)$ | Normal transactions cleared without friction. |
| **Precision** | $\frac{\text{TP}}{\text{TP} + \text{FP}}$ | Accuracy of triggered fraud blocks. |
| **Recall (Sensitivity)** | $\frac{\text{TP}}{\text{TP} + \text{FN}}$ | Coverage rate of total criminal volume captured. |
| **F1 Score** | $2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$ | Harmonic mean balancing detection vs friction. |
| **Blocked Illicit Capital** | $\sum_{i \in \text{TP}} \text{Amount}_i$ | Total monetary value preserved from fraud loss. |
| **False Alarm Capital** | $\sum_{i \in \text{FP}} \text{Amount}_i$ | Interrupted legitimate commercial volume. |

---

## 03. COMPONENT IMPLEMENTATION & RENDERING ENGINE

### 3.1 Architecture of `components/BankingFraud3DAnomalyManifold.tsx`
- **Total Lines**: 1,083 lines of strictly typed TypeScript / React 19.
- **Rendering Technology**: Zero-dependency Native HTML5 2D Canvas context (`canvas.getContext("2d")`).
- **Performance**: 60 FPS sustained rendering, $<15\text{ kB}$ total component footprint (zero Three.js or WebGL overhead).

### 3.2 3D Perspective Projection Pipeline
The camera pipeline converts each point $\mathbf{x} = (x, y, z)$ into screen pixels $(X_s, Y_s)$ via an upright Euler orbit transformation:
1. **Target-Relative Centering**:
   $$\Delta x = x - x_{\text{tgt}}, \quad \Delta y = y - y_{\text{tgt}}, \quad \Delta z = z - z_{\text{tgt}}$$
2. **Yaw Azimuth Orbit ($\theta$)**:
   $$x_1 = \Delta x \cos\theta - \Delta y \sin\theta, \quad y_1 = \Delta x \sin\theta + \Delta y \cos\theta$$
3. **Pitch Elevation Tilt ($\phi$)**:
   $$y_2 = y_1 \cos\phi - \Delta z \sin\phi, \quad z_2 = y_1 \sin\phi + \Delta z \cos\phi$$
4. **Focal Perspective Mapping ($f = 720, d_{\text{cam}} = 580$)**:
   $$\text{depth} = d_{\text{cam}} + z_2, \quad \text{scale} = \frac{f}{\text{depth}}$$
   $$X_s = X_{\text{center}} + x_1 \cdot \text{scale}, \quad Y_s = Y_{\text{center}} - y_2 \cdot \text{scale}$$

### 3.3 Visual & Interactive Elements
- **3D Bounding Box**: Wireframe box with axis ticks, labels, and floor grid.
- **Twilight Zone Floor**: Shaded amber region marking the critical $01:00\text{--}04:00\text{ UTC}$ window.
- **Hyperplane Mesh**: Dynamic 3D quad lattice slicing through the cloud with translucent crimson wash (`rgba(244, 63, 94, 0.15)`) and perimeter glow.
- **Depth-Sorted Particles**: Painter's algorithm sorts all 2,512 points back-to-front by depth, ensuring accurate visual occlusion.
- **Interactive Controls**:
  - **Threshold Slider**: Real-time evaluation of $\tau \in [0.10, 0.85]$.
  - **Category Filter Pills**: `ALL`, `HIGH AMOUNT`, `ODD HOURS`, `RAPID VELOCITY`, `BALANCE DRAIN`, `FAILED LOGINS`.
  - **Dual Zoom Controls**: Top HUD pill (`+ ZOOM IN`, `− ZOOM OUT` with magnification %) + Floating quick-zoom widget on right canvas margin.
  - **3 Camera View Presets**:
    - `3D ISOMETRIC`: Default perspective view ($\theta = 45^\circ, \phi = 25^\circ$).
    - `DIURNAL TIME PROFILE`: Side elevation looking along diurnal hours ($\theta = 90^\circ, \phi = 5^\circ$).
    - `TOP-DOWN DENSITY MAP`: Birds-eye view of Amount vs Hour ($\theta = 0^\circ, \phi = 89^\circ$).
  - **Raycasting Transaction Inspector**: Sub-pixel hit testing with click/hover activation, rendering a complete transaction dossier with risk flag breakdown.

---

## 04. INTEGRATION & FILE MANIFEST

### 4.1 Modified & Added Files

```text
PORTOFOLIO/01. Vercel/project/
├── components/
│   ├── BankingFraud3DAnomalyManifold.tsx   # [NEW] 3D Feature Manifold & Decision Hyperplane Studio (1,083 lines)
│   ├── BankingFraud3DGraph.tsx             # [UPDATED] Studio 01 Force-Directed Graph with zoom controls
│   ├── BankingFraud3DToc.tsx               # [UPDATED] Re-indexed to 11 sections with #anomaly-manifold & #feature-space
│   └── AmazonCaseStudyToc.tsx              # [UPDATED] Cleaned up legacy anchor references (100% valid TOC)
├── app/projects/banking-fraud-3d-network-intelligence/
│   └── page.tsx                            # [UPDATED] Section 02 mounting <BankingFraud3DAnomalyManifold />
├── content/projects/
│   └── banking-fraud-3d-network-intelligence.md # [UPDATED] Added Section 04 Latent Feature Space formulation
└── PATCH_NOTES.md                          # [UPDATED] Documented Patch v1.7.9
```

---

## 05. QUALITY ASSURANCE & VERIFICATION SUITE

### 5.1 Automated Test Results
- **Vitest Unit Test Suite**: **238 / 238 tests passing (100%)** across 15 test suites:
  - `lib/anti-fraud.test.ts` (10 tests)
  - `lib/anti-fraud-graph.test.ts` (4 tests)
  - `lib/interactive-stress.test.ts` (22 tests)
  - `lib/final-static-integrity.test.ts` (5 tests)
  - `lib/butterflyPhysics.adversarial.test.ts` (17 tests)
  - `lib/butterflyStressHarness.test.ts` (22 tests)
  - `lib/butterflyTier5CoverageHardening.test.ts` (12 tests)
  - *Plus all other system and component suites.*

### 5.2 Next.js Production Build Validation
- **Status**: Clean compilation and static export (`out/`).
- **Total Static Pages**: **33 / 33 static routes** generated:
  ```text
  Route (app)
  ┌ ○ /
  ├ ○ /admin
  ├ ○ /learning
  ├ ● /learning/[slug] (7 paths)
  ├ ○ /opinion
  ├ ● /opinion/[slug] (4 paths)
  ├ ● /projects/[slug] (5 paths)
  ├ ○ /projects/amazon-product-intelligence
  ├ ○ /projects/banking-fraud-3d-network-intelligence  (11.7 kB, 134 kB first load)
  ├ ○ /projects/banking-transaction-anti-fraud
  ├ ○ /projects/brent-oil-3d-volatility-manifold
  ├ ○ /projects/brent-oil-market-dynamics
  └ ○ /projects/olist-payment-behavior-analytics
  ```

### 5.3 TOC Anchor Integrity Audit
- Audited across all 11 project case studies using `scratch/audit-project-tocs.mjs`:
  - **Result**: **87 / 87 TOC anchors valid (100%)**, zero missing DOM IDs.

### 5.4 Dev Server Health
- Dev server running on `http://localhost:3000`.
- All CSS and JS chunks return HTTP 200 with zero hydration mismatches.

---

## 06. GIT COMMIT STATUS & BACKUP BUNDLES

### 6.1 Git Repository Invariant
- **Branch**: `main`
- **Active Commit**: `2ccb0da` (`feat(anti-fraud): launch 3D transaction anomaly manifold & decision hyperplane studio (Patch v1.7.9)`)
- **Working Tree**: Clean (`nothing to commit, working tree clean`)
- **Strict Rule**: **NEVER execute `git push` autonomously**. All changes are committed locally and mirrored to backup bundles.

### 6.2 Backup Bundle Disk Mirrors
The full repository state has been packaged into Git bundles and mirrored across all 3 disk locations:
1. `c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\backup-portfolio-2026-09-05.bundle`
2. `c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\backup-portfolio-2026-09-05.bundle`
3. `c:\Users\HYPE AMD\Documents\FILE\PROJECT\backup-portfolio-2026-09-05.bundle`
4. Artifact directory: `C:\Users\HYPE AMD\.gemini\antigravity\brain\5c4f23a5-2b4e-4c7f-a3e1-8dade6306733\backup-portfolio-2026-09-05.bundle`

---

## 07. OPERATIONS GUIDE FOR FUTURE SESSIONS

### 7.1 Starting the Development Server
```powershell
cd "c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
npm.cmd run dev
```
Navigate to: `http://localhost:3000/projects/banking-fraud-3d-network-intelligence/`

### 7.2 Running Automated Tests
```powershell
cd "c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
npm.cmd test
```

### 7.3 Executing a Clean Production Build
> ⚠️ **CRITICAL CACHE RULE**: Always stop the dev server before running `next build`. Delete `.next` before restarting `next dev` to prevent chunk hash collisions.
```powershell
cd "c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm.cmd run build
```

---
*Manual compiled and verified on September 5, 2026 by Antigravity AI Pair Programmer.*
