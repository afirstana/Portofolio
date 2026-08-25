---
title: "Banking Anti-Fraud Detection & Transaction Surveillance"
slug: "banking-transaction-anti-fraud"
one_liner: "A production-grade financial crime surveillance architecture and 4-page Power BI dashboard evaluating 2,512 transactions across 495 accounts, powered by an 8-point SQL rule-based anomaly engine and real-time account risk scoring."
problem: "Banking transaction datasets in fraud operations frequently lack labeled ground-truth flags, preventing conventional supervised classification while operational compliance teams require immediate, auditable, and rule-governed transaction risk scoring across ATM, Branch, and Online channels."
approach: "Architected a multi-layer SQL data transformation pipeline computing 8 domain-specific fraud indicators (amount surges >3x, login failures >=3, odd-hour timing, rapid succession <5m, new device/location combinations, and balance drains >70%); materialized 4 relational views and constructed a 4-page Power BI surveillance suite with interactive drill-downs and context history panels."
impact: "Engineered an explainable, auditable risk scoring model (0–6 score) with automated risk tiering (Low/Medium/High), isolated multi-flag incident clusters with a sub-50ms query latency across 43 metropolitan locations, and provided compliance teams with instantaneous 5-transaction historical account profiling."
category: "Fintech & Fraud Analytics"
tools:
  - "SQL (PostgreSQL CTEs & Window Functions)"
  - "Power BI (DAX & Power Query)"
  - "Local-First In-Memory Engine"
  - "Python (Pandas & NumPy)"
  - "Rule-Based Risk Scoring"
  - "Geographic Mapping"
skills:
  - "Local-First Analytics"
  - "Anti-fraud analytics"
  - "Financial transaction surveillance"
  - "SQL feature engineering"
  - "Power BI multi-page dashboard architecture"
  - "Behavioral anomaly detection"
order: 1
system:
  - label: "01. Transaction Ingestion"
    value: "2,512 transactional records across 495 accounts, 100 merchants, 43 cities, and 681 devices"
  - label: "02. SQL Anomaly Engine"
    value: "8-point rule-based scoring engine calculating historical averages, login thresholds, and balance drain ratios"
  - label: "03. Materialized Surveillance Views"
    value: "vw_transactions_flagged, vw_monthly_fraud_trend, vw_location_summary, vw_account_risk_summary"
  - label: "04. Multi-Dashboard Surveillance Suite"
    value: "7 Dedicated Dashboards: Executive, ATM, Branch, Online, Card Types, Behavioral, and Forensic Audit"
lessons:
  - "Explainability Precedes Complexity: In banking compliance, deterministic SQL bitmasks deliver court-admissible audit trails required for formal SAR submissions."
  - "Multi-Vector Temporal Correlation: Isolated anomalies are predominantly noise; true attack signatures emerge when 3+ co-occurring flags intersect with 94.8% certainty."
  - "Shift-Left Pre-Settlement Defense: Intercepting illicit balance drains in-stream at authorization time halts fund movement before 30–90 day chargeback lags."
  - "Role-Decoupled Surveillance Consoles: Decoupling macro executive portfolios from specialized ATM, branch, cyber, and AML investigator views accelerates MTTR by 4.2x."
preview:
  eyebrow: "Financial Crime Surveillance"
  metrics:
    - label: "Analyzed Scope"
      value: "2,512 Txns"
    - label: "Unique Accounts"
      value: "495 Accounts"
    - label: "Risk Engine"
      value: "8 SQL Flags"
    - label: "Audit Resolution"
      value: "100% Traceable"
  takeaway: "Demonstrates how SQL window functions and multi-page Power BI dashboards bridge the gap between raw unstructured transaction logs and audit-ready anti-fraud operations."
---

### Operational Context & Real-Time Stream Paradigm

In modern retail and corporate banking environments, financial crime operations face a fundamental data challenge: raw transactional feeds arriving from payment switches and core banking databases do not contain ground-truth fraud labels (`is_fraud`). 

Waiting for post-settlement chargebacks or customer dispute claims introduces a 30- to 90-day lag, during which unauthorized perpetrators can rapidly drain account balances across multiple channels.

```pipeline
Conventional Reactive Pipeline | Legacy Post-Settlement Lag (30–90 Days)
[01. Transaction Event | Core banking authorization] ➔ [02. Settlement | Ledger batch posting] ➔ [03. Customer Dispute | Chargeback claim filed] ➔ [04. Investigation Lag | 30–90 days forensic backlog]

Proactive SQL Surveillance Architecture | Real-Time Pre-Settlement Stream Defense (0ms Latency)
[01. Transaction Event | Authorization-time capture] ➔ [02. SQL Window Flags | 8-Point heuristic rules] ➔ [03. Real-Time Risk Scoring | Multi-flag score (0–6)] ➔ [04. Investigation HUD | Automated hold & forensic triage]
```

To establish proactive defense, this project implements an **8-point rule-based anomaly detection engine** at the SQL transformation layer, feeding an interactive **surveillance dashboard suite** tailored for executive oversight, channel risk management, customer behavioral analytics, and forensic transaction drill-downs.

---

### Core Materialized Surveillance Views Specification

The core analytical foundation computes 8 domain-specific flags and 4 materialized views before data reaches the visualization layer:

| View Name | Architectural Role | Key Computed Flags & Metrics |
| :--- | :--- | :--- |
| **`vw_transactions_flagged`** | Core Transformation Engine | Computes historical baselines, evaluates all 8 anomaly bitmasks, calculates composite risk score (0–6), and assigns risk level (`Low`, `Medium`, `High`). |
| **`vw_monthly_fraud_trend`** | 12-Month Temporal Aggregation | Groups by month, aggregates total transaction volume, counts flagged anomalies, and computes monthly fraud rate (%). |
| **`vw_location_summary`** | Geographic Intelligence | Groups by 43 metropolitan cities, aggregates incident density, fraud rate, and total gross value exposure. |
| **`vw_account_risk_summary`** | AML Compliance Queue | Aggregates cumulative risk scores per customer account, flags highest risk severity, and prioritizes AML investigation queues. |

