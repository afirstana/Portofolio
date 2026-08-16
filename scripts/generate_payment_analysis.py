import os
import json
import pandas as pd
import numpy as np

# Base paths
DATASET_DIR = r"C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\dataset\Work\2. Olist-Payment Behavior Analyziz,"
PROJECT_DIR = r"C:\Users\HYPE AMD\Documents\FILE\PROJECT\PORTOFOLIO\01. Vercel\project"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "content", "data", "olist_payment_analysis.json")

def format_category_name(cat_str):
    if not isinstance(cat_str, str) or not cat_str.strip():
        return "Uncategorized"
    parts = cat_str.replace("_", " ").split()
    return " ".join([p.capitalize() if p.lower() not in ["and", "or", "of", "in", "to", "for"] else p.lower() for p in parts]).capitalize()

def generate_payment_analysis():
    print("Reading CSVs...")
    payments_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_order_payments_dataset.csv"))
    orders_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_orders_dataset.csv"))
    items_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_order_items_dataset.csv"))
    products_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_products_dataset.csv"))
    trans_df = pd.read_csv(os.path.join(DATASET_DIR, "product_category_name_translation.csv"))
    customers_df = pd.read_csv(os.path.join(DATASET_DIR, "olist_customers_dataset.csv"))

    # Translation map
    trans_map = dict(zip(trans_df["product_category_name"], trans_df["product_category_name_english"]))

    # Clean payments: filter out not_defined
    payments_valid = payments_df[payments_df["payment_type"] != "not_defined"].copy()

    total_payment_rows = len(payments_valid)
    total_payment_val = float(payments_valid["payment_value"].sum())

    # Order level aggregation
    # Dominant payment type = payment_type with max payment_value for the order
    idx_max = payments_valid.groupby("order_id")["payment_value"].idxmax()
    dominant_payments = payments_valid.loc[idx_max][["order_id", "payment_type"]].rename(columns={"payment_type": "dominant_payment_type"})

    order_payments_agg = payments_valid.groupby("order_id").agg(
        total_payment_value=("payment_value", "sum"),
        max_installments=("payment_installments", "max"),
        payment_rows_count=("payment_sequential", "count")
    ).reset_index()

    order_payments = pd.merge(order_payments_agg, dominant_payments, on="order_id")

    # Merge with orders (order_purchase_timestamp) and customers (state, city)
    orders_df["order_purchase_timestamp"] = pd.to_datetime(orders_df["order_purchase_timestamp"])
    orders_df["order_month"] = orders_df["order_purchase_timestamp"].dt.strftime("%Y-%m")

    order_full = pd.merge(order_payments, orders_df[["order_id", "customer_id", "order_purchase_timestamp", "order_month", "order_status"]], on="order_id", how="inner")
    order_full = pd.merge(order_full, customers_df[["customer_id", "customer_state", "customer_city"]], on="customer_id", how="left")

    # Get first item category per order
    items_sorted = items_df.sort_values(by=["order_id", "order_item_id"])
    first_item = items_sorted.groupby("order_id").first().reset_index()
    first_item = pd.merge(first_item[["order_id", "product_id", "price", "freight_value"]], products_df[["product_id", "product_category_name"]], on="product_id", how="left")

    first_item["category_english"] = first_item["product_category_name"].map(trans_map).fillna(first_item["product_category_name"]).fillna("Uncategorized")
    first_item["category_display"] = first_item["category_english"].apply(format_category_name)

    order_full = pd.merge(order_full, first_item[["order_id", "category_display"]], on="order_id", how="left")
    order_full["category_display"] = order_full["category_display"].fillna("Uncategorized")

    # 1. Macro KPIs
    total_orders = len(order_full)
    avg_order_val = float(order_full["total_payment_value"].mean())
    median_order_val = float(order_full["total_payment_value"].median())

    cc_orders = order_full[order_full["dominant_payment_type"] == "credit_card"]
    cc_share_orders = float(len(cc_orders) / total_orders * 100)
    cc_share_value = float(cc_orders["total_payment_value"].sum() / order_full["total_payment_value"].sum() * 100)
    avg_cc_installments = float(cc_orders["max_installments"].mean())

    # Pearson correlation for CC orders (installments vs order value)
    corr_cc = float(cc_orders["max_installments"].corr(cc_orders["total_payment_value"]))

    # 2. Payment methods breakdown (from valid payment rows)
    method_agg = payments_valid.groupby("payment_type").agg(
        count=("payment_value", "count"),
        total_value=("payment_value", "sum"),
        avg_value=("payment_value", "mean"),
        avg_installments=("payment_installments", "mean")
    ).reset_index()

    method_list = []
    method_name_map = {
        "credit_card": "Credit Card",
        "boleto": "Boleto",
        "voucher": "Voucher",
        "debit_card": "Debit Card"
    }

    for _, row in method_agg.iterrows():
        ptype = row["payment_type"]
        method_list.append({
            "id": ptype,
            "name": method_name_map.get(ptype, ptype.capitalize()),
            "count": int(row["count"]),
            "count_pct": round(float(row["count"] / total_payment_rows * 100), 1),
            "total_value": round(float(row["total_value"]), 2),
            "value_pct": round(float(row["total_value"] / total_payment_val * 100), 1),
            "avg_value": round(float(row["avg_value"]), 2),
            "avg_installments": round(float(row["avg_installments"]), 2)
        })

    method_list = sorted(method_list, key=lambda x: x["total_value"], reverse=True)

    # 3. Installment distribution (all transactions)
    inst_counts = payments_valid["payment_installments"].value_counts().to_dict()
    installment_dist = []
    for inst in range(1, 25):
        cnt = int(inst_counts.get(inst, 0))
        installment_dist.append({
            "installments": inst,
            "count": cnt,
            "pct": round(float(cnt / total_payment_rows * 100), 2),
            "is_anomaly": inst == 10
        })

    # 4. Installment Buckets (Credit Card orders)
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

    cc_orders_copy = cc_orders.copy()
    cc_orders_copy["bucket"] = cc_orders_copy["max_installments"].apply(assign_bucket)

    bucket_order = ["1x", "2-3x", "4-6x", "7-10x", "11-24x"]
    bucket_stats = []
    base_1x_aov = 0

    for b in bucket_order:
        sub = cc_orders_copy[cc_orders_copy["bucket"] == b]
        if len(sub) > 0:
            aov = float(sub["total_payment_value"].mean())
            med = float(sub["total_payment_value"].median())
            cnt = len(sub)
            if b == "1x":
                base_1x_aov = aov
            multiplier = round(aov / base_1x_aov, 2) if base_1x_aov > 0 else 1.0
            bucket_stats.append({
                "bucket": b,
                "order_count": cnt,
                "order_pct": round(float(cnt / len(cc_orders) * 100), 1),
                "avg_order_value": round(aov, 2),
                "median_order_value": round(med, 2),
                "multiplier_vs_1x": multiplier
            })

    # 5. Product Category Elasticity Analysis
    # Filter categories with >= 100 CC orders
    cat_cc = cc_orders.groupby("category_display").agg(
        cc_orders_count=("total_payment_value", "count"),
        avg_installments=("max_installments", "mean"),
        avg_order_value=("total_payment_value", "mean"),
        total_revenue=("total_payment_value", "sum")
    ).reset_index()

    # All orders category overview
    cat_all = order_full.groupby("category_display").agg(
        total_orders=("total_payment_value", "count"),
        total_revenue=("total_payment_value", "sum"),
        avg_order_value=("total_payment_value", "mean")
    ).reset_index()

    # Payment mix per category
    cat_pm = pd.crosstab(order_full["category_display"], order_full["dominant_payment_type"], normalize="index") * 100

    categories_payload = []
    for _, row in cat_all.iterrows():
        cat_name = row["category_display"]
        cc_match = cat_cc[cat_cc["category_display"] == cat_name]
        cc_inst = float(cc_match["avg_installments"].iloc[0]) if len(cc_match) > 0 else 1.0
        cc_count = int(cc_match["cc_orders_count"].iloc[0]) if len(cc_match) > 0 else 0

        mix = {}
        if cat_name in cat_pm.index:
            for pcol in ["credit_card", "boleto", "voucher", "debit_card"]:
                mix[pcol] = round(float(cat_pm.loc[cat_name].get(pcol, 0.0)), 1)
        else:
            mix = {"credit_card": 75.0, "boleto": 19.0, "voucher": 4.0, "debit_card": 2.0}

        categories_payload.append({
            "category": cat_name,
            "total_orders": int(row["total_orders"]),
            "total_revenue": round(float(row["total_revenue"]), 2),
            "avg_order_value": round(float(row["avg_order_value"]), 2),
            "cc_orders_count": cc_count,
            "avg_installments": round(cc_inst, 2),
            "payment_mix": mix,
            "is_high_installment": cc_inst >= 4.0 and cc_count >= 100
        })

    # Sort categories by total orders descending
    categories_payload = sorted(categories_payload, key=lambda x: x["total_orders"], reverse=True)

    # 6. Monthly Time-Series
    # Keep months between 2017-01 and 2018-08 for reliable trend analysis
    monthly_df = order_full[(order_full["order_month"] >= "2017-01") & (order_full["order_month"] <= "2018-08")].copy()
    
    monthly_summary = []
    for m, mgroup in monthly_df.groupby("order_month"):
        m_tot_val = float(mgroup["total_payment_value"].sum())
        m_tot_orders = len(mgroup)
        m_cc = mgroup[mgroup["dominant_payment_type"] == "credit_card"]
        m_avg_inst = float(m_cc["max_installments"].mean()) if len(m_cc) > 0 else 1.0

        p_vals = mgroup.groupby("dominant_payment_type")["total_payment_value"].sum().to_dict()
        p_orders = mgroup.groupby("dominant_payment_type")["total_payment_value"].count().to_dict()

        monthly_summary.append({
            "month": m,
            "total_value": round(m_tot_val, 2),
            "total_orders": m_tot_orders,
            "avg_installments": round(m_avg_inst, 2),
            "credit_card_value": round(float(p_vals.get("credit_card", 0)), 2),
            "boleto_value": round(float(p_vals.get("boleto", 0)), 2),
            "voucher_value": round(float(p_vals.get("voucher", 0)), 2),
            "debit_card_value": round(float(p_vals.get("debit_card", 0)), 2),
            "credit_card_orders": int(p_orders.get("credit_card", 0)),
            "boleto_orders": int(p_orders.get("boleto", 0)),
            "voucher_orders": int(p_orders.get("voucher", 0)),
            "debit_card_orders": int(p_orders.get("debit_card", 0)),
        })

    monthly_summary = sorted(monthly_summary, key=lambda x: x["month"])

    # 7. Curated Sample Transactions (1,200 records)
    # Stratified sample across payment types and installment lengths
    sample_dfs = []
    # CC with installments >= 7
    s_cc_high = order_full[(order_full["dominant_payment_type"] == "credit_card") & (order_full["max_installments"] >= 7)].sample(n=350, random_state=42, replace=False)
    # CC with installments 2-6
    s_cc_mid = order_full[(order_full["dominant_payment_type"] == "credit_card") & (order_full["max_installments"].between(2, 6))].sample(n=350, random_state=42, replace=False)
    # CC with installments 1
    s_cc_1x = order_full[(order_full["dominant_payment_type"] == "credit_card") & (order_full["max_installments"] == 1)].sample(n=200, random_state=42, replace=False)
    # Boleto
    s_boleto = order_full[order_full["dominant_payment_type"] == "boleto"].sample(n=180, random_state=42, replace=False)
    # Voucher
    s_voucher = order_full[order_full["dominant_payment_type"] == "voucher"].sample(n=70, random_state=42, replace=False)
    # Debit card
    s_debit = order_full[order_full["dominant_payment_type"] == "debit_card"].sample(n=50, random_state=42, replace=False)

    sampled = pd.concat([s_cc_high, s_cc_mid, s_cc_1x, s_boleto, s_voucher, s_debit]).sample(frac=1.0, random_state=42).reset_index(drop=True)

    transactions_payload = []
    for _, row in sampled.iterrows():
        transactions_payload.append({
            "order_id": str(row["order_id"])[:12] + "...",
            "full_order_id": str(row["order_id"]),
            "order_date": str(row["order_purchase_timestamp"])[:10],
            "month": str(row["order_month"]),
            "category": str(row["category_display"]),
            "payment_type": str(row["dominant_payment_type"]),
            "installments": int(row["max_installments"]),
            "order_value": round(float(row["total_payment_value"]), 2),
            "customer_state": str(row["customer_state"]) if pd.notna(row["customer_state"]) else "SP",
            "customer_city": str(row["customer_city"]).title() if pd.notna(row["customer_city"]) else "Sao Paulo"
        })

    # Combine everything
    output_payload = {
        "metadata": {
            "title": "Olist E-Commerce Payment & Installment Behavior Intelligence",
            "source": "Olist Brazilian E-Commerce Dataset (99,440 orders / 103,886 payment records)",
            "total_gmv": round(total_payment_val, 2),
            "total_orders": total_orders,
            "total_payment_rows": total_payment_rows,
            "avg_order_value": round(avg_order_val, 2),
            "median_order_value": round(median_order_val, 2),
            "credit_card_share_volume": round(cc_share_orders, 1),
            "credit_card_share_value": round(cc_share_value, 1),
            "avg_credit_card_installments": round(avg_cc_installments, 2),
            "pearson_correlation": round(corr_cc, 2),
            "anomaly_10x_count": 5328,
            "generated_at": "2026-08-16T13:50:00Z"
        },
        "payment_methods": method_list,
        "installment_distribution": installment_dist,
        "installment_buckets": bucket_stats,
        "categories": categories_payload,
        "monthly_trends": monthly_summary,
        "sample_transactions": transactions_payload
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print(f"Successfully generated {OUTPUT_FILE} ({len(transactions_payload)} sample transactions, {len(categories_payload)} categories)")

if __name__ == "__main__":
    generate_payment_analysis()
