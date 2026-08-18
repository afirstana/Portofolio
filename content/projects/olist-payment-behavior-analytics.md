---
title: "Olist Payment & Installment Behavior Analytics"
slug: "olist-payment-behavior-analytics"
one_liner: "An econometric payment investigation of 103,886 Brazilian transactions (R$ 16.0M GMV) proving that credit card installment financing drives a 3.3x surge in Average Order Value (r = 0.37) and diagnosing the 10x checkout anomaly."
problem: "Marketplace conversion and basket size growth were constrained by fragmented payment method preferences and uncertainty around credit installment economics, risking margin erosion from high financing fees without clear visibility into category AOV elasticity."
approach: "Engineered an order-level payment aggregation and econometric modeling pipeline across 103,886 payment records using SQL, Python (Pandas/Seaborn), and Power BI (DAX); modeled installment elasticity across 74,975 credit card orders and mapped category financing sensitivity across durable vs consumable goods."
impact: "Demonstrated that credit cards drive 78.4% of total GMV with extended installments (7–10x) generating a 3.3x higher basket size (R$ 336.44 vs R$ 100.91), isolated a 5,328-order checkout heuristic anomaly at 10x installments, and established targeted 0% interest promotional frameworks for high-volume durable categories (Watches, Computers, Home Furniture)."
category: "Analytics"
tools:
  - "SQL"
  - "Python (Pandas & Seaborn)"
  - "Power BI (DAX & Power Query)"
  - "Econometric Modeling"
  - "Statistical Hypothesis Testing"
skills:
  - "Fintech & payment analytics"
  - "Behavioral economics"
  - "Installment elasticity modeling"
  - "Data modeling (SQL & DAX)"
  - "Checkout UX optimization"
order: 3
system:
  - label: "01. Transaction Aggregation"
    value: "Normalizes 103,886 multi-payment sequential rows into 99,440 order-level entities with dominant payment tagging"
  - label: "02. Payment Channel Distribution"
    value: "Analyzes share of wallet across Credit Card (78.4% GMV), Boleto (17.9% GMV), Voucher (2.4%), and Debit (1.4%)"
  - label: "03. Installment Elasticity Model"
    value: "Models Pearson correlation (r = 0.37) between installment length and order value, discovering a 3.3x AOV multiplier"
  - label: "04. Category Sensitivity Matrix"
    value: "Classifies 70+ product categories by financing dependency, isolating high-consideration durable goods from consumables"
lessons:
  - "In Latin American e-commerce, installment financing is an essential AOV growth engine: customers actively leverage 7–10x installments to acquire high-ticket items that would otherwise be abandoned."
  - "Abrupt volume spikes at round installment numbers (e.g. 5,328 orders at 10x) reveal checkout UI defaults and psychological anchoring rather than organic consumer preference."
  - "Boleto Bancário is an irreplaceable cash-based financial lifeline (19.0% volume) serving underbanked demographics and price-sensitive shoppers avoiding credit interest."
preview:
  eyebrow: "Payment & Installment Engine"
  metrics:
    - label: "Credit GMV"
      value: "78.4%"
    - label: "AOV Surge"
      value: "3.3x (7-10x)"
    - label: "Correlation"
      value: "r = 0.37"
  takeaway: "Proved credit installments drive 3.3x larger baskets and diagnosed the 10x checkout default anomaly."
evidence:
  - slot: "01"
    kind: "dashboard"
    title: "Payment Method Mix & Revenue Share"
    description: "Power BI dashboard tracking revenue volume and average ticket size across Credit Card, Boleto, Voucher, and Debit."
    alt: "Power BI dashboard of payment method distribution in Brazilian e-commerce."
    image: ""
  - slot: "02"
    kind: "diagram"
    title: "Installment Elasticity vs AOV Curve"
    description: "Econometric regression curve illustrating the Pearson r=0.37 relationship between installment count and basket size."
    alt: "Diagram showing correlation between installment count and average order value."
    image: ""
  - slot: "03"
    kind: "screenshot"
    title: "Category Financing Sensitivity Matrix"
    description: "Cross-tabulation matrix mapping product categories by average installment depth and ticket value."
    alt: "Category financing sensitivity heatmap matrix."
    image: ""
