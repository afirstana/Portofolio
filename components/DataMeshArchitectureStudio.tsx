"use client";

import React, { useState, useMemo } from "react";

// ============================================================================
// DOMAIN TOPOLOGY & DATA PRODUCT DATA TYPES
// ============================================================================
interface DomainDataProduct {
  id: string;
  name: string;
  domain: string;
  leadEngineer: string;
  schemaNamespace: string;
  publicPort: string;
  semVer: string;
  protocol: string;
  slaRefresh: string;
  slaAvailability: string;
  consumerCount: number;
  datsis: {
    discoverable: number;
    addressable: number;
    trustworthy: number;
    selfDescribing: number;
    interoperable: number;
    secure: number;
  };
  description: string;
  boundedContext: string;
  inputIngestion: string;
  columns: { name: string; type: string; nullable: boolean; isPII: boolean; desc: string }[];
  sampleRows: Record<string, string | number>[];
}

const DOMAIN_DATA_PRODUCTS: DomainDataProduct[] = [
  {
    id: "leasing",
    name: "Active Lease Portfolio",
    domain: "Core Leasing",
    leadEngineer: "Budi Santoso (Domain Lead)",
    schemaNamespace: "domain_leasing",
    publicPort: "leasing_dp.active_portfolio",
    semVer: "2.1.0",
    protocol: "PostgreSQL ANSI SQL / Iceberg",
    slaRefresh: "Hourly (T+60m)",
    slaAvailability: "99.85%",
    consumerCount: 14,
    datsis: {
      discoverable: 4.8,
      addressable: 4.9,
      trustworthy: 4.7,
      selfDescribing: 4.8,
      interoperable: 4.6,
      secure: 4.7,
    },
    description: "Authoritative financial record of all active, restructured, and grace-period heavy machinery lease contracts across Indonesia.",
    boundedContext: "Lease Contract Lifecycle, Tenor, Disbursement & Principal Balances",
    inputIngestion: "Transactional Core ERP (PostgreSQL CDC via Debezium)",
    columns: [
      { name: "contract_id", type: "VARCHAR(32)", nullable: false, isPII: false, desc: "Unique contract UUID (e.g. CTR-2025-JKT-0811)" },
      { name: "borrower_id", type: "VARCHAR(24)", nullable: false, isPII: false, desc: "Borrower identity foreign key to crm_dp" },
      { name: "asset_id", type: "VARCHAR(24)", nullable: false, isPII: false, desc: "Collateral asset foreign key to equipment_dp" },
      { name: "principal_idr", type: "NUMERIC(15,2)", nullable: false, isPII: false, desc: "Financed principal in Indonesian Rupiah" },
      { name: "tenor_months", type: "INTEGER", nullable: false, isPII: false, desc: "Financing duration in months (12 - 60)" },
      { name: "annual_interest_pct", type: "NUMERIC(5,2)", nullable: false, isPII: false, desc: "Agreed effective annual interest rate" },
      { name: "contract_status", type: "VARCHAR(20)", nullable: false, isPII: false, desc: "ACTIVE, RESTRUCTURED, or GRACE_PERIOD" },
    ],
    sampleRows: [
      { contract_id: "CTR-2025-JKT-0811", borrower_id: "BORR-IDN-0419", asset_id: "EQP-KOM-PC200-91", principal_idr: "2,450,000,000", tenor_months: 36, annual_interest_pct: 10.75, contract_status: "ACTIVE" },
      { contract_id: "CTR-2025-PKU-0194", borrower_id: "BORR-IDN-0882", asset_id: "EQP-CAT-320D-14", principal_idr: "1,850,000,000", tenor_months: 48, annual_interest_pct: 11.25, contract_status: "ACTIVE" },
      { contract_id: "CTR-2024-BPN-0522", borrower_id: "BORR-IDN-0104", asset_id: "EQP-VOL-FMX-08", principal_idr: "3,200,000,000", tenor_months: 24, annual_interest_pct: 10.50, contract_status: "RESTRUCTURED" },
      { contract_id: "CTR-2025-SUB-0731", borrower_id: "BORR-IDN-0655", asset_id: "EQP-HIT-ZX200-44", principal_idr: "2,100,000,000", tenor_months: 36, annual_interest_pct: 11.00, contract_status: "ACTIVE" },
    ],
  },
  {
    id: "equipment",
    name: "Fleet Telematics IoT Summary",
    domain: "Asset & Heavy Equipment",
    leadEngineer: "Hendro Wijaya (IoT Squad)",
    schemaNamespace: "domain_equipment",
    publicPort: "equipment_dp.telematics_summary",
    semVer: "1.4.2",
    protocol: "PostgreSQL ANSI SQL / S3 Parquet",
    slaRefresh: "Near Real-time (T+15m)",
    slaAvailability: "99.90%",
    consumerCount: 9,
    datsis: {
      discoverable: 4.7,
      addressable: 4.8,
      trustworthy: 4.6,
      selfDescribing: 4.6,
      interoperable: 4.5,
      secure: 4.5,
    },
    description: "Live IoT telematics feed summarizing operating hours, GPS geofencing, engine telemetry, and physical collateral health.",
    boundedContext: "Heavy Equipment Machine Assets, Sensors & Field Operations",
    inputIngestion: "MQTT Telematics Broker -> TimescaleDB Time-Series Engine",
    columns: [
      { name: "asset_id", type: "VARCHAR(24)", nullable: false, isPII: false, desc: "Machine equipment primary identifier" },
      { name: "machine_category", type: "VARCHAR(30)", nullable: false, isPII: false, desc: "Excavator, Dump Truck, Wheel Loader, Bulldozer" },
      { name: "brand_model", type: "VARCHAR(40)", nullable: false, isPII: false, desc: "Komatsu PC200, Caterpillar 320D, Volvo FMX" },
      { name: "total_operating_hours", type: "INTEGER", nullable: false, isPII: false, desc: "Cumulative engine operating hours" },
      { name: "telematics_signal_status", type: "VARCHAR(24)", nullable: false, isPII: false, desc: "ONLINE, SIGNAL_LOST, GEOFENCE_BREACH" },
      { name: "collateral_health_tier", type: "VARCHAR(20)", nullable: false, isPII: false, desc: "TIER_1_OPTIMAL, TIER_2_WARNING, TIER_3_CRITICAL" },
    ],
    sampleRows: [
      { asset_id: "EQP-KOM-PC200-91", machine_category: "Excavator", brand_model: "Komatsu PC200-8", total_operating_hours: 4820, telematics_signal_status: "ONLINE", collateral_health_tier: "TIER_1_OPTIMAL" },
      { asset_id: "EQP-CAT-320D-14", machine_category: "Excavator", brand_model: "CAT 320D Hydraulic", total_operating_hours: 8140, telematics_signal_status: "ONLINE", collateral_health_tier: "TIER_2_WARNING" },
      { asset_id: "EQP-VOL-FMX-08", machine_category: "Dump Truck", brand_model: "Volvo FMX 440 6x4", total_operating_hours: 11950, telematics_signal_status: "SIGNAL_LOST", collateral_health_tier: "TIER_3_CRITICAL" },
      { asset_id: "EQP-HIT-ZX200-44", machine_category: "Excavator", brand_model: "Hitachi ZX200-5G", total_operating_hours: 3250, telematics_signal_status: "ONLINE", collateral_health_tier: "TIER_1_OPTIMAL" },
    ],
  },
  {
    id: "risk",
    name: "Underwriting & Credit Risk Scores",
    domain: "Credit Risk & Underwriting",
    leadEngineer: "Citra Dewi (Risk Lead)",
    schemaNamespace: "domain_risk",
    publicPort: "risk_dp.underwriting_scores",
    semVer: "3.0.1",
    protocol: "PostgreSQL ANSI SQL / Trino",
    slaRefresh: "Daily Batch (T+24h)",
    slaAvailability: "99.95%",
    consumerCount: 18,
    datsis: {
      discoverable: 4.9,
      addressable: 4.8,
      trustworthy: 4.9,
      selfDescribing: 4.7,
      interoperable: 4.7,
      secure: 4.8,
    },
    description: "Statistical probability of default (PD) estimates, credit risk ratings, and debt service coverage ratios calculated by internal ML models.",
    boundedContext: "Borrower Credit Worthiness, Underwriting Models & OJK Risk Tiers",
    inputIngestion: "Risk Scoring Microservice + OJK SLIK Credit Bureau Batch Ingest",
    columns: [
      { name: "borrower_id", type: "VARCHAR(24)", nullable: false, isPII: false, desc: "Borrower entity identifier" },
      { name: "credit_score", type: "INTEGER", nullable: false, isPII: false, desc: "Standard credit rating score (300 - 850)" },
      { name: "probability_of_default", type: "NUMERIC(4,3)", nullable: false, isPII: false, desc: "12-month expected PD rate (0.000 - 1.000)" },
      { name: "historical_risk_tier", type: "VARCHAR(20)", nullable: false, isPII: false, desc: "AAA, AA, A, BBB, BB, C, D" },
      { name: "dscr_ratio", type: "NUMERIC(4,2)", nullable: false, isPII: false, desc: "Debt Service Coverage Ratio (>1.25 required)" },
    ],
    sampleRows: [
      { borrower_id: "BORR-IDN-0419", credit_score: 745, probability_of_default: 0.024, historical_risk_tier: "AA", dscr_ratio: 1.82 },
      { borrower_id: "BORR-IDN-0882", credit_score: 690, probability_of_default: 0.058, historical_risk_tier: "BBB", dscr_ratio: 1.45 },
      { borrower_id: "BORR-IDN-0104", credit_score: 540, probability_of_default: 0.220, historical_risk_tier: "C", dscr_ratio: 0.94 },
      { borrower_id: "BORR-IDN-0655", credit_score: 715, probability_of_default: 0.038, historical_risk_tier: "A", dscr_ratio: 1.60 },
    ],
  },
  {
    id: "crm",
    name: "Borrower Directory (UU PDP Compliant)",
    domain: "Customer & KYC",
    leadEngineer: "Agus Pratama (KYC Squad)",
    schemaNamespace: "domain_crm",
    publicPort: "crm_dp.borrower_directory",
    semVer: "2.0.0",
    protocol: "PostgreSQL Dynamic Masked View",
    slaRefresh: "Near Real-time (T+5m)",
    slaAvailability: "99.92%",
    consumerCount: 22,
    datsis: {
      discoverable: 4.9,
      addressable: 4.8,
      trustworthy: 4.8,
      selfDescribing: 4.9,
      interoperable: 4.7,
      secure: 5.0,
    },
    description: "Verified Indonesian commercial borrower directory enforcing automated NIK and telephone masking under UU PDP No. 27/2022.",
    boundedContext: "Customer Identity, Business Registrations & Privacy Compliance",
    inputIngestion: "Branch Onboarding Portal & Dukcapil Citizen API Verification",
    columns: [
      { name: "borrower_id", type: "VARCHAR(24)", nullable: false, isPII: false, desc: "Unique borrower identifier" },
      { name: "company_name", type: "VARCHAR(100)", nullable: false, isPII: false, desc: "Registered commercial contractor name" },
      { name: "business_sector", type: "VARCHAR(40)", nullable: false, isPII: false, desc: "Mining, Agribusiness, Civil Infrastructure" },
      { name: "nik_masked", type: "VARCHAR(20)", nullable: false, isPII: true, desc: "UU PDP Masked NIK (3201************0004)" },
      { name: "contact_masked", type: "VARCHAR(20)", nullable: false, isPII: true, desc: "Masked phone (0812****9012)" },
      { name: "registered_province", type: "VARCHAR(30)", nullable: false, isPII: false, desc: "East Kalimantan, Riau, South Sumatra, West Java" },
    ],
    sampleRows: [
      { borrower_id: "BORR-IDN-0419", company_name: "PT Nusantara Mining Logistik", business_sector: "Mining", nik_masked: "3201************0419", contact_masked: "0811****3210", registered_province: "East Kalimantan" },
      { borrower_id: "BORR-IDN-0882", company_name: "PT Sawit Sejahtera Bersama", business_sector: "Agribusiness", nik_masked: "1402************0882", contact_masked: "0812****8891", registered_province: "Riau" },
      { borrower_id: "BORR-IDN-0104", company_name: "CV Kutai Transport Prima", business_sector: "Mining Hauling", nik_masked: "6401************0104", contact_masked: "0821****0104", registered_province: "East Kalimantan" },
      { borrower_id: "BORR-IDN-0655", company_name: "PT Java Mandiri Konstruksi", business_sector: "Civil Infrastructure", nik_masked: "3171************0655", contact_masked: "0813****9922", registered_province: "West Java" },
    ],
  },
  {
    id: "finance",
    name: "Collections & Arrears Ledger",
    domain: "Billing & Treasury",
    leadEngineer: "Maya Indah (Treasury Squad)",
    schemaNamespace: "domain_finance",
    publicPort: "finance_dp.payment_performance",
    semVer: "1.3.0",
    protocol: "PostgreSQL ANSI SQL / Real-time Ledger",
    slaRefresh: "Continuous (T+1m)",
    slaAvailability: "99.98%",
    consumerCount: 16,
    datsis: {
      discoverable: 4.8,
      addressable: 4.9,
      trustworthy: 4.9,
      selfDescribing: 4.7,
      interoperable: 4.6,
      secure: 4.7,
    },
    description: "Real-time payment reconciliation stream calculating Days Past Due (DPD), late penalties, and collection aging buckets.",
    boundedContext: "Installment Invoicing, Bank Reconciliation & Default Tracking",
    inputIngestion: "Bank Mandiri / BCA Virtual Account Webhook Reconciliation",
    columns: [
      { name: "contract_id", type: "VARCHAR(32)", nullable: false, isPII: false, desc: "Contract foreign key to leasing_dp" },
      { name: "current_dpd", type: "INTEGER", nullable: false, isPII: false, desc: "Current Days Past Due (0 = On-time)" },
      { name: "consecutive_late_months", type: "INTEGER", nullable: false, isPII: false, desc: "Number of consecutive late installment cycles" },
      { name: "dpd_bucket", type: "VARCHAR(20)", nullable: false, isPII: false, desc: "CURRENT, DPD_1_30, DPD_31_60, DPD_61_90, DPD_90_PLUS" },
      { name: "last_payment_date", type: "DATE", nullable: false, isPII: false, desc: "Most recent settled payment timestamp" },
    ],
    sampleRows: [
      { contract_id: "CTR-2025-JKT-0811", current_dpd: 0, consecutive_late_months: 0, dpd_bucket: "CURRENT", last_payment_date: "2026-09-28" },
      { contract_id: "CTR-2025-PKU-0194", current_dpd: 12, consecutive_late_months: 1, dpd_bucket: "DPD_1_30", last_payment_date: "2026-09-15" },
      { contract_id: "CTR-2024-BPN-0522", current_dpd: 94, consecutive_late_months: 3, dpd_bucket: "DPD_90_PLUS", last_payment_date: "2026-06-22" },
      { contract_id: "CTR-2025-SUB-0731", current_dpd: 0, consecutive_late_months: 0, dpd_bucket: "CURRENT", last_payment_date: "2026-09-30" },
    ],
  },
];

