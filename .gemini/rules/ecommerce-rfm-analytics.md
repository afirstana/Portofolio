# E-Commerce RFM Modeling & Data Invariants

## 1. Grain Invariant: Person vs. Transaction Token
- In marketplace schemas where `customer_id` is generated per checkout session, **ALWAYS** aggregate RFM and retention metrics on the person entity (`customer_unique_id`).
- Grouping on transaction tokens will falsely report `Frequency = 1` for all repeat customers.

## 2. Payment Pre-Aggregation Rule
- When computing Monetary (M) value across relational schemas, always pre-aggregate `order_payments` per `order_id` (`SUM(payment_value) GROUP BY order_id`) prior to table joins to prevent Cartesian multiplication.

## 3. Disagreeable Frequency Distributions (The 97% One-Time Skew)
- When marketplace frequency distributions are heavily skewed (e.g., 97.0% one-time buyers, 3.0% repeat buyers), do not use standard 5-point quintile binning for Frequency.
- **Adopt the Hybrid RFM Engine**:
  - `R_score`: 1–5 Recency Quintiles
  - `M_score`: 1–5 Monetary Quintiles
  - `Frequency`: Discrete behavioral flag (`freq >= 2` vs `freq == 1`)
- **Key Business Segments**:
  - `Cannot Lose Them`: `freq == 1`, `R <= 2`, `M >= 4` (Large-ticket dormant buyers — primary churn crisis).
  - `Promising Big Spenders`: `freq == 1`, `R IN (3,4)`, `M >= 4` (High-value warm buyers — cross-sell window).
  - `New High-Value`: `freq == 1`, `R == 5`, `M >= 4` (Fresh high-value buyers — 2nd purchase conversion target).
  - `Champions`: `freq >= 2`, `R >= 4` (True loyal repeat buyers).