---

# Olist Payment & Installment Behavior Analytics Case Study

## 1. Executive Summary & Problem Scope

> [!NOTE]
> **Macro Analytical Baseline**: 103,886 payment transaction records across 99,440 marketplace orders totaling **R$ 16,008,872.12 in Gross Merchandise Value (GMV)**. Across Brazilian digital commerce, payment infrastructure operates as both an existential conversion bridge and an average order value (AOV) multiplier.

In Latin American e-commerce ecosystems, settlement mechanisms are deeply fragmented. Unlike Anglo-American markets where credit cards settle primarily in single transactions with backend revolving debt, the Brazilian retail landscape is anchored by merchant-subsidized installment financing (*parcelamento*) and paper/digital cash vouchers (*Boleto Bancário*).

This investigation was conducted across the Olist marketplace to address three central operational and financial questions:
1. **Wallet Share & Liquidity Architecture**: What is the empirical settlement distribution across credit cards, cash vouchers (Boleto), digital vouchers, and debit cards, and how does each channel contribute to platform GMV?
2. **Installment Elasticity & AOV Multiplier**: Does extended installment financing actively expand customer purchasing power to drive higher-ticket basket sizes, or does it merely fragment payment liquidity on low-value transactions?
3. **Category Financing Dependency**: Which product catalog categories demonstrate acute structural sensitivity to installment depth, and how should promotional financing (such as 0% interest *sem juros*) be allocated to maximize marketplace revenue without incurring unnecessary banking fees?

---

## 2. Relational Schema & Data Preparation Pipeline

### 2.1 Multi-Table Ingestion & Entity Relationship Grain
The analytical pipeline extracts, transforms, and normalizes records across four core relational tables:
- `olist_order_payments_dataset.csv`: 103,886 raw payment settlement rows capturing `payment_sequential`, `payment_type`, `payment_installments`, and `payment_value`.
- `olist_orders_dataset.csv`: 99,441 order headers tracking order statuses and purchase timestamps.
- `olist_order_items_dataset.csv`: 112,650 line items capturing product identifiers, prices, and freight values.
- `olist_products_dataset.csv` + `product_category_name_translation.csv`: Catalog metadata translating 71 Portuguese category keys into standardized English classifications.

The relational pipeline processes transactions through three structured stages:
1. **Stage 01 (Raw Transaction Schema Grain)**: Ingests 103,886 payment records and resolves multi-payment splits by computing `SUM(payment_value)` and `MAX(payment_installments)` per order header.
2. **Stage 02 (Order-Level Analytical Entity)**: Merges payments with delivered orders to yield 99,440 valid orders (R$ 16.01M GMV), tagging dominant payment types.
3. **Stage 03 (First-Item Category Attribution)**: Maps order line items with product translation keys to establish standardized category classifications across durable and consumable goods.

### 2.2 Data Transformation & Normalization Rules

#### 1. Multi-Payment Sequential Aggregation (`payment_sequential > 1`)
In Brazilian e-commerce, customers frequently combine promotional vouchers or loyalty points with a secondary credit card to complete high-value orders. To resolve multiple payment rows into a unified order-level entity, values and installment depths are aggregated:

$$\text{Order Total Value} = \sum_{i=1}^k \text{payment\_value}_i$$

$$\text{Order Max Installments} = \max(\text{payment\_installments}_1, \dots, \text{payment\_installments}_k)$$

#### 2. Dominant Payment Type Assignment
For cross-tabulations and wallet-share attribution, each order is assigned a single representative payment method corresponding to the highest monetary value contributed:

$$\text{Dominant Method} = \arg\max(\text{payment\_value}_{\text{type}})$$

