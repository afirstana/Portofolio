---
title: "Olist Payment & Installment Behavior Analysis"
slug: "olist-payment-behavior-analytics"
one_liner: "An empirical analysis of 103,886 Brazilian e-commerce payment records (R$ 16.01M total value) examining payment method mix, installment-to-order-value relationships (r = 0.37), and category-level financing patterns."
problem: "Marketplace operators need visibility into how customer payment preferences and installment options interact with order values across product categories without relying on unverified assumptions about checkout behavior."
approach: "Aggregated 103,886 payment records to order-level grains via SUM(payment_value) and MAX(payment_installments), assigned dominant payment rails, evaluated installment tier distributions against basket sizes, and cross-tabulated category financing patterns."
impact: "Identified that higher installment counts consistently accompany higher order values (orders at 7–10x average 3.3x the value of 1x orders), flagged a 10x checkout anomaly for product-team validation, and highlighted high-volume/high-installment categories like Watches & Gifts."
category: "Analytics"
tools:
  - "SQL / Relational Modeling"
  - "Python (Pandas)"
  - "Descriptive Statistics"
  - "TypeScript & Next.js"
  - "Pure SVG Visualizations"
skills:
  - "Payment behavior analysis"
  - "Descriptive statistics"
  - "Relational data modeling"
  - "E-commerce analytics"
  - "Interactive dashboards"
order: 4
system:
  - label: "01. Pre-Aggregation"
    value: "Aggregates multi-payment records per order via SUM(payment_value) and MAX(payment_installments)"
  - label: "02. Dominant Method Mapping"
    value: "Assigns one dominant payment type per order based on the largest contributing payment value"
  - label: "03. Installment & Category Analysis"
    value: "Evaluates order value across installment tiers and cross-tabs against translated product categories"
  - label: "04. Dashboard Delivery"
    value: "Presents descriptive trends, category breakdowns, and audit records through an interactive browser interface"
lessons:
  - "Installment count correlates positively with order value (r = 0.37), with higher-installment orders consistently carrying higher average values."
  - "Unusual volume spikes at specific tiers (such as 10x) should be treated as potential checkout UI artifacts and validated with product teams before assuming organic customer demand."
  - "Durable, higher-ticket categories (Computers, Appliances, Furniture) show the highest average installments, while consumables (Food, Drinks, Books) remain primarily upfront purchases."
preview:
  eyebrow: "Payment & Installment Behavior"
  metrics:
    - label: "Payment Records"
      value: "103.9k"
    - label: "Credit Card Share"
      value: "78.4%"
    - label: "Correlation"
      value: "r = 0.37"
  takeaway: "Evaluated payment distribution, installment elasticity, and category financing patterns across 99.4k orders."
evidence: []
---

| Specification Attribute | Scope & Data Invariants |
|---|---|
| **Data Sources** | `olist_order_payments_dataset.csv`, `olist_order_items_dataset.csv`, `olist_products_dataset.csv`, `product_category_name_translation.csv` |
| **Macro Dataset Scope** | **103,886 payment records** across **99,440 orders** (Total GMV: **R$ 16,008,872.12**) |
| **Financing Sub-Cohort** | **74,975 credit-card-dominant orders** (evaluated for installment count vs. basket size elasticity) |

---

## 1. Research Objectives

1. Understand the distribution of payment methods used on the platform and their relative revenue contribution.
2. Test the descriptive relationship between installment count and order value across transaction tiers.
3. Identify which merchandise categories rely most on extended installment terms, providing an empirical basis for targeted financing promotions.

---

## 2. Data Preparation & Grain Normalization

- **Multi-Payment Split Aggregation**: A single customer order can have multiple payment rows (e.g., promotional vouchers combined with a credit card). Order-level monetary totals are computed as `SUM(payment_value)` and maximum installment depth as `MAX(payment_installments)` grouped by `order_id`.
- **Dominant Payment Method Classification**: Each order is assigned one dominant payment type—the payment row with the largest monetary contribution—so that each order maps cleanly to exactly one method for distribution and category cross-tabs.
- **Primary SKU Category Attribution**: Product category is resolved from the first item per order (`order_item_id == 1`) and translated to English via the translation dictionary. Orders spanning multiple categories are represented by their initial item.
- **Data Hygiene**: 3 rows recorded under `payment_type == 'not_defined'` (R$ 0.00 total) were removed as non-representative anomalies.

