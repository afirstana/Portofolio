# 🛡️ MASTER HANDOFF MANUAL — STANDALONE 3D TRANSACTION ANOMALY FEATURE MANIFOLD & DECISION HYPERPLANE (#12)

> **Document Type**: Master Technical Architecture & Operations Handoff  
> **Effective Date**: September 5, 2026 (2026-09-05 15:27:00 +07:00 WIB)  
> **System**: Abimael.Data Portfolio & Interactive Analytical Engine  
> **Case Study**: Banking Anti-Fraud — 3D Latent Feature Manifold & Decision Hyperplane  
> **Route**: `/projects/banking-fraud-3d-anomaly-manifold/` (Rank #12 in Catalog)  
> **Project Directory**: `C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project`  
> **Active Branch**: `main`  
> **Live Local Preview**: `http://localhost:3000/projects/banking-fraud-3d-anomaly-manifold/`  

---

## 01. THE 3-TIER BANKING ANTI-FRAUD SURVEILLANCE SUITE

With the launch of this dedicated standalone page, the portfolio features an interconnected **3-Tier Banking Anti-Fraud Surveillance Triad**:

```diagram
Lane: 3-Tier Banking Anti-Fraud Architecture
[PART 1: 2D SQL SUITE (#1) | Rule-Based Authorization & 6-Dashboard Power BI Suite]
         ↕ (Cross-Navigation Hub)
[PART 2: 3D GRAPH STUDIO (#11) | Force-Directed Crime Graph & Coordinated Mule Syndicates]
         ↕ (Cross-Navigation Hub)
[PART 3: 3D ANOMALY MANIFOLD (#12) | Latent Feature Embedding in R³ & Dynamic Decision Hyperplane]
```

| Tier & Catalog Rank | Case Study Route | Analytical Discipline | Core Technology & Interactive Artifact |
|---|---|---|---|
| **Tier 1 (Rank #1)** | `/projects/banking-transaction-anti-fraud/` | **Enterprise Business Operations** | PostgreSQL Window Functions, 6-Dashboard Power BI Suite, Real-Time Interactive SQL Query Sandbox. |
| **Tier 2 (Rank #11)** | `/projects/banking-fraud-3d-network-intelligence/` | **Relational Network Intelligence** | Native Canvas 3D Force-Directed Graph ($G = (V, E)$), Coulomb-Hooke physics, laser fund flow pulses, 3 isolated criminal syndicates. |
| **Tier 3 (Rank #12)** | `/projects/banking-fraud-3d-anomaly-manifold/` | **Machine Learning Feature Geometry** | 3D Latent Feature Space ($\mathbb{R}^3$), Dynamic 3D Decision Hyperplane $\mathcal{H}(\tau)$, Live Confusion Matrix optimization HUD. |

---

## 02. STANDALONE CASE STUDY MANIFEST & ARCHITECTURE

### 2.1 File & Directory Manifest
```text
PORTOFOLIO/01. Vercel/project/
├── app/projects/banking-fraud-3d-anomaly-manifold/
│   └── page.tsx                            # [NEW] Standalone Next.js Page with static export & 3-Tier Nav Hub
├── components/
│   ├── BankingFraud3DAnomalyManifold.tsx   # [FLAGSHIP] 1,083-line Native HTML5 2D Canvas 3D Engine
│   └── BankingFraud3DAnomalyToc.tsx        # [NEW] Dedicated 10-section Table of Contents with scroll-spy
├── content/projects/
│   └── banking-fraud-3d-anomaly-manifold.md # [NEW] Dedicated Case Study Markdown (order: 12)
├── app/projects/banking-fraud-3d-network-intelligence/
│   └── page.tsx                            # [UPDATED] Streamlined Graph page with Part 3 Launchcard
├── components/
│   └── BankingFraud3DToc.tsx               # [UPDATED] Streamlined 9-section TOC for Graph case study
├── content/projects/
│   └── banking-fraud-3d-network-intelligence.md # [UPDATED] Re-indexed sections (01 to 05)
└── app/projects/[slug]/
    └── page.tsx                            # [UPDATED] Excluded dedicated route from dynamic generation
```

---

## 03. MATHEMATICAL SPECIFICATIONS & FORMULATIONS

### 3.1 3D Latent Feature Vector Projection in $\mathbb{R}^3$
Each of the 2,512 transactions $i$ is mapped to continuous coordinates $\mathbf{x}_i \in \mathbb{R}^3$:

$$\mathbf{x}_i = \begin{pmatrix} x_i \\ y_i \\ z_i \end{pmatrix} = \begin{pmatrix} \text{Log-Scaled Monetary Amount: } \log_{10}(\text{Amount}_i) \\ \text{Diurnal Circadian Hour: } \text{Hour}_i \in [0, 24) \text{ UTC} \\ \text{Normalized Anomaly Severity: } \mathcal{R}_i = \frac{\text{RiskScore}_i}{6} \in [0.0, 1.0] \end{pmatrix}$$

#### Spatial Normalization:
- **Amount ($X$)**: Normalizes $\log_{10}(\text{Amount}_i) \in [\log_{10}(20), \log_{10}(1920)] \approx [1.30, 3.28]$ mapped to $[-240, 240]$ px:
  $$x_i = \left(\frac{\log_{10}(\text{Amount}_i) - 1.30}{1.98} - 0.5\right) \times 480$$
- **Hour ($Y$)**: Maps diurnal UTC hour $[0.0, 24.0]$ to $[-200, 200]$ px:
  $$y_i = \left(\frac{\text{Hour}_i}{24.0} - 0.5\right) \times 400$$
  - *Twilight Zone*: High-risk window ($01:00\text{--}04:00\text{ UTC}$) projected onto shaded amber floor grid.
- **Risk Severity ($Z$)**: Discrete risk flags (0 to 6) mapped to vertical elevation $[0, 240]$ px:
  $$z_i = \left(\frac{\text{RiskScore}_i}{6}\right) \times 240$$

---

### 3.2 Multi-Variate Linear Scoring Function & Decision Hyperplane $\mathcal{H}(\tau)$
The feature manifold is partitioned by an adjustable linear decision boundary:

$$S(\mathbf{x}_i) = 0.45 \cdot \left(\frac{\text{RiskScore}_i}{6}\right) + 0.35 \cdot \left(\frac{\log_{10}(\text{Amount}_i) - 1.30}{1.98}\right) + 0.20 \cdot \mathbb{I}(\text{Hour}_i \in [1, 4])$$

$$\mathcal{H}(\tau) = \{ \mathbf{x} \in \mathbb{R}^3 \mid S(\mathbf{x}) = \tau \}$$

$$\text{Classification}(\mathbf{x}_i) = \begin{cases} \text{BLOCKED ANOMALY } (\text{Crimson } \#f43f5e), & \text{if } S(\mathbf{x}_i) \ge \tau \\ \text{APPROVED TRANSACTION } (\text{Cyan } \#00f0ff), & \text{if } S(\mathbf{x}_i) < \tau \end{cases}$$

---

### 3.3 Dynamic Confusion Matrix & Financial Capital Metrics
Dragging the threshold slider $\tau \in [0.10, 0.85]$ triggers instantaneous client-side evaluation against ground-truth criteria ($\text{isFlagged}_i \iff \text{RiskScore}_i \ge 2$):

| Telemetry Variable | Mathematical Formula | Optimal Performance ($\tau^* = 0.45$) |
|---|---|---|
| **True Positives (TP)** | $\sum \mathbb{I}(S_i \ge \tau \land \text{isFlagged}_i)$ | **245 Intercepted Drains** |
| **False Positives (FP)** | $\sum \mathbb{I}(S_i \ge \tau \land \neg\text{isFlagged}_i)$ | **46 Customer Friction Events** |
| **False Negatives (FN)** | $\sum \mathbb{I}(S_i < \tau \land \text{isFlagged}_i)$ | **32 Undetected Anomalies** |
| **Precision** | $\frac{\text{TP}}{\text{TP} + \text{FP}}$ | **84.2% Block Accuracy** |
| **Recall (Sensitivity)** | $\frac{\text{TP}}{\text{TP} + \text{FN}}$ | **88.4% Fraud Coverage** |
| **F1 Score** | $2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$ | **0.862 Harmonic Peak** |
| **Blocked Capital** | $\sum_{i \in \text{TP}} \text{Amount}_i$ | **\$38,940 Illicit Funds Frozen** |
| **Customer Friction Volume** | $\sum_{i \in \text{FP}} \text{Amount}_i$ | **\$4,120 Legitimate Interruption** |

---

## 04. QUALITY ASSURANCE & VERIFICATION AUDIT

| Verification Suite | Target Requirement | Status / Result |
|---|---|---|
| **Vitest Unit Test Suite** | 15 test files (anti-fraud, graph, stress, physics) | **238 / 238 Passed (100%)** |
| **Next.js Production Build** | Static generation (`out/`) | **34 / 34 Static Routes Exported** |
| **TOC Anchor Integrity** | All 12 project case studies | **95 / 95 Anchors Valid (100%)** |
| **Dev Server HTTP Health** | Standalone route `/projects/banking-fraud-3d-anomaly-manifold/` | **200 OK** (HTML: 338 kB, JS: 200) |
| **Responsive Interactivity** | Threshold slider, zoom controls, 3 camera presets | **60 FPS Sustained** |

---

## 05. OPERATIONS & ENVIRONMENT GUIDE

### 5.1 Starting Local Development Server
```powershell
cd "c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
npm.cmd run dev
```
Preview at: `http://localhost:3000/projects/banking-fraud-3d-anomaly-manifold/`

### 5.2 Running Automated Test Suites
```powershell
cd "c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
npm.cmd test
```

### 5.3 Executing Clean Production Build
> ⚠️ **CRITICAL CACHE INVARIANT**: Always wipe `.next` before running `next dev` after a production build to prevent chunk hash collisions.
```powershell
cd "c:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm.cmd run build
```

---
*Manual authored and certified on September 5, 2026 by Antigravity AI Pair Programmer.*