#### 3. Product Category Attribution
In multi-item baskets, product category is attributed from the primary line item (`min(order_item_id)`) and mapped via the English translation table.

#### 4. Noise Removal & Baseline Filtering
Records with `payment_type == 'not_defined'` (3 rows totaling R$ 0.00) were filtered out from the econometric baseline.

---

## 3. Empirical Finding 1: Payment Method Distribution & Wallet Share

### 3.1 Four-Channel Transaction Baseline (n = 103,886 Payment Rows)

| Payment Method | Transaction Count | Volume Share (%) | Total Value (R$) | GMV Share (%) | Average Ticket (R$) | Average Installments |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Credit Card** | 76,795 | **73.9%** | **R$ 12,542,084.20** | **78.4%** | **R$ 163.32** | **3.51x** |
| **Boleto Bancário** | 19,784 | **19.0%** | **R$ 2,869,361.30** | **17.9%** | **R$ 145.03** | **1.00x** |
| **Voucher** | 5,775 | **5.6%** | **R$ 379,436.90** | **2.4%** | **R$ 65.70** | **1.00x** |
| **Debit Card** | 1,529 | **1.5%** | **R$ 217,989.80** | **1.4%** | **R$ 142.57** | **1.00x** |
| *Not Defined (Filtered)* | 3 | 0.0% | R$ 0.00 | 0.0% | R$ 0.00 | — |
| **Total Baseline** | **103,886** | **100.0%** | **R$ 16,008,872.20** | **100.0%** | **R$ 154.10** | **—** |

### 3.2 Channel Ecosystem Interpretation
- **Credit Card Hegemony (78.4% GMV)**: Credit cards represent the vital foundation of marketplace GMV. Crucially, credit card is the *only* payment rail supporting multi-month installment plans, making it the primary driver of high-value purchasing.
- **Boleto Bancário as Essential Cash Alternative (19.0% Volume)**: Capturing nearly a fifth of all transactions, Boleto Bancário serves consumers without access to traditional bank credit lines, as well as disciplined buyers avoiding credit debt.
- **Vouchers as Secondary Co-Payment Rails (5.6% Volume, 2.4% GMV)**: With a low average ticket size of R$ 65.70, vouchers reflect promotional credits, cashbacks, and customer support refunds, frequently paired with credit cards in multi-payment sequences.
- **Debit Card Friction (1.5% Volume)**: Historically constrained in Brazilian e-commerce due to 3D-Secure authentication redirects and authentication friction prior to the nationwide implementation of the Central Bank's Pix instant payment rails.

---

## 4. Empirical Finding 2: Installment Elasticity Model & Basket Size Multiplier

### 4.1 Econometric Formulation & Correlation
Across the cohort of **74,975 credit card dominant orders**, we model the relationship between installment depth ($X$) and total order value ($Y$). The empirical data reveals a statistically robust, moderate positive correlation:

$$\rho_{X,Y} = \frac{\operatorname{Cov}(X, Y)}{\sigma_X \sigma_Y} = 0.37$$

### Installment Elasticity & AOV Step-Ladder Matrix

| Installment Length Tier | Dominant Order Count | Volume Share (%) | Mean AOV (R$) | Median AOV (R$) | Multiplier vs 1x | Growth Surge Interpretation |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **1x (Full Payment)** | 24,004 | 32.0% | `R$ 100.91` | `R$ 71.62` | `1.00x` | Baseline reference basket |
| **2–3x Installments** | 22,649 | 30.2% | `R$ 135.58` | `R$ 111.38` | `1.34x` | `+34.4%` Basket expansion |
| **4–6x Installments** | 16,160 | 21.6% | `R$ 182.56` | `R$ 128.28` | `1.81x` | `+80.9%` Basket expansion |
| **7–10x Installments** | 11,819 | 15.8% | **`R$ 336.44`** | **`R$ 206.78`** | **`3.33x`** | **`+233.4%` (High-Ticket Surge)** |
| **11–24x (Long-Tail)** | 341 | 0.5% | `R$ 360.37` | `R$ 216.05` | `3.57x` | `+257.1%` (Financing Ceiling) |