---

## 3. Payment Method Distribution & Macro Revenue

| Payment Method | Transaction Rows | Volume Share | Total Value (R$) | Revenue Share | Avg Ticket / Row (R$) | Avg Installments |
|---|---:|---:|---:|---:|---:|---:|
| **Credit Card** | 76,795 | 73.9% | 12,542,084.20 | **78.4%** | R$ 163.32 | **3.51x** |
| **Boleto Bancário** | 19,784 | 19.0% | 2,869,361.30 | **17.9%** | R$ 145.03 | 1.00x |
| **Voucher / Store Credit** | 5,775 | 5.6% | 379,436.90 | 2.4% | R$ 65.70 | 1.00x |
| **Debit Card** | 1,529 | 1.5% | 217,989.80 | 1.4% | R$ 142.57 | 1.00x |
| **Total Benchmark** | **103,886** | **100.0%** | **R$ 16,008,872.20** | **100.0%** | — | — |

**Reading:** Credit card is the dominant rail by both transaction volume (73.9%) and total value (78.4%), and is the exclusive method offering multi-month installments. Boleto Bancário represents a substantial secondary channel capturing 17.9% of platform GMV, serving customer segments without revolving credit access or those preferring cash-voucher settlements. Voucher transactions average a significantly lower value (R$ 65.70), consistent with dispute compensation and promotional credits.

---

## 4. Installment Distribution & The 10x Anomaly

| Installment Count | Transaction Volume | Share of Volume |
|---|---:|---:|
| **1x (Lump Sum)** | 52,546 | 50.6% |
| **2x** | 12,413 | 11.9% |
| **3x** | 10,461 | 10.1% |
| **4x** | 7,098 | 6.8% |
| **5x** | 5,239 | 5.0% |
| **6x** | 3,920 | 3.8% |
| **7x** | 1,626 | 1.6% |
| **8x** | 4,268 | 4.1% |
| **9x** | 644 | 0.6% |
| **10x (Volume Surge)** | **5,328** | **5.1%** |
| **11x–24x (Combined Tail)** | 326 | 0.3% |

**Reading:** Transaction volume steadily declines from 1x through 9x as expected. At **10x installments**, however, volume jumps to 5,328 transactions—roughly 8.27x the volume at 9x and higher than 5x or 6x tiers. This non-linear pattern is consistent with **10x being a default selector cap or featured promotion in the checkout UI** rather than organic customer demand. This hypothesis should be verified with product engineering teams before treating it as an organic preference.

---

## 5. Installment Count vs. Order Value (Elasticity)

Scope: 74,975 credit-card-dominant orders.

**Descriptive Correlation:** Pearson $r = 0.37$ (moderate positive relationship on raw observational data; no causal claim or significance testing is assumed).

| Installment Tier | Order Volume | Volume Share | Avg Order Value (R$) | Median Order Value (R$) | Multiplier vs. 1x Baseline |
|---|---:|---:|---:|---:|---:|
| **1x (Single Payment)** | 24,004 | 32.0% | R$ 100.91 | R$ 71.62 | **1.00x (Baseline)** |
| **2x–3x (Short Term)** | 22,649 | 30.2% | R$ 135.58 | R$ 111.38 | **1.34x (+34.4%)** |
| **4x–6x (Mid Term)** | 16,160 | 21.6% | R$ 182.56 | R$ 128.28 | **1.81x (+80.9%)** |
| **7x–10x (Extended Term)**| 11,819 | 15.8% | **R$ 336.44** | **R$ 206.78** | **3.33x (+233.4%)** |
| **11x–24x (Maximum Term)**| 341 | 0.4% | R$ 360.37 | R$ 216.05 | **3.57x (+257.1%)** |

