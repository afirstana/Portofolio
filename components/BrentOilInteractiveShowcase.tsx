"use client";

import React, { useState } from "react";
import brentData from "@/content/data/brent_oil_analysis.json";

export function BrentOilInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"timeline" | "crises" | "risk">("timeline");
  const [selectedDecade, setSelectedDecade] = useState<string>("ALL");
  const [showMA30, setShowMA30] = useState<boolean>(true);
  const [showMA365, setShowMA365] = useState<boolean>(true);
  const [selectedCrisisIndex, setSelectedCrisisIndex] = useState<number>(2); // Default to 2008 peak

  // Filter series based on selected decade
  const filteredSeries = brentData.monthly_series.filter((pt) => {
    if (selectedDecade === "ALL") return true;
    const yr = parseInt(pt.date.split("-")[0]);
    if (selectedDecade === "1980s_1990s") return yr >= 1987 && yr <= 1999;
    if (selectedDecade === "2000s") return yr >= 2000 && yr <= 2009;
    if (selectedDecade === "2010s") return yr >= 2010 && yr <= 2019;
    if (selectedDecade === "2020s") return yr >= 2020 && yr <= 2022;
    return true;
  });

  // Calculate dynamic stats for selected view
  const currentPrices = filteredSeries.map((p) => p.price);
  const currentAvg = currentPrices.length > 0 ? (currentPrices.reduce((a, b) => a + b, 0) / currentPrices.length) : 0;
  const currentMin = currentPrices.length > 0 ? Math.min(...currentPrices) : 0;
  const currentMax = currentPrices.length > 0 ? Math.max(...currentPrices) : 0;
  const currentVol = filteredSeries.length > 0
    ? (filteredSeries.reduce((acc, p) => acc + p.volatility, 0) / filteredSeries.length)
    : 0;

  // Chart coordinate mapping
  const chartWidth = 740;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const minVal = 0;
  const maxVal = 160;

  const getX = (idx: number) => {
    if (filteredSeries.length <= 1) return padding.left;
    return padding.left + (idx / (filteredSeries.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return padding.top + innerHeight - ((clamped - minVal) / (maxVal - minVal)) * innerHeight;
  };

  // Generate SVG paths
  const pricePath = filteredSeries
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(pt.price).toFixed(1)}`)
    .join(" ");

  const ma30Path = filteredSeries
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(pt.ma_30).toFixed(1)}`)
    .join(" ");

  const ma365Path = filteredSeries
    .map((pt, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx).toFixed(1)} ${getY(pt.ma_365).toFixed(1)}`)
    .join(" ");

  const areaPath = filteredSeries.length > 0
    ? `${pricePath} L ${getX(filteredSeries.length - 1).toFixed(1)} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`
    : "";

  const selectedCrisis = brentData.historical_crises[selectedCrisisIndex];

  return (
    <section className="case-stage brent-oil-showcase" style={{ margin: "24px 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <p className="mono case-label" style={{ marginBottom: 4 }}>
            Interactive Console • 35.5-Year Econometric Model
          </p>
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink-heading)" }}>
            Brent Crude Oil Price & Risk Explorer (1987–2022)
          </h3>
        </div>
        <span className="mono" style={{ fontSize: 10, color: "var(--dim)" }}>
          9,011 TRADING DAYS • LOCAL PRECOMPUTED STATIC JSON
        </span>
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab("timeline")}
          style={{
            background: activeTab === "timeline" ? "var(--panel)" : "transparent",
            color: activeTab === "timeline" ? "var(--accent)" : "var(--muted)",
            border: activeTab === "timeline" ? "1px solid var(--accent)" : "1px solid var(--line)",
            padding: "6px 12px",
            fontSize: 12,
            fontFamily: "monospace",
            borderRadius: 3,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          01. 35-Year Timeline & Regimes
        </button>
        <button
          onClick={() => setActiveTab("crises")}
          style={{
            background: activeTab === "crises" ? "var(--panel)" : "transparent",
            color: activeTab === "crises" ? "var(--accent)" : "var(--muted)",
            border: activeTab === "crises" ? "1px solid var(--accent)" : "1px solid var(--line)",
            padding: "6px 12px",
            fontSize: 12,
            fontFamily: "monospace",
            borderRadius: 3,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          02. 7 Geopolitical Crises Simulator
        </button>
        <button
          onClick={() => setActiveTab("risk")}
          style={{
            background: activeTab === "risk" ? "var(--panel)" : "transparent",
            color: activeTab === "risk" ? "var(--accent)" : "var(--muted)",
            border: activeTab === "risk" ? "1px solid var(--accent)" : "1px solid var(--line)",
            padding: "6px 12px",
            fontSize: 12,
            fontFamily: "monospace",
            borderRadius: 3,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          03. Fat-Tail Risk & VaR (95/99)
        </button>
      </div>

      {/* TAB 1: TIMELINE & REGIMES */}
      {activeTab === "timeline" && (
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: 4 }}>
          {/* Era filter controls & Moving average toggles */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "ALL", label: "Full 35Y History" },
                { id: "1980s_1990s", label: "1987–1999" },
                { id: "2000s", label: "2000–2009 (Peak)" },
                { id: "2010s", label: "2010–2019 (Shale)" },
                { id: "2020s", label: "2020–2022 (War/COVID)" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedDecade(btn.id)}
                  style={{
                    backgroundColor: selectedDecade === btn.id ? "var(--accent)" : "var(--panel)",
                    color: selectedDecade === btn.id ? "#000" : "var(--muted)",
                    border: "1px solid var(--line)",
                    padding: "4px 8px",
                    fontSize: 10,
                    fontFamily: "monospace",
                    borderRadius: 2,
                    cursor: "pointer"
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <label className="mono" style={{ fontSize: 10, color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="checkbox"
                  checked={showMA30}
                  onChange={(e) => setShowMA30(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                <span style={{ color: "#38bdf8" }}>MA-30 (Short Trend)</span>
              </label>
              <label className="mono" style={{ fontSize: 10, color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="checkbox"
                  checked={showMA365}
                  onChange={(e) => setShowMA365(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }}
                />
                <span style={{ color: "#f59e0b" }}>MA-365 (Long Trend)</span>
              </label>
            </div>
          </div>

          {/* Dynamic KPI Strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 14 }}>
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "8px 12px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>SELECTED MEAN PRICE</span>
              <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace", display: "block", marginTop: 2 }}>
                ${currentAvg.toFixed(2)}/bbl
              </strong>
            </div>
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "8px 12px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>OBSERVED MINIMUM</span>
              <strong style={{ fontSize: 16, color: "#38bdf8", fontFamily: "monospace", display: "block", marginTop: 2 }}>
                ${currentMin.toFixed(2)}
              </strong>
            </div>
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "8px 12px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>OBSERVED MAXIMUM</span>
              <strong style={{ fontSize: 16, color: "var(--accent)", fontFamily: "monospace", display: "block", marginTop: 2 }}>
                ${currentMax.toFixed(2)}
              </strong>
            </div>
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "8px 12px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>AVG 30D VOLATILITY</span>
              <strong style={{ fontSize: 16, color: "#f59e0b", fontFamily: "monospace", display: "block", marginTop: 2 }}>
                {currentVol.toFixed(2)}%
              </strong>
            </div>
          </div>

          {/* SVG Line Chart Canvas */}
          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <defs>
                <linearGradient id="brentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 40, 80, 120, 160].map((val) => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={chartWidth - padding.right}
                    y2={getY(val)}
                    stroke="var(--line)"
                    strokeDasharray="2 2"
                    strokeWidth={0.7}
                  />
                  <text
                    x={padding.left - 6}
                    y={getY(val) + 3}
                    fill="var(--dim)"
                    fontSize="8"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    ${val}
                  </text>
                </g>
              ))}

              {/* Area & Price Curves */}
              {areaPath && <path d={areaPath} fill="url(#brentGrad)" />}
              {pricePath && <path d={pricePath} fill="none" stroke="var(--accent)" strokeWidth={1.4} />}
              {showMA30 && ma30Path && <path d={ma30Path} fill="none" stroke="#38bdf8" strokeWidth={1.0} strokeDasharray="3 2" />}
              {showMA365 && ma365Path && <path d={ma365Path} fill="none" stroke="#f59e0b" strokeWidth={1.2} />}

              {/* Milestones Annotations if ALL is selected */}
              {selectedDecade === "ALL" && (
                <>
                  {/* Peak 2008: $143.95 */}
                  <circle cx={getX(254)} cy={getY(143.95)} r={3.5} fill="var(--accent)" />
                  <text x={getX(254)} y={getY(143.95) - 6} fill="var(--accent)" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    Peak $143.95 (2008)
                  </text>

                  {/* COVID 2020: $9.10 */}
                  <circle cx={getX(395)} cy={getY(9.10)} r={3.5} fill="#38bdf8" />
                  <text x={getX(395)} y={getY(9.10) + 12} fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    COVID $9.10 (2020)
                  </text>
                </>
              )}
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>
              {filteredSeries.length > 0 ? filteredSeries[0].date : "1987-05"}
            </span>
            <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>
              {filteredSeries.length > 0 ? filteredSeries[filteredSeries.length - 1].date : "2022-11"}
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: GEOPOLITICAL CRISIS IMPACT SIMULATOR */}
      {activeTab === "crises" && (
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>
              7 HISTORICAL GLOBAL ENERGY SHOCKS (BEFORE VS AFTER ±WINDOW ANALYSIS)
            </span>
            <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
              CLICK EVENT TO INSPECT SHOCK DYNAMICS
            </span>
          </div>

          {/* Event Selector Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 6, marginBottom: 16 }}>
            {brentData.historical_crises.map((crisis, idx) => {
              const isSelected = selectedCrisisIndex === idx;
              const isPositive = crisis.pct_impact >= 0;
              return (
                <button
                  key={crisis.name}
                  onClick={() => setSelectedCrisisIndex(idx)}
                  style={{
                    backgroundColor: isSelected ? "var(--panel)" : "var(--panel-secondary, #111)",
                    border: isSelected ? "1px solid var(--accent)" : "1px solid var(--line)",
                    padding: "8px 10px",
                    borderRadius: 2,
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>{crisis.date}</span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 8,
                        color: isPositive ? "var(--accent)" : "#38bdf8",
                        fontWeight: "bold"
                      }}
                    >
                      {isPositive ? `+${crisis.pct_impact}%` : `${crisis.pct_impact}%`}
                    </span>
                  </div>
                  <strong style={{ fontSize: 11, color: isSelected ? "var(--ink-heading)" : "var(--muted)", display: "block", marginTop: 2 }}>
                    {crisis.name}
                  </strong>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Crisis Drilldown Card */}
          {selectedCrisis && (
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "16px 18px", borderRadius: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span className="mono" style={{ fontSize: 9, color: "var(--accent)", backgroundColor: "var(--accent-subtle)", padding: "2px 6px", borderRadius: 2 }}>
                    {selectedCrisis.tag} • WINDOW: ±{selectedCrisis.window_days} DAYS
                  </span>
                  <h4 style={{ margin: "4px 0 2px", fontSize: 16, color: "var(--ink-heading)" }}>
                    {selectedCrisis.name} ({selectedCrisis.date})
                  </h4>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>PRICE ON EVENT DATE</span>
                  <strong style={{ fontSize: 20, color: "var(--accent)", fontFamily: "monospace" }}>
                    ${selectedCrisis.event_price.toFixed(2)}/bbl
                  </strong>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 14px" }}>
                {selectedCrisis.description}
              </p>

              {/* Before vs After Metric Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>AVG PRICE BEFORE</span>
                  <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace", display: "block", marginTop: 2 }}>
                    ${selectedCrisis.avg_before.toFixed(2)}
                  </strong>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>Prior {selectedCrisis.window_days} days</span>
                </div>

                <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>AVG PRICE AFTER</span>
                  <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace", display: "block", marginTop: 2 }}>
                    ${selectedCrisis.avg_after.toFixed(2)}
                  </strong>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>Next {selectedCrisis.window_days} days</span>
                </div>

                <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>NET DELTA SHOCK</span>
                  <strong
                    style={{
                      fontSize: 16,
                      color: selectedCrisis.pct_impact >= 0 ? "var(--accent)" : "#38bdf8",
                      fontFamily: "monospace",
                      display: "block",
                      marginTop: 2
                    }}
                  >
                    {selectedCrisis.pct_impact >= 0 ? `+${selectedCrisis.pct_impact}%` : `${selectedCrisis.pct_impact}%`}
                  </strong>
                  <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>Window Transition</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RISK & VOLATILITY ENGINE */}
      {activeTab === "risk" && (
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>
                NON-GAUSSIAN FAT-TAILS & VALUE-AT-RISK (VaR) CALIBRATION
              </span>
              <h4 style={{ margin: "2px 0 0", fontSize: 16, color: "var(--ink-heading)" }}>
                Statistical Leptokurtic Return Distribution Analysis
              </h4>
            </div>
            <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
              9,010 DAILY RETURNS ANALYZED
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 14 }}>
            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>FAT-TAIL KURTOSIS</span>
              <strong style={{ fontSize: 20, color: "var(--accent)", fontFamily: "monospace", display: "block", margin: "4px 0" }}>
                {brentData.risk_statistics.kurtosis}
              </strong>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                15.1x higher than Gaussian benchmark (3.0), proving extreme tail events happen far more frequently.
              </p>
            </div>

            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>DAILY VaR (95% CONFIDENCE)</span>
              <strong style={{ fontSize: 20, color: "#f59e0b", fontFamily: "monospace", display: "block", margin: "4px 0" }}>
                {brentData.risk_statistics.var_95_daily_pct}%
              </strong>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                On 1 out of 20 trading sessions, daily price drops by 3.57% or greater.
              </p>
            </div>

            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>DAILY VaR (99% TAIL RISK)</span>
              <strong style={{ fontSize: 20, color: "#ef4444", fontFamily: "monospace", display: "block", margin: "4px 0" }}>
                {brentData.risk_statistics.var_99_daily_pct}%
              </strong>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                Severe 1-in-100 day crash risk threshold exceeds -6.13% daily decline.
              </p>
            </div>

            <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: 2 }}>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>ANOMALY SESSIONS (|Z| &gt; 3)</span>
              <strong style={{ fontSize: 20, color: "#38bdf8", fontFamily: "monospace", display: "block", margin: "4px 0" }}>
                {brentData.risk_statistics.anomaly_days_count} Days
              </strong>
              <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                Statistical outlier trading sessions heavily clustered around major geopolitical crises.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