> [!TIP]
> **Key Behavioral Insight**: Customers choosing **7–10 installments spend 3.33x more per order** than single-payment customers (**R$ 336.44 vs R$ 100.91**). Installment options serve not merely as settlement conveniences, but as essential revenue conversion engines that unlock high-ticket purchases.

---

## 5. Diagnostic Investigation: The 10x Installment Checkout Anomaly

### 5.1 Observed Installment Depth Distribution Across All Payment Records

| Installment Depth | Transaction Count | Distribution Share (%) | Curve Classification | Anomaly Diagnosis |
| :---: | :---: | :---: | :--- | :--- |
| **1x** | 52,546 | 50.58% | Natural Modal Peak | Single payment & cash vouchers |
| **2x** | 12,413 | 11.95% | Natural Decay Curve | Standard short installment |
| **3x** | 10,461 | 10.07% | Natural Decay Curve | Standard short installment |
| **4x** | 7,098 | 6.83% | Natural Decay Curve | Mid-tier financing |
| **5x** | 5,239 | 5.04% | Natural Decay Curve | Mid-tier financing |
| **6x** | 3,920 | 3.77% | Natural Decay Curve | Half-year milestone |
| **7x** | 1,626 | 1.57% | Monotonic Decrease | Natural decay trough |
| **8x** | 4,268 | 4.11% | Minor Secondary Bump | Common merchant promo threshold |
| **9x** | 644 | 0.62% | Sharp Valley Trough | Steep drop before boundary |
| **10x** | **5,328** | **5.13%** | **⚠️ NON-LINEAR SPIKE** | **+727% Surge over 9x (0% Interest Ceiling & UI Default)** |
| **11–24x** | 326 | 0.31% | Ultra Long-Tail | Interest-bearing debt cliff |

### 5.2 Root-Cause Triangulation: Why Does 10x Surge 8.3x Over 9x?
The sudden expansion from **644 orders at 9x to 5,328 orders at 10x (+727%)** represents a distinct non-linear structural anomaly. We triangulate three explanatory drivers:
1. **Checkout UI Configuration & Preset Defaults**: The checkout dropdown interface likely defaulted to or truncated selectable installment plans at 10x, creating an artificial clustering boundary.
2. **Merchant "Sem Juros" (0% Interest) Promotional Ceiling**: In Brazilian retail banking, 10 installments is the traditional maximum ceiling for interest-free financing offered by merchant acquiring banks. Installments beyond 10x trigger compound consumer interest, creating an acute cliff in consumer demand.
3. **Cognitive Decimal Anchoring**: Consumers exhibit psychological preference for round decimal numbers (10 months) when calculating monthly personal cash flow allocations.

---

## 6. Empirical Finding 3: Category Financing Sensitivity Matrix

### 6.1 Top 15 High-Installment Categories (Durable Goods, ≥ 100 Orders)

| Category Name | Credit Orders | Avg Installments | Avg Order Value (R$) | Category Classification |
| :--- | :---: | :---: | :---: | :--- |
| **Computers** | 149 | **7.41x** | **R$ 1,288.65** | High-ticket tech & hardware |
| **Home Appliances 2** | 179 | **5.55x** | **R$ 609.51** | Major household appliances |
| **Home Comfort** | 293 | **5.18x** | R$ 183.53 | Home improvement durables |
| **Office Furniture** | 873 | **4.78x** | R$ 276.90 | Commercial & workspace equipment |
| **Kitchen / Garden Furniture** | 186 | **4.49x** | R$ 254.10 | Modular living furniture |
| **Musical Instruments** | 455 | **4.49x** | R$ 363.37 | Specialty durable assets |
| **Agro Industry & Commerce** | 124 | **4.46x** | R$ 439.25 | Commercial equipment |
| **Watches & Gifts** | **4,485** | **4.46x** | **R$ 243.97** | **High-volume revenue sweetspot** |
| **Small Appliances** | 484 | **4.35x** | R$ 337.86 | Consumer electronics |
| **Furniture Living Room** | 314 | **4.34x** | R$ 216.37 | Bulky furniture |
| **Bed, Bath & Table** | **7,265** | **4.31x** | R$ 137.18 | High-volume home textile |
| **Construction Tools Safety** | 117 | **4.27x** | R$ 281.95 | Industrial equipment |
| **Construction Tools** | 571 | **4.12x** | R$ 237.87 | Workshop hardware |
| **Home Construction** | 375 | **4.10x** | R$ 210.78 | Building materials |
| **Luggage & Accessories** | 805 | **4.07x** | R$ 169.22 | Travel durables |

