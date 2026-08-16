---
title: "ML Product Mapping System"
slug: "ml-product-mapping-system"
one_liner: "A multi-model machine learning ensemble (PyTorch Bi-Encoder, Cross-Encoder, XGBoost, Random Forest, & Online Active Learner) that automatically maps distributor descriptions across DBC Group brands (Rucika, Djabesmen, RB Shera, Superex) to internal Master SKUs with 95.4% precision."
problem: "Thousands of unstandardized supplier Purchase Orders and invoices arrived with inconsistent dimension formats (1/2\" vs 0.5\", AW vs D pipe classes, threaded vs plain fittings). Manual reconciliation across tens of thousands of SKUs took days each month and caused costly fulfillment errors."
approach: "Engineered a 6-component hybrid hierarchical ensemble combining 384-dimensional Bi-Encoder retrieval (~3ms), Cross-Encoder transformer re-ranking, XGBoost, Random Forest, and a sub-millisecond Online Active Learning feedback loop."
impact: "Achieved 95.4% precision on auto-approved mappings, automated >80% of PO lines without manual touch, and slashed batch processing turnaround from 3 business days to under 5 minutes across 4 manufacturing brands."
category: "Machine learning"
tools:
  - "Python"
  - "PyTorch Bi-Encoder"
  - "Cross-Encoder Transformer"
  - "XGBoost"
  - "Random Forest"
  - "Scikit-Learn (SGD Active Learner)"
  - "TF-IDF & Fuzzy Matching"
skills:
  - "Machine learning"
  - "NLP & Embeddings"
  - "Active learning"
  - "Data quality"
  - "System architecture"
order: 1
system:
  - label: "01. Fast Dense Retrieval"
    value: "PyTorch Bi-Encoder (384-d dense embeddings) retrieves Top 30 candidate Master SKUs in ~3ms"
  - label: "02. Deep Semantic Re-Ranking"
    value: "Cross-Encoder Transformer conducts word-level cross-attention for sensitive specs (AW vs D, drat)"
  - label: "03. Hybrid Meta-Classifier"
    value: "XGBoost + Random Forest compute probabilities across 8 statistical & lexical feature dimensions"
  - label: "04. Active Human-in-the-Loop"
    value: "Online Active Learner (SGD log_loss) updates ensemble weights in <1ms from operator feedback"
lessons:
  - "Multi-model ensembles provide significantly greater robustness against extreme technical phrasing variations than any single NLP model."
  - "Strict confidence tiering (Auto-Approve vs Human Review Queue) is critical for enterprise operational trust and zero-downtime adoption."
  - "Online incremental learning ensures continuous model improvement without requiring heavy, disruptive batch retraining pipelines."
preview:
  eyebrow: "5-Model Hybrid Ensemble"
  metrics:
    - label: "Auto-Precision"
      value: "95.4%"
    - label: "Auto Volume"
      value: ">80%"
    - label: "Batch Speed"
      value: "<5 Min"
  takeaway: "5-model ensemble with active learning reduced multi-brand SKU reconciliation from days to minutes."
evidence:
  - slot: "01"
    kind: "diagram"
    title: "5-Model Hybrid Ensemble Architecture"
    description: "Hierarchical 2-stage retrieval (Bi-Encoder Dense Search ➡️ Cross-Encoder Re-Ranker) augmented with XGBoost, Random Forest, and Online Active Learner."
    alt: "Diagram of the 5-model hybrid ensemble ML product mapping architecture."
    image: ""
  - slot: "02"
    kind: "dashboard"
    title: "Confidence Calibration & Review Queue"
    description: "Confidence triage interface: Scores >=85% auto-sync to ERP Master SKU, 60-85% routed to operator review queue with Top 3 suggestions."
    alt: "Interface mockup of confidence calibration and human review queue."
    image: ""
  - slot: "03"
    kind: "screenshot"
    title: "Multi-Brand SKU Transformation Matrix"
    description: "Production mapping examples transforming raw distributor descriptions into standardized DBC Group Master SKUs."
    alt: "Transformation matrix showing raw distributor text mapped to standardized DBC Group SKUs."
    image: ""
---

## Problem: Fragmented Distributor Descriptions Across DBC Group Brands

