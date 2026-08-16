# E-Commerce Payment & Installment Behavior Analytics Invariants

## 1. Multi-Payment Order-Level Grain Normalization
- Always aggregate multi-row payment records (`SUM(payment_value)` and `MAX(payment_installments)`) by `order_id` before joining with order item/product catalogs to prevent duplicate counting.
- Determine the representative `dominant_payment_type` per order by selecting the payment row with the largest `payment_value`.

## 2. Installment Elasticity & Basket Value Modeling
- Model the relationship between installment count and Average Order Value (AOV) through discrete bucket analysis (`1x`, `2–3x`, `4–6x`, `7–10x`, `11–24x`).
- Segment product categories into high-consideration durable goods (high installment count, high AOV e.g., Computers, Furniture) vs rapid consumables (1x cash/boleto preference).

## 3. Checkout UX Anomaly Detection
- Isolate unnatural volume spikes at boundary installment tiers (e.g., 10x installment surge) as potential UI/checkout default bias rather than pure organic customer preference.
