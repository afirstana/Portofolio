"use client";

import React, { useState, useMemo } from "react";
import brentData from "@/content/data/brent_oil_analysis.json";

type RiskMetricRow = {
  id: string;
  metric: string;
  category: "central" | "dispersion" | "tail" | "extreme";
  empirical: string;
  gaussian: string;
  delta: string;
  status: "danger" | "warning" | "neutral" | "info";
  takeaway: string;
};

const RISK_TABLE_DATA: RiskMetricRow[] = [
  {
    id: "kurtosis",
    metric: "Kurtosis (Fat-Tail Indicator)",
    category: "tail",
    empirical: "45.43 (Leptokurtic)",
    gaussian: "3.00 (Mesokurtic)",
    delta: "+1,414% Excess Kurtosis",
    status: "danger",
    takeaway: "Extreme non-Gaussian fat tails; catastrophic black-swan price collapses occur 15x more frequently than normal distributions predict.",
  },
  {
    id: "var_99",
    metric: "Daily VaR (99% Confidence Level)",
    category: "tail",
    empirical: "-6.13%",
    gaussian: "-5.87%",
    delta: "Underestimates tail loss by -0.26%",
    status: "danger",
    takeaway: "In 1 out of 100 trading days (approx. 2.5 times/year), daily portfolio loss exceeds -6.13%. Requires asymmetric put options hedging.",
  },
  {
    id: "var_95",
    metric: "Daily VaR (95% Confidence Level)",
    category: "tail",
    empirical: "-3.57%",
    gaussian: "-4.15%",
    delta: "+0.58% clustered intraday",
    status: "warning",
    takeaway: "In 1 out of 20 trading sessions, daily price falls by ≥ 3.57%. Standard capital reserve buffer required for crude inventory holders.",
  },
  {
    id: "anomalies",
    metric: "Outlier Sessions (|Z| > 3.0)",
    category: "extreme",
    empirical: "105 Days (1.17%)",
    gaussian: "24 Days (0.27%)",
    delta: "4.38x higher outlier frequency",
    status: "danger",
    takeaway: "80%+ of outlier sessions cluster directly within ±60 days of major geopolitical shocks (Gulf War, 2008 Crash, COVID, Ukraine Invasion).",
  },
  {
    id: "max_crash",
    metric: "Maximum 1-Day Crash",
    category: "extreme",
    empirical: "-29.10% (Apr 2020)",
    gaussian: "Max ~ -7.58% (3σ limit)",
    delta: "3.84x beyond theoretical limit",
    status: "danger",
    takeaway: "COVID storage saturation event in April 2020 breached Gaussian risk models by over 380%, triggering cascading margin calls.",
  },
  {
    id: "max_spike",
    metric: "Maximum 1-Day Spike",
    category: "extreme",
    empirical: "+19.89% (Sep 2019)",
    gaussian: "Max ~ +7.58% (3σ limit)",
    delta: "2.62x beyond theoretical limit",
    status: "warning",
    takeaway: "Abqaiq refinery drone attack took 5.7M bpd offline in hours, demonstrating acute upward jump-diffusion risk.",
  },
  {
    id: "skewness",
    metric: "Return Skewness",
    category: "dispersion",
    empirical: "+0.312",
    gaussian: "0.000 (Symmetric)",
    delta: "Positive supply-side skew",
    status: "neutral",
    takeaway: "Mild positive skew driven by sudden geopolitical supply disruption spikes outpacing gradual macroeconomic demand fades.",
  },
  {
    id: "volatility",
    metric: "Daily Volatility (Std Dev σ)",
    category: "dispersion",
    empirical: "2.525% (40.1% Annualized)",
    gaussian: "2.525%",
    delta: "Baseline variance metric",
    status: "info",
    takeaway: "High baseline commodity volatility requires dynamic rolling position limits rather than fixed nominal contracts.",
  },
  {
    id: "mean_return",
    metric: "Daily Mean Return (μ)",
    category: "central",
    empirical: "+0.050%",
    gaussian: "+0.050%",
    delta: "+12.6% compound annual",
    status: "info",
    takeaway: "Long-term secular price appreciation matching global nominal GDP expansion and crude reserve extraction costs.",
  },
];

