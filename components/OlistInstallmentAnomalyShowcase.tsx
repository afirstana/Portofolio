"use client";

import React, { useState } from "react";

type InstallmentRow = {
  depth: string;
  count: number;
  share: number;
  aov: number;
  curveType: "modal" | "decay" | "bump" | "trough" | "anomaly" | "cliff";
  diagnosis: string;
  deltaPrev: string;
  isAnomaly?: boolean;
};

const INSTALLMENT_DISTRIBUTION: InstallmentRow[] = [
  { depth: "1x", count: 52546, share: 50.58, aov: 100.91, curveType: "modal", diagnosis: "Modal Peak (Cash & Single Pay)", deltaPrev: "Baseline" },
  { depth: "2x", count: 12413, share: 11.95, aov: 129.40, curveType: "decay", diagnosis: "Natural Decay Curve", deltaPrev: "-76.4%" },
  { depth: "3x", count: 10461, share: 10.07, aov: 142.92, curveType: "decay", diagnosis: "Natural Decay Curve", deltaPrev: "-15.7%" },
  { depth: "4x", count: 7098, share: 6.83, aov: 164.21, curveType: "decay", diagnosis: "Natural Decay Curve", deltaPrev: "-32.1%" },
  { depth: "5x", count: 5239, share: 5.04, aov: 181.75, curveType: "decay", diagnosis: "Natural Decay Curve", deltaPrev: "-26.2%" },
  { depth: "6x", count: 3920, share: 3.77, aov: 209.84, curveType: "decay", diagnosis: "Half-Year Benchmark", deltaPrev: "-25.2%" },
  { depth: "7x", count: 1626, share: 1.57, aov: 215.30, curveType: "trough", diagnosis: "Monotonic Decay Trough", deltaPrev: "-58.5%" },
  { depth: "8x", count: 4268, share: 4.11, aov: 301.12, curveType: "bump", diagnosis: "Merchant Promo Threshold", deltaPrev: "+162.5%" },
  { depth: "9x", count: 644, share: 0.62, aov: 304.55, curveType: "trough", diagnosis: "Steep Pre-Boundary Trough", deltaPrev: "-84.9%" },
  { depth: "10x", count: 5328, share: 5.13, aov: 415.82, curveType: "anomaly", diagnosis: "⚠️ NON-LINEAR CHECKOUT ANOMALY (+727% vs 9x)", deltaPrev: "+727.3%", isAnomaly: true },
  { depth: "11–24x", count: 326, share: 0.31, aov: 360.37, curveType: "cliff", diagnosis: "Interest-Bearing Debt Cliff", deltaPrev: "-93.9%" },
];

const ROOT_CAUSES = [
  {
    id: "ui_default",
    title: "1. Checkout UI Default & Truncation",
    tag: "UX ARCHITECTURE",
    desc: "The marketplace checkout dropdown menu historically truncated or pre-selected 10 installments as the maximum standard option, funneling shoppers into a default clustering pattern.",
    impact: "High artificial volume concentration at 10x"
  },
  {
    id: "sem_juros",
    title: "2. 'Sem Juros' (0% Interest) Banking Ceiling",
    tag: "FINANCIAL INFRASTRUCTURE",
    desc: "In Brazilian retail banking, 10 installments is the traditional merchant-subsidized interest-free threshold. Selecting 11x+ incurs immediate compound revolving interest, creating an acute demand cliff.",
    impact: "-93.9% drop from 10x to 11x+"
  },
  {
    id: "cognitive",
    title: "3. Decimal Psychological Anchoring",
    tag: "BEHAVIORAL ECONOMICS",
    desc: "Consumers exhibit strong cognitive bias toward round base-10 calculations (e.g. R$ 41.58/mo for 10 months) when evaluating personal monthly liquidity allocation.",
    impact: "Preference for 10x over awkward 7x or 9x tenors"
  }
];

