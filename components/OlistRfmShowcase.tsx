"use client";

import React, { useState } from "react";

const RFM_PILLARS = [
  {
    id: "dormant_high",
    name: "Cannot Lose Them (Dormant High-Value)",
    gmv: "R$ 4.24M",
    gmv_pct: 27.5,
    customers: "13,757",
    cust_pct: 14.7,
    avg_spend: "R$ 308",
    recency: "443 Days (>14 mo)",
    accent: "#ff4d1c",
    status: "CRITICAL CHURN RISK (27.5% GMV)",
    action: "Top revenue cohort (27.5% GMV) in dormant status. Deploy high-value win-back vouchers (R$ 50 off) to re-engage before permanent churn."
  },
  {
    id: "active_high",
    name: "Promising & New Big Spenders",
    gmv: "R$ 6.29M",
    gmv_pct: 40.8,
    customers: "21,348",
    cust_pct: 22.9,
    avg_spend: "R$ 295",
    recency: "182 Days (<6 mo)",
    accent: "#f59e0b",
    status: "PRIME RETENTION TARGET",
    action: "Largest active revenue engine (40.8% GMV). Target with post-delivery category cross-sells to secure second purchase."
  },
  {
    id: "low_value_base",
    name: "One-Time Low-Value Base",
    gmv: "R$ 4.03M",
    gmv_pct: 26.1,
    customers: "55,452",
    cust_pct: 59.4,
    avg_spend: "R$ 73",
    recency: "288 Days",
    accent: "#71717a",
    status: "MASS AUTOMATION ONLY",
    action: "Accounts for 59.4% of buyers but low ticket size. Maintain zero-cost automated email newsletters; avoid expensive ad subsidies."
  },
  {
    id: "champions_vip",
    name: "True Loyal Repeat Buyers",
    gmv: "R$ 0.86M",
    gmv_pct: 5.6,
    customers: "2,801",
    cust_pct: 3.0,
    avg_spend: "R$ 307",
    recency: "263 Days (2.2x orders)",
    accent: "#38bdf8",
    status: "ELITE VIP AMBASSADORS (3.0%)",
    action: "Rare multi-order customers (3.0% repeat rate). Reward with priority customer service, exclusive previews, and referral perks."
  }
];

export function OlistRfmShowcase() {
  const [selectedPillar, setSelectedPillar] = useState(RFM_PILLARS[0]);

  return (
    <div
      style={{
        margin: "36px 0",
        backgroundColor: "#07070a",
        border: "1px solid #1c1c24",
        borderRadius: 4,
        padding: "20px",
      }}
      aria-label="Olist 9-Tier RFM Customer Retention Matrix"
    >
      <div style={{ borderBottom: "1px solid #181822", paddingBottom: 12, marginBottom: 16 }}>
        <span className="mono" style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          CUSTOMER INTELLIGENCE & RETENTION • OLIST BRAZIL (93.4K BUYERS)
        </span>
        <h3 style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "#ffffff", letterSpacing: "-0.03em", margin: "3px 0 0" }}>
          9-Tier Behavioral RFM Retention Matrix
        </h3>
      </div>

      {/* Discovery Summary */}
      <div style={{ backgroundColor: "#0b0b0f", border: "1px solid #1a1a24", padding: "12px 16px", borderRadius: 3, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <span style={{ color: "#e2e2e8", fontSize: 13 }}>
          🎯 <strong>97.0% of buyers purchase once.</strong> High-ticket single buyers drive <strong>68.3% of total platform GMV</strong> (R$ 10.5M+).
        </span>
        <span className="mono" style={{ fontSize: 9, color: "var(--accent)", border: "1px solid var(--accent)", padding: "2px 6px", borderRadius: 2 }}>
          N = 93,358 UNIQUE DELIVERED CUSTOMERS
        </span>
      </div>

      {/* 4 Clean Quadrant Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: 16 }}>
        {RFM_PILLARS.map((pillar) => {
          const isSelected = selectedPillar.id === pillar.id;
          return (
            <div
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar)}
              onMouseEnter={() => setSelectedPillar(pillar)}
              style={{
                padding: "16px 14px",
                backgroundColor: isSelected ? "rgba(255,77,28,0.1)" : "#0c0c10",
                border: isSelected ? `2px solid ${pillar.accent}` : "1px solid #1a1a22",
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 8, color: pillar.accent, border: `1px solid ${pillar.accent}`, padding: "1px 4px", borderRadius: 2 }}>
                  {pillar.status}
                </span>
                <strong style={{ fontSize: 15, color: pillar.accent, fontFamily: "monospace" }}>{pillar.gmv_pct}% GMV</strong>
              </div>

              <strong style={{ fontSize: 13, color: isSelected ? "#ffffff" : "#d0d0d8", display: "block", margin: "6px 0 2px" }}>
                {pillar.name}
              </strong>
              <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>
                {pillar.customers} buyers ({pillar.cust_pct}%) • Avg {pillar.avg_spend}
              </span>
            </div>
          );
        })}
      </div>

      {/* Strategic Action Plan Box */}
      <div style={{ backgroundColor: "#0b0b10", border: `1px solid ${selectedPillar.accent}`, padding: "14px 18px", borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <span className="mono" style={{ color: selectedPillar.accent, fontSize: 9 }}>
            RECOMMENDED ACTION • {selectedPillar.name.toUpperCase()}
          </span>
          <p style={{ margin: "4px 0 0", color: "#f0f0f4", fontSize: 12, lineHeight: 1.5 }}>
            {selectedPillar.action}
          </p>
        </div>

        <div style={{ textAlign: "right", minWidth: 140 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>RECENCY WINDOW</span>
          <strong style={{ fontSize: 14, color: "#ffffff", fontFamily: "monospace" }}>{selectedPillar.recency}</strong>
        </div>
      </div>
    </div>
  );
}