// ============================================================================
// SIMULATED CI DATA CONTRACT VALIDATION SCENARIOS
// ============================================================================
interface ContractScenario {
  id: string;
  label: string;
  description: string;
  verdict: "PASS" | "FAIL";
  failureType?: "DRIFT" | "PII_LEAK" | "SLA_BREACH";
  logs: { level: "INFO" | "WARN" | "ERROR" | "SUCCESS"; message: string }[];
  summary: string;
}

const CONTRACT_SCENARIOS: ContractScenario[] = [
  {
    id: "clean-pr",
    label: "Scenario A: Clean Pull Request (Passing Build Gate)",
    description: "Domain leasing squad submits contract update bumping minor SemVer (v2.1.0 -> v2.2.0) with zero schema drift and 100% PII masking.",
    verdict: "PASS",
    logs: [
      { level: "INFO", message: "[CI-INIT] Fetching contract spec: configs/contracts/leasing_contract_v2.yaml" },
      { level: "INFO", message: "[SYNTAX-CHECK] Validating ODCS schema against OpenDataContract v2.1 spec: VALID" },
      { level: "INFO", message: "[SEMVER-CHECK] Current: 2.1.0 -> Proposed: 2.2.0 (Additive Non-Breaking Change: PASS)" },
      { level: "INFO", message: "[EPHEMERAL-DB] Spun up isolated test instance: postgres://ci_test:5432/nusafinance" },
      { level: "INFO", message: "[SCHEMA-AUDIT] Comparing 7 columns in information_schema vs ODCS schema definitions: 100% MATCH" },
      { level: "INFO", message: "[GREAT-EXPECTATIONS] Running test suite: 'expect_table_columns_to_match_ordered_set'... PASSED" },
      { level: "INFO", message: "[GREAT-EXPECTATIONS] Running test suite: 'expect_column_values_to_not_be_null' on contract_id... PASSED" },
      { level: "INFO", message: "[UU-PDP-SCANNER] Executing Regex scanner (r'\\d{16}') across 500 sample records for raw NIK exposure..." },
      { level: "SUCCESS", message: "[UU-PDP-SCANNER] 0 unmasked NIK matches detected. Dynamic port masking verified compliant." },
      { level: "SUCCESS", message: "[GATE-PASSED] All 8 CI validation gates passed. Pull request approved for merge." },
    ],
    summary: "Build Gate PASSED. All schema assertions verified, SemVer backward-compatibility confirmed, and 0 raw PII elements detected.",
  },
  {
    id: "schema-drift",
    label: "Scenario B: Silent Schema Drift (Dropped tenor_months)",
    description: "Upstream developer renamed 'tenor_months' to 'tenor_duration' in operational table without updating the ODCS contract spec.",
    verdict: "FAIL",
    failureType: "DRIFT",
    logs: [
      { level: "INFO", message: "[CI-INIT] Fetching contract spec: configs/contracts/leasing_contract_v2.yaml" },
      { level: "INFO", message: "[SYNTAX-CHECK] Validating ODCS schema against OpenDataContract v2.1 spec: VALID" },
      { level: "INFO", message: "[SEMVER-CHECK] Comparing schema signature with production registry..." },
      { level: "ERROR", message: "[SCHEMA-DRIFT-ALERT] Column 'tenor_months' required by contract is MISSING from physical view 'leasing_dp.active_portfolio'!" },
      { level: "ERROR", message: "[VIOLATION] Detected unannounced physical column: 'tenor_duration' (Type: INTEGER)" },
      { level: "ERROR", message: "[BREAKAGE-GUARD] 14 downstream consumer pipelines depend on 'tenor_months' (including Risk 360 & Finance Treasury)." },
      { level: "ERROR", message: "[BUILD-BLOCKED] Breaking contract change detected without MAJOR SemVer bump (e.g. v3.0.0) or deprecation grace window." },
    ],
    summary: "Build Gate FAILED. Proactive shift-left test prevented production breakage of 14 downstream consumer pipelines.",
  },
  {
    id: "pii-leak",
    label: "Scenario C: Critical UU PDP PII Leak (Unmasked NIK)",
    description: "New junior developer exposed raw 16-digit Indonesian NIK in public output view without applying dynamic RLS masking function.",
    verdict: "FAIL",
    failureType: "PII_LEAK",
    logs: [
      { level: "INFO", message: "[CI-INIT] Fetching contract spec: configs/contracts/crm_contract_v2.yaml" },
      { level: "INFO", message: "[SYNTAX-CHECK] ODCS schema parsed successfully." },
      { level: "INFO", message: "[UU-PDP-SCANNER] Initializing Indonesian Personal Data Protection (UU PDP No. 27/2022) Privacy Audit..." },
      { level: "INFO", message: "[SCANNING] Running pattern matching regex (r'\\d{16}') against output port 'crm_dp.borrower_directory'..." },
      { level: "ERROR", message: "[CRITICAL PRIVACY BREACH] Raw 16-digit citizen NIK detected in row 4: '3201884920480004'!" },
      { level: "ERROR", message: "[LEGAL VIOLATION] Exposing unmasked NIK violates UU PDP Pasal 16 & Pasal 20 (Data Minimization & Encryption)." },
      { level: "ERROR", message: "[SECURITY LOCK] Port deployment permanently halted. Access tokens revoked until dynamic RLS masking view is restored." },
    ],
    summary: "Build Gate FAILED (Critical Security Gate). Prevented severe regulatory violation and potential \$1.2M (2% revenue) fine under UU PDP.",
  },
  {
    id: "sla-breach",
    label: "Scenario D: Freshness SLA Constraint Breach",
    description: "Batch ETL sync lagged due to upstream database lock, exceeding the contracted 60-minute freshness threshold.",
    verdict: "FAIL",
    failureType: "SLA_BREACH",
    logs: [
      { level: "INFO", message: "[CI-INIT] Polling data freshness telemetry for leasing_dp.active_portfolio" },
      { level: "INFO", message: "[SLA-OBSERVABILITY] Contracted freshness SLA: T+60 minutes (Hourly)" },
      { level: "WARN", message: "[TELEMETRY] Current database timestamp: 2026-10-01 22:00:00 WIB" },
      { level: "WARN", message: "[TELEMETRY] Last updated record timestamp: 2026-10-01 19:15:00 WIB (Delta: 165 minutes)" },
      { level: "ERROR", message: "[SLA-VIOLATION] Freshness breach detected: 165 minutes exceeds contracted 60-minute threshold by 175%!" },
      { level: "ERROR", message: "[ALERT DISPATCHED] PagerDuty incident generated to squads-leasing@nusafinance.co.id. Port health tagged DEGRADED." },
    ],
    summary: "Health Check FAILED. Output port marked DEGRADED in catalog; automated PagerDuty alert routed to domain owner.",
  },
];

