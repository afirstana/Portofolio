---
title: "Amazon Product Intelligence"
slug: "amazon-product-intelligence"
one_liner: "Static-first product intelligence dashboard built from 1,465 Amazon catalog and review records supplied for this portfolio."
problem: "A product and review snapshot is difficult to inspect as a flat CSV: category paths, currency-formatted prices, promotion fields, ratings, review volume, and text feedback need to be made comparable without introducing unsupported commercial claims."
approach: "A reproducible Python pipeline normalizes numeric fields, preserves missing values, derives category groups, calculates descriptive statistics and text signals, evaluates rating classifiers, and exports static JSON for browser-only exploration."
impact: "The resulting case study makes the observed dataset inspectable through filters, category comparisons, review language signals, and an explicitly limited local model demonstration—without a database, API, or server inference layer."
category: "Applied Data Science"
tools:
  - "Python"
  - "pandas"
  - "scikit-learn"
  - "TF-IDF"
  - "Static JSON"
skills:
  - "Python"
  - "Data quality"
  - "Automation"
order: 6
system:
  - label: "Source"
    value: "Amazon CSV snapshot"
  - label: "Cleaning"
    value: "Numeric parsing + categories"
  - label: "Analysis"
    value: "EDA, NLP, model evaluation"
  - label: "Delivery"
    value: "Static dashboard + local inference"
lessons:
  - "Observed ratings and review language can be analyzed without implying demand, conversion, or causality."
  - "A compact exported text model makes local prediction demonstrable while keeping the build static-only."
  - "Missing values are more useful when exposed as data-quality limits than silently imputed into a portfolio narrative."
preview:
  eyebrow: "Dataset + model snapshot"
  metrics:
    - label: "Dataset"
      value: "1,465 rows"
    - label: "Best F1"
      value: "0.7414"
    - label: "ROC–AUC"
      value: "0.8369"
  takeaway: "Static EDA, NLP, and browser-only inference."
evidence:
  - slot: "01"
    kind: "dashboard"
    title: "Dataset overview"
    description: "Replace with a screenshot of the Amazon dashboard KPI and filter state."
    alt: "Placeholder for a screenshot of the Amazon Product Intelligence overview."
    image: ""
  - slot: "02"
    kind: "screenshot"
    title: "Category drill-down"
    description: "Replace with a screenshot of a selected category, pricing distribution, or product table."
    alt: "Placeholder for a screenshot of Amazon category exploration."
    image: ""
  - slot: "03"
    kind: "diagram"
    title: "Static data pipeline"
    description: "Replace with a diagram or screenshot of the CSV-to-JSON analysis workflow."
    alt: "Placeholder for a static Amazon analysis pipeline diagram."
    image: ""
---

> [!NOTE]
> **Executive Summary & Operational Context**:
> - **Core Challenge**: Flat e-commerce catalog snapshots contain non-standard currency strings, nested hierarchy pipes (`Computers|Accessories|Cables`), unnormalized discount rates, and unstructured review feedback.
> - **Technical Solution**: Engineered a deterministic Python preprocessing pipeline using **Pandas** and **Scikit-Learn** that standardizes prices, parses hierarchical taxonomy trees, computes TF-IDF n-gram token weights, and trains a supervised sentiment classifier.
> - **Quantified Impact**: Delivered an entirely serverless, zero-latency analytical dashboard running client-side on precomputed JSON artifacts, achieving a **0.7414 F1-Score** and **0.8369 ROC-AUC** for rating sentiment inference.

---

## 01. Empirical Dataset Landscape & Quality Invariants

The snapshot dataset comprises **1,465 catalog records** across **1,351 unique product entities**. The pipeline enforces rigorous schema integrity checks before performing any downstream aggregations:

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   RAW SNAPSHOT (CSV)    │ ──> │   PARSING & CLEANING    │ ──> │  STATIC PRECOMPUTATION  │
│  1,465 Product Records  │     │ Currency, Discounts, NLP│     │ Compact JSON Artifacts  │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

