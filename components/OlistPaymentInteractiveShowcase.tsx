"use client";

import React, { useState } from "react";

type PaymentMethod = {
  method: string;
  share_volume: number;
  share_gmv: number;
  total_gmv: string;
  order_count: string;
  avg_ticket: string;
  avg_installments: number;
  color: string;
  insight: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    method: "Credit Card",
    share_volume: 73.9,
    share_gmv: 78.4,
    total_gmv: "R$ 12.54M",
    order_count: "76,795 txns",
    avg_ticket: "R$ 163.32",
    avg_installments: 3.51,
    color: "var(--accent)",
    insight: "The primary marketplace engine. Dominates 78.4% of total GMV and acts as the sole vehicle for installment financing across Brazil."
  },
  {
    method: "Boleto Bancário",
    share_volume: 19.0,
    share_gmv: 17.9,
    total_gmv: "R$ 2.87M",
    order_count: "19,784 txns",
    avg_ticket: "R$ 145.03",
    avg_installments: 1.0,
    color: "#f59e0b",
    insight: "Essential cash-based and unbanked consumer lifeline. Fixed 1x settlement for price-sensitive buyers avoiding interest."
  },
  {
    method: "Voucher",
    share_volume: 5.6,
    share_gmv: 2.4,
    total_gmv: "R$ 379.4k",
    order_count: "5,775 txns",
    avg_ticket: "R$ 65.70",
    avg_installments: 1.0,
    color: "#38bdf8",
    insight: "Promotional credit and refund balances. Frequently used as a secondary split-payment method alongside credit cards."
  },
  {
    method: "Debit Card",
    share_volume: 1.5,
    share_gmv: 1.4,
    total_gmv: "R$ 217.9k",
    order_count: "1,529 txns",
    avg_ticket: "R$ 142.57",
    avg_installments: 1.0,
    color: "#10b981",
    insight: "Low-adoption direct settlement channel due to historical Brazilian banking authentication friction."
  }
];

const INSTALLMENT_TIERS = [
  { tier: "1x (Full Payment)", orders: "24,004 (32.0%)", aov: 100.91, median: 71.62, color: "var(--dim)", surge: "Baseline" },
  { tier: "2–3x Installments", orders: "22,649 (30.2%)", aov: 135.58, median: 111.38, color: "#38bdf8", surge: "+34.4%" },
  { tier: "4–6x Installments", orders: "16,160 (21.6%)", aov: 182.56, median: 128.28, color: "#facc15", surge: "+80.9%" },
  { tier: "7–10x Installments", orders: "11,819 (15.8%)", aov: 336.44, median: 206.78, color: "var(--accent)", surge: "+233.4% (3.3x)" },
  { tier: "11–24x (Long-Tail)", orders: "341 (0.5%)", aov: 360.37, median: 216.05, color: "#ef4444", surge: "+257.1% (3.6x)" }
];

const CATEGORY_SENSITIVITY = [
  { category: "Computers", avg_inst: 7.41, aov: 1288.65, orders: 149, type: "High-Ticket Tech" },
  { category: "Home Appliances 2", avg_inst: 5.55, aov: 609.51, orders: 179, type: "Major Appliances" },
  { category: "Musical Instruments", avg_inst: 4.49, aov: 363.37, orders: 455, type: "Durable Goods" },
  { category: "Watches & Gifts", avg_inst: 4.46, aov: 243.97, orders: 4485, type: "High-Volume Sweetspot" },
  { category: "Office Furniture", avg_inst: 4.78, aov: 276.90, orders: 873, type: "Commercial Furniture" },
  { category: "Bed, Bath & Table", avg_inst: 4.31, aov: 137.18, orders: 7265, type: "Mass Category" },
  { category: "Books Technical", avg_inst: 2.48, aov: 93.01, orders: 187, type: "Consumable" },
  { category: "Food & Drinks", avg_inst: 1.95, aov: 91.15, orders: 230, type: "Fast Consumable" }
];