Across **DBC Group (Djabesmen Group)**—a major building materials and industrial manufacturing conglomerate—thousands of *Purchase Orders (PO)* and invoice lines are received daily from hundreds of independent distributors and building material retailers for 4 major product divisions:
1. **Rucika**: PVC pipes (Standard AW/D pressure classes, JIS), PPR/HDPE pipes, and hundreds of fitting variants (Elbows, Tees, Sockets, Valves, Internal/External Threads).
2. **Djabesmen**: Corrugated fiber-cement roofing sheets and ridge caps across varying thicknesses, lengths, and corrugation profiles.
3. **RB Shera**: Fiber cement boards, wood-grain textured planks, and decorative eaves with precise millimeter dimensions.
4. **Superex**: PVC pipes and rainwater drainage gutter systems (*gutters & fittings*).

### Operational Bottlenecks:
- **Unstructured Input Text**: Every distributor uses arbitrary shorthand, irregular abbreviations, and typos. For example: *"RCK PPA AW 1/2 IN"* vs. *"PIPA PVC RUCIKA STD KELAS AW 0.5 INCH 4 METER"*, or *"SHERA PLANK TEAK BROWN 8X200X3000"* vs. *"PAPAN RB SHERA COKLAT 3M"*.
- **High-Risk Spec Mismatch**: Conflating critical technical variants (e.g., high-pressure Class AW pipes mistakenly mapped as thin Class D drainage pipes) caused severe logistics fulfillment failures and ERP inventory discrepancies.
- **Manual Time Overhead**: Inventory operators spent up to 3 full business days at month-end manually cross-referencing lines in spreadsheets.

---

## Technical Solution: 5-Model + TF-IDF Hybrid Hierarchical Ensemble

To achieve near-perfect precision without sacrificing retrieval speed, the system implements a hierarchical multi-stage matching architecture that combines dense vector retrieval, transformer cross-attention, gradient-boosted decision trees, and real-time online active learning.

### 1. Ensemble Components & Mathematical Weighting Formula:

The final match probability (**Final Ensemble Confidence Score**) is calculated via a calibrated linear combination:

$$\text{Final Score} = 0.20 \times M_1 + 0.25 \times M_2 + 0.20 \times M_3 + 0.15 \times M_4 + 0.10 \times M_5 + 0.10 \times \text{TF-IDF}$$

| Component | Model / Engine | Latency | Specialized Role in Pipeline |
| :--- | :--- | :--- | :--- |
| **Model 1 (20%)** | **PyTorch Bi-Encoder** | ~3ms | Generates 384-dimensional dense semantic embeddings for *fast dense vector retrieval* of Top 30 Master SKU candidates from the catalog database. |
| **Model 2 (25%)** | **Cross-Encoder Re-Ranker** | ~18ms | Transformer with word-level *cross-attention* evaluating fine-grained technical nuances (AW vs. D classes, internal vs. external threading, inch vs. mm). |
| **Model 3 (20%)** | **XGBoost Classifier** | ~2ms | *Gradient-boosted decision trees* calculating match probabilities across an 8-dimensional feature vector (token overlap ratio, length similarity, numeric dimension match). |
| **Model 4 (15%)** | **Random Forest Classifier** | ~2ms | *Bagged meta-ensemble* (100 trees) serving as a variance regularizer to minimize prediction bias on sparse or rare SKU variants. |
| **Model 5 (10%)** | **Online Active Learner** | <1ms | Real-time incremental learner (`SGDClassifier` with `log_loss`) that absorbs operator corrections on the fly, updating model weights in sub-milliseconds. |
| **TF-IDF (10%)** | **Character N-Gram Vectorizer** | <1ms | Retains sub-word character matching to robustly handle extreme typos, missing vowels, and proprietary distributor shorthand. |

---

## Operational Workflow: Human-in-the-Loop & Confidence Calibration

The system is engineered around **uncompromising reliability**. Rather than forcing binary automation on ambiguous text, it enforces a calibrated 3-tier confidence triage:

```
[Distributor PO / Invoice Text]
               │
               ▼
┌─────────────────────────────────────────────────┐
│  Text Preprocessing & Dimension Normalization   │
│  (Regex inch-mm, brand aliases, schedule specs) │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│   5-Model + TF-IDF Hybrid Ensemble Scoring      │
│  (Bi-Encoder ➡️ Cross-Encoder ➡️ XGBoost ➡️ RF) │
└──────────────────────┬──────────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
[Score ≥ 85%: AUTO-APPROVE]   [Score 60-85%: REVIEW QUEUE]   [Score < 60%: ANOMALY FLAG]
 (>80% Total PO Volume)        (Top 3 Suggested Candidates)   (New Uncataloged SKU)
       │                               │                               │
       │                               ▼                               │
       │                   [Operator Validates Choice]                 │
       │                               │                               │
       │                               ▼                               │
       │                   ┌────────────────────────┐                  │
       │                   │ Online Active Learner  │                  │
       │                   │ Weight Update (<1ms)   │                  │
       │                   └────────────────────────┘                  │
       ▼                               ▼                               ▼
 [ERP SAP Master SKU]         [ERP SAP Master SKU]            [Master Data Triage]
```

1. **Tier 1 — Auto-Approved ($\ge 85\%$ Confidence)**:
   - Covers **>80% of daily incoming PO volume**.
   - Directly synchronized into the SAP ERP system with an audited **95.4% precision rate**.
2. **Tier 2 — Human Review Queue ($60\% - 85\%$ Confidence)**:
   - Surfaces a streamlined audit interface with **Top 3 candidate recommendations** and match probabilities.
   - When an operator validates the true match, the **Online Active Learner updates its weights in <1ms**, preventing recurrence of identical uncertainties.
3. **Tier 3 — Anomaly / New Product Flag ($< 60\%$ Confidence)**:
   - Isolates unrecognized product lines for review by the Master Data Management team before catalog ingestion.

---

## Visual Transformation Matrix: Raw Input to Master SKU

Real-world production transformations demonstrating the multi-brand capability across DBC Group divisions:

| Brand | Raw Distributor Description (Input) | Standardized Internal Master SKU (Output) | Ensemble Score | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Rucika** | `RCK PPA AW 1/2 INCH X 4M PUTIH` | `RUCIKA-PVC-AW-050-4M-WHT (Pipa PVC Standard AW 1/2" 4M)` | **98.2%** | `Auto-Approved` |
| **Rucika** | `KNEE DRAT DLM RCK 3/4X1/2 AW` | `RUCIKA-FIT-AW-FTE-075X050 (Faucet Elbow AW 3/4" x 1/2")` | **94.6%** | `Auto-Approved` |
| **Djabesmen** | `ATAP FIBER DJABES GEL 14 2100` | `DJABES-GLB14-2100X1020-GREY (Atap Semen Gelombang 14 2.10M)` | **96.1%** | `Auto-Approved` |
| **RB Shera** | `PAPAN FIBER SHERA PLANK COKLAT 3M` | `SHERA-PLK-TEAK-08X200X3000 (Shera Plank Dint Teak Brown 3M)` | **91.8%** | `Auto-Approved` |
| **Superex** | `TLNG AIR SUPEREX 4M SET ACC` | `SPRX-GUTTER-U140-4M-SET (Talang Air PVC U-140 Set 4M)` | **89.3%** | `Auto-Approved` |
| **Rucika** | `SOK PIPA KHUSUS DRAT KUNINGAN` | `RUCIKA-FIT-FAUCET-SCK-050 (Faucet Socket AW Brass Insert 1/2")` | **74.5%** | `Reviewed (Top 1)` |

---

## Quantitative Business Impact & Outcomes

Deploying the system across DBC Group operational divisions delivered measurable enterprise efficiency gains:

```text
┌──────────────────────────────┬──────────────────────────────┬──────────────────────────────┐
│       AUTO-PRECISION         │       AUTOMATION RATE        │       BATCH TIME SAVED       │
│           95.4%              │            >80%              │          99.1%               │
│   Verified on >50k SKUs      │   Zero-touch automation      │  From 3 days to <5 minutes   │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

- **99% Reduction in Processing Time**: Monthly reconciliation of tens of thousands of distributor lines dropped from **3 business days to under 5 minutes**.
- **Multi-Brand Scalability**: Replicated across **4 manufacturing brands** (Rucika, Djabesmen, RB Shera, Superex) without requiring architectural rewrites.
- **Elimination of Critical Mismatches**: Near-zero incidence of erroneous pipe schedule dispatches (Class AW vs. Class D), protecting customer trust and order fulfillment SLAs.
- **Strategic Resource Reallocation**: Inventory and order processing staff were reallocated from repetitive clerical mapping to high-value supply chain demand forecasting.