// Distribution Histogram Bins (-10% to +10%)
const DISTRIBUTION_BINS = [
  { range: "<-8%", mid: -9.0, empiricalFreq: 0.42, gaussianFreq: 0.01, isVaR99: true, isVaR95: true, label: "Extreme Left Tail (Crash Zone)" },
  { range: "-8% to -6%", mid: -7.0, empiricalFreq: 0.95, gaussianFreq: 0.12, isVaR99: true, isVaR95: true, label: "VaR 99% Tail Zone (-6.13%)" },
  { range: "-6% to -4%", mid: -5.0, empiricalFreq: 3.14, gaussianFreq: 1.45, isVaR99: false, isVaR95: true, label: "VaR 95% Tail Zone (-3.57%)" },
  { range: "-4% to -2%", mid: -3.0, empiricalFreq: 11.20, gaussianFreq: 9.80, isVaR99: false, isVaR95: false, label: "Moderate Downside" },
  { range: "-2% to 0%", mid: -1.0, empiricalFreq: 34.65, gaussianFreq: 38.62, isVaR99: false, isVaR95: false, label: "Near-Mean Negative" },
  { range: "0% to +2%", mid: 1.0, empiricalFreq: 36.80, gaussianFreq: 38.62, isVaR99: false, isVaR95: false, label: "Near-Mean Positive" },
  { range: "+2% to +4%", mid: 3.0, empiricalFreq: 8.92, gaussianFreq: 9.80, isVaR99: false, isVaR95: false, label: "Moderate Upside" },
  { range: "+4% to +6%", mid: 5.0, empiricalFreq: 2.45, gaussianFreq: 1.45, isVaR99: false, isVaR95: false, label: "Supply Shock Upside" },
  { range: "+6% to +8%", mid: 7.0, empiricalFreq: 0.98, gaussianFreq: 0.12, isVaR99: false, isVaR95: false, label: "Geopolitical Jump" },
  { range: ">+8%", mid: 9.0, empiricalFreq: 0.49, gaussianFreq: 0.01, isVaR99: false, isVaR95: false, label: "Extreme Right Tail (Spike Zone)" },
];

