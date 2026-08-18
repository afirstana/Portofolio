"use client";

import React, { useState, useMemo } from "react";

type PaymentMethod = {
  id: string;
  method: string;
  share_volume: number;
  share_gmv: number;
  total_gmv: string;
  order_count: string;
  avg_ticket: string;
  avg_installments: number;
  color: string;
  insight: string;
  behavioral_role: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "credit_card",
    method: "Credit Card",
    share_volume: 73.9,
    share_gmv: 78.4,
    total_gmv: "R$ 12.54M",
    order_count: "76,795 txns",
    avg_ticket: "R$ 163.32",
    avg_installments: 3.51,
    color: "var(--accent)",
    insight: "The primary marketplace growth engine. Generates 78.4% of platform GMV and serves as the sole rail supporting multi-month installment financing across Brazil.",
    behavioral_role: "High-Ticket Conversion & Installment Financing Rail"
  },
  {
    id: "boleto",
    method: "Boleto Bancário",
    share_volume: 19.0,
    share_gmv: 17.9,
    total_gmv: "R$ 2.87M",
    order_count: "19,784 txns",
    avg_ticket: "R$ 145.03",
    avg_installments: 1.0,
    color: "#f59e0b",
    insight: "Essential cash-based and unbanked consumer lifeline (19.0% volume). Sells fixed 1x cash settlement for price-sensitive shoppers avoiding credit debt.",
    behavioral_role: "Unbanked Demographics & Cash-Preferred Buyers"
  },
  {
    id: "voucher",
    method: "Voucher",
    share_volume: 5.6,
    share_gmv: 2.4,
    total_gmv: "R$ 379.4k",
    order_count: "5,775 txns",
    avg_ticket: "R$ 65.70",
    avg_installments: 1.0,
    color: "#38bdf8",
    insight: "Promotional credits, cashbacks, and refund balances. Frequently used as a secondary co-payment split alongside credit cards on high-ticket checkouts.",
    behavioral_role: "Loyalty Cashback & Split Co-Payment Rail"
  },
  {
    id: "debit_card",
    method: "Debit Card",
    share_volume: 1.5,
    share_gmv: 1.4,
    total_gmv: "R$ 217.9k",
    order_count: "1,529 txns",
    avg_ticket: "R$ 142.57",
    avg_installments: 1.0,
    color: "#10b981",
    insight: "Historically constrained in Brazilian e-commerce (1.5% volume) due to 3D-Secure authentication friction prior to the nationwide rollout of Pix instant payment rails.",
    behavioral_role: "Direct Account Settlement (Pre-Pix Era)"
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
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | null>(null);
  const [pieMetric, setPieMetric] = useState<"gmv" | "volume">("gmv");
  const [activeTab, setActiveTab] = useState<"methods" | "elasticity" | "categories">("methods");

  const activeMethod = hoveredMethod || selectedMethod;

  // Donut Arc calculation for SVG Pie / Donut
  const donutArcs = useMemo(() => {
    let currentAngle = -Math.PI / 2;
    const totalVal = PAYMENT_METHODS.reduce((sum, pm) => sum + (pieMetric === "gmv" ? pm.share_gmv : pm.share_volume), 0);

    return PAYMENT_METHODS.map((pm) => {
      const share = pieMetric === "gmv" ? pm.share_gmv : pm.share_volume;
      const sliceAngle = (share / totalVal) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      const midAngle = (startAngle + endAngle) / 2;
      currentAngle = endAngle;

      const rOuter = 88;
      const rInner = 54;
      const cx = 110;
      const cy = 110;

      const x1 = cx + rOuter * Math.cos(startAngle);
      const y1 = cy + rOuter * Math.sin(startAngle);
      const x2 = cx + rOuter * Math.cos(endAngle);
      const y2 = cy + rOuter * Math.sin(endAngle);

      const x3 = cx + rInner * Math.cos(endAngle);
      const y3 = cy + rInner * Math.sin(endAngle);
      const x4 = cx + rInner * Math.cos(startAngle);
      const y4 = cy + rInner * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;

      // Offset for hover pop-out effect
      const hoverOffset = 5;
      const offsetX = Math.cos(midAngle) * hoverOffset;
      const offsetY = Math.sin(midAngle) * hoverOffset;

      return {
        ...pm,
        share,
        pathData,
        offsetX,
        offsetY,
      };
    });
  }, [pieMetric]);

  return (
    <section
      id="payment-analytics-terminal"
      style={{
        margin: "36px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 20px",
      }}
      aria-label="Olist Payment & Installment Behavior Analytics Terminal"
    >
      {/* Terminal Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            FINTECH & BEHAVIORAL ECONOMICS • OLIST BRAZIL (103.9K TRANSACTIONS)
          </span>
          <h2 style={{ fontSize: "clamp(20px, 2.2vw, 26px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
            Payment Method Mix & Installment Elasticity Engine
          </h2>
        </div>

        {/* View Switcher Buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("methods")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "7px 14px",
              backgroundColor: activeTab === "methods" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === "methods" ? "var(--accent)" : "var(--ink)",
              border: activeTab === "methods" ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer",
              fontWeight: activeTab === "methods" ? 700 : 500,
              transition: "all 0.15s ease",
            }}
          >
            01. Interactive Pie / Mix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("elasticity")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "7px 14px",
              backgroundColor: activeTab === "elasticity" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === "elasticity" ? "var(--accent)" : "var(--ink)",
              border: activeTab === "elasticity" ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer",
              fontWeight: activeTab === "elasticity" ? 700 : 500,
              transition: "all 0.15s ease",
            }}
          >
            02. Installment vs AOV (3.3x)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              padding: "7px 14px",
              backgroundColor: activeTab === "categories" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === "categories" ? "var(--accent)" : "var(--ink)",
              border: activeTab === "categories" ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 3,
              cursor: "pointer",
              fontWeight: activeTab === "categories" ? 700 : 500,
              transition: "all 0.15s ease",
            }}
          >
            03. Category Financing Sensitivity
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INTERACTIVE PIE / DONUT CHART & FLOATING TELEMETRY                 */}
      {/* ========================================================================= */}
      {activeTab === "methods" && (
        <div>
          {/* Executive Summary Bar */}
          <div
            style={{
              backgroundColor: "var(--surface-secondary)",
              border: "1px solid var(--line)",
              borderLeft: "3px solid var(--accent)",
              padding: "12px 18px",
              borderRadius: 3,
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.5 }}>
              💳 <strong>Credit Cards drive 78.4% of total marketplace GMV</strong> (R$ 12.54M), while <strong>Boleto Bancário</strong> acts as the vital cash-based alternative (17.9% GMV). Hover over any pie slice to inspect live floating telemetry.
            </span>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--accent)", border: "1px solid var(--accent)", padding: "3px 8px", borderRadius: 2, whiteSpace: "nowrap" }}>
              N = 103,886 PAYMENTS (R$ 16.01M GMV)
            </span>
          </div>

          {/* Side-by-Side: Interactive SVG Donut & Floating Telemetry Panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 20, alignItems: "start", marginBottom: 20 }}>
            {/* Left Box: SVG Pie / Donut Chart */}
            <div
              style={{
                backgroundColor: "var(--surface-secondary)",
                border: "1px solid var(--line)",
                borderRadius: 4,
                padding: "18px 20px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Pie Metric Switcher */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, fontWeight: 700 }}>
                  INTERACTIVE PIE DISTRIBUTION
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setPieMetric("gmv")}
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      padding: "4px 8px",
                      borderRadius: 2,
                      cursor: "pointer",
                      border: pieMetric === "gmv" ? "1px solid var(--accent)" : "1px solid var(--line)",
                      backgroundColor: pieMetric === "gmv" ? "var(--accent-subtle)" : "transparent",
                      color: pieMetric === "gmv" ? "var(--accent)" : "var(--dim)",
                      fontWeight: pieMetric === "gmv" ? 700 : 400,
                    }}
                  >
                    GMV Share (%)
                  </button>
                  <button
                    onClick={() => setPieMetric("volume")}
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      padding: "4px 8px",
                      borderRadius: 2,
                      cursor: "pointer",
                      border: pieMetric === "volume" ? "1px solid var(--accent)" : "1px solid var(--line)",
                      backgroundColor: pieMetric === "volume" ? "var(--accent-subtle)" : "transparent",
                      color: pieMetric === "volume" ? "var(--accent)" : "var(--dim)",
                      fontWeight: pieMetric === "volume" ? 700 : 400,
                    }}
                  >
                    Volume Share (%)
                  </button>
                </div>
              </div>

              {/* SVG Donut Canvas */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", margin: "10px 0" }}>
                <svg viewBox="0 0 220 220" style={{ width: "220px", height: "220px", overflow: "visible" }}>
                  {donutArcs.map((slice) => {
                    const isHovered = activeMethod.id === slice.id;
                    return (
                      <path
                        key={slice.id}
                        d={slice.pathData}
                        fill={slice.color}
                        transform={isHovered ? `translate(${slice.offsetX.toFixed(2)}, ${slice.offsetY.toFixed(2)})` : "translate(0, 0)"}
                        style={{
                          cursor: "pointer",
                          transition: "transform 0.18s ease, filter 0.18s ease, opacity 0.18s ease",
                          opacity: isHovered ? 1 : 0.82,
                          filter: isHovered ? "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" : "none",
                        }}
                        onMouseEnter={() => {
                          setHoveredMethod(slice);
                          setSelectedMethod(slice);
                        }}
                        onMouseLeave={() => setHoveredMethod(null)}
                        onClick={() => setSelectedMethod(slice)}
                      />
                    );
                  })}

                  {/* Center Donut Hole Text */}
                  <g style={{ pointerEvents: "none" }}>
                    <circle cx="110" cy="110" r="48" fill="var(--panel)" />
                    <text x="110" y="102" textAnchor="middle" fill="var(--dim)" fontSize="9" fontFamily="monospace">
                      {activeMethod.method.toUpperCase()}
                    </text>
                    <text x="110" y="122" textAnchor="middle" fill={activeMethod.color} fontSize="17" fontWeight="bold" fontFamily="monospace">
                      {pieMetric === "gmv" ? `${activeMethod.share_gmv}%` : `${activeMethod.share_volume}%`}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Legend Badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = activeMethod.id === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onMouseEnter={() => {
                        setHoveredMethod(pm);
                        setSelectedMethod(pm);
                      }}
                      onMouseLeave={() => setHoveredMethod(null)}
                      onClick={() => setSelectedMethod(pm)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        padding: "3px 8px",
                        borderRadius: 3,
                        backgroundColor: isSelected ? "var(--accent-subtle)" : "transparent",
                        border: isSelected ? `1px solid ${pm.color}` : "1px solid transparent",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: pm.color, display: "inline-block" }} />
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: isSelected ? "var(--ink-heading)" : "var(--dim)" }}>
                        {pm.method} ({pieMetric === "gmv" ? `${pm.share_gmv}%` : `${pm.share_volume}%`})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Box: Floating Interactive Detail HUD Panel */}
            <div
              style={{
                backgroundColor: "var(--surface-secondary)",
                border: `1px solid ${activeMethod.color}`,
                borderRadius: 4,
                padding: "20px 22px",
                transition: "all 0.2s ease",
              }}
            >
              {/* Top Banner: Method Name & Behavioral Role */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                <div>
                  <span className="mono" style={{ color: activeMethod.color, fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                    CHANNEL TELEMETRY HUD
                  </span>
                  <h4 style={{ fontSize: 18, color: "var(--ink-heading)", margin: "4px 0 0", fontWeight: 700 }}>
                    {activeMethod.method}
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: 9.5,
                    fontFamily: "monospace",
                    color: activeMethod.color,
                    border: `1px solid ${activeMethod.color}`,
                    padding: "2px 8px",
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {activeMethod.behavioral_role}
                </span>
              </div>

              {/* 4 Metric Highlights Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "10px 12px" }}>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>TOTAL GMV VALUE</span>
                  <strong style={{ fontSize: 16, color: activeMethod.color, fontFamily: "monospace" }}>{activeMethod.total_gmv}</strong>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>{activeMethod.share_gmv}% of total GMV</span>
                </div>

                <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "10px 12px" }}>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>TOTAL TRANSACTIONS</span>
                  <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>{activeMethod.order_count}</strong>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>{activeMethod.share_volume}% volume share</span>
                </div>

                <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "10px 12px" }}>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>AVERAGE TICKET (AOV)</span>
                  <strong style={{ fontSize: 15, color: "var(--ink-heading)", fontFamily: "monospace" }}>{activeMethod.avg_ticket}</strong>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>per transaction</span>
                </div>

                <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "10px 12px" }}>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>AVG INSTALLMENT TENOR</span>
                  <strong style={{ fontSize: 15, color: activeMethod.color, fontFamily: "monospace" }}>{activeMethod.avg_installments.toFixed(2)}x</strong>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>months duration</span>
                </div>
              </div>

              {/* Behavioral & Strategic Interpretation Callout */}
              <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "12px 14px" }}>
                <span className="mono" style={{ fontSize: 8.5, color: activeMethod.color, display: "block", marginBottom: 4, fontWeight: 700 }}>
                  STRATEGIC BEHAVIORAL INSIGHT:
                </span>
                <p style={{ margin: 0, color: "var(--ink)", fontSize: 12.5, lineHeight: 1.55 }}>
                  {activeMethod.insight}
                </p>
              </div>
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