export function OlistPaymentInteractiveShowcase() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [activeTab, setActiveTab] = useState<"methods" | "elasticity" | "categories">("methods");

  return (
    <section
      id="payment-analytics-terminal"
      style={{
        margin: "36px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "22px 20px",
      }}
      aria-label="Olist Payment & Installment Behavior Analytics Terminal"
    >
      {/* Terminal Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 18 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            FINTECH & BEHAVIORAL ECONOMICS • OLIST BRAZIL (103.9K TRANSACTIONS)
          </span>
          <h2 style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "3px 0 0" }}>
            Payment Method Mix & Installment Elasticity Engine
          </h2>
        </div>

        {/* View Switcher Buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("methods")}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              padding: "7px 12px",
              backgroundColor: activeTab === "methods" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === "methods" ? "var(--ink-heading)" : "var(--dim)",
              border: activeTab === "methods" ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            01. PAYMENT MIX (4 CHANNELS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("elasticity")}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              padding: "7px 12px",
              backgroundColor: activeTab === "elasticity" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === "elasticity" ? "var(--ink-heading)" : "var(--dim)",
              border: activeTab === "elasticity" ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            02. INSTALLMENT VS AOV (3.3x SURGE)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              padding: "7px 12px",
              backgroundColor: activeTab === "categories" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === "categories" ? "var(--ink-heading)" : "var(--dim)",
              border: activeTab === "categories" ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            03. CATEGORY SENSITIVITY
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PAYMENT METHOD DISTRIBUTION & TELEMETRY                           */}
      {/* ========================================================================= */}
      {activeTab === "methods" && (
        <div>
          {/* Executive Summary Bar */}
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "12px 16px", borderRadius: 3, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "var(--ink)", fontSize: 13 }}>
              💳 <strong>Credit Cards drive 78.4% of total GMV</strong> (R$ 12.54M), while <strong>Boleto Bancário</strong> acts as the essential #2 non-credit cash channel (17.9% GMV).
            </span>
            <span className="mono" style={{ fontSize: 9, color: "var(--accent)", border: "1px solid var(--accent)", padding: "2px 6px", borderRadius: 2 }}>
              N = 103,886 PAYMENTS (R$ 16.01M GMV)
            </span>
          </div>

          {/* 4 Clean Payment Method Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = selectedMethod.method === pm.method;
              return (
                <div
                  key={pm.method}
                  onClick={() => setSelectedMethod(pm)}
                  onMouseEnter={() => setSelectedMethod(pm)}
                  style={{
                    padding: "16px 14px",
                    backgroundColor: isSelected ? "var(--accent-subtle)" : "var(--surface-secondary)",
                    border: isSelected ? `2px solid ${pm.color}` : "1px solid var(--line)",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 9, color: pm.color, border: `1px solid ${pm.color}`, padding: "1px 5px", borderRadius: 2 }}>
                      {pm.share_gmv}% GMV
                    </span>
                    <strong style={{ fontSize: 14, color: "var(--ink-heading)", fontFamily: "monospace" }}>{pm.total_gmv}</strong>
                  </div>

                  <strong style={{ fontSize: 14, color: isSelected ? "var(--ink-heading)" : "var(--ink)", display: "block", margin: "6px 0 2px" }}>
                    {pm.method}
                  </strong>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>
                    {pm.order_count} ({pm.share_volume}%) • Avg {pm.avg_ticket}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 1-Box Deep Method Dossier */}
          <div style={{ backgroundColor: "var(--surface-secondary)", border: `1px solid ${selectedMethod.color}`, padding: "14px 18px", borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <span className="mono" style={{ color: selectedMethod.color, fontSize: 9 }}>
                CHANNEL ARCHITECTURE • {selectedMethod.method.toUpperCase()}
              </span>
              <p style={{ margin: "4px 0 0", color: "var(--ink)", fontSize: 12, lineHeight: 1.5 }}>
                {selectedMethod.insight}
              </p>
            </div>

            <div style={{ textAlign: "right", minWidth: 150 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>AVG INSTALLMENTS</span>
              <strong style={{ fontSize: 16, color: selectedMethod.color, fontFamily: "monospace" }}>
                {selectedMethod.avg_installments.toFixed(2)}x
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INSTALLMENT VS ORDER VALUE ELASTICITY CURVE                       */}
      {/* ========================================================================= */}
      {activeTab === "elasticity" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "16px 20px", borderRadius: 3 }}>
              <span className="mono" style={{ color: "#38bdf8", fontSize: 9 }}>SINGLE-PAYMENT BASELINE (1x)</span>
              <strong style={{ fontSize: 26, color: "#38bdf8", fontFamily: "monospace", display: "block", margin: "6px 0 2px" }}>
                R$ 100.91 <small style={{ fontSize: 12, color: "var(--dim)" }}>(Median: R$ 71.62)</small>
              </strong>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>Standard low-ticket purchases and routine consumable reorders settled in full.</p>
            </div>

            <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--accent)", padding: "16px 20px", borderRadius: 3 }}>
              <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>EXTENDED INSTALLMENTS (7–10x) • 3.3x HIGHER AOV</span>
              <strong style={{ fontSize: 26, color: "var(--accent)", fontFamily: "monospace", display: "block", margin: "6px 0 2px" }}>
                R$ 336.44 <small style={{ fontSize: 12, color: "var(--dim)" }}>(Median: R$ 206.78)</small>
              </strong>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>Financing enables high-ticket durable purchases without immediate cashflow strain (r = 0.37).</p>
            </div>
          </div>

          {/* 5-Tier Installment Spectrum Table */}
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "16px 18px", borderRadius: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="mono" style={{ color: "var(--dim)", fontSize: 9 }}>
                INSTALLMENT TIER ESCALATION (74,975 CREDIT CARD ORDERS • PEARSON r = 0.37):
              </span>
              <span className="mono" style={{ color: "var(--accent)", fontSize: 9, backgroundColor: "var(--accent-subtle)", padding: "2px 6px", borderRadius: 2 }}>
                10x ANOMALY: 5,328 ORDERS (CHECKOUT DEFAULT)
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {INSTALLMENT_TIERS.map((tier) => (
                <div key={tier.tier} style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "10px 8px", borderRadius: 2, textAlign: "center" }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>{tier.tier}</span>
                  <strong style={{ fontSize: 15, color: tier.color, fontFamily: "monospace", display: "block", margin: "3px 0" }}>
                    R$ {tier.aov.toFixed(0)}
                  </strong>
                  <span className="mono" style={{ fontSize: 8, color: tier.color, display: "block" }}>{tier.surge}</span>
                  <span className="mono" style={{ fontSize: 7, color: "var(--dim)", display: "block", marginTop: 2 }}>{tier.orders}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CATEGORY SENSITIVITY TO INSTALLMENTS                              */}
      {/* ========================================================================= */}
      {activeTab === "categories" && (
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>CATEGORY FINANCING SENSITIVITY</span>
              <h4 style={{ fontSize: 16, color: "var(--ink-heading)", margin: "2px 0 0" }}>
                Durable High-Ticket vs Consumables Installment Behavior
              </h4>
            </div>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 9 }}>
              HIGH CONSIDERATION = 4.5x–7.4x INSTALLMENTS
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {CATEGORY_SENSITIVITY.map((cat) => (
              <div key={cat.category} style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>{cat.type}</span>
                  <strong style={{ fontSize: 14, color: cat.avg_inst >= 4.5 ? "var(--accent)" : "var(--dim)", fontFamily: "monospace" }}>
                    {cat.avg_inst}x Inst.
                  </strong>
                </div>
                <strong style={{ fontSize: 13, color: "var(--ink-heading)", display: "block", margin: "4px 0 2px" }}>{cat.category}</strong>
                <span className="mono" style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>
                  AOV: R$ {cat.aov.toFixed(0)} • {cat.orders.toLocaleString()} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