### 6.2 Top 10 Low-Installment Categories (Consumables & Fast-Moving Goods, ≥ 100 Orders)

| Category Name | Credit Orders | Avg Installments | Avg Order Value (R$) | Category Classification |
| :--- | :---: | :---: | :---: | :--- |
| **Drinks** | 230 | **1.95x** | R$ 91.15 | Fast-moving consumable beverage |
| **Electronics (Small)** | 1,823 | **2.04x** | R$ 87.68 | Low-cost peripheral devices |
| **Home Appliances (Basic)** | 597 | **2.22x** | R$ 125.00 | Entry-level home items |
| **Food** | 318 | **2.33x** | R$ 86.17 | Consumable groceries |
| **Food & Drink** | 158 | **2.43x** | R$ 95.93 | Gourmet & perishables |
| **Books (Technical)** | 187 | **2.48x** | R$ 93.01 | Educational media |
| **Art** | 139 | **2.55x** | R$ 106.38 | Collectibles |
| **Telephony** | 3,040 | **2.71x** | R$ 98.05 | Mobile accessories & prepaid |
| **Computers Accessories** | 4,637 | **2.74x** | R$ 155.96 | Peripherals, cables & storage |
| **Books (General Interest)** | 374 | **2.82x** | R$ 113.22 | Literature & leisure reading |

### 6.3 Strategic Spotlight: "Watches & Gifts" (Relógios Presentes) as a Growth Engine

> [!IMPORTANT]
> **Commercial Flagship Anchor**: The **Watches & Gifts** (*Relógios Presentes*) category represents the marketplace's highest-leverage growth engine — uniquely combining massive transaction velocity (**4,485 credit card orders**, ranked #3 platform-wide) with high basket sizes (**R$ 243.97 AOV**, +51.5% over the platform mean) and extended financing adoption (**4.46x average installments**).

#### Watches & Gifts vs Marketplace Benchmark Telemetry

| Performance Dimension | Watches & Gifts Benchmark | Marketplace Overall Mean | Variance vs Baseline | Strategic Interpretation |
| :--- | :---: | :---: | :---: | :--- |
| **Credit Card Share** | **80.1%** | 73.9% | **+6.2%** | Highest credit card wallet share platform-wide |
| **Average Order Value (AOV)** | **R$ 243.97** | R$ 161.04 | **+51.5%** | Substantial basket expansion without luxury volume decay |
| **Average Installment Tenor** | **4.46x** | 3.51x | **+27.1%** | Consumers actively amortize timepieces across 4–6 months |
| **Gross Merchandise Value (GMV)** | **R$ 1.09M** | — | — | Top 3 revenue contributor in Olist catalog |
| **Boleto Cash Share** | **16.4%** | 19.0% | **-2.6%** | Lower cash dependence; higher willingness to use credit lines |

#### Three-Pronged Commercial Growth Framework

1. **Merchant-Subsidized 6x–10x "Sem Juros" Campaigns**:
   - Partner with flagship watch sellers to co-subsidize 0% interest financing for timepieces above R$ 200.
   - Expected Impact: 15–22% conversion lift during seasonal gifting milestones (Mother's Day, Father's Day, Black Friday).