// ============================================================================
// SIMULATED CROSS-DOMAIN RISK 360 DATASET
// ============================================================================
interface Risk360Row {
  contractId: string;
  borrowerId: string;
  companyName: string;
  sector: "Mining" | "Agribusiness" | "Civil Infrastructure";
  province: string;
  nikRaw: string;
  nikMasked: string;
  contactRaw: string;
  contactMasked: string;
  principalBillionIdr: number;
  tenorMonths: number;
  interestPct: number;
  machineModel: string;
  machineCategory: string;
  operatingHours: number;
  telematicsStatus: "ONLINE" | "SIGNAL_LOST" | "GEOFENCE_BREACH";
  collateralHealth: "OPTIMAL" | "WARNING" | "CRITICAL";
  creditScore: number;
  probDefaultPct: number;
  currentDpd: number;
  riskClassification: "HEALTHY_PERFORMING" | "MODERATE_MONITORING" | "ELEVATED_WATCHLIST" | "SEVERELY_IMPAIRED";
}

const RISK_360_DATA: Risk360Row[] = [
  {
    contractId: "CTR-2025-JKT-0811",
    borrowerId: "BORR-IDN-0419",
    companyName: "PT Nusantara Mining Logistik",
    sector: "Mining",
    province: "East Kalimantan",
    nikRaw: "3201041982040002",
    nikMasked: "3201************0002",
    contactRaw: "081198765432",
    contactMasked: "0811****5432",
    principalBillionIdr: 2.45,
    tenorMonths: 36,
    interestPct: 10.75,
    machineModel: "Komatsu PC200-8",
    machineCategory: "Excavator",
    operatingHours: 4820,
    telematicsStatus: "ONLINE",
    collateralHealth: "OPTIMAL",
    creditScore: 745,
    probDefaultPct: 2.4,
    currentDpd: 0,
    riskClassification: "HEALTHY_PERFORMING",
  },
  {
    contractId: "CTR-2025-PKU-0194",
    borrowerId: "BORR-IDN-0882",
    companyName: "PT Sawit Sejahtera Bersama",
    sector: "Agribusiness",
    province: "Riau",
    nikRaw: "1402088289090001",
    nikMasked: "1402************0001",
    contactRaw: "081234567890",
    contactMasked: "0812****7890",
    principalBillionIdr: 1.85,
    tenorMonths: 48,
    interestPct: 11.25,
    machineModel: "CAT 320D Hydraulic",
    machineCategory: "Excavator",
    operatingHours: 8140,
    telematicsStatus: "ONLINE",
    collateralHealth: "WARNING",
    creditScore: 690,
    probDefaultPct: 5.8,
    currentDpd: 12,
    riskClassification: "MODERATE_MONITORING",
  },
  {
    contractId: "CTR-2024-BPN-0522",
    borrowerId: "BORR-IDN-0104",
    companyName: "CV Kutai Transport Prima",
    sector: "Mining",
    province: "East Kalimantan",
    nikRaw: "6401010477030005",
    nikMasked: "6401************0005",
    contactRaw: "082199887766",
    contactMasked: "0821****7766",
    principalBillionIdr: 3.20,
    tenorMonths: 24,
    interestPct: 10.50,
    machineModel: "Volvo FMX 440 6x4",
    machineCategory: "Dump Truck",
    operatingHours: 11950,
    telematicsStatus: "SIGNAL_LOST",
    collateralHealth: "CRITICAL",
    creditScore: 540,
    probDefaultPct: 22.0,
    currentDpd: 94,
    riskClassification: "SEVERELY_IMPAIRED",
  },
  {
    contractId: "CTR-2025-SUB-0731",
    borrowerId: "BORR-IDN-0655",
    companyName: "PT Java Mandiri Konstruksi",
    sector: "Civil Infrastructure",
    province: "West Java",
    nikRaw: "3171065591010003",
    nikMasked: "3171************0003",
    contactRaw: "081311223344",
    contactMasked: "0813****3344",
    principalBillionIdr: 2.10,
    tenorMonths: 36,
    interestPct: 11.00,
    machineModel: "Hitachi ZX200-5G",
    machineCategory: "Excavator",
    operatingHours: 3250,
    telematicsStatus: "ONLINE",
    collateralHealth: "OPTIMAL",
    creditScore: 715,
    probDefaultPct: 3.8,
    currentDpd: 0,
    riskClassification: "HEALTHY_PERFORMING",
  },
  {
    contractId: "CTR-2025-MDN-0388",
    borrowerId: "BORR-IDN-0912",
    companyName: "CV Andalas Agro Sawit",
    sector: "Agribusiness",
    province: "North Sumatra",
    nikRaw: "1271091285070008",
    nikMasked: "1271************0008",
    contactRaw: "081988223311",
    contactMasked: "0819****3311",
    principalBillionIdr: 1.40,
    tenorMonths: 36,
    interestPct: 11.50,
    machineModel: "Komatsu WA200 Loader",
    machineCategory: "Wheel Loader",
    operatingHours: 6400,
    telematicsStatus: "GEOFENCE_BREACH",
    collateralHealth: "WARNING",
    creditScore: 630,
    probDefaultPct: 9.2,
    currentDpd: 38,
    riskClassification: "ELEVATED_WATCHLIST",
  },
  {
    contractId: "CTR-2024-PLG-0902",
    borrowerId: "BORR-IDN-0234",
    companyName: "PT Sriwijaya Alat Berat",
    sector: "Mining",
    province: "South Sumatra",
    nikRaw: "1671023488050007",
    nikMasked: "1671************0007",
    contactRaw: "085277889900",
    contactMasked: "0852****9900",
    principalBillionIdr: 4.10,
    tenorMonths: 48,
    interestPct: 10.25,
    machineModel: "CAT D8R Bulldozer",
    machineCategory: "Bulldozer",
    operatingHours: 10200,
    telematicsStatus: "ONLINE",
    collateralHealth: "WARNING",
    creditScore: 665,
    probDefaultPct: 7.5,
    currentDpd: 18,
    riskClassification: "MODERATE_MONITORING",
  },
];