**Reading:** The pattern is consistent and directional—higher installment selections accompany progressively higher average basket sizes. Orders structured across 7–10 installments average **R$ 336.44 (3.33x the 1x baseline of R$ 100.91)**. This indicates installments operate primarily as a mechanism enabling consumers to commit to higher-ticket capital outlays by spreading cash outflow over time.

---

## 6. Merchandise Category Financing Patterns

Scope: Credit-card-dominant orders across categories with $\ge 100$ orders for statistical stability.

### 6.1 Highest Average Installments (Durable Goods)

| Product Category | Total Orders | Avg Installments | Avg Order Value (R$) | Primary Trait |
|---|---:|---:|---:|---|
| **Computers** | 149 | **7.41x** | **R$ 1,288.65** | High-ticket electronics |
| **Home Appliances 2** | 179 | **5.55x** | R$ 609.51 | Major home durable goods |
| **Home Comfort** | 293 | **5.18x** | R$ 183.53 | Furniture & home bedding |
| **Office Furniture** | 873 | **4.78x** | R$ 276.90 | Commercial & workspace |
| **Kitchen / Dining Furniture** | 186 | **4.49x** | R$ 254.10 | Home furnishings |
| **Musical Instruments** | 455 | **4.49x** | R$ 363.37 | Specialty equipment |
| **Agro Industry & Commerce** | 124 | **4.46x** | R$ 439.25 | Commercial equipment |
| **Watches & Gifts** | **4,485** | **4.46x** | **R$ 243.97** | Premium high-volume gift items |
| **Small Appliances** | 484 | **4.35x** | R$ 337.86 | Domestic electronics |
| **Bed, Bath & Table** | 7,265 | **4.31x** | R$ 137.18 | High-volume home essentials |

### 6.2 Lowest Average Installments (Consumables)

| Product Category | Total Orders | Avg Installments | Avg Order Value (R$) | Primary Trait |
|---|---:|---:|---:|---|
| **Books (General)** | 374 | **2.82x** | R$ 113.22 | Media & literature |
| **Computer Accessories** | 4,637 | **2.74x** | R$ 155.96 | Low-ticket peripherals |
| **Telephony** | 3,040 | **2.71x** | R$ 98.05 | Mobile accessories & cables |
| **Books (Technical)** | 187 | **2.48x** | R$ 93.01 | Educational media |
| **Food & Drink Specials** | 158 | **2.43x** | R$ 95.93 | Gourmet consumables |
| **Food Items** | 318 | **2.33x** | R$ 86.17 | Grocery consumables |
| **Electronics (Accessories)**| 1,823 | **2.04x** | R$ 87.68 | Small hardware accessories |
| **Drinks & Beverages** | 230 | **1.95x** | R$ 91.15 | Low-cost beverage goods |

**Reading:** High-installment categories are high-ticket durable goods (Computers, Major Appliances, Furniture), whereas low-installment categories are low-cost consumables (Food, Drinks, Books) paid predominantly upfront.

### 6.3 Strategic Category Showcase: Watches & Gifts
**Watches & Gifts** stands out as the platform's prime target for financing campaigns:
- **Order scale:** 4,485 orders (one of the largest single category volumes).
- **Ticket size:** R$ 243.97 average order value.
- **Financing reliance:** 4.46x average installments and **80.1% credit card mix**.

### 6.4 Payment Method Mix across Top 8 Categories

| Category | Credit Card | Boleto Bancário | Voucher | Debit Card |
|---|---:|---:|---:|---:|
| **Bed, Bath & Table** | 78.0% | 17.0% | 3.7% | 1.3% |
| **Computer Accessories** | 69.6% | 25.8% | 2.6% | 2.1% |
| **Furniture Decor** | 74.6% | 20.8% | 3.4% | 1.2% |
| **Health & Beauty** | 76.8% | 19.3% | 2.3% | 1.6% |
| **Housewares** | 76.4% | 17.8% | 4.1% | 1.7% |
| **Sports & Leisure** | 75.2% | 20.5% | 2.8% | 1.5% |
| **Telephony** | 72.7% | 22.5% | 3.0% | 1.8% |
| **Watches & Gifts** | **80.1%** | 16.4% | 2.5% | 1.0% |

