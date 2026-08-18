"use client";

import React, { useState } from "react";

interface RfmCohort {
  id: string;
  name: string;
  gmv: string;
  gmv_pct: number;
  customers: string;
  cust_pct: number;
  avg_spend: string;
  recency: string;
  accent: string;
  badge: string;
  action: string;
  retention_lever: string;
}

interface GranularTier {
  rank: number;
  name: string;
  definition: string;
  customers: string;
  cust_pct: number;
  gmv: string;
  gmv_pct: number;
  aov: string;
  accent: string;
  priority: string;
}

const STRATEGIC_PILLARS: RfmCohort[] = [
  {
    id: "dormant_high",
    name: "Cannot Lose Them (Dormant High-Value)",
    gmv: "R$ 4.24M",
    gmv_pct: 27.5,
    customers: "13,757",
    cust_pct: 14.7,
    avg_spend: "R$ 308",
    recency: "443 Days (>14 mo)",
    accent: "var(--accent)",
    badge: "CRITICAL CHURN RISK",
    action: "Top revenue cohort (27.5% GMV) in dormant status. Deploy high-value win-back vouchers (R$ 50 off basket > R$ 200) before permanent churn.",
    retention_lever: "Win-back voucher + Category-affinity personalized re-engagement"
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
    badge: "PRIME RETENTION TARGET",
    action: "Largest active revenue engine (40.8% GMV). Target with post-delivery category cross-sells to convert high-ticket single buyers into second purchase.",
    retention_lever: "Cross-sell automation + 30-day post-delivery incentive"
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
    accent: "#94a3b8",
    badge: "MASS AUTOMATION ONLY",
    action: "Accounts for 59.4% of total buyers but low ticket size. Maintain zero-cost automated email newsletters; avoid expensive ad subsidies.",
    retention_lever: "Zero-CAC automated triggers + Free shipping threshold upsell"
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
    badge: "ELITE VIP AMBASSADORS",
    action: "Rare multi-order customers (3.0% repeat rate). Reward with priority customer service, exclusive previews, and referral perks.",
    retention_lever: "VIP tier rewards + Merchant direct loyalty programs"
  }
];

const GRANULAR_9_TIERS: GranularTier[] = [
  { rank: 1, name: "Champions", definition: "F >= 2, R <= 90d, M > R$ 200", customers: "642", cust_pct: 0.69, gmv: "R$ 284,120", gmv_pct: 1.84, aov: "R$ 442.50", accent: "#10b981", priority: "VIP Loyalty" },
  { rank: 2, name: "Loyal Customers", definition: "F >= 2, R > 90d", customers: "1,890", cust_pct: 2.02, gmv: "R$ 512,300", gmv_pct: 3.32, aov: "R$ 271.10", accent: "#38bdf8", priority: "Priority Service" },
  { rank: 3, name: "High-Value Recent", definition: "F = 1, R <= 90d, M > R$ 200", customers: "14,210", cust_pct: 15.22, gmv: "R$ 4,812,400", gmv_pct: 31.20, aov: "R$ 338.70", accent: "#f59e0b", priority: "Cross-Sell Trigger" },
  { rank: 4, name: "Promising Active", definition: "F = 1, R <= 90d, M <= R$ 200", customers: "12,850", cust_pct: 13.76, gmv: "R$ 1,745,200", gmv_pct: 11.32, aov: "R$ 135.80", accent: "#fb923c", priority: "Second Purchase Voucher" },
  { rank: 5, name: "Core Mid-Tier", definition: "F = 1, 91d <= R <= 240d", customers: "28,450", cust_pct: 30.47, gmv: "R$ 3,840,100", gmv_pct: 24.90, aov: "R$ 134.90", accent: "#94a3b8", priority: "Lifecycle Re-engagement" },
  { rank: 6, name: "Budget One-Time", definition: "F = 1, M < R$ 80", customers: "18,920", cust_pct: 20.27, gmv: "R$ 984,500", gmv_pct: 6.38, aov: "R$ 52.00", accent: "#64748b", priority: "Automated Email Only" },
  { rank: 7, name: "At Risk High-Value", definition: "F = 1, R > 240d, M > R$ 200", customers: "6,840", cust_pct: 7.33, gmv: "R$ 2,145,800", gmv_pct: 13.91, aov: "R$ 313.70", accent: "var(--accent)", priority: "Aggressive Win-Back" },
  { rank: 8, name: "Hibernating Mid-Tier", definition: "F = 1, R > 240d, M <= R$ 200", customers: "7,120", cust_pct: 7.63, gmv: "R$ 812,300", gmv_pct: 5.27, aov: "R$ 114.10", accent: "#a855f7", priority: "Low-Cost Cadence" },
  { rank: 9, name: "Lost Low-Value", definition: "F = 1, R > 360d, M < R$ 80", customers: "2,436", cust_pct: 2.61, gmv: "R$ 285,742", gmv_pct: 1.85, aov: "R$ 117.30", accent: "#ef4444", priority: "Deprioritize Spend" }
];