export function BrentOilRiskShowcase() {
  const [selectedMetricId, setSelectedMetricId] = useState<string>("kurtosis");
  const [activeDistributionLayer, setActiveDistributionLayer] = useState<"both" | "empirical" | "gaussian">("both");
  const [tableFilter, setTableFilter] = useState<"all" | "tail" | "extreme">("all");
  const [hoveredBin, setHoveredBin] = useState<typeof DISTRIBUTION_BINS[0] | null>(null);

  const selectedMetric = useMemo(() => {
    return RISK_TABLE_DATA.find((m) => m.id === selectedMetricId) || RISK_TABLE_DATA[0];
  }, [selectedMetricId]);

  const filteredTableData = useMemo(() => {
    if (tableFilter === "all") return RISK_TABLE_DATA;
    if (tableFilter === "tail") return RISK_TABLE_DATA.filter((r) => r.category === "tail");
    if (tableFilter === "extreme") return RISK_TABLE_DATA.filter((r) => r.category === "extreme");
    return RISK_TABLE_DATA;
  }, [tableFilter]);

  // SVG Dimensions for Return Distribution
  const svgWidth = 680;
  const svgHeight = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;
  const maxFreq = 42; // Max percentage on Y axis

  const getX = (index: number) => {
    return padding.left + (index / (DISTRIBUTION_BINS.length - 1)) * innerWidth;
  };

  const getY = (freq: number) => {
    return padding.top + innerHeight - (freq / maxFreq) * innerHeight;
  };

  // Empirical Bar & Gaussian Curve Paths
  const gaussianLinePath = DISTRIBUTION_BINS.map((b, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(b.gaussianFreq).toFixed(1)}`).join(" ");

  return (
    <section
      id="fat-tail-risk-matrix"
      style={{
        margin: "32px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 20px",
      }}
      aria-label="Fat-Tail Risk & VaR Econometric Terminal"
    >
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em" }}>
            ECONOMETRIC TAIL RISK & VALUE-AT-RISK (VaR) CALIBRATION
          </span>
          <h3 style={{ fontSize: "clamp(19px, 2.2vw, 24px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
            03. Non-Gaussian Fat-Tail Risk & VaR (95/99) Terminal
          </h3>
        </div>

        {/* 4 Macro KPI Chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: 3, textAlign: "right" }}>
            <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>KURTOSIS (FAT TAILS)</span>
            <strong className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>45.43 (15.1x Norm)</strong>
          </div>
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: 3, textAlign: "right" }}>
            <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>VaR 95% (1-DAY)</span>
            <strong className="mono" style={{ fontSize: 13, color: "#f59e0b" }}>-3.57%</strong>
          </div>
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: 3, textAlign: "right" }}>
            <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>VaR 99% (TAIL CRASH)</span>
            <strong className="mono" style={{ fontSize: 13, color: "#ef4444" }}>-6.13%</strong>
          </div>
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: 3, textAlign: "right" }}>
            <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>ANOMALY SESSIONS</span>
            <strong className="mono" style={{ fontSize: 13, color: "#38bdf8" }}>105 Days (|Z|&gt;3)</strong>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 16, alignItems: "stretch" }}>
        
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: 3, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)" }}>
                RETURN DISTRIBUTION: EMPIRICAL (BARS) VS GAUSSIAN NORMAL (LINE)
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setActiveDistributionLayer("both")}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9.5,
                    padding: "3px 6px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: activeDistributionLayer === "both" ? "var(--accent-subtle)" : "transparent",
                    border: activeDistributionLayer === "both" ? "1px solid var(--accent)" : "1px solid var(--line)",
                    color: activeDistributionLayer === "both" ? "var(--accent)" : "var(--dim)",
                  }}
                >
                  Both Overlay
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDistributionLayer("empirical")}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9.5,
                    padding: "3px 6px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: activeDistributionLayer === "empirical" ? "var(--accent-subtle)" : "transparent",
                    border: activeDistributionLayer === "empirical" ? "1px solid var(--accent)" : "1px solid var(--line)",
                    color: activeDistributionLayer === "empirical" ? "var(--accent)" : "var(--dim)",
                  }}
                >
                  Empirical Bars
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDistributionLayer("gaussian")}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9.5,
                    padding: "3px 6px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: activeDistributionLayer === "gaussian" ? "var(--accent-subtle)" : "transparent",
                    border: activeDistributionLayer === "gaussian" ? "1px solid var(--accent)" : "1px solid var(--line)",
                    color: activeDistributionLayer === "gaussian" ? "var(--accent)" : "var(--dim)",
                  }}
                >
                  Gaussian Curve
                </button>
              </div>
            </div>

            <div style={{ width: "100%", overflowX: "auto" }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <linearGradient id="barGradNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="barGradVaR95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="barGradVaR99" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                  </linearGradient>
                </defs>

                {[0, 10, 20, 30, 40].map((f) => (
                  <g key={f}>
                    <line
                      x1={padding.left}
                      y1={getY(f)}
                      x2={svgWidth - padding.right}
                      y2={getY(f)}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={padding.left - 6}
                      y={getY(f) + 3}
                      fill="var(--dim)"
                      fontSize="8.5"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {f}%
                    </text>
                  </g>
                ))}

                <rect
                  x={padding.left}
                  y={padding.top}
                  width={getX(2) - padding.left}
                  height={innerHeight}
                  fill="rgba(239, 68, 68, 0.08)"
                  stroke="none"
                />
                <line
                  x1={getX(1)}
                  y1={padding.top}
                  x2={getX(1)}
                  y2={padding.top + innerHeight}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                />
                <text x={getX(1) + 4} y={padding.top + 14} fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  VaR 99% (-6.13%)
                </text>

                <line
                  x1={getX(2)}
                  y1={padding.top}
                  x2={getX(2)}
                  y2={padding.top + innerHeight}
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                />
                <text x={getX(2) + 4} y={padding.top + 28} fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  VaR 95% (-3.57%)
                </text>

                {(activeDistributionLayer === "both" || activeDistributionLayer === "empirical") &&
                  DISTRIBUTION_BINS.map((bin, idx) => {
                    const barWidth = 46;
                    const bx = getX(idx) - barWidth / 2;
                    const by = getY(bin.empiricalFreq);
                    const bHeight = padding.top + innerHeight - by;
                    const isHovered = hoveredBin?.range === bin.range;

                    let fillGrad = "url(#barGradNormal)";
                    let strokeCol = "var(--accent)";
                    if (bin.isVaR99) {
                      fillGrad = "url(#barGradVaR99)";
                      strokeCol = "#ef4444";
                    } else if (bin.isVaR95) {
                      fillGrad = "url(#barGradVaR95)";
                      strokeCol = "#f59e0b";
                    }

                    return (
                      <g
                        key={bin.range}
                        onMouseEnter={() => setHoveredBin(bin)}
                        onMouseLeave={() => setHoveredBin(null)}
                        style={{ cursor: "pointer" }}
                      >
                        <rect
                          x={bx}
                          y={by}
                          width={barWidth}
                          height={bHeight}
                          fill={fillGrad}
                          stroke={isHovered ? "#fff" : strokeCol}
                          strokeWidth={isHovered ? 1.5 : 0.8}
                          rx={2}
                          opacity={isHovered ? 1 : 0.9}
                        />
                        <text
                          x={getX(idx)}
                          y={by - 4}
                          fill={isHovered ? "var(--ink-heading)" : "var(--dim)"}
                          fontSize="8"
                          textAnchor="middle"
                          fontFamily="monospace"
                          fontWeight={isHovered ? "bold" : "normal"}
                        >
                          {bin.empiricalFreq}%
                        </text>
                        <text
                          x={getX(idx)}
                          y={padding.top + innerHeight + 14}
                          fill={bin.isVaR99 ? "#ef4444" : bin.isVaR95 ? "#f59e0b" : "var(--dim)"}
                          fontSize="7.5"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {bin.range}
                        </text>
                      </g>
                    );
                  })}

                {(activeDistributionLayer === "both" || activeDistributionLayer === "gaussian") && (
                  <>
                    <path d={gaussianLinePath} fill="none" stroke="#38bdf8" strokeWidth={1.8} strokeDasharray="4 3" />
                    {DISTRIBUTION_BINS.map((b, i) => (
                      <circle key={i} cx={getX(i)} cy={getY(b.gaussianFreq)} r={2.5} fill="#38bdf8" />
                    ))}
                    <text
                      x={getX(5) + 10}
                      y={getY(38.62) - 8}
                      fill="#38bdf8"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Gaussian Normal Curve (Kurtosis = 3.0)
                    </text>
                  </>
                )}
              </svg>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              backgroundColor: "var(--panel)",
              border: "1px solid var(--line)",
              padding: "10px 14px",
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {hoveredBin ? (
              <>
                <div>
                  <span className="mono" style={{ fontSize: 8.5, color: "var(--accent)", fontWeight: 700 }}>
                    INSPECTING BIN: {hoveredBin.range} ({hoveredBin.label})
                  </span>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--ink)" }}>
                    Empirical Observed Freq: <strong>{hoveredBin.empiricalFreq}%</strong> vs Gaussian Model: <strong>{hoveredBin.gaussianFreq}%</strong>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>EXCESS TAIL PROBABILITY</span>
                  <strong className="mono" style={{ fontSize: 12, color: hoveredBin.empiricalFreq > hoveredBin.gaussianFreq ? "var(--accent)" : "#38bdf8" }}>
                    {hoveredBin.empiricalFreq > hoveredBin.gaussianFreq ? "+" : ""}
                    {(hoveredBin.empiricalFreq - hoveredBin.gaussianFreq).toFixed(2)}% pts
                  </strong>
                </div>
              </>
            ) : (
              <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)" }}>
                💡 HOVER OVER ANY HISTOGRAM BAR TO COMPARE EMPIRICAL VS GAUSSIAN PROBABILITY DENSITY
              </span>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: 3, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--accent)", fontWeight: 700 }}>
                RISK MATRIX BENCHMARK TABLE
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setTableFilter("all")}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8.5,
                    padding: "2px 6px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: tableFilter === "all" ? "var(--accent)" : "transparent",
                    border: "1px solid var(--line)",
                    color: tableFilter === "all" ? "#000" : "var(--dim)",
                    fontWeight: 700,
                  }}
                >
                  All Metrics (9)
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter("tail")}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8.5,
                    padding: "2px 6px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: tableFilter === "tail" ? "var(--accent)" : "transparent",
                    border: "1px solid var(--line)",
                    color: tableFilter === "tail" ? "#000" : "var(--dim)",
                    fontWeight: 700,
                  }}
                >
                  VaR & Tails (3)
                </button>
                <button
                  type="button"
                  onClick={() => setTableFilter("extreme")}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8.5,
                    padding: "2px 6px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: tableFilter === "extreme" ? "var(--accent)" : "transparent",
                    border: "1px solid var(--line)",
                    color: tableFilter === "extreme" ? "#000" : "var(--dim)",
                    fontWeight: 700,
                  }}
                >
                  Extreme Outliers (3)
                </button>
              </div>
            </div>

            {/* Scrollable Benchmark Table Container */}
            <div style={{ maxHeight: 185, overflowY: "auto", overflowX: "auto", border: "1px solid var(--line)", borderRadius: 2 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "var(--panel)", zIndex: 2 }}>
                  <tr style={{ borderBottom: "1px solid var(--line)", color: "var(--dim)", fontFamily: "monospace", fontSize: 8.5 }}>
                    <th style={{ textAlign: "left", padding: "6px 8px" }}>RISK DIMENSION</th>
                    <th style={{ textAlign: "center", padding: "6px 8px" }}>BRENT EMPIRICAL</th>
                    <th style={{ textAlign: "center", padding: "6px 8px" }}>GAUSSIAN NORM</th>
                    <th style={{ textAlign: "right", padding: "6px 8px" }}>VARIANCE / BIAS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableData.map((row) => {
                    const isSelected = selectedMetric.id === row.id;
                    let deltaColor = "var(--dim)";
                    if (row.status === "danger") deltaColor = "#ef4444";
                    if (row.status === "warning") deltaColor = "#f59e0b";
                    if (row.status === "info") deltaColor = "var(--muted)";

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedMetricId(row.id)}
                        style={{
                          borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                          backgroundColor: isSelected ? "var(--accent-subtle)" : "transparent",
                          cursor: "pointer",
                          transition: "all 0.12s ease",
                        }}
                      >
                        <td style={{ padding: "6px 8px", fontWeight: isSelected ? 700 : 500, color: isSelected ? "var(--ink-heading)" : "var(--ink)" }}>
                          {row.metric}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center", fontFamily: "monospace", color: "var(--ink-heading)", fontWeight: 700 }}>
                          {row.empirical}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center", fontFamily: "monospace", color: "var(--dim)" }}>
                          {row.gaussian}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "right", fontFamily: "monospace", fontSize: 9.5, color: deltaColor, fontWeight: 700 }}>
                          {row.delta}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Selected Metric Dossier Box */}
          <div style={{ marginTop: 10, backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "8px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span className="mono" style={{ fontSize: 8.5, color: "var(--accent)", fontWeight: 700 }}>
                OPERATIONAL RISK & HEDGING IMPLICATION
              </span>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)", border: "1px solid var(--line)", padding: "1px 4px", borderRadius: 2 }}>
                {selectedMetric.metric}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: "var(--ink)", lineHeight: 1.45 }}>
              {selectedMetric.takeaway}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
