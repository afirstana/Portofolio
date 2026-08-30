"use client";

import React, { useState, useMemo } from "react";

type DiscrepancyTier = "all" | "tier1" | "tier2" | "tier3" | "tier4";

type InvoicePair = {
  id: string;
  invoiceNumber: string;
  systemInvoiceNumber: string;
  supplierName: string;
  npwp: string;
  date: string;
  sourceAmount: number;
  systemAmount: number;
  variance: number;
  tier: "tier1" | "tier2" | "tier3" | "tier4";
  tierLabel: string;
  taxVarianceReason?: string;
  auditAction: string;
  status: "Cleared" | "Flagged Variance" | "Unrecorded" | "Double Processed";
};

const MOCK_INVOICE_DATA: InvoicePair[] = [
  {
    id: "REC-001",
    invoiceNumber: "INV/2023/DBO/09841",
    systemInvoiceNumber: "INV-2023-DBO-09841",
    supplierName: "PT. Rucika Pipe Utama",
    npwp: "01.345.678.9-012.000",
    date: "2023-10-12",
    sourceAmount: 45250000,
    systemAmount: 45250000,
    variance: 0,
    tier: "tier1",
    tierLabel: "Tier 1: 100% Exact Match",
    auditAction: "Auto-cleared for General Ledger journalization",
    status: "Cleared",
  },
  {
    id: "REC-002",
    invoiceNumber: "INV/2023/DBO/09842",
    systemInvoiceNumber: "INV-2023-DBO-09842",
    supplierName: "PT. Djabesmen Roofing Corp",
    npwp: "02.887.412.3-041.000",
    date: "2023-10-14",
    sourceAmount: 12800000,
    systemAmount: 12800000,
    variance: 0,
    tier: "tier1",
    tierLabel: "Tier 1: 100% Exact Match",
    auditAction: "Auto-cleared for General Ledger journalization",
    status: "Cleared",
  },
  {
    id: "REC-003",
    invoiceNumber: "INV/2023/DBO/09843",
    systemInvoiceNumber: "INV-2023-DBO-09843",
    supplierName: "PT. Shera Board Indonesia",
    npwp: "03.112.984.5-055.000",
    date: "2023-10-15",
    sourceAmount: 88450000,
    systemAmount: 88000000,
    variance: -450000,
    tier: "tier2",
    tierLabel: "Tier 2: Value Discrepancy",
    taxVarianceReason: "11% PPN tax rounding variance across sub-line items",
    auditAction: "Tax adjustment credit note generated for reconciliation",
    status: "Flagged Variance",
  },
  {
    id: "REC-004",
    invoiceNumber: "INV/2023/DBO/09844",
    systemInvoiceNumber: "— [NOT FOUND IN ERP] —",
    supplierName: "PT. Superex Gutter Systems",
    npwp: "04.556.123.7-088.000",
    date: "2023-10-18",
    sourceAmount: 24150000,
    systemAmount: 0,
    variance: 24150000,
    tier: "tier3",
    tierLabel: "Tier 3: Missing in ERP System",
    taxVarianceReason: "Physical invoice received but unposted in internal billing",
    auditAction: "Routed to Finance Entry Queue for immediate ERP posting",
    status: "Unrecorded",
  },
  {
    id: "REC-005",
    invoiceNumber: "INV/2023/DBO/09845",
    systemInvoiceNumber: "INV-2023-DBO-09845 [x2 DUAL POST]",
    supplierName: "PT. Mitra Bangunan Logistik",
    npwp: "05.991.332.1-011.000",
    date: "2023-10-21",
    sourceAmount: 63900000,
    systemAmount: 127800000,
    variance: -63900000,
    tier: "tier4",
    tierLabel: "Tier 4: Duplicate Processed Entry",
    taxVarianceReason: "Single invoice settled twice across two distinct ERP vouchers",
    auditAction: "CRITICAL REVERSAL: Duplicate settlement blocked; saved Rp 63.9M",
    status: "Double Processed",
  },
  {
    id: "REC-006",
    invoiceNumber: "INV/2023/DBO/09846",
    systemInvoiceNumber: "INV-2023-DBO-09846",
    supplierName: "PT. Holcim Cement Nusantara",
    npwp: "06.221.789.0-022.000",
    date: "2023-10-23",
    sourceAmount: 31200000,
    systemAmount: 31200000,
    variance: 0,
    tier: "tier1",
    tierLabel: "Tier 1: 100% Exact Match",
    auditAction: "Auto-cleared for General Ledger journalization",
    status: "Cleared",
  },
];