// ============================================================================
// ARCHITECTURAL INTERVIEW PREP & FAQ KNOWLEDGE BASE
// ============================================================================
interface InterviewFAQ {
  id: string;
  category: "Framework & Strategy" | "Governance & Compliance" | "Data Engineering" | "Organization & People";
  question: string;
  interviewerIntent: string;
  modelAnswer: string;
  nusaFinanceApplication: string;
}

const INTERVIEW_FAQS: InterviewFAQ[] = [
  {
    id: "faq-01",
    category: "Framework & Strategy",
    question: "When should an enterprise NOT adopt Data Mesh? What are the prerequisite maturity thresholds?",
    interviewerIntent: "Assesses whether the candidate evaluates architecture pragmatically rather than blindly chasing modern buzzwords.",
    modelAnswer: "Data Mesh is not a universal panacea. You should NOT adopt it if: (1) The organization has fewer than 3 distinct business domains and under 30 engineers—the organizational coordination overhead will exceed any decentralized benefit. (2) Engineering culture lacks fundamental hygiene (no Git, CI/CD, or automated testing). (3) The enterprise is unwilling to allocate engineering resources directly into business domains. Prerequisite thresholds include at least 3-5 distinct domain bounded contexts, persistent central data team bottlenecks (>3-week queue delays), and executive sponsorship for domain-aligned funding models.",
    nusaFinanceApplication: "PT NusaFinance met every threshold: 5 independent domains across Indonesia, 45 branch offices, a severe 3-6 week central backlog, and multi-billion Rupiah credit risk exposure requiring real-time cross-domain joins.",
  },
  {
    id: "faq-02",
    category: "Governance & Compliance",
    question: "How do you resolve schema versioning conflicts when Domain A introduces breaking changes needed by Domain B?",
    interviewerIntent: "Tests real-world operational distributed systems governance and semantic versioning discipline.",
    modelAnswer: "We enforce strict Semantic Versioning (SemVer) on all public Data Product Output Ports. Minor and patch updates (additive fields, optimizations) are deployed continuously with backward compatibility. When a breaking change (MAJOR bump) is unavoidable, Domain A is contractually required to maintain concurrent dual output ports (v1 and v2) for an agreed deprecation grace window (typically 90 days). Automated platform telemetry tracks downstream query volume on v1; only when consumption reaches zero is v1 decommissioned.",
    nusaFinanceApplication: "When Core Leasing needed to restructure interest calculations, they maintained leasing_dp.active_portfolio_v1 alongside v2, preventing any disruption to the Risk 360 analytical engine while downstream squads migrated.",
  },
  {
    id: "faq-03",
    category: "Data Engineering",
    question: "How does Data Mesh handle cross-domain joins without recreating the centralized monolithic bottleneck in the compute engine?",
    interviewerIntent: "Checks understanding of distributed query execution, in-memory federation (Trino), and higher-order consumer data products.",
    modelAnswer: "Decouple ad-hoc exploration from high-frequency production aggregation. For ad-hoc analytics, deploy distributed in-memory query federation (such as Trino/Presto) that pushes predicate filters down to domain output ports without copying data. For high-frequency, business-critical aggregations, establish a 'Higher-Order Consumer-Aligned Data Product' (e.g. Risk 360). This product explicitly consumes contracted upstream ports, materializes the joined dataset on an optimized cadence, and exposes its own SLA-backed output port with clear ownership.",
    nusaFinanceApplication: "The Credit Risk domain owns the Risk 360 data product, ingesting outputs from leasing_dp, equipment_dp, crm_dp, and finance_dp to provide sub-second queries for executive credit committees.",
  },
  {
    id: "faq-04",
    category: "Governance & Compliance",
    question: "How do you enforce Indonesian UU PDP No. 27/2022 and OJK financial regulations across 5 autonomous engineering squads?",
    interviewerIntent: "Validates practical regulatory engineering in Indonesian banking/fintech contexts.",
    modelAnswer: "Through Federated Computational Governance, shifting compliance from manual post-hoc audits to automated CI/CD build gates. We enforce three computational controls: (1) CI Regex Linters scanning PR sample data for unmasked 16-digit citizen NIK patterns. (2) Self-serve platform dynamic Row-Level Security (RLS) views masking sensitive columns by default. (3) OpenLineage cryptographic audit logging recording every read access on public output ports to satisfy UU PDP Pasal 39 and OJK POJK 35/POJK.05/2018 audit mandates.",
    nusaFinanceApplication: "crm_dp.borrower_directory dynamically returns masked NIKs (3201************0004) to standard analytical consumers, while privileged compliance officers receive unmasked data via cryptographic session tokens.",
  },
  {
    id: "faq-05",
    category: "Framework & Strategy",
    question: "What is the concrete architectural difference between a Data Lakehouse and a Data Mesh?",
    interviewerIntent: "Tests clarity between architectural technology stacks vs socio-technical operating models.",
    modelAnswer: "A Data Lakehouse is a technology stack (object storage + ACID table formats like Iceberg/Delta Lake + compute engines like Spark/Trino). A Data Mesh is an organizational and socio-technical architectural paradigm (domain ownership, data as a product, self-serve platform, computational governance). Crucially, an enterprise can build a Data Mesh USING Lakehouse technology! In our architecture, domain teams use PostgreSQL and Apache Iceberg (Lakehouse storage primitives), while Data Mesh governs how squads own, contract, and federate those assets.",
    nusaFinanceApplication: "PT NusaFinance utilizes PostgreSQL schema isolation and Iceberg tables as the underlying storage layer, organized and governed under the 4 Data Mesh pillars.",
  },
  {
    id: "faq-06",
    category: "Organization & People",
    question: "How do you incentivize domain squads to treat their data as a product rather than an unwanted operational chore?",
    interviewerIntent: "Probes leadership, organizational alignment, and engineering cultural transformation capability.",
    modelAnswer: "By aligning incentives, reducing platform friction, and establishing executive visibility: (1) Internal cross-charging where domains receive platform credits or budget recognition from downstream consumer usage. (2) Integrating data product health metrics (SLA compliance, consumer NPS) into engineering directors' quarterly OKRs. (3) Radical reduction in platform cognitive friction—the central platform team provides automated scaffolding templates allowing domain teams to stand up contracted output ports in under 30 minutes.",
    nusaFinanceApplication: "PT NusaFinance instituted quarterly DATSIS Excellence Awards and tied 15% of domain squad leads' performance bonuses to output port uptime and contract SLA adherence.",
  },
  {
    id: "faq-07",
    category: "Framework & Strategy",
    question: "How do you prevent 'Data Silo 2.0' where autonomous domains hoard data or build duplicate pipelines?",
    interviewerIntent: "Evaluates systemic governance mechanisms that maintain organizational coherence in decentralized systems.",
    modelAnswer: "Data silos occur in the absence of discoverability and shared accountability. We combat this through: (1) Mandatory Central Catalog Registry—datasets not registered with ODCS contracts cannot be queried or routed across the corporate network. (2) Bi-weekly Federated Governance Council where domain leads review new analytical requirements to prevent duplicate modeling. (3) Standardized Interoperable Protocols (ANSI SQL, Iceberg/Parquet)—prohibiting proprietary, inaccessible domain formats.",
    nusaFinanceApplication: "All 5 domains publish metadata directly to the central catalog; when Field Operations required telematics data, they consumed equipment_dp rather than deploying redundant IoT pipelines.",
  },
  {
    id: "faq-08",
    category: "Data Engineering",
    question: "Explain the technical architecture of an automated Data Contract CI/CD validation pipeline.",
    interviewerIntent: "Drills into shift-left testing, automated linting, and GitOps data engineering implementation details.",
    modelAnswer: "Our pipeline executes 4 sequential gates in GitHub Actions: (1) ODCS Syntax & Linter Gate validating YAML metadata, contact emails, and SemVer tags. (2) Git Registry Backward-Compatibility Comparator catching dropped or renamed columns. (3) Ephemeral Staging Deployment launching an isolated PostgreSQL Docker container seeded with test fixtures. (4) Great Expectations & PII Assertions executing schema, nullability, range checks, and regex privacy scans. Only 100% passing PRs can be merged to main.",
    nusaFinanceApplication: "The computational_contract_validator.py script runs in 42 seconds in CI, completely eliminating the 14 monthly silent schema breakages previously experienced in production.",
  },
  {
    id: "faq-09",
    category: "Data Engineering",
    question: "How does the Self-Serve Data Platform reduce cognitive load for domain squads?",
    interviewerIntent: "Explores the platform-as-a-product mindset and developer ergonomics in enterprise architectures.",
    modelAnswer: "The platform team treats domain software engineers as their primary customers. Rather than domain teams configuring distributed clusters and network security, the platform provides: (1) Cookiecutter repository blueprints with pre-wired CI pipelines. (2) Declarative infrastructure provisioning via Terraform and Helm. (3) Automated RBAC provisioning translating ODCS contract policies into database permissions. (4) Out-of-the-box telemetry dashboards tracking query latency, SLA freshness, and error budgets.",
    nusaFinanceApplication: "Onboarding a new domain data product at PT NusaFinance dropped from 4.2 weeks of manual infrastructure setup to just 3.5 days.",
  },
  {
    id: "faq-10",
    category: "Framework & Strategy",
    question: "How do you evaluate and track Data Product ROI and architectural fitness over time (DATSIS)?",
    interviewerIntent: "Assesses long-term architectural stewardship and quantified business value communication to C-level executives.",
    modelAnswer: "We track ROI across three quantifiable pillars: (1) Business Velocity—measuring delivery lead time reduction (from 3-6 weeks to <15 minutes). (2) Operational Cost—measuring compute infrastructure TCO reduction from eliminating redundant ETL pipelines. (3) Quarterly DATSIS Architectural Fitness scoring each product across Discoverability, Addressability, Trustworthiness, Self-description, Interoperability, and Security on a 1-5 scale.",
    nusaFinanceApplication: "PT NusaFinance achieved an overall DATSIS score of 4.67/5.00, while saving \$66,000/year (35.9% TCO reduction) through centralized pipeline decommissioning and query federation.",
  },
];

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export function DataMeshArchitectureStudio() {
  const [activeTab, setActiveTab] = useState<"topology" | "contracts" | "risk360" | "faq">("topology");
  
  // Tab 1 States
  const [selectedDomainId, setSelectedDomainId] = useState<string>("leasing");
  const selectedProduct = useMemo(
    () => DOMAIN_DATA_PRODUCTS.find((p) => p.id === selectedDomainId) ?? DOMAIN_DATA_PRODUCTS[0],
    [selectedDomainId]
  );

  // Tab 2 States
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("clean-pr");
  const activeScenario = useMemo(
    () => CONTRACT_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? CONTRACT_SCENARIOS[0],
    [selectedScenarioId]
  );

  // Tab 3 States
  const [filterSector, setFilterSector] = useState<string>("ALL");
  const [filterRiskTier, setFilterRiskTier] = useState<string>("ALL");
  const [isAuditorMode, setIsAuditorMode] = useState<boolean>(false);

  // Tab 4 States
  const [faqCategory, setFaqCategory] = useState<string>("ALL");
  const [expandedFaqId, setExpandedFaqId] = useState<string>("faq-01");
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>("");

  // Filtered Risk 360 data
  const filteredRiskRows = useMemo(() => {
    return RISK_360_DATA.filter((row) => {
      if (filterSector !== "ALL" && row.sector !== filterSector) return false;
      if (filterRiskTier !== "ALL" && row.riskClassification !== filterRiskTier) return false;
      return true;
    });
  }, [filterSector, filterRiskTier]);

  // Aggregate telemetry for Risk 360
  const risk360Metrics = useMemo(() => {
    const totalExposure = filteredRiskRows.reduce((acc, r) => acc + r.principalBillionIdr, 0);
    const avgDpd = filteredRiskRows.length > 0
      ? (filteredRiskRows.reduce((acc, r) => acc + r.currentDpd, 0) / filteredRiskRows.length).toFixed(1)
      : "0.0";
    const impairedCount = filteredRiskRows.filter((r) => r.riskClassification === "SEVERELY_IMPAIRED" || r.riskClassification === "ELEVATED_WATCHLIST").length;
    return {
      totalContracts: filteredRiskRows.length,
      totalExposureIdrBillion: totalExposure.toFixed(2),
      avgDpd,
      impairedCount,
    };
  }, [filteredRiskRows]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return INTERVIEW_FAQS.filter((faq) => {
      if (faqCategory !== "ALL" && faq.category !== faqCategory) return false;
      if (faqSearchQuery.trim() !== "") {
        const q = faqSearchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.modelAnswer.toLowerCase().includes(q) ||
          faq.nusaFinanceApplication.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [faqCategory, faqSearchQuery]);

  return (
    <section
      aria-label="Enterprise Data Mesh Architecture Studio"
      style={{
        marginTop: "48px",
        marginBottom: "48px",
        border: "1px solid var(--line)",
        borderRadius: "4px",
        backgroundColor: "var(--panel)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
        overflow: "hidden",
      }}
    >
      {/* Studio Header & Telemetry Strip */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--accent, #60a5fa)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "4px",
            }}
          >
            // ARCHITECTURE LAB &amp; GOVERNANCE ENGINE
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--ink-heading)",
            }}
          >
            PT NusaFinance Enterprise Data Mesh Studio
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            color: "var(--muted)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
            5 DOMAINS ACTIVE
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block" }} />
            ODCS v2.1 ENFORCED
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#8b5cf6", display: "inline-block" }} />
            UU PDP ZERO-LEAK
          </span>
        </div>
      </div>

      {/* Interactive Module Navigation Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface-secondary)",
          overflowX: "auto",
        }}
      >
        {[
          { id: "topology", label: "01. Domain Topology & Ports" },
          { id: "contracts", label: "02. CI Contract & PII Validator" },
          { id: "risk360", label: "03. Risk 360 Aggregator" },
          { id: "faq", label: "04. Architect Interview Prep (10 Q&A)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: "12px 20px",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent, #60a5fa)" : "2px solid transparent",
              backgroundColor: activeTab === tab.id ? "var(--panel)" : "transparent",
              color: activeTab === tab.id ? "var(--ink-heading)" : "var(--muted)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Module 1: Domain Topology & Output Port Explorer */}
      {activeTab === "topology" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
            Select an autonomous business domain to inspect its <strong>Bounded Context</strong>, underlying transactional ingestion,
            standardized <strong>Data Product Output Port</strong>, and quarterly <strong>DATSIS Usability Scorecard</strong>.
          </p>

          {/* Domain Selector Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {DOMAIN_DATA_PRODUCTS.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setSelectedDomainId(prod.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "3px",
                  border: selectedDomainId === prod.id ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                  backgroundColor: selectedDomainId === prod.id ? "rgba(96, 165, 250, 0.12)" : "var(--surface)",
                  color: selectedDomainId === prod.id ? "var(--accent, #60a5fa)" : "var(--ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>{prod.domain}</span>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "10px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", color: "var(--muted)" }}>
                  v{prod.semVer}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Domain Deep Dive Card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "20px",
              backgroundColor: "var(--surface)",
              marginBottom: "24px",
            }}
          >
            {/* Left: Domain Metadata & Context */}
            <div>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "6px" }}>
                // DOMAIN IDENTITY &amp; BOUNDED CONTEXT
              </div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "var(--ink-heading)" }}>
                {selectedProduct.name}
              </h3>
              <p style={{ margin: "0 0 14px 0", fontSize: "13px", color: "var(--ink)", lineHeight: 1.5 }}>
                {selectedProduct.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px", fontFamily: "var(--font-mono), monospace" }}>
                <div style={{ padding: "8px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "10px" }}>SCHEMA NAMESPACE</span>
                  <strong style={{ color: "var(--ink-heading)" }}>{selectedProduct.schemaNamespace}</strong>
                </div>
                <div style={{ padding: "8px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "10px" }}>PUBLIC OUTPUT PORT</span>
                  <strong style={{ color: "var(--ink-heading)" }}>{selectedProduct.publicPort}</strong>
                </div>
                <div style={{ padding: "8px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "10px" }}>REFRESH SLA</span>
                  <strong style={{ color: "var(--ink-heading)" }}>{selectedProduct.slaRefresh}</strong>
                </div>
                <div style={{ padding: "8px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                  <span style={{ color: "var(--muted)", display: "block", fontSize: "10px" }}>AVAILABILITY SLO</span>
                  <strong style={{ color: "#10b981" }}>{selectedProduct.slaAvailability}</strong>
                </div>
              </div>

              <div style={{ marginTop: "14px", fontSize: "12px", color: "var(--muted)" }}>
                <strong style={{ color: "var(--ink-heading)" }}>Operational Ingestion: </strong> {selectedProduct.inputIngestion}
              </div>
              <div style={{ marginTop: "4px", fontSize: "12px", color: "var(--muted)" }}>
                <strong style={{ color: "var(--ink-heading)" }}>Domain Lead: </strong> {selectedProduct.leadEngineer}
              </div>
            </div>

            {/* Right: DATSIS Architectural Fitness Radar / Scores */}
            <div style={{ borderLeft: "1px solid var(--line)", paddingLeft: "24px" }}>
              <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--accent, #60a5fa)", textTransform: "uppercase", marginBottom: "6px" }}>
                // DATSIS USABILITY FITNESS SCORECARD
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink)" }}>Composite Fitness Rating</span>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "20px", fontWeight: 700, color: "#10b981" }}>
                  {(
                    (selectedProduct.datsis.discoverable +
                      selectedProduct.datsis.addressable +
                      selectedProduct.datsis.trustworthy +
                      selectedProduct.datsis.selfDescribing +
                      selectedProduct.datsis.interoperable +
                      selectedProduct.datsis.secure) /
                    6
                  ).toFixed(2)}{" "}
                  / 5.0
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                {[
                  { label: "Discoverable (Metadata Catalog)", score: selectedProduct.datsis.discoverable },
                  { label: "Addressable (Stable Protocol URI)", score: selectedProduct.datsis.addressable },
                  { label: "Trustworthy (SLA & Quality Tests)", score: selectedProduct.datsis.trustworthy },
                  { label: "Self-Describing (ODCS Contract Schema)", score: selectedProduct.datsis.selfDescribing },
                  { label: "Interoperable (ANSI SQL / Parquet)", score: selectedProduct.datsis.interoperable },
                  { label: "Secure (UU PDP Dynamic RLS Masking)", score: selectedProduct.datsis.secure },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ color: "var(--muted)" }}>{item.label}</span>
                      <strong style={{ color: "var(--ink-heading)" }}>{item.score.toFixed(1)}</strong>
                    </div>
                    <div style={{ width: "100%", height: "4px", backgroundColor: "var(--panel)", borderRadius: "2px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${(item.score / 5) * 100}%`,
                          height: "100%",
                          backgroundColor: item.score >= 4.8 ? "#10b981" : "#3b82f6",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Output Port Schema & Data Preview */}
          <div style={{ border: "1px solid var(--line)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--ink-heading)" }}>
                PORT VIEW: {selectedProduct.publicPort} (Read-Only Analytical Output)
              </span>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--muted)" }}>
                {selectedProduct.consumerCount} Active Downstream Consumers
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "var(--font-mono), monospace" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--surface-secondary)", borderBottom: "1px solid var(--line)", textAlign: "left", color: "var(--muted)" }}>
                    {selectedProduct.columns.map((c) => (
                      <th key={c.name} style={{ padding: "8px 12px", fontWeight: 600 }}>
                        {c.name}
                        {c.isPII && (
                          <span style={{ marginLeft: "6px", fontSize: "9px", padding: "1px 4px", borderRadius: "2px", backgroundColor: "rgba(244, 63, 94, 0.15)", color: "#f43f5e" }}>
                            UU PDP
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.sampleRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--line)", backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)" }}>
                      {selectedProduct.columns.map((c) => (
                        <td key={c.name} style={{ padding: "8px 12px", color: "var(--ink)" }}>
                          {String(row[c.name] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module 2: Computational Contract & PII Validator Simulator */}
      {activeTab === "contracts" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
            Test the automated <strong>GitOps CI/CD Build Gate</strong>. Toggle between different Pull Request scenarios to simulate how the
            contract validator prevents silent schema drift, blocks breaking changes, and enforces Indonesian <strong>UU PDP No. 27/2022</strong> compliance.
          </p>

          {/* Scenario Selection Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {CONTRACT_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                style={{
                  padding: "14px",
                  borderRadius: "4px",
                  border: selectedScenarioId === sc.id ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                  backgroundColor: selectedScenarioId === sc.id ? "rgba(96, 165, 250, 0.08)" : "var(--surface)",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: selectedScenarioId === sc.id ? "var(--accent, #60a5fa)" : "var(--ink-heading)",
                    }}
                  >
                    {sc.label.split(":")[0]}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "3px",
                      backgroundColor: sc.verdict === "PASS" ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                      color: sc.verdict === "PASS" ? "#10b981" : "#f43f5e",
                    }}
                  >
                    {sc.verdict}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
                  {sc.description}
                </p>
              </button>
            ))}
          </div>

          {/* Interactive Terminal / CI Runner Output */}
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "4px",
              backgroundColor: "#090d13",
              overflow: "hidden",
              boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Terminal Window Chrome */}
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#111827",
                borderBottom: "1px solid #1f2937",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
                <span style={{ marginLeft: "8px" }}>GitHub Actions — computational_contract_validator.py</span>
              </div>
              <span>EXIT CODE: {activeScenario.verdict === "PASS" ? "0 (SUCCESS)" : "1 (BUILD FAILED)"}</span>
            </div>

            {/* Terminal Output Stream */}
            <div style={{ padding: "16px 20px", fontFamily: "var(--font-mono), monospace", fontSize: "12px", lineHeight: 1.7, minHeight: "220px" }}>
              {activeScenario.logs.map((log, idx) => {
                let color = "#d1d5db";
                if (log.level === "ERROR") color = "#f87171";
                if (log.level === "WARN") color = "#fbbf24";
                if (log.level === "SUCCESS") color = "#34d399";
                return (
                  <div key={idx} style={{ color, display: "flex", gap: "10px" }}>
                    <span style={{ color: "#4b5563", userSelect: "none" }}>[{String(idx + 1).padStart(2, "0")}]</span>
                    <span>{log.message}</span>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Remediation Banner */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #1f2937",
                backgroundColor: activeScenario.verdict === "PASS" ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "12px",
              }}
            >
              <span style={{ color: activeScenario.verdict === "PASS" ? "#34d399" : "#f87171", fontWeight: 600 }}>
                {activeScenario.summary}
              </span>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                {activeScenario.verdict === "PASS" ? "READY FOR MERGE" : "REMEDIATION REQUIRED"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Module 3: Cross-Domain Risk 360 Aggregator */}
      {activeTab === "risk360" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
            Simulate the federated <strong>Risk 360 SQL Query</strong> joining 4 autonomous output ports in-memory:{" "}
            <code>leasing_dp</code>, <code>equipment_dp</code>, <code>risk_dp</code>, and <code>crm_dp</code>.
            Toggle the <strong>Compliance Officer Mode</strong> to observe dynamic UU PDP privacy unmasking in action.
          </p>

          {/* Interactive Filters & Privacy Toggle */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              marginBottom: "20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Filter Dropdowns */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                  SECTOR FILTER
                </label>
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "var(--panel)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  <option value="ALL">All Sectors</option>
                  <option value="Mining">Mining</option>
                  <option value="Agribusiness">Agribusiness</option>
                  <option value="Civil Infrastructure">Civil Infrastructure</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", marginBottom: "4px" }}>
                  RISK TIER FILTER
                </label>
                <select
                  value={filterRiskTier}
                  onChange={(e) => setFilterRiskTier(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "var(--panel)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  <option value="ALL">All Risk Tiers</option>
                  <option value="HEALTHY_PERFORMING">Healthy Performing</option>
                  <option value="MODERATE_MONITORING">Moderate Monitoring</option>
                  <option value="ELEVATED_WATCHLIST">Elevated Watchlist</option>
                  <option value="SEVERELY_IMPAIRED">Severely Impaired</option>
                </select>
              </div>
            </div>

            {/* UU PDP Role Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--ink-heading)" }}>
                  UU PDP Compliance Mode
                </span>
                <span style={{ fontSize: "10px", color: isAuditorMode ? "#f43f5e" : "#10b981", fontFamily: "var(--font-mono), monospace" }}>
                  {isAuditorMode ? "ROLE: role_compliance_auditor (Unmasked)" : "ROLE: role_data_consumer (Masked)"}
                </span>
              </div>
              <button
                onClick={() => setIsAuditorMode(!isAuditorMode)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "3px",
                  border: isAuditorMode ? "1px solid #f43f5e" : "1px solid var(--line)",
                  backgroundColor: isAuditorMode ? "rgba(244, 63, 94, 0.15)" : "var(--panel)",
                  color: isAuditorMode ? "#f43f5e" : "var(--ink)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isAuditorMode ? "Re-apply Masking 🔒" : "Unmask (Audit Role) 🔓"}
              </button>
            </div>
          </div>

          {/* Telemetry KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            <div style={{ padding: "14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", textTransform: "uppercase" }}>
                MATCHED CONTRACTS
              </span>
              <strong style={{ display: "block", fontSize: "20px", color: "var(--ink-heading)", marginTop: "4px" }}>
                {risk360Metrics.totalContracts} Units
              </strong>
            </div>
            <div style={{ padding: "14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", textTransform: "uppercase" }}>
                AGGREGATED EXPOSURE
              </span>
              <strong style={{ display: "block", fontSize: "20px", color: "var(--accent, #60a5fa)", marginTop: "4px" }}>
                Rp {risk360Metrics.totalExposureIdrBillion} M
              </strong>
            </div>
            <div style={{ padding: "14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", textTransform: "uppercase" }}>
                AVERAGE ARREARS (DPD)
              </span>
              <strong style={{ display: "block", fontSize: "20px", color: Number(risk360Metrics.avgDpd) > 30 ? "#f43f5e" : "#10b981", marginTop: "4px" }}>
                {risk360Metrics.avgDpd} Days
              </strong>
            </div>
            <div style={{ padding: "14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)", textTransform: "uppercase" }}>
                WATCHLIST / IMPAIRED
              </span>
              <strong style={{ display: "block", fontSize: "20px", color: risk360Metrics.impairedCount > 0 ? "#fbbf24" : "#10b981", marginTop: "4px" }}>
                {risk360Metrics.impairedCount} Accounts
              </strong>
            </div>
          </div>

          {/* Federated Results Table */}
          <div style={{ border: "1px solid var(--line)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--ink-heading)" }}>
                MATERIALIZED RISK 360 COMPOSITE TABLE (JOINED ACROSS 4 PORTS)
              </span>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "#10b981" }}>
                In-Memory Federation: 420ms
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "var(--font-mono), monospace" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--surface-secondary)", borderBottom: "1px solid var(--line)", textAlign: "left", color: "var(--muted)" }}>
                    <th style={{ padding: "8px 12px" }}>CONTRACT &amp; BORROWER</th>
                    <th style={{ padding: "8px 12px" }}>SECTOR</th>
                    <th style={{ padding: "8px 12px" }}>NIK (UU PDP)</th>
                    <th style={{ padding: "8px 12px" }}>MACHINE ASSET</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>EXPOSURE (IDR)</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>DPD</th>
                    <th style={{ padding: "8px 12px" }}>COLLATERAL</th>
                    <th style={{ padding: "8px 12px" }}>RISK TIER</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiskRows.map((row) => (
                    <tr key={row.contractId} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 12px" }}>
                        <strong style={{ color: "var(--ink-heading)", display: "block" }}>{row.companyName}</strong>
                        <span style={{ fontSize: "10px", color: "var(--muted)" }}>{row.contractId}</span>
                      </td>
                      <td style={{ padding: "8px 12px", color: "var(--ink)" }}>{row.sector}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ color: isAuditorMode ? "#f43f5e" : "var(--muted)" }}>
                          {isAuditorMode ? row.nikRaw : row.nikMasked}
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ color: "var(--ink-heading)", display: "block" }}>{row.machineModel}</span>
                        <span style={{ fontSize: "10px", color: "var(--muted)" }}>{row.operatingHours.toLocaleString()} hrs</span>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "var(--ink-heading)", fontWeight: 600 }}>
                        Rp {row.principalBillionIdr.toFixed(2)} M
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "2px",
                            backgroundColor: row.currentDpd === 0 ? "rgba(16, 185, 129, 0.1)" : row.currentDpd > 30 ? "rgba(244, 63, 94, 0.15)" : "rgba(251, 191, 36, 0.15)",
                            color: row.currentDpd === 0 ? "#10b981" : row.currentDpd > 30 ? "#f43f5e" : "#fbbf24",
                            fontWeight: 700,
                          }}
                        >
                          {row.currentDpd}d
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "2px",
                            backgroundColor: row.collateralHealth === "OPTIMAL" ? "rgba(16, 185, 129, 0.1)" : row.collateralHealth === "CRITICAL" ? "rgba(244, 63, 94, 0.15)" : "rgba(251, 191, 36, 0.15)",
                            color: row.collateralHealth === "OPTIMAL" ? "#10b981" : row.collateralHealth === "CRITICAL" ? "#f43f5e" : "#fbbf24",
                          }}
                        >
                          {row.collateralHealth}
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "2px",
                            backgroundColor:
                              row.riskClassification === "HEALTHY_PERFORMING"
                                ? "rgba(16, 185, 129, 0.12)"
                                : row.riskClassification === "SEVERELY_IMPAIRED"
                                ? "rgba(244, 63, 94, 0.15)"
                                : "rgba(251, 191, 36, 0.15)",
                            color:
                              row.riskClassification === "HEALTHY_PERFORMING"
                                ? "#10b981"
                                : row.riskClassification === "SEVERELY_IMPAIRED"
                                ? "#f43f5e"
                                : "#fbbf24",
                          }}
                        >
                          {row.riskClassification.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module 4: Architect Interview Prep (10 Q&A) */}
      {activeTab === "faq" && (
        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
            Master the <strong>Senior &amp; Principal Data Architect</strong> interview technical gauntlet.
            Explore 10 battle-tested questions covering organizational trade-offs, schema governance, cross-domain queries, and Indonesian regulations.
          </p>

          {/* Search & Category Filter */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["ALL", "Framework & Strategy", "Governance & Compliance", "Data Engineering", "Organization & People"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "3px",
                    border: faqCategory === cat ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                    backgroundColor: faqCategory === cat ? "rgba(96, 165, 250, 0.12)" : "var(--surface)",
                    color: faqCategory === cat ? "var(--accent, #60a5fa)" : "var(--muted)",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search interview questions..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              style={{
                padding: "8px 12px",
                backgroundColor: "var(--surface)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                borderRadius: "3px",
                fontSize: "12px",
                fontFamily: "inherit",
                minWidth: "240px",
              }}
            />
          </div>

          {/* Expandable Interview Accordion List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    border: isExpanded ? "1px solid var(--accent, #60a5fa)" : "1px solid var(--line)",
                    borderRadius: "4px",
                    backgroundColor: "var(--surface)",
                    overflow: "hidden",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? "" : faq.id)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      textAlign: "left",
                      backgroundColor: isExpanded ? "rgba(96, 165, 250, 0.04)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--accent, #60a5fa)" }}>
                          Q{String(idx + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", padding: "1px 6px", borderRadius: "2px", backgroundColor: "var(--panel)", color: "var(--muted)", border: "1px solid var(--line)" }}>
                          {faq.category}
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--ink-heading)", lineHeight: 1.4 }}>
                        {faq.question}
                      </h4>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "16px", color: "var(--muted)" }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Expanded Model Answer & Real-World Application */}
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid var(--line)" }}>
                      {/* Interviewer Intent Box */}
                      <div
                        style={{
                          margin: "16px 0",
                          padding: "10px 14px",
                          backgroundColor: "var(--panel)",
                          borderLeft: "3px solid #8b5cf6",
                          fontSize: "12px",
                          color: "var(--muted)",
                        }}
                      >
                        <strong style={{ color: "#a78bfa", display: "block", marginBottom: "2px", fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                          INTERVIEWER EVALUATION CRITERIA:
                        </strong>
                        {faq.interviewerIntent}
                      </div>

                      {/* Comprehensive Model Answer */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, color: "var(--ink-heading)", textTransform: "uppercase", marginBottom: "6px" }}>
                          // PRINCIPAL ARCHITECT MODEL ANSWER:
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: "var(--ink)" }}>
                          {faq.modelAnswer}
                        </p>
                      </div>

                      {/* PT NusaFinance Context */}
                      <div
                        style={{
                          padding: "12px 14px",
                          backgroundColor: "rgba(16, 185, 129, 0.06)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                          borderRadius: "3px",
                          fontSize: "12px",
                          color: "var(--ink)",
                          lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: "#10b981", display: "block", marginBottom: "2px", fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                          PT NUSAFINANCE CONCRETE APPLICATION:
                        </strong>
                        {faq.nusaFinanceApplication}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