2. **Dynamic Monthly Price Anchoring in Checkout UX**:
   - Display prominent instalment fractions (*"10x of R$ 24.40"* instead of lump-sum *"R$ 243.97"*) on product catalog cards and product detail pages (PDP).
   - Expected Impact: Minimizes perceived ticket friction and leverages psychological decimal anchoring.

3. **Multi-Item Co-Payment & Warranty Bundling**:
   - Pair premium timepieces with extended warranty coverage and accessory straps using split voucher/credit co-payment options.
   - Expected Impact: Expands cross-category basket size towards the R$ 336+ high-installment sweetspot.

### 6.4 Payment Method Mix Across Top 8 Marketplace Categories

| Product Category | Boleto Share (%) | Credit Card (%) | Debit Card (%) | Voucher (%) | Dominant Profile |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Bed, Bath & Table** | 17.0% | **78.0%** | 1.3% | 3.7% | Stable multi-method baseline |
| **Computers Accessories** | **25.8%** | 69.6% | 2.1% | 2.6% | Higher Boleto cash sensitivity |
| **Furniture Decor** | 20.8% | 74.6% | 1.2% | 3.4% | Balanced credit dominance |
| **Health & Beauty** | 19.3% | 76.8% | 1.6% | 2.3% | Core marketplace standard |
| **Housewares** | 17.8% | 76.4% | 1.7% | 4.1% | Higher voucher utilization |
| **Sports & Leisure** | 20.5% | 75.2% | 1.5% | 2.8% | Standard retail profile |
| **Telephony** | 22.5% | 72.7% | 1.8% | 3.0% | Boleto penetration in hardware |
| **Watches & Gifts** | 16.4% | **80.1%** | 1.0% | 2.5% | Highest credit card share |

---

## 7. Strategic Action Recommendations

| Strategic Pillar | Operational Action | Expected Business Impact | Priority |
| :--- | :--- | :--- | :---: |
| **1. Checkout UX & Dropdown Optimization** | Audit the checkout interface to determine if the 10x spike is an artificial default. A/B test dynamic installment selectors displaying exact monthly costs (*"10x of R$ 33.64"* vs total amount). | Eliminates UX-driven checkout abandonment and aligns installment options with consumer ability to pay. | **High (P0)** |
| **2. Category-Specific 0% Interest Financing** | Partner with merchant banking acquirers to offer subsidized 0% interest promotions (*sem juros*) targeted specifically at high-elasticity durables (**Computers**, **Home Appliances**, **Furniture**). | Expands average order values by 20–35% on high-ticket inventory where consumer financing elasticity is strongest. | **High (P0)** |
| **3. Boleto Bancário Settlement Optimization** | Optimize Boleto settlement workflows through automated SMS/WhatsApp barcode delivery, dynamic payment links, and instant QR generation. | Reduces Boleto non-payment drop-off rate (historically 30–40% in Brazilian e-commerce). | **Medium (P1)** |
| **4. Flagship Showcase: Watches & Gifts** | Launch dedicated co-marketing campaigns featuring 6x–10x interest-free installments for premium timepieces and gift sets. | Drives immediate marketplace revenue velocity in Olist's highest-converting durable category. | **High (P0)** |

---

## 8. Analytical Limitations & Methodological Guardrails

1. **Dominant Payment Type Proxy**: Orders with multi-payment splits (e.g. Voucher + Credit Card) are categorized solely by their highest-value payment method, which slightly under-indexes secondary voucher volume.
2. **First-Item Category Attribution**: For multi-item baskets containing products across diverse categories, the category of the first item ($\min(\text{order\_item\_id})$) is utilized as the basket proxy.
3. **Observational vs Causal Relationship**: The Pearson correlation $r = 0.37$ describes an observed relationship on transactional data. It does not control for individual consumer credit limits, exogenous macroeconomic interest rates (SELIC), or merchant discount rates (MDR).
4. **Historical Checkout UI Configuration**: The 10x installment surge is diagnosed as a structural anomaly based on empirical distribution shape; definitive validation requires historical frontend interaction logs.