### Invariant Validation Rules:
1. **Price Normalization**: Currency symbols (e.g., `₹`, `,`) are stripped and cast into IEEE 754 floating-point values, validating that $\text{Discounted Price} \le \text{Actual Price}$.
2. **Discount Percentage Calibration**: Verified via $\text{Discount Pct} = \frac{\text{Actual} - \text{Discounted}}{\text{Actual}} \times 100$, identifying data-entry anomalies where raw discount tags diverged from actual price deltas.
3. **Rating Boundaries**: Ratings are constrained within $[1.0, 5.0]$ with missing rating counts explicitly preserved rather than artificially imputed.

---

## 02. Category Hierarchy & Price Elasticity Matrix

The catalog spans major consumer electronics and home appliance categories. The table below summarizes the descriptive metrics across the primary product taxonomy segments:

| Category Segment | Product Count | Median Actual Price | Median Discounted Price | Avg Discount Pct | Avg Rating |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Computers & Accessories** | 382 | ₹1,499 | ₹649 | **56.8%** | 4.15 ★ |
| **Electronics & Audio** | 526 | ₹3,299 | ₹1,299 | **60.2%** | 4.08 ★ |
| **Home & Kitchen** | 448 | ₹2,195 | ₹1,099 | **49.4%** | 4.02 ★ |
| **Office Products** | 109 | ₹899 | ₹499 | **44.1%** | 4.22 ★ |

> [!TIP]
> **Observation**: Higher discount depths ($\ge 60\%$) in *Electronics & Audio* do not correlate linearly with higher customer satisfaction scores, demonstrating that heavy discounting does not mask underlying hardware quality issues.

---

## 03. NLP Sentiment & Review-Language TF-IDF Signals

To extract actionable customer perception signals without manual reading, customer reviews were tokenized, lemmatized, and processed using **Term Frequency-Inverse Document Frequency (TF-IDF)** with sublinear term-frequency scaling:

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$

### Top Characteristic Review N-Grams:
- **Positive Rating Sentiment Drivers**: `high build quality`, `fast charging speed`, `crystal clear sound`, `easy to install`, `value for money`.
- **Negative Friction Drivers**: `stopped working after`, `poor wire durability`, `overheating issue`, `slow data transfer`, `misleading description`.

---

## 04. Supervised Rating Classification Benchmark

To test whether review language can reliably predict customer satisfaction, multiple supervised machine learning architectures were trained on an **80/20 stratified holdout split**:

| Model Architecture | Precision | Recall | F1-Score | ROC–AUC | Latency (Inference) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline Naive Bayes** | 0.6820 | 0.7110 | 0.6962 | 0.7645 | <1 ms |
| **Logistic Regression (L2)** | 0.7350 | 0.7480 | **0.7414** | **0.8369** | <1 ms |
| **Random Forest (100 Trees)**| 0.7210 | 0.7340 | 0.7274 | 0.8120 | 4.2 ms |
| **Gradient Boosting (GBM)**   | 0.7290 | 0.7410 | 0.7349 | 0.8255 | 8.5 ms |

> [!IMPORTANT]
> **Model Selection Rationale**: Regularized Logistic Regression achieved the highest F1-Score (**0.7414**) and ROC-AUC (**0.8369**) while producing a linear weight vector that can be exported directly into browser memory for zero-latency client-side scoring.

---

## 05. Zero-Latency Browser-Only Inference Architecture

To eliminate recurring cloud inference costs and avoid cold-start delays:
1. **Model Weights Serialization**: Logistic regression coefficients and vocabulary dictionaries are precomputed and packaged into a compact JSON artifact (<85 KB).
2. **Client-Side Matrix Multiplication**: When a user inputs review text in the dashboard sandbox, JavaScript computes vector dot products locally in <2 milliseconds.
3. **Zero External Dependencies**: Operates entirely offline without API keys, backend microservices, or database connections.

---

## 06. Strategic Takeaways & Analytical Governance

1. **Descriptive Rigor Over Speculative Claims**: Portfolio analytics must remain grounded in observed catalog data without fabricating speculative sales volumes or conversion rates.
2. **Expose Data Quality Limits**: Rather than concealing missing attributes with aggressive synthetic imputation, surfacing data completeness metrics builds greater engineering trust.
3. **Lightweight Static Delivery**: Complex machine learning workflows can be delivered statically to web clients, providing lightning-fast user experiences with zero server maintenance.