const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
};

export function RevenueReconciliationShowcase() {
  const [activeTier, setActiveTier] = useState<DiscrepancyTier>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState<InvoicePair | null>(MOCK_INVOICE_DATA[0]);
  const [activeTab, setActiveTab] = useState<"visual-flow" | "workbench" | "excel-preview">("visual-flow");

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICE_DATA.filter((item) => {
      const matchesTier = activeTier === "all" || item.tier === activeTier;
      const matchesSearch =
        item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [activeTier, searchQuery]);

  const stats = useMemo(() => {
    const totalSource = MOCK_INVOICE_DATA.reduce((sum, item) => sum + item.sourceAmount, 0);
    const exactMatches = MOCK_INVOICE_DATA.filter((i) => i.tier === "tier1").length;
    const matchRate = (exactMatches / MOCK_INVOICE_DATA.length) * 100;
    const duplicatePrevented = MOCK_INVOICE_DATA.filter((i) => i.tier === "tier4").reduce((sum, item) => sum + item.sourceAmount, 0);
    return {
      totalSource,
      matchRate,
      duplicatePrevented,
      totalRows: MOCK_INVOICE_DATA.length,
    };
  }, []);

  return (
    <div className="case-stage revenue-showcase-stage" style={{ padding: "32px 0 48px" }}>
      <div style={{ marginBottom: "24px" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
          Interactive Financial Engineering Console
        </p>
        <h2 style={{ fontSize: "clamp(24px, 2.5vw, 36px)", letterSpacing: "-0.05em", color: "var(--ink-heading)", margin: "0 0 12px" }}>
          4-Tier Revenue Reconciliation &amp; Audit Engine
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", maxWidth: "820px", margin: 0 }}>
          Interactive visualization of the DBO automated revenue audit pipeline. Explore the multi-layer string normalization, composite key matching, anomaly categorization, and automated Openpyxl executive workbook generation.
        </p>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button
          type="button"
          className="mono"
          onClick={() => setActiveTab("visual-flow")}
          style={{
            padding: "8px 16px",
            fontSize: "11px",
            border: "1px solid var(--line)",
            background: activeTab === "visual-flow" ? "var(--accent-subtle)" : "var(--panel)",
            color: activeTab === "visual-flow" ? "var(--accent)" : "var(--muted)",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "all .15s ease",
          }}
        >
          🔀 01. Visual Architecture Flow
        </button>
        <button
          type="button"
          className="mono"
          onClick={() => setActiveTab("workbench")}
          style={{
            padding: "8px 16px",
            fontSize: "11px",
            border: "1px solid var(--line)",
            background: activeTab === "workbench" ? "var(--accent-subtle)" : "var(--panel)",
            color: activeTab === "workbench" ? "var(--accent)" : "var(--muted)",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "all .15s ease",
          }}
        >
          🔍 02. Live Reconciliation Workbench ({filteredInvoices.length})
        </button>
        <button
          type="button"
          className="mono"
          onClick={() => setActiveTab("excel-preview")}
          style={{
            padding: "8px 16px",
            fontSize: "11px",
            border: "1px solid var(--line)",
            background: activeTab === "excel-preview" ? "var(--accent-subtle)" : "var(--panel)",
            color: activeTab === "excel-preview" ? "var(--accent)" : "var(--muted)",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "all .15s ease",
          }}
        >
          📑 03. Openpyxl Excel Audit Preview
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1px",
          background: "var(--line)",
          border: "1px solid var(--line)",
          marginBottom: "28px",
        }}
      >
        <div style={{ background: "var(--panel)", padding: "18px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", display: "block" }}>TOTAL RECONCILED GMV</span>
          <strong style={{ fontSize: "20px", color: "var(--ink-heading)", display: "block", marginTop: "8px" }}>{formatIDR(stats.totalSource)}</strong>
          <small style={{ color: "var(--muted)", fontSize: "10px" }}>Ground-truth tax invoices</small>
        </div>
        <div style={{ background: "var(--panel)", padding: "18px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", display: "block" }}>100% CLEAN MATCH RATE</span>
          <strong style={{ fontSize: "20px", color: "#10b981", display: "block", marginTop: "8px" }}>{stats.matchRate.toFixed(1)}%</strong>
          <small style={{ color: "var(--muted)", fontSize: "10px" }}>Direct to General Ledger</small>
        </div>
        <div style={{ background: "var(--panel)", padding: "18px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", display: "block" }}>DOUBLE-PAYMENT PREVENTED</span>
          <strong style={{ fontSize: "20px", color: "var(--accent)", display: "block", marginTop: "8px" }}>{formatIDR(stats.duplicatePrevented)}</strong>
          <small style={{ color: "var(--muted)", fontSize: "10px" }}>Zero duplicate leakage</small>
        </div>
        <div style={{ background: "var(--panel)", padding: "18px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", display: "block" }}>AUDIT TRACEABILITY</span>
          <strong style={{ fontSize: "20px", color: "#3b82f6", display: "block", marginTop: "8px" }}>100%</strong>
          <small style={{ color: "var(--muted)", fontSize: "10px" }}>Bi-directional source lineage</small>
        </div>
      </div>

      {/* TAB 1: VISUAL ARCHITECTURE FLOW */}
      {activeTab === "visual-flow" && (
        <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: "28px", borderRadius: "6px" }}>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <p className="mono" style={{ color: "var(--accent)", fontSize: "9px", margin: "0 0 4px" }}>Interactive Flow Diagram</p>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--ink-heading)" }}>End-to-End Reconciliation Data Flow</h3>
            </div>
            <span className="mono" style={{ fontSize: "10px", color: "var(--dim)", padding: "4px 8px", background: "var(--surface-secondary)", border: "1px solid var(--line)" }}>
              Click any tier node below to inspect logic
            </span>
          </div>

          {/* Graphical Pipeline Layout */}
          <div style={{ display: "grid", gap: "20px" }}>
            {/* Stage 1: Dual Inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ padding: "16px", border: "1px dashed var(--line)", background: "var(--surface-secondary)", borderRadius: "4px" }}>
                <span className="mono" style={{ fontSize: "9px", color: "var(--accent)" }}>INPUT SOURCE A</span>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--ink-heading)", marginTop: "4px" }}>Original Tax Invoices (Faktur Asli)</strong>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "6px 0 0", lineHeight: "1.4" }}>Raw physical PDF/CSV vendor billing &amp; tax authority files</p>
              </div>
              <div style={{ padding: "16px", border: "1px dashed var(--line)", background: "var(--surface-secondary)", borderRadius: "4px" }}>
                <span className="mono" style={{ fontSize: "9px", color: "var(--accent)" }}>INPUT SOURCE B</span>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--ink-heading)", marginTop: "4px" }}>Processed ERP System Records</strong>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "6px 0 0", lineHeight: "1.4" }}>Internal DBO billing ledgers, purchase vouchers &amp; settlement logs</p>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "var(--accent)", fontSize: "18px" }}>
              <span className="mono" style={{ fontSize: "11px", background: "var(--surface-secondary)", padding: "4px 12px", border: "1px solid var(--line)", borderRadius: "20px" }}>
                ↓ Vectorized Ingestion &amp; Regex Sanitizer
              </span>
            </div>

            {/* Stage 2: Normalization & Multi-Key Matching */}
            <div style={{ padding: "18px", border: "1px solid var(--accent)", background: "var(--accent-subtle)", borderRadius: "4px", textAlign: "center" }}>
              <span className="mono" style={{ fontSize: "9px", color: "var(--accent)", letterSpacing: "0.08em" }}>CORE MATCHING ENGINE</span>
              <strong style={{ display: "block", fontSize: "16px", color: "var(--ink-heading)", marginTop: "4px" }}>
                Composite 4-Key Pairing &amp; Tax Boundary Verifier
              </strong>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "6px auto 0", maxWidth: "600px" }}>
                Evaluates <code style={{ color: "var(--accent)" }}>Invoice ID</code> + <code style={{ color: "var(--accent)" }}>Vendor NPWP</code> + <code style={{ color: "var(--accent)" }}>Transaction Date</code> + <code style={{ color: "var(--accent)" }}>Gross Nominal (PPN/PPh)</code>
              </p>
            </div>

            {/* Connecting Split Arrows */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "var(--accent)" }}>
              <span className="mono" style={{ fontSize: "11px", background: "var(--surface-secondary)", padding: "4px 12px", border: "1px solid var(--line)", borderRadius: "20px" }}>
                ↓ Automated 4-Tier Classification Triage
              </span>
            </div>

            {/* Stage 3: 4 Output Tier Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {/* Tier 1 */}
              <div
                onClick={() => { setActiveTier("tier1"); setActiveTab("workbench"); }}
                style={{
                  padding: "16px",
                  border: "1px solid #10b981",
                  background: "rgba(16, 185, 129, 0.05)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "transform .15s ease",
                }}
              >
                <span className="mono" style={{ fontSize: "9px", color: "#10b981", fontWeight: "bold" }}>TIER 01 • EXACT MATCH</span>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--ink-heading)", marginTop: "6px" }}>100% Cleared (Rp 0 Diff)</strong>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "8px 0 0", lineHeight: "1.4" }}>
                  Zero nominal delta. Auto-approved for financial statements.
                </p>
                <div style={{ marginTop: "10px", fontSize: "9px", color: "#10b981", fontWeight: "bold" }}>👉 View 3 Invoices</div>
              </div>

              {/* Tier 2 */}
              <div
                onClick={() => { setActiveTier("tier2"); setActiveTab("workbench"); }}
                style={{
                  padding: "16px",
                  border: "1px solid #f59e0b",
                  background: "rgba(245, 158, 11, 0.05)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "transform .15s ease",
                }}
              >
                <span className="mono" style={{ fontSize: "9px", color: "#f59e0b", fontWeight: "bold" }}>TIER 02 • VALUE VARIANCE</span>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--ink-heading)", marginTop: "6px" }}>Tax / Rounding Delta</strong>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "8px 0 0", lineHeight: "1.4" }}>
                  Invoice matched but nominal diverged. Flags tax adjustments.
                </p>
                <div style={{ marginTop: "10px", fontSize: "9px", color: "#f59e0b", fontWeight: "bold" }}>👉 View Flagged Items</div>
              </div>

              {/* Tier 3 */}
              <div
                onClick={() => { setActiveTier("tier3"); setActiveTab("workbench"); }}
                style={{
                  padding: "16px",
                  border: "1px solid #3b82f6",
                  background: "rgba(59, 130, 246, 0.05)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "transform .15s ease",
                }}
              >
                <span className="mono" style={{ fontSize: "9px", color: "#3b82f6", fontWeight: "bold" }}>TIER 03 • MISSING IN ERP</span>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--ink-heading)", marginTop: "6px" }}>Unrecorded Physical Doc</strong>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "8px 0 0", lineHeight: "1.4" }}>
                  Source exists but absent in system. Prevents tax deadline penalty.
                </p>
                <div style={{ marginTop: "10px", fontSize: "9px", color: "#3b82f6", fontWeight: "bold" }}>👉 View Missing Queue</div>
              </div>

              {/* Tier 4 */}
              <div
                onClick={() => { setActiveTier("tier4"); setActiveTab("workbench"); }}
                style={{
                  padding: "16px",
                  border: "1px solid #ef4444",
                  background: "rgba(239, 68, 68, 0.05)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "transform .15s ease",
                }}
              >
                <span className="mono" style={{ fontSize: "9px", color: "#ef4444", fontWeight: "bold" }}>TIER 04 • DOUBLE PROCESSED</span>
                <strong style={{ display: "block", fontSize: "14px", color: "var(--ink-heading)", marginTop: "6px" }}>Duplicate ERP Voucher</strong>
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "8px 0 0", lineHeight: "1.4" }}>
                  Single invoice posted twice. Immediate reversal alert.
                </p>
                <div style={{ marginTop: "10px", fontSize: "9px", color: "#ef4444", fontWeight: "bold" }}>👉 View Critical Alert</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE WORKBENCH */}
      {activeTab === "workbench" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(300px, 1fr)", gap: "20px" }}>
          {/* Left Table Panel */}
          <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: "20px", borderRadius: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="mono"
                  onClick={() => setActiveTier("all")}
                  style={{
                    fontSize: "9px",
                    padding: "4px 8px",
                    border: "1px solid var(--line)",
                    background: activeTier === "all" ? "var(--accent-subtle)" : "var(--surface-secondary)",
                    color: activeTier === "all" ? "var(--accent)" : "var(--muted)",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  All ({MOCK_INVOICE_DATA.length})
                </button>
                <button
                  type="button"
                  className="mono"
                  onClick={() => setActiveTier("tier1")}
                  style={{
                    fontSize: "9px",
                    padding: "4px 8px",
                    border: "1px solid #10b981",
                    background: activeTier === "tier1" ? "rgba(16,185,129,0.15)" : "var(--surface-secondary)",
                    color: activeTier === "tier1" ? "#10b981" : "var(--muted)",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Tier 1 Exact (3)
                </button>
                <button
                  type="button"
                  className="mono"
                  onClick={() => setActiveTier("tier2")}
                  style={{
                    fontSize: "9px",
                    padding: "4px 8px",
                    border: "1px solid #f59e0b",
                    background: activeTier === "tier2" ? "rgba(245,158,11,0.15)" : "var(--surface-secondary)",
                    color: activeTier === "tier2" ? "#f59e0b" : "var(--muted)",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Tier 2 Tax Diff (1)
                </button>
                <button
                  type="button"
                  className="mono"
                  onClick={() => setActiveTier("tier3")}
                  style={{
                    fontSize: "9px",
                    padding: "4px 8px",
                    border: "1px solid #3b82f6",
                    background: activeTier === "tier3" ? "rgba(59,130,246,0.15)" : "var(--surface-secondary)",
                    color: activeTier === "tier3" ? "#3b82f6" : "var(--muted)",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Tier 3 Missing (1)
                </button>
                <button
                  type="button"
                  className="mono"
                  onClick={() => setActiveTier("tier4")}
                  style={{
                    fontSize: "9px",
                    padding: "4px 8px",
                    border: "1px solid #ef4444",
                    background: activeTier === "tier4" ? "rgba(239,68,68,0.15)" : "var(--surface-secondary)",
                    color: activeTier === "tier4" ? "#ef4444" : "var(--muted)",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Tier 4 Duplicate (1)
                </button>
              </div>
              <input
                type="text"
                placeholder="Filter by vendor / ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  fontSize: "11px",
                  padding: "5px 10px",
                  background: "var(--surface-secondary)",
                  color: "var(--ink)",
                  border: "1px solid var(--line)",
                  borderRadius: "3px",
                  width: "180px",
                }}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--line)", color: "var(--dim)", textAlign: "left" }}>
                    <th style={{ padding: "8px 6px" }}>Invoice ID</th>
                    <th style={{ padding: "8px 6px" }}>Supplier</th>
                    <th style={{ padding: "8px 6px" }}>Source Amount</th>
                    <th style={{ padding: "8px 6px" }}>System Amount</th>
                    <th style={{ padding: "8px 6px" }}>Variance</th>
                    <th style={{ padding: "8px 6px" }}>Tier Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => {
                    const isSelected = selectedPair?.id === inv.id;
                    const tierBadgeColor =
                      inv.tier === "tier1" ? "#10b981" : inv.tier === "tier2" ? "#f59e0b" : inv.tier === "tier3" ? "#3b82f6" : "#ef4444";
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedPair(inv)}
                        style={{
                          borderBottom: "1px solid var(--line)",
                          background: isSelected ? "var(--accent-subtle)" : "transparent",
                          cursor: "pointer",
                          transition: "background .15s ease",
                        }}
                      >
                        <td style={{ padding: "10px 6px", fontWeight: "bold", color: isSelected ? "var(--accent)" : "var(--ink)" }}>
                          {inv.invoiceNumber}
                        </td>
                        <td style={{ padding: "10px 6px", color: "var(--muted)" }}>{inv.supplierName}</td>
                        <td style={{ padding: "10px 6px", color: "var(--ink)" }}>{formatIDR(inv.sourceAmount)}</td>
                        <td style={{ padding: "10px 6px", color: "var(--ink)" }}>
                          {inv.systemAmount === 0 ? "—" : formatIDR(inv.systemAmount)}
                        </td>
                        <td style={{ padding: "10px 6px", fontWeight: "bold", color: inv.variance === 0 ? "#10b981" : "#ef4444" }}>
                          {inv.variance === 0 ? "Rp 0" : formatIDR(inv.variance)}
                        </td>
                        <td style={{ padding: "10px 6px" }}>
                          <span
                            className="mono"
                            style={{
                              fontSize: "9px",
                              padding: "2px 6px",
                              border: `1px solid ${tierBadgeColor}`,
                              color: tierBadgeColor,
                              borderRadius: "2px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Inspector Card */}
          {selectedPair && (
            <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: "20px", borderRadius: "6px", height: "fit-content" }}>
              <span className="mono" style={{ fontSize: "9px", color: "var(--accent)", letterSpacing: "0.08em" }}>
                AUDIT DRILL-DOWN INSPECTOR
              </span>
              <h3 style={{ fontSize: "16px", margin: "6px 0 14px", color: "var(--ink-heading)" }}>
                {selectedPair.invoiceNumber}
              </h3>

              <div style={{ display: "grid", gap: "10px", fontSize: "11px" }}>
                <div style={{ padding: "8px", background: "var(--surface-secondary)", borderRadius: "3px" }}>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: "9px", display: "block" }}>SUPPLIER ENTITY</span>
                  <strong style={{ color: "var(--ink-heading)", display: "block", marginTop: "2px" }}>{selectedPair.supplierName}</strong>
                  <small style={{ color: "var(--muted)" }}>NPWP: {selectedPair.npwp}</small>
                </div>

                <div style={{ padding: "8px", background: "var(--surface-secondary)", borderRadius: "3px" }}>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: "9px", display: "block" }}>PAIRING COMPARISON</span>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span>Faktur Asli:</span>
                    <strong>{formatIDR(selectedPair.sourceAmount)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                    <span>System ERP:</span>
                    <strong>{selectedPair.systemAmount === 0 ? "Not Found" : formatIDR(selectedPair.systemAmount)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", borderTop: "1px solid var(--line)", paddingTop: "4px" }}>
                    <span>Net Variance:</span>
                    <strong style={{ color: selectedPair.variance === 0 ? "#10b981" : "#ef4444" }}>{formatIDR(selectedPair.variance)}</strong>
                  </div>
                </div>

                {selectedPair.taxVarianceReason && (
                  <div style={{ padding: "8px", background: "rgba(245, 158, 11, 0.08)", border: "1px dashed #f59e0b", borderRadius: "3px" }}>
                    <span className="mono" style={{ color: "#f59e0b", fontSize: "9px", display: "block", fontWeight: "bold" }}>ROOT CAUSE DIAGNOSIS</span>
                    <p style={{ margin: "4px 0 0", color: "var(--ink)", lineHeight: "1.4" }}>{selectedPair.taxVarianceReason}</p>
                  </div>
                )}

                <div style={{ padding: "10px", background: "var(--surface-secondary)", borderLeft: "3px solid var(--accent)", borderRadius: "2px" }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: "9px", display: "block" }}>RECOMMENDED AUDIT ACTION</span>
                  <p style={{ margin: "4px 0 0", color: "var(--ink-heading)", fontWeight: "500", lineHeight: "1.4" }}>{selectedPair.auditAction}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OPENPYXL EXCEL PREVIEW */}
      {activeTab === "excel-preview" && (
        <div style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: "24px", borderRadius: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <p className="mono" style={{ color: "var(--accent)", fontSize: "9px", margin: "0 0 4px" }}>Automated Deliverable</p>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--ink-heading)" }}>Executive Openpyxl Multi-Tab Excel Workbook</h3>
            </div>
            <span className="mono" style={{ fontSize: "10px", color: "#10b981", padding: "4px 10px", border: "1px solid #10b981", background: "rgba(16,185,129,0.08)", borderRadius: "3px" }}>
              ✓ Auto-Generated in &lt; 2 Minutes
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "16px" }}>
            <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--surface-secondary)", borderRadius: "4px" }}>
              <span className="mono" style={{ color: "var(--accent)", fontSize: "9px" }}>SHEET 01</span>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink-heading)", marginTop: "4px" }}>📊 Executive KPI Summary</strong>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: "6px 0 0" }}>High-level reconciliation cards, variance ratio %, and double-payment prevention chart.</p>
            </div>
            <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--surface-secondary)", borderRadius: "4px" }}>
              <span className="mono" style={{ color: "#10b981", fontSize: "9px" }}>SHEET 02</span>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink-heading)", marginTop: "4px" }}>✅ Cleared Exact Matches</strong>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: "6px 0 0" }}>100% verified transactions with bi-directional voucher references for journal ledger entry.</p>
            </div>
            <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--surface-secondary)", borderRadius: "4px" }}>
              <span className="mono" style={{ color: "#f59e0b", fontSize: "9px" }}>SHEET 03</span>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink-heading)", marginTop: "4px" }}>⚠️ Tax &amp; Value Variances</strong>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: "6px 0 0" }}>Color-coded delta variances (PPN/PPh rounding) with targeted auditor adjustment columns.</p>
            </div>
            <div style={{ padding: "14px", border: "1px solid var(--line)", background: "var(--surface-secondary)", borderRadius: "4px" }}>
              <span className="mono" style={{ color: "#ef4444", fontSize: "9px" }}>SHEET 04</span>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ink-heading)", marginTop: "4px" }}>🚨 Critical Duplicate Entries</strong>
              <p style={{ fontSize: "11px", color: "var(--muted)", margin: "6px 0 0" }}>High-priority double-posted transaction alert list with immediate reversal batch codes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
