"use client";

import React, { useState, useMemo } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerGdpScatterShowcase() {
  const [hoveredScatter, setHoveredScatter] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [incomeFilter, setIncomeFilter] = useState<"all" | "high" | "middle" | "low" | "high_mortality">("all");

  const scatterPoints = useMemo(() => {
    let list = cancerData.gdp_vs_mortality.filter((d) => d.gdp_per_capita > 500 && d.cancer_death_rate > 50);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }

    if (incomeFilter === "high") {
      list = list.filter((d) => d.gdp_per_capita >= 40000);
    } else if (incomeFilter === "middle") {
      list = list.filter((d) => d.gdp_per_capita >= 10000 && d.gdp_per_capita < 40000);
    } else if (incomeFilter === "low") {
      list = list.filter((d) => d.gdp_per_capita < 10000);
    } else if (incomeFilter === "high_mortality") {
      list = list.filter((d) => d.cancer_death_rate >= 160);
    }

    return list;
  }, [searchQuery, incomeFilter]);

  const minGdp = 800;
  const maxGdp = 120000;
  const minRate = 60;
  const maxRate = 220;

  const activePoint = hoveredScatter || (scatterPoints.length > 0 ? scatterPoints[0] : null);

  return (
    <section className="case-stage cancer-gdp-scatter-stage" id="gdp-elasticity" style={{ margin: "32px 0 40px", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <p className="mono case-label" style={{ marginBottom: "4px" }}>
            Macroeconomic Econometrics • 186 Sovereign Nations
          </p>
          <h3 style={{ margin: 0, fontSize: "1.35rem", color: "var(--ink-heading)" }}>
            GDP per Capita vs Cancer Mortality Elasticity
          </h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "12px", maxWidth: "680px", lineHeight: 1.5 }}>
            Empirical 2D logarithmic scatter analysis demonstrating the non-linear relationship between national purchasing power ($PPP) and age-standardized cancer mortality rates.
          </p>
        </div>
        <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
          LOGARITHMIC SCALE • 186 DATA POINTS
        </span>
      </div>

      {/* Surface Card Container */}
      <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "22px", borderRadius: "6px", width: "100%" }}>
        {/* Controls Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="🔍 Search country on scatter (e.g. USA, Germany, Japan, Indonesia)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: "var(--panel)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                padding: "6px 12px",
                fontSize: "11px",
                fontFamily: "monospace",
                borderRadius: "3px",
                minWidth: "280px",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "All 186 Nations" },
                { id: "high", label: "High Income (>$40k)" },
                { id: "middle", label: "Middle Income ($10k–$40k)" },
                { id: "low", label: "Low Income (<$10k)" },
                { id: "high_mortality", label: "High Mortality (>160/100k)" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setIncomeFilter(filter.id as any)}
                  style={{
                    background: incomeFilter === filter.id ? "var(--accent)" : "var(--panel)",
                    color: incomeFilter === filter.id ? "#000" : "var(--muted)",
                    border: "1px solid var(--line)",
                    padding: "5px 10px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontWeight: incomeFilter === filter.id ? "bold" : "normal",
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
            Showing {scatterPoints.length} plotted nations • Hover dots for detail
          </span>
        </div>

        {/* SVG Scatter Plot */}
        <div style={{ width: "100%", overflowX: "auto", position: "relative" }}>
          <svg viewBox="0 0 780 260" style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Horizontal ASDR Gridlines */}
            {[80, 120, 160, 200].map((r) => {
              const y = 220 - ((r - minRate) / (maxRate - minRate)) * 190;
              return (
                <g key={r}>
                  <line x1="55" y1={y} x2="745" y2={y} stroke="var(--line)" strokeDasharray="2 2" strokeWidth="0.7" />
                  <text x="48" y={y + 3} fill="var(--dim)" fontSize="8.5" textAnchor="end" fontFamily="monospace">
                    {r}/100k
                  </text>
                </g>
              );
            })}

            {/* Vertical GDP Log Guides */}
            {[1000, 5000, 10000, 30000, 60000, 100000].map((gdp) => {
              const logMin = Math.log10(minGdp);
              const logMax = Math.log10(maxGdp);
              const x = 55 + ((Math.log10(gdp) - logMin) / (logMax - logMin)) * 690;
              return (
                <g key={gdp}>
                  <line x1={x} y1="20" x2={x} y2="220" stroke="var(--line)" strokeDasharray="2 2" strokeWidth="0.7" />
                  <text x={x} y="238" fill="var(--dim)" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                    ${gdp >= 1000 ? `${gdp / 1000}k` : gdp}
                  </text>
                </g>
              );
            })}

            {/* Axis Titles */}
            <text x="400" y="254" fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="monospace">
              GDP per Capita (PPP in constant 2017 international $) — Logarithmic Scale
            </text>
            <text x="18" y="120" fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="monospace" transform="rotate(-90 18 120)">
              Age-Standardized Cancer Death Rate (/100k)
            </text>

            {/* Scatter Dots */}
            {scatterPoints.map((pt) => {
              const logMin = Math.log10(minGdp);
              const logMax = Math.log10(maxGdp);
              const x = 55 + ((Math.log10(pt.gdp_per_capita) - logMin) / (logMax - logMin)) * 690;
              const y = 220 - ((pt.cancer_death_rate - minRate) / (maxRate - minRate)) * 190;
              const isHovered = hoveredScatter?.code === pt.code;
              const isHighIncome = pt.gdp_per_capita >= 40000;
              const isHighMortality = pt.cancer_death_rate >= 160;

              const dotColor = isHighIncome ? "#38bdf8" : isHighMortality ? "#f43f5e" : "var(--accent)";

              return (
                <g key={pt.code}>
                  {isHovered && (
                    <>
                      <circle cx={x} cy={y} r="9" fill="none" stroke={dotColor} strokeWidth="1.5" opacity="0.6" />
                      <line x1={x} y1="20" x2={x} y2="220" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" strokeWidth="0.8" />
                      <line x1="55" y1={y} x2="745" y2={y} stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" strokeWidth="0.8" />
                    </>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6.5 : 3.8}
                    fill={dotColor}
                    opacity={isHovered ? 1 : 0.78}
                    stroke={isHovered ? "#fff" : "rgba(0,0,0,0.5)"}
                    strokeWidth={isHovered ? 2 : 0.6}
                    style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                    onMouseEnter={() => setHoveredScatter(pt)}
                  />
                </g>
              );
            })}

            {/* SVG Floating Tooltip Box */}
            {hoveredScatter && (() => {
              const logMin = Math.log10(minGdp);
              const logMax = Math.log10(maxGdp);
              const hx = 55 + ((Math.log10(hoveredScatter.gdp_per_capita) - logMin) / (logMax - logMin)) * 690;
              const hy = 220 - ((hoveredScatter.cancer_death_rate - minRate) / (maxRate - minRate)) * 190;

              const tooltipW = 168;
              const tooltipH = 54;
              const tooltipX = hx > 580 ? hx - tooltipW - 12 : hx + 12;
              const tooltipY = Math.max(15, Math.min(165, hy - 25));

              return (
                <g style={{ pointerEvents: "none" }}>
                  <rect
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipW}
                    height={tooltipH}
                    rx="4"
                    fill="#0d0d10"
                    stroke="var(--accent)"
                    strokeWidth="1"
                    opacity="0.96"
                  />
                  <text x={tooltipX + 10} y={tooltipY + 16} fill="var(--ink-heading)" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                    {hoveredScatter.country} ({hoveredScatter.code})
                  </text>
                  <text x={tooltipX + 10} y={tooltipY + 31} fill="var(--accent)" fontSize="9" fontFamily="monospace">
                    GDP: ${hoveredScatter.gdp_per_capita.toLocaleString()} PPP
                  </text>
                  <text x={tooltipX + 10} y={tooltipY + 44} fill="var(--dim)" fontSize="8.5" fontFamily="monospace">
                    ASDR: {hoveredScatter.cancer_death_rate}/100k • {hoveredScatter.continent || "Other"}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Macroeconomic Telemetry Inspection Bar */}
        <div style={{ marginTop: "14px", padding: "12px 16px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px", minHeight: "52px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          {activePoint ? (
            <>
              <div>
                <span className="mono" style={{ fontSize: "9px", color: "var(--accent)" }}>
                  MACROECONOMIC PROFILE • {activePoint.country} ({activePoint.code})
                </span>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--ink)", fontFamily: "monospace" }}>
                  <strong>GDP: ${activePoint.gdp_per_capita.toLocaleString()} PPP</strong> • Cancer Mortality: <strong style={{ color: activePoint.cancer_death_rate >= 160 ? "#f43f5e" : activePoint.gdp_per_capita >= 40000 ? "#38bdf8" : "var(--accent)" }}>{activePoint.cancer_death_rate} deaths / 100k</strong>
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
                  Population: <strong>{activePoint.population ? `${(activePoint.population / 1e6).toFixed(1)}M` : "—"}</strong>
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    padding: "4px 9px",
                    borderRadius: "2px",
                    background:
                      activePoint.gdp_per_capita >= 40000
                        ? "rgba(56, 189, 248, 0.18)"
                        : activePoint.cancer_death_rate >= 160
                        ? "rgba(244, 63, 94, 0.18)"
                        : "rgba(255, 77, 28, 0.18)",
                    color:
                      activePoint.gdp_per_capita >= 40000
                        ? "#38bdf8"
                        : activePoint.cancer_death_rate >= 160
                        ? "#f43f5e"
                        : "var(--accent)",
                    fontFamily: "monospace",
                  }}
                >
                  {activePoint.gdp_per_capita >= 40000
                    ? "HIGH INCOME PLATEAU"
                    : activePoint.cancer_death_rate >= 160
                    ? "HIGH MORTALITY CLUSTER"
                    : "DEVELOPING TRANSITION"}
                </span>
              </div>
            </>
          ) : (
            <p className="mono" style={{ margin: 0, fontSize: "10px", color: "var(--dim)" }}>
              👉 Hover over any nation dot on the scatter plot to inspect its exact GDP per capita and cancer mortality rate.
            </p>
          )}
        </div>

        {/* 3 Macro Insights Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginTop: "14px" }}>
          <div style={{ padding: "10px 14px", background: "rgba(56, 189, 248, 0.05)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8.5px", color: "#38bdf8", fontWeight: "bold" }}>01. HIGH-INCOME PLATEAU ($40k+)</span>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
              High-income nations plateau at 110–130/100k due to early clinical intervention and broad registry coverage.
            </p>
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.05)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8.5px", color: "#f43f5e", fontWeight: "bold" }}>02. TRANSITION PEAK ($10k–$40k)</span>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
              Middle-income nations experience high cancer mortality (140–208/100k) due to tobacco uptake and late diagnosis.
            </p>
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(255, 77, 28, 0.05)", border: "1px solid rgba(255, 77, 28, 0.2)", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8.5px", color: "var(--accent)", fontWeight: "bold" }}>03. LOW-INCOME REPORTING GAP (&lt;$10k)</span>
            <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
              Deceptively low reported rates (&lt;90/100k) reflect pathology shortages and registry latency rather than lower incidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CancerGdpScatterShowcase;
