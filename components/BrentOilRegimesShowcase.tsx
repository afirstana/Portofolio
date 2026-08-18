"use client";

import React, { useState, useMemo } from "react";
import brentData from "@/content/data/brent_oil_analysis.json";

type RegimeEra = {
  id: string;
  period: string;
  title: string;
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  std: number;
  volatility_pct: number;
  color: string;
  startYear: number;
  endYear: number;
  catalysts: string[];
  takeaway: string;
};

const REGIME_ERAS: RegimeEra[] = [
  {
    id: "pre_global",
    period: "1987–1999",
    title: "Pre-Globalized Stability",
    count: 3200,
    mean: 18.08,
    median: 17.90,
    min: 9.10,
    max: 41.45,
    std: 4.00,
    volatility_pct: 2.29,
    color: "#10b981",
    startYear: 1987,
    endYear: 1999,
    catalysts: [
      "Stable post-1986 OPEC quota discipline anchor",
      "Gulf War (1990) brief spike to $41.45/bbl (+79.9%)",
      "Asian Financial Crisis (1997–98) demand drop to all-time low $9.10/bbl",
    ],
    takeaway: "Secular low baseline before the emergence of Chinese industrial demand.",
  },
  {
    id: "supercycle",
    period: "2000–2009",
    title: "Commodity Supercycle & Peak",
    count: 2551,
    mean: 49.46,
    median: 43.03,
    min: 16.51,
    max: 143.95,
    std: 25.78,
    volatility_pct: 2.51,
    color: "var(--accent)",
    startYear: 2000,
    endYear: 2009,
    catalysts: [
      "Rapid industrialization and urbanization of BRICS (China & India)",
      "Peak Oil speculative frenzy peaking at all-time high $143.95/bbl (Jul 2008)",
      "Global Financial Crisis collapse down to $36.20/bbl (-74.8% drawdown)",
    ],
    takeaway: "Longest secular commodity bull market in modern financial history.",
  },
  {
    id: "shale_boom",
    period: "2010–2019",
    title: "US Shale Boom & Price War",
    count: 2531,
    mean: 79.35,
    median: 74.86,
    min: 26.01,
    max: 128.14,
    std: 26.09,
    volatility_pct: 1.91,
    color: "#38bdf8",
    startYear: 2010,
    endYear: 2019,
    catalysts: [
      "US hydraulic fracturing & horizontal drilling boom unlocks Permian basin",
      "OPEC market share defense war (2014–16) crashes Brent from $115 to $26",
      "Formation of OPEC+ alliance (Vienna 2016) to re-impose supply ceilings",
    ],
    takeaway: "Structural supply transformation with lowest baseline return volatility (1.91%).",
  },
  {
    id: "pandemic_war",
    period: "2020–2022",
    title: "Pandemic Crash & War Rebound",
    count: 729,
    mean: 70.60,
    median: 69.95,
    min: 9.12,
    max: 133.18,
    std: 27.04,
    volatility_pct: 3.78,
    color: "#f59e0b",
    startYear: 2020,
    endYear: 2022,
    catalysts: [
      "COVID-19 global lockdowns & demand destruction nadir to $9.12/bbl (Apr 2020)",
      "V-shaped post-lockdown reflation and global supply chain bottlenecks",
      "Russia-Ukraine war sanctions trigger massive rally to $133.18/bbl (Mar 2022)",
    ],
    takeaway: "Highest volatility regime (3.78% daily) driven by physical and geopolitical shocks.",
  },
];