export function OlistInstallmentAnomalyShowcase() {
  const [hoveredRow, setHoveredRow] = useState<InstallmentRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<InstallmentRow>(INSTALLMENT_DISTRIBUTION[9]); // default 10x
  const [chartView, setChartView] = useState<"full" | "anomaly_zone">("full");

  const activeRow = hoveredRow || selectedRow;

  const displayedRows = chartView === "anomaly_zone"
    ? INSTALLMENT_DISTRIBUTION.filter((_, idx) => idx >= 5) // 6x to 11-24x
    : INSTALLMENT_DISTRIBUTION;

  const maxCount = Math.max(...displayedRows.map((r) => r.count));

  return (
    <section
      id="installment-anomaly-showcase"
      style={{
        margin: "32px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "22px 20px",
      }}
      aria-label="10x Installment Anomaly Diagnostic Terminal"
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 18 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, letterSpacing: "0.08em", fontWeight: 700 }}>
            DIAGNOSTIC TELEMETRY • NON-LINEAR CHECKOUT BEHAVIOR
          </span>
          <h3 style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "3px 0 0", fontWeight: 700 }}>
            The 10x Installment Spike Anomaly Investigation
          </h3>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setChartView("full")}
            style={{
              fontFamily: "monospace",
              fontSize: 10.5,
              padding: "5px 10px",
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: chartView === "full" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              border: chartView === "full" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: chartView === "full" ? "var(--accent)" : "var(--dim)",
              fontWeight: chartView === "full" ? 700 : 400,
            }}
          >
            Full Curve (1x–24x)
          </button>
          <button
            type="button"
            onClick={() => setChartView("anomaly_zone")}
            style={{
              fontFamily: "monospace",
              fontSize: 10.5,
              padding: "5px 10px",
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: chartView === "anomaly_zone" ? "var(--accent-subtle)" : "var(--surface-secondary)",
              border: chartView === "anomaly_zone" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: chartView === "anomaly_zone" ? "var(--accent)" : "var(--dim)",
              fontWeight: chartView === "anomaly_zone" ? 700 : 400,
            }}
          >
            ⚠️ Zoom Anomaly Zone (6x–11x)
          </button>
        </div>
      </div>

      {/* Interactive Bar Chart with Anomaly Spike */}
      <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: 3, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)" }}>
            TRANSACTION VOLUME DISTRIBUTION BY INSTALLMENT DEPTH (N = 103,886 TXNS)
          </span>
          <span className="mono" style={{ fontSize: 9, color: "var(--accent)", border: "1px solid var(--accent)", padding: "2px 6px", borderRadius: 2 }}>
            10x ANOMALY: +727% SPIKE OVER 9x
          </span>
        </div>

        {/* Bar Chart Visual */}
        <div style={{ display: "flex", alignItems: "flex-end", height: "170px", gap: chartView === "anomaly_zone" ? 18 : 8, paddingTop: 20 }}>
          {displayedRows.map((row) => {
            const barHeightPct = Math.max(6, (row.count / maxCount) * 100);
            const isSelected = activeRow.depth === row.depth;
            const isSpike = row.isAnomaly;

            return (
              <div
                key={row.depth}
                onMouseEnter={() => {
                  setHoveredRow(row);
                  setSelectedRow(row);
                }}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setSelectedRow(row)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  cursor: "pointer",
                }}
              >
                {/* Floating label above bar */}
                <span
                  style={{
                    fontSize: 8.5,
                    fontFamily: "monospace",
                    color: isSpike ? "var(--accent)" : isSelected ? "var(--ink-heading)" : "var(--dim)",
                    fontWeight: isSpike || isSelected ? 700 : 400,
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.count >= 1000 ? `${(row.count / 1000).toFixed(1)}k` : row.count}
                </span>

                {/* The Bar */}
                <div
                  style={{
                    width: "100%",
                    height: `${barHeightPct}%`,
                    backgroundColor: isSpike
                      ? "var(--accent)"
                      : isSelected
                      ? "#38bdf8"
                      : row.curveType === "bump"
                      ? "#f59e0b"
                      : "rgba(255, 255, 255, 0.12)",
                    borderRadius: "3px 3px 0 0",
                    transition: "all 0.2s ease",
                    boxShadow: isSpike
                      ? "0 0 12px rgba(255, 100, 50, 0.4)"
                      : isSelected
                      ? "0 0 8px rgba(56, 189, 248, 0.3)"
                      : "none",
                  }}
                />

                {/* X Axis Label */}
                <span
                  style={{
                    marginTop: 6,
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: isSpike ? "var(--accent)" : isSelected ? "var(--ink-heading)" : "var(--dim)",
                    fontWeight: isSpike || isSelected ? 700 : 500,
                  }}
                >
                  {row.depth}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Interactive Live Telemetry HUD for Selected Tier */}
      <div
        style={{
          backgroundColor: "var(--surface-secondary)",
          border: activeRow.isAnomaly ? "2px solid var(--accent)" : "1px solid var(--line)",
          borderRadius: 4,
          padding: "16px 18px",
          marginBottom: 20,
          transition: "all 0.15s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, borderBottom: "1px solid var(--line)", paddingBottom: 10, marginBottom: 12 }}>
          <div>
            <span className="mono" style={{ color: activeRow.isAnomaly ? "var(--accent)" : "var(--dim)", fontSize: 9.5, fontWeight: 700 }}>
              SELECTED INSTALLMENT DEPTH TELEMETRY
            </span>
            <h4 style={{ fontSize: 18, color: "var(--ink-heading)", margin: "2px 0 0", fontWeight: 700 }}>
              {activeRow.depth} Installment Tier
            </h4>
          </div>

          <span
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: activeRow.isAnomaly ? "var(--accent)" : "var(--ink)",
              border: activeRow.isAnomaly ? "1px solid var(--accent)" : "1px solid var(--line)",
              padding: "3px 8px",
              borderRadius: 3,
              backgroundColor: activeRow.isAnomaly ? "var(--accent-subtle)" : "var(--panel)",
              fontWeight: 700,
            }}
          >
            {activeRow.diagnosis}
          </span>
        </div>

        {/* 4 Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 10 }}>
          <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>TRANSACTION VOLUME</span>
            <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>{activeRow.count.toLocaleString()}</strong>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>{activeRow.share}% share</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>AVERAGE ORDER VALUE</span>
            <strong style={{ fontSize: 16, color: activeRow.isAnomaly ? "var(--accent)" : "#38bdf8", fontFamily: "monospace" }}>
              R$ {activeRow.aov.toFixed(2)}
            </strong>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>mean basket size</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>DELTA VS PREVIOUS TIER</span>
            <strong style={{ fontSize: 16, color: activeRow.deltaPrev.startsWith("+") ? "var(--accent)" : "var(--dim)", fontFamily: "monospace" }}>
              {activeRow.deltaPrev}
            </strong>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>volume trajectory</span>
          </div>

          <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 3, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>ESTIMATED TOTAL GMV</span>
            <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>
              R$ {((activeRow.count * activeRow.aov) / 1000000).toFixed(2)}M
            </strong>
            <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)", display: "block" }}>cohort revenue</span>
          </div>
        </div>
      </div>

      {/* 3 Root-Cause Triangulation Cards */}
      <div>
        <span className="mono" style={{ fontSize: 9.5, color: "var(--accent)", display: "block", marginBottom: 8, fontWeight: 700 }}>
          ROOT-CAUSE TRIANGULATION ARCHITECTURE:
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {ROOT_CAUSES.map((rc) => (
            <div key={rc.id} style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "14px 16px", borderRadius: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--accent)", border: "1px solid var(--accent)", padding: "1px 5px", borderRadius: 2 }}>
                  {rc.tag}
                </span>
              </div>
              <strong style={{ fontSize: 13.5, color: "var(--ink-heading)", display: "block", marginBottom: 6 }}>
                {rc.title}
              </strong>
              <p style={{ margin: 0, color: "var(--ink)", fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>
                {rc.desc}
              </p>
              <span className="mono" style={{ fontSize: 9, color: "#38bdf8", display: "block" }}>
                → {rc.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
