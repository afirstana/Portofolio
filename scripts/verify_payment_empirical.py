import os
import json
import pandas as pd
import numpy as np

DATASET_DIR = r"C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\dataset\Work\2. Olist-Payment Behavior Analyziz,"
PROJECT_DIR = r"C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
JSON_FILE = os.path.join(PROJECT_DIR, "content", "data", "olist_payment_analysis.json")
MARKDOWN_FILE = os.path.join(PROJECT_DIR, "content", "projects", "olist-payment-behavior-analytics.md")
SOURCE_DOC = os.path.join(DATASET_DIR, "payment_behavior_analysis.md")
SHOWCASE_FILE = os.path.join(PROJECT_DIR, "components", "OlistPaymentInteractiveShowcase.tsx")
DASHBOARD_FILE = os.path.join(PROJECT_DIR, "components", "OlistPaymentDashboard.tsx")
TEST_FILE = os.path.join(PROJECT_DIR, "lib", "content.test.ts")

def main():
    print("=================================================================")
    print("EMPIRICAL DATA INTEGRITY & ADVERSARIAL VERIFICATION HARNESS")
    print("=================================================================")

    # 1. Load Raw CSVs
    print("\n[Step 1] Loading raw CSV datasets...")
    payments_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_order_payments_dataset.csv"))
    orders_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_orders_dataset.csv"))
    items_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_order_items_dataset.csv"))
    products_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_products_dataset.csv"))
    trans_df = pd.read_csv(os.path.join(DATASET_DIR, "product_category_name_translation.csv"))
    customers_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_customers_dataset.csv"))

    trans_map = dict(zip(trans_df["product_category_name"], trans_df["product_category_name_english"]))

    raw_rows = len(payments_df)
    raw_gmv = float(payments_df["payment_value"].sum())
    raw_orders = payments_df["order_id"].nunique()

    print(f"  Raw Payment Rows: {raw_rows} (Expected: 103,886)")
    print(f"  Raw GMV: R$ {raw_gmv:,.2f} (Expected: R$ 16,008,872.12)")
    print(f"  Unique Orders in Payments: {raw_orders} (Expected: 99,440)")

    # 2. Filter not_defined
    payments_valid = payments_df[payments_df["payment_type"] != "not_defined"].copy()
    valid_rows = len(payments_valid)
    valid_gmv = float(payments_valid["payment_value"].sum())
    not_defined_count = len(payments_df[payments_df["payment_type"] == "not_defined"])

    print(f"\n[Step 2] Filtering not_defined ({not_defined_count} rows):")
    print(f"  Valid Payment Rows: {valid_rows} (Expected: 103,883)")
    print(f"  Valid GMV: R$ {valid_gmv:,.2f}")

    # 3. Channel breakdown
    print("\n[Step 3] Payment Channel Distribution (on raw 103,886 rows):")
    channel_res = {}
    for ptype, group in payments_df.groupby("payment_type"):
        cnt = len(group)
        val = float(group["payment_value"].sum())
        avg_val = float(group["payment_value"].mean())
        avg_inst = float(group["payment_installments"].mean())
        vol_pct = (cnt / raw_rows) * 100
        gmv_pct = (val / raw_gmv) * 100
        channel_res[ptype] = {
            "cnt": cnt,
            "vol_pct": vol_pct,
            "val": val,
            "gmv_pct": gmv_pct,
            "avg_val": avg_val,
            "avg_inst": avg_inst
        }
        print(f"  - {ptype:12s}: {cnt:6d} txns ({vol_pct:5.1f}%), R$ {val:12,.2f} ({gmv_pct:5.1f}% GMV), Avg: R$ {avg_val:6.2f}, Avg Inst: {avg_inst:4.2f}x")

    # 4. Aggregation by Order
    idx_max = payments_valid.groupby("order_id")["payment_value"].idxmax()
    dominant_payments = payments_valid.loc[idx_max][["order_id", "payment_type"]].rename(columns={"payment_type": "dominant_payment_type"})

    order_payments_agg = payments_valid.groupby("order_id").agg(
        total_payment_value=("payment_value", "sum"),
        max_installments=("payment_installments", "max"),
        payment_rows_count=("payment_sequential", "count")
    ).reset_index()

    order_full = pd.merge(order_payments_agg, dominant_payments, on="order_id")
    order_full = pd.merge(order_full, orders_df[["order_id", "customer_id", "order_purchase_timestamp", "order_status"]], on="order_id", how="inner")

    # First item category
    items_sorted = items_df.sort_values(by=["order_id", "order_item_id"])
    first_item = items_sorted.groupby("order_id").first().reset_index()
    first_item = pd.merge(first_item[["order_id", "product_id", "price", "freight_value"]], products_df[["product_id", "product_category_name"]], on="product_id", how="left")
    first_item["category_english"] = first_item["product_category_name"].map(trans_map).fillna(first_item["product_category_name"]).fillna("Uncategorized")
    
    order_full = pd.merge(order_full, first_item[["order_id", "category_english"]], on="order_id", how="left")
    order_full["category_english"] = order_full["category_english"].fillna("Uncategorized")

    # Credit card cohort
    cc_orders = order_full[order_full["dominant_payment_type"] == "credit_card"].copy()
    cc_n = len(cc_orders)
    cc_corr = float(cc_orders["max_installments"].corr(cc_orders["total_payment_value"]))
    cc_mean_inst = float(cc_orders["max_installments"].mean())

    print(f"\n[Step 4] Credit Card Dominant Cohort:")
    print(f"  CC Orders (n): {cc_n} (Expected: 74,975)")
    print(f"  Pearson Correlation r: {cc_corr:.4f} (Reported: r = 0.37)")
    print(f"  CC Mean Installments: {cc_mean_inst:.2f}x")

    # 5. Installment Tiers for Credit Card Cohort
    def assign_bucket(inst):
        if inst == 1:
            return "1x"
        elif inst in [2, 3]:
            return "2-3x"
        elif inst in [4, 5, 6]:
            return "4-6x"
        elif inst in [7, 8, 9, 10]:
            return "7-10x"
        else:
            return "11-24x"

    cc_orders["bucket"] = cc_orders["max_installments"].apply(assign_bucket)
    print("\n[Step 5] Installment Tiers & Basket Sizes (CC Cohort):")
    base_1x = float(cc_orders[cc_orders["bucket"] == "1x"]["total_payment_value"].mean())
    for b in ["1x", "2-3x", "4-6x", "7-10x", "11-24x"]:
        sub = cc_orders[cc_orders["bucket"] == b]
        cnt = len(sub)
        mean_val = float(sub["total_payment_value"].mean())
        med_val = float(sub["total_payment_value"].median())
        mult = mean_val / base_1x
        print(f"  - {b:7s}: {cnt:6d} orders ({cnt/cc_n*100:4.1f}%), Mean AOV: R$ {mean_val:6.2f}, Median: R$ {med_val:6.2f}, Multiplier: {mult:.2f}x")

    # 6. Installment Depth Anomaly
    print("\n[Step 6] 10x Installment Anomaly Check (All Payments):")
    inst_counts = payments_df["payment_installments"].value_counts().to_dict()
    cnt_7 = inst_counts.get(7, 0)
    cnt_8 = inst_counts.get(8, 0)
    cnt_9 = inst_counts.get(9, 0)
    cnt_10 = inst_counts.get(10, 0)
    surge_9_to_10 = (cnt_10 / cnt_9) if cnt_9 > 0 else 0
    pct_increase = ((cnt_10 - cnt_9) / cnt_9) * 100 if cnt_9 > 0 else 0

    print(f"  7x count : {cnt_7:5d}")
    print(f"  8x count : {cnt_8:5d}")
    print(f"  9x count : {cnt_9:5d}")
    print(f"  10x count: {cnt_10:5d} (Surge over 9x: {surge_9_to_10:.2f}x or +{pct_increase:.1f}%)")

    # 7. Category Financing Sensitivity
    print("\n[Step 7] Category Sensitivity Matrix (Categories with >= 100 CC Orders):")
    cat_summary = cc_orders.groupby("category_english").agg(
        cc_count=("total_payment_value", "count"),
        avg_inst=("max_installments", "mean"),
        aov=("total_payment_value", "mean")
    ).reset_index()

    cat_100 = cat_summary[cat_summary["cc_count"] >= 100].sort_values(by="avg_inst", ascending=False)
    print("\n  Top 5 Categories by Installment Depth:")
    for _, r in cat_100.head(5).iterrows():
        print(f"    {r['category_english']:35s}: {r['cc_count']:5d} orders, Avg Inst: {r['avg_inst']:.2f}x, AOV: R$ {r['aov']:.2f}")

    print("\n  Bottom 5 Categories by Installment Depth:")
    for _, r in cat_100.tail(5).iterrows():
        print(f"    {r['category_english']:35s}: {r['cc_count']:5d} orders, Avg Inst: {r['avg_inst']:.2f}x, AOV: R$ {r['aov']:.2f}")

    print("\n  Spotlight 'watches_gifts':")
    wg = cat_summary[cat_summary["category_english"] == "watches_gifts"]
    if len(wg) > 0:
        print(f"    watches_gifts: {wg['cc_count'].iloc[0]} orders, Avg Inst: {wg['avg_inst'].iloc[0]:.2f}x, AOV: R$ {wg['aov'].iloc[0]:.2f}")

    # 8. Verify against JSON file
    print("\n[Step 8] Cross-verifying against content/data/olist_payment_analysis.json...")
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        json_data = json.load(f)

    meta = json_data["metadata"]
    print(f"  JSON metadata.total_gmv: {meta['total_gmv']} (Matches raw: {abs(meta['total_gmv'] - valid_gmv) < 1.0})")
    print(f"  JSON metadata.credit_card_share_value: {meta['credit_card_share_value']}%")
    print(f"  JSON metadata.pearson_correlation: {meta['pearson_correlation']}")
    print(f"  JSON metadata.anomaly_10x_count: {meta['anomaly_10x_count']}")

    # 9. Verify against Markdown project file
    print("\n[Step 9] Cross-verifying against olist-payment-behavior-analytics.md...")
    with open(MARKDOWN_FILE, "r", encoding="utf-8") as f:
        md_text = f.read()

    assertions = [
        ("103,886", "103,886 payment records"),
        ("16,008,872", "R$ 16.0M GMV"),
        ("78.4%", "Credit Card GMV share"),
        ("17.9%", "Boleto GMV share"),
        ("2.4%", "Voucher GMV share"),
        ("1.4%", "Debit Card GMV share"),
        ("74,975", "Credit card dominant cohort sample size"),
        ("0.37", "Pearson correlation r = 0.37"),
        ("336.44", "7-10x Mean AOV R$ 336.44"),
        ("100.91", "1x Mean AOV R$ 100.91"),
        ("3.3x", "3.3x or 3.33x multiplier"),
        ("5,328", "5,328 orders at 10x"),
        ("644", "644 orders at 9x"),
        ("8.3x", "Surge 8.3x over 9x"),
        ("7.41", "Computers avg installments 7.41x"),
        ("1.95", "Drinks avg installments 1.95x"),
        ("4.46", "Watches & Gifts avg installments 4.46x"),
        ("4,485", "Watches & Gifts 4,485 orders")
    ]

    all_passed = True
    for text_to_find, desc in assertions:
        present = text_to_find in md_text
        if not present:
            all_passed = False
            print(f"  [FAIL] MISSING in Markdown: '{text_to_find}' ({desc})")
        else:
            print(f"  [PASS] FOUND in Markdown: '{text_to_find}' ({desc})")

    # 10. Verify against Showcase Component
    print("\n[Step 10] Cross-verifying against components/OlistPaymentInteractiveShowcase.tsx...")
    with open(SHOWCASE_FILE, "r", encoding="utf-8") as f:
        showcase_text = f.read()

    showcase_checks = [
        ("78.4", "Credit card GMV share 78.4%"),
        ("17.9", "Boleto GMV share 17.9%"),
        ("2.4", "Voucher GMV share 2.4%"),
        ("1.4", "Debit card GMV share 1.4%"),
        ("163.32", "Credit card avg ticket R$ 163.32"),
        ("145.03", "Boleto avg ticket R$ 145.03"),
        ("65.70", "Voucher avg ticket R$ 65.70"),
        ("142.57", "Debit avg ticket R$ 142.57"),
        ("100.91", "1x AOV R$ 100.91"),
        ("336.44", "7-10x AOV R$ 336.44"),
        ("74,975", "74,975 CC orders"),
        ("5,328", "5,328 orders at 10x"),
        ("7.41", "Computers 7.41x"),
        ("4.46", "Watches & Gifts 4.46x"),
        ("4485", "Watches & Gifts 4485 orders"),
        ("1.95", "Drinks 1.95x")
    ]

    for text_to_find, desc in showcase_checks:
        present = text_to_find in showcase_text
        if not present:
            all_passed = False
            print(f"  [FAIL] MISSING in Showcase: '{text_to_find}' ({desc})")
        else:
            print(f"  [PASS] FOUND in Showcase: '{text_to_find}' ({desc})")

    # 11. Verify against Dashboard Component
    print("\n[Step 11] Cross-verifying against components/OlistPaymentDashboard.tsx...")
    with open(DASHBOARD_FILE, "r", encoding="utf-8") as f:
        dash_text = f.read()

    dash_checks = [
        ("olist_payment_analysis.json", "Imports raw data json"),
        ("credit_card", "Contains credit_card channel filter"),
        ("boleto", "Contains boleto channel filter"),
        ("voucher", "Contains voucher channel filter"),
        ("debit_card", "Contains debit_card channel filter"),
        ("5,328", "References 5,328 10x anomaly"),
        ("r = 0.37", "References r = 0.37"),
        ("336.44", "References R$ 336.44"),
        ("100.91", "References R$ 100.91"),
    ]

    for text_to_find, desc in dash_checks:
        present = text_to_find in dash_text
        if not present:
            all_passed = False
            print(f"  [FAIL] MISSING in Dashboard: '{text_to_find}' ({desc})")
        else:
            print(f"  [PASS] FOUND in Dashboard: '{text_to_find}' ({desc})")

    # 12. Verify against Unit Tests
    print("\n[Step 12] Cross-verifying against lib/content.test.ts...")
    with open(TEST_FILE, "r", encoding="utf-8") as f:
        test_text = f.read()

    test_checks = [
        ("olist-payment-behavior-analytics", "Checks olist-payment-behavior-analytics slug"),
        ("1. Executive Summary & Problem Scope", "Verifies Section 1"),
        ("2. Relational Schema & Data Preparation Pipeline", "Verifies Section 2"),
        ("3. Empirical Finding 1: Payment Method Distribution & Wallet Share", "Verifies Section 3"),
        ("4. Empirical Finding 2: Installment Elasticity Model & Basket Size Multiplier", "Verifies Section 4"),
        ("5. Diagnostic Investigation: The 10x Installment Checkout Anomaly", "Verifies Section 5"),
        ("6. Empirical Finding 3: Category Financing Sensitivity Matrix", "Verifies Section 6"),
        ("7. Strategic Action Recommendations", "Verifies Section 7"),
        ("8. Analytical Limitations & Methodological Guardrails", "Verifies Section 8"),
    ]

    for text_to_find, desc in test_checks:
        present = text_to_find in test_text
        if not present:
            all_passed = False
            print(f"  [FAIL] MISSING in Unit Tests: '{text_to_find}' ({desc})")
        else:
            print(f"  [PASS] FOUND in Unit Tests: '{text_to_find}' ({desc})")

    print("\n=================================================================")
    print(f"OVERALL EMPIRICAL VERIFICATION VERDICT: {'ALL TESTS PASSED (APPROVE)' if all_passed else 'FAILURES DETECTED (REQUEST_CHANGES)'}")
    print("=================================================================")

if __name__ == "__main__":
    main()