export function BrentOilRegimesShowcase() {
  const [selectedEraId, setSelectedEraId] = useState<string>("supercycle");
  const [chartMode, setChartMode] = useState<"price" | "volatility">("price");

  const selectedEra = useMemo(() => {
    return REGIME_ERAS.find((e) => e.id === selectedEraId) || REGIME_ERAS[1];
  }, [selectedEraId]);

  // SVG Chart Setup
  const svgWidth = 720;
  const svgHeight = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const minYear = 1987;
  const maxYear = 2022;
  const maxPrice = 160;

  const getXByYear = (year: number) => {
    return padding.left + ((year - minYear) / (maxYear - minYear)) * innerWidth;
  };

  const getYByPrice = (price: number) => {
    return padding.top + innerHeight - (price / maxPrice) * innerHeight;
  };

  return (
    <section
      id="market-regimes-matrix"
      style={{
        margin: "32px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 20px",
      }}
      aria-label="Four Decades of Market Regimes Interactive Console"
    >
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em" }}>
            MACROECONOMIC EVOLUTION • 4-DECADE REGIME TRAJECTORY
          </span>
          <h3 style={{ fontSize: "clamp(19px, 2.2vw, 24px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "4px 0 0", fontWeight: 700 }}>
            03. Four Decades of Market Regimes (1987–2022)
          </h3>
        </div>

        {/* Chart View Mode Switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setChartMode("price")}
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: chartMode === "price" ? "var(--accent-subtle)" : "transparent",
              border: chartMode === "price" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: chartMode === "price" ? "var(--accent)" : "var(--dim)",
              fontWeight: chartMode === "price" ? 700 : 400,
            }}
          >
            Price Trajectory ($/bbl)
          </button>
          <button
            type="button"
            onClick={() => setChartMode("volatility")}
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: chartMode === "volatility" ? "var(--accent-subtle)" : "transparent",
              border: chartMode === "volatility" ? "1px solid var(--accent)" : "1px solid var(--line)",
              color: chartMode === "volatility" ? "var(--accent)" : "var(--dim)",
              fontWeight: chartMode === "volatility" ? 700 : 400,
            }}
          >
            Return Volatility (%)
          </button>
        </div>
      </div>

      {/* 4 Interactive Era Cards (Selector Buttons) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8, marginBottom: 18 }}>
        {REGIME_ERAS.map((era) => {
          const isSelected = selectedEra.id === era.id;
          return (
            <button
              key={era.id}
              type="button"
              onClick={() => setSelectedEraId(era.id)}
              style={{
                backgroundColor: isSelected ? "var(--surface-secondary)" : "transparent",
                borderWidth: "3px 1px 1px 1px",
                borderStyle: "solid",
                borderColor: isSelected
                  ? era.color
                  : `${era.color} var(--line) var(--line) var(--line)`,
                padding: "10px 12px",
                borderRadius: 3,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 9, color: isSelected ? era.color : "var(--dim)", fontWeight: 700 }}>
                  {era.period}
                </span>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)" }}>
                  {era.count} days
                </span>
              </div>
              <strong style={{ fontSize: 12, color: isSelected ? "var(--ink-heading)" : "var(--muted)", display: "block", marginTop: 2 }}>
                {era.title}
              </strong>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, fontFamily: "monospace" }}>
                <span style={{ color: "var(--dim)" }}>Mean: ${era.mean.toFixed(1)}</span>
                <span style={{ color: era.color, fontWeight: 700 }}>Vol: {era.volatility_pct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive SVG Regime Canvas & Detailed Dossier */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, alignItems: "stretch" }}>
        
        {/* Left: Interactive 35-Year SVG Trajectory with Highlighted Regime Corridor */}
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: 3, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--dim)" }}>
                {chartMode === "price" ? "35.5-YEAR HISTORICAL PRICE CURVE (USD/BBL)" : "30-DAY ROLLING VOLATILITY REGIMES (%)"}
              </span>
              <span className="mono" style={{ fontSize: 9, color: selectedEra.color, fontWeight: 700 }}>
                FOCUSING: {selectedEra.period}
              </span>
            </div>

            <div style={{ width: "100%", overflowX: "auto" }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <linearGradient id="regimeHighlight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={selectedEra.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={selectedEra.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                {/* Grid Horizontal Lines */}
                {(chartMode === "price" ? [0, 40, 80, 120, 160] : [0, 2, 4, 6, 8]).map((val) => {
                  const yPos = chartMode === "price"
                    ? getYByPrice(val)
                    : padding.top + innerHeight - (val / 8) * innerHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={padding.left}
                        y1={yPos}
                        x2={svgWidth - padding.right}
                        y2={yPos}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={padding.left - 6}
                        y={yPos + 3}
                        fill="var(--dim)"
                        fontSize="8.5"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {chartMode === "price" ? `$${val}` : `${val}%`}
                      </text>
                    </g>
                  );
                })}

                {/* Highlight Corridor for Selected Era */}
                <rect
                  x={getXByYear(selectedEra.startYear)}
                  y={padding.top}
                  width={Math.max(15, getXByYear(selectedEra.endYear) - getXByYear(selectedEra.startYear))}
                  height={innerHeight}
                  fill="url(#regimeHighlight)"
                  stroke={selectedEra.color}
                  strokeWidth={1}
                  strokeDasharray="3 2"
                />

                {/* Era Label on Top of Highlight Box */}
                <text
                  x={(getXByYear(selectedEra.startYear) + getXByYear(selectedEra.endYear)) / 2}
                  y={padding.top + 14}
                  fill={selectedEra.color}
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {selectedEra.title} ({selectedEra.period})
                </text>

                {/* 35-Year Price Trajectory Polyline */}
                {chartMode === "price" && (
                  <>
                    <path
                      d={brentData.monthly_series
                        .map((pt, idx) => {
                          const yr = parseInt(pt.date.split("-")[0]);
                          const mo = parseInt(pt.date.split("-")[1]);
                          const fracYear = yr + (mo - 1) / 12;
                          const x = getXByYear(fracYear);
                          const y = getYByPrice(pt.price);
                          return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="var(--dim)"
                      strokeWidth={1.2}
                      opacity={0.4}
                    />
                    {/* Highlighted portion of price line within selected era */}
                    <path
                      d={brentData.monthly_series
                        .filter((pt) => {
                          const yr = parseInt(pt.date.split("-")[0]);
                          return yr >= selectedEra.startYear && yr <= selectedEra.endYear;
                        })
                        .map((pt, idx) => {
                          const yr = parseInt(pt.date.split("-")[0]);
                          const mo = parseInt(pt.date.split("-")[1]);
                          const fracYear = yr + (mo - 1) / 12;
                          const x = getXByYear(fracYear);
                          const y = getYByPrice(pt.price);
                          return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke={selectedEra.color}
                      strokeWidth={2.0}
                    />
                  </>
                )}

                {/* Volatility Trajectory Polyline */}
                {chartMode === "volatility" && (
                  <path
                    d={brentData.monthly_series
                      .map((pt, idx) => {
                        const yr = parseInt(pt.date.split("-")[0]);
                        const mo = parseInt(pt.date.split("-")[1]);
                        const fracYear = yr + (mo - 1) / 12;
                        const x = getXByYear(fracYear);
                        const y = padding.top + innerHeight - (Math.min(8, pt.volatility) / 8) * innerHeight;
                        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke={selectedEra.color}
                    strokeWidth={1.8}
                  />
                )}

                {/* Milestone Circles */}
                <circle cx={getXByYear(2008.5)} cy={getYByPrice(143.95)} r={3.5} fill="var(--accent)" />
                <text x={getXByYear(2008.5)} y={getYByPrice(143.95) - 6} fill="var(--accent)" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                  $143.95 (2008)
                </text>

                <circle cx={getXByYear(2020.3)} cy={getYByPrice(9.10)} r={3.5} fill="#38bdf8" />
                <text x={getXByYear(2020.3)} y={getYByPrice(9.10) + 12} fill="#38bdf8" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                  $9.10 (2020)
                </text>

                {/* X Axis Years */}
                {[1987, 1992, 1997, 2002, 2007, 2012, 2017, 2022].map((yr) => (
                  <text
                    key={yr}
                    x={getXByYear(yr)}
                    y={padding.top + innerHeight + 16}
                    fill="var(--dim)"
                    fontSize="8"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {yr}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Trajectory Corridor Summary HUD */}
          <div style={{ marginTop: 12, backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <span className="mono" style={{ fontSize: 8.5, color: selectedEra.color, fontWeight: 700 }}>
                CORRIDOR STATUS: {selectedEra.title.toUpperCase()}
              </span>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--ink)" }}>
                Span: <strong>{selectedEra.period}</strong> • Trading Days: <strong>{selectedEra.count.toLocaleString()}</strong> ({((selectedEra.count / 9011) * 100).toFixed(1)}% of 35-yr sample)
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, textAlign: "right" }}>
              <div>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>ERA MAX SPIKE</span>
                <strong className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>${selectedEra.max.toFixed(2)}</strong>
              </div>
              <div>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>ERA MIN CRASH</span>
                <strong className="mono" style={{ fontSize: 12, color: "#38bdf8" }}>${selectedEra.min.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Focused Regime Profile & Economic Catalysts Dossier */}
        <div style={{ backgroundColor: "var(--surface-secondary)", border: `1px solid ${selectedEra.color}`, borderRadius: 3, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 9, color: selectedEra.color, fontWeight: 700 }}>
                  REGIME PROFILE DOSSIER
                </span>
                <span className="mono" style={{ fontSize: 8.5, color: "var(--dim)" }}>
                  {selectedEra.period}
                </span>
              </div>
              <h4 style={{ fontSize: 16, color: "var(--ink-heading)", margin: "4px 0 2px", fontWeight: 700 }}>
                {selectedEra.title}
              </h4>
              <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
                {selectedEra.takeaway}
              </p>
            </div>

            {/* 4 Metric KPI Box */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>MEAN PRICE</span>
                <strong style={{ fontSize: 16, color: selectedEra.color, fontFamily: "monospace" }}>
                  ${selectedEra.mean.toFixed(2)}
                </strong>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>Median: ${selectedEra.median.toFixed(2)}</span>
              </div>

              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>PRICE RANGE</span>
                <strong style={{ fontSize: 14, color: "var(--ink-heading)", fontFamily: "monospace" }}>
                  ${selectedEra.min.toFixed(0)} – ${selectedEra.max.toFixed(0)}
                </strong>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>Spread: ${(selectedEra.max - selectedEra.min).toFixed(0)}</span>
              </div>

              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>RETURN VOLATILITY</span>
                <strong style={{ fontSize: 16, color: selectedEra.volatility_pct > 3.0 ? "var(--accent)" : "#38bdf8", fontFamily: "monospace" }}>
                  {selectedEra.volatility_pct.toFixed(2)}%
                </strong>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>Daily σ rate</span>
              </div>

              <div style={{ backgroundColor: "var(--panel)", padding: "8px 10px", borderRadius: 2, border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>TOTAL OBSERVATIONS</span>
                <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>
                  {selectedEra.count.toLocaleString()}
                </strong>
                <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>Trading sessions</span>
              </div>
            </div>
          </div>

          {/* Historical Catalysts List */}
          <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: 3, padding: "10px 12px" }}>
            <span className="mono" style={{ fontSize: 8.5, color: selectedEra.color, display: "block", marginBottom: 6, fontWeight: 700 }}>
              KEY MACROECONOMIC & GEOPOLITICAL DRIVERS:
            </span>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "var(--ink)", lineHeight: 1.5 }}>
              {selectedEra.catalysts.map((cat, idx) => (
                <li key={idx} style={{ marginBottom: 3 }}>
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