**Reading:** Payment rail distribution remains relatively stable across all major merchandise categories (Credit Card 70–80%, Boleto 16–26%), indicating payment rail selection is primarily governed by customer demographic profiles rather than catalog SKU types.

---

## 7. Key Findings Summary

1. **Credit Card Hegemony with Financing**: Credit cards drive 73.9% of transactions and 78.4% of total GMV, functioning as the platform's exclusive installment rail (3.51x average).
2. **Consistent Order Value Elasticity**: The positive relationship between installment depth and basket size holds consistently at both individual transaction levels ($r = 0.37$) and category aggregations.
3. **10x Checkout Anomaly**: The volume spike at 10 installments indicates a checkout UI default selector cap rather than organic consumer preference.
4. **Boleto Revenue Protection**: Capturing 17.9% of GMV, Boleto remains a vital cash-alternative channel for non-credit consumer segments.

---

## 8. Strategic Business Recommendations

| Strategic Area | Operational Action | Expected Commercial Impact |
|---|---|---|
| **Checkout UI Configuration** | Audit dropdown selectors to evaluate whether 10x is an artificial bottleneck; test 12x options for orders > R$ 1,000. | Validates true financing demand and eliminates checkout UI bias. |
| **Targeted 0% APR Campaigns** | Partner with acquirers to offer subsidized 0% interest on durable goods (Computers, Major Appliances, Furniture). | Stimulates conversion on high-ticket inventory with minimal margin impact. |
| **Alternative Rail Support** | Modernize Boleto settlement protocols (or PIX integration) to retain the ~18–20% non-credit customer base. | Reduces checkout abandonment among unbanked or credit-averse cohorts. |
| **Merchandising Focus** | Deploy installment-first pricing badges on high-volume, high-installment categories (*Watches & Gifts*). | Maximizes revenue velocity on proven high-consideration catalog segments. |

---

## 9. Dashboard Architecture & Component Hierarchy

The interactive dashboard is structured in a 5-tier progressive disclosure layout, prioritizing high-level portfolio KPIs before granular transaction inspection:

| Interface Tier | Module Component | Analytical Purpose & Primary Signals |
|---|---|---|
| **Tier 1 · Executive KPIs** | 4-Metric Summary Grid | Instant overview of total GMV (R$ 16.01M), credit card share (78.4%), average installment count (3.51x), and ticket size multiplier (3.3x). |
| **Tier 2 · Temporal Explorer** | Monthly Trend Line Chart | Tracks monthly GMV and order volume trajectories (2017–2018) across the 4 payment rails with an optional installment overlay. |
| **Tier 3A · Category Elasticity** | Top 15 Category Bar Chart | Ranks merchandise categories by average installment depth with interactive category-specific payment mix breakdowns. |
| **Tier 3B · Basket Scaling** | Installment vs. AOV Scatter Plot | Visualizes order value expansion across discrete installment tiers (1x baseline up to 11–24x). |
| **Tier 4 · Control Toolbar** | Multi-Facet Filter Strip | Provides client-side filtering across payment rails, merchandise categories, installment ranges, and Brazilian states. |
| **Tier 5 · Transaction Audit** | Paginated Order Detail Table | Displays granular order rows with multi-column sorting (date, category, installments, gross value) and CSV export. |

> **Live Console**: This 5-tier architecture is actively rendered and fully interactive in the **[02. Dashboard](#interactive-dashboard)** section above.

---

## 10. Analytical Limitations & Caveats

1. **Dominant Payment Simplification**: Split-payment orders (3.2% of total) combining vouchers or multiple cards are classified solely under their largest contributing method.
2. **First-Item Category Grain**: Multi-item orders spanning different categories are attributed to the primary item (`order_item_id == 1`).
3. **Observational vs. Causal Correlation**: The $r = 0.37$ relationship reflects descriptive observational data; interest rate policies and customer self-selection were not controlled via randomized experiments.
4. **Distribution-Shape Diagnostic**: The 10x anomaly is flagged based on statistical distribution shape and requires direct confirmation with checkout engineering logs.