export function OlistRfmShowcase() {
  const [activeTab, setActiveTab] = useState<"pillars" | "granular">("pillars");
  const [selectedCohort, setSelectedCohort] = useState<RfmCohort>(STRATEGIC_PILLARS[0]);

  return (
    <section
      style={{
        margin: "36px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 20px",
      }}
      aria-label="Olist 9-Tier RFM Customer Retention Matrix"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
              CUSTOMER INTELLIGENCE & RETENTION • OLIST BRAZIL
            </span>
            <h3 style={{ fontSize: "clamp(20px, 2.2vw, 26px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
              9-Tier Behavioral RFM Retention Matrix
            </h3>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setActiveTab("pillars")}
              style={{
                padding: "6px 14px",
                fontFamily: "monospace",
                fontSize: 11,
                borderRadius: 3,
                cursor: "pointer",
                border: activeTab === "pillars" ? "1px solid var(--accent)" : "1px solid var(--line)",
                backgroundColor: activeTab === "pillars" ? "var(--accent-subtle)" : "var(--surface-secondary)",
                color: activeTab === "pillars" ? "var(--accent)" : "var(--ink)",
                fontWeight: activeTab === "pillars" ? 700 : 500,
                transition: "all 0.15s ease",
              }}
            >
              Strategic 4 Pillars
            </button>
            <button
              onClick={() => setActiveTab("granular")}
              style={{
                padding: "6px 14px",
                fontFamily: "monospace",
                fontSize: 11,
                borderRadius: 3,
                cursor: "pointer",
                border: activeTab === "granular" ? "1px solid var(--accent)" : "1px solid var(--line)",
                backgroundColor: activeTab === "granular" ? "var(--accent-subtle)" : "var(--surface-secondary)",
                color: activeTab === "granular" ? "var(--accent)" : "var(--ink)",
                fontWeight: activeTab === "granular" ? 700 : 500,
                transition: "all 0.15s ease",
              }}
            >
              All 9 Granular Tiers
            </button>
          </div>
        </div>
      </div>

      {/* Discovery Telemetry Callout */}
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
          🎯 <strong>97.0% of buyers purchase only once.</strong> High-ticket single buyers drive <strong>68.3% of total marketplace GMV</strong> (R$ 10.5M+), proving that standard quintile frequency fails and behavioral thresholds are essential.
        </span>
        <span className="mono" style={{ fontSize: 9.5, color: "var(--accent)", border: "1px solid var(--accent)", padding: "3px 8px", borderRadius: 2, whiteSpace: "nowrap" }}>
          N = 93,358 DELIVERED BUYERS
        </span>
      </div>

      {/* VIEW 1: STRATEGIC 4 PILLARS */}
      {activeTab === "pillars" && (
        <>
          {/* 4 Quadrant Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
            {STRATEGIC_PILLARS.map((pillar) => {
              const isSelected = selectedCohort.id === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedCohort(pillar)}
                  onMouseEnter={() => setSelectedCohort(pillar)}
                  style={{
                    padding: "16px 16px",
                    backgroundColor: isSelected ? "var(--accent-subtle)" : "var(--surface-secondary)",
                    border: isSelected ? `2px solid ${pillar.accent}` : "1px solid var(--line)",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Top Row: Badge + GMV Share */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: 9,
                          color: pillar.accent,
                          border: `1px solid ${pillar.accent}`,
                          padding: "2px 6px",
                          borderRadius: 2,
                          letterSpacing: "0.03em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pillar.badge}
                      </span>
                      <strong style={{ fontSize: 16, color: pillar.accent, fontFamily: "monospace" }}>
                        {pillar.gmv_pct}% GMV
                      </strong>
                    </div>

                    {/* Title */}
                    <strong style={{ fontSize: 14, color: isSelected ? "var(--ink-heading)" : "var(--ink)", display: "block", marginBottom: 6, lineHeight: 1.3 }}>
                      {pillar.name}
                    </strong>
                  </div>

                  {/* Metrics Footer */}
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8, marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--dim)", fontFamily: "monospace" }}>
                      <span>{pillar.customers} buyers ({pillar.cust_pct}%)</span>
                      <span style={{ color: "var(--ink)" }}>Avg {pillar.avg_spend}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Strategy Detail Card */}
          <div
            style={{
              backgroundColor: "var(--surface-secondary)",
              border: `1px solid ${selectedCohort.accent}`,
              borderRadius: 4,
              padding: "18px 20px",
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 20,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span className="mono" style={{ color: selectedCohort.accent, fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                  STRATEGIC PLAYBOOK • {selectedCohort.name.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--ink)", fontSize: 13, lineHeight: 1.55 }}>
                {selectedCohort.action}
              </p>
              <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--dim)" }}>
                <strong style={{ color: "var(--ink)" }}>Key Retention Lever:</strong> {selectedCohort.retention_lever}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 3,
                padding: "12px 16px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                textAlign: "center",
              }}
            >
              <div>
                <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>TOTAL GMV CONTRIBUTION</span>
                <strong style={{ fontSize: 15, color: selectedCohort.accent, fontFamily: "monospace" }}>{selectedCohort.gmv}</strong>
              </div>
              <div>
                <span className="mono" style={{ fontSize: 9, color: "var(--dim)", display: "block" }}>MEAN RECENCY WINDOW</span>
                <strong style={{ fontSize: 13, color: "var(--ink-heading)", fontFamily: "monospace" }}>{selectedCohort.recency}</strong>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: ALL 9 GRANULAR TIERS */}
      {activeTab === "granular" && (
        <div
          className="table-scroll"
          style={{
            border: "1px solid var(--line)",
            borderRadius: 4,
            backgroundColor: "var(--surface-secondary)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
                <th style={{ padding: "10px 14px", textAlign: "center", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>#</th>
                <th style={{ padding: "10px 14px", textAlign: "left", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>SEGMENT NAME</th>
                <th style={{ padding: "10px 14px", textAlign: "left", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>RFM CRITERIA</th>
                <th style={{ padding: "10px 14px", textAlign: "right", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>CUSTOMERS</th>
                <th style={{ padding: "10px 14px", textAlign: "right", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>CUST SHARE</th>
                <th style={{ padding: "10px 14px", textAlign: "right", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>TOTAL GMV</th>
                <th style={{ padding: "10px 14px", textAlign: "right", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>GMV SHARE</th>
                <th style={{ padding: "10px 14px", textAlign: "right", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>AVG ORDER VALUE</th>
                <th style={{ padding: "10px 14px", textAlign: "left", font: "10px/1.2 monospace", color: "var(--ink-heading)" }}>RETENTION STRATEGY</th>
              </tr>
            </thead>
            <tbody>
              {GRANULAR_9_TIERS.map((tier) => (
                <tr
                  key={tier.rank}
                  style={{
                    borderBottom: tier.rank === 9 ? "none" : "1px solid var(--line)",
                    backgroundColor: tier.rank % 2 === 0 ? "rgba(255, 255, 255, 0.015)" : "transparent",
                  }}
                >
                  <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "monospace", color: "var(--dim)" }}>{tier.rank}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--ink-heading)" }}>{tier.name}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "var(--dim)" }}>{tier.definition}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace" }}>{tier.customers}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: "var(--dim)" }}>{tier.cust_pct}%</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: tier.accent }}>{tier.gmv}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", fontWeight: 600, color: tier.accent }}>{tier.gmv_pct}%</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "monospace", color: "var(--ink)" }}>{tier.aov}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: tier.accent,
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: `1px solid ${tier.accent}`,
                        padding: "2px 6px",
                        borderRadius: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tier.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
