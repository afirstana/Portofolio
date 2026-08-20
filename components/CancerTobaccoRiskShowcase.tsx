"use client";

import React, { useState, useMemo } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerTobaccoRiskShowcase() {
  const [activeMode, setActiveMode] = useState<"absolute" | "indexed" | "stacked">("absolute");
  const [hoveredYear, setHoveredYear] = useState<number | null>(2019);

  const series = (cancerData as any).tobacco_comparison_longitudinal || [];
  const activeData = series.find((d: any) => d.year === hoveredYear) || series[series.length - 1];

  // SVG Chart Dimensions
  const width = 800;
  const height = 260;
  const padLeft = 65;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 35;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Min/Max calculations
  const minYear = 1990;
  const maxYear = 2019;

  // Scale functions
  const getX = (yr: number) => padLeft + ((yr - minYear) / (maxYear - minYear)) * chartW;

  // Max values for scales
  const maxTotalDeaths = 10000000; // 10M
  const getYAbsolute = (val: number) => padTop + chartH - (val / maxTotalDeaths) * chartH;

  const maxIndexed = 200; // 100 to 200%
  const minIndexed = 80;
  const getYIndexed = (val: number) => padTop + chartH - ((val - minIndexed) / (maxIndexed - minIndexed)) * chartH;

  // SVG Path Generators
  const pathTotalAbsolute = useMemo(() => {
    return series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYAbsolute(d.total_cancer_deaths).toFixed(1)}`).join(" ");
  }, [series]);

  const pathTobaccoAbsolute = useMemo(() => {
    return series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYAbsolute(d.tobacco_cancer_deaths).toFixed(1)}`).join(" ");
  }, [series]);

  const pathLungAbsolute = useMemo(() => {
    return series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYAbsolute(d.lung_cancer_deaths).toFixed(1)}`).join(" ");
  }, [series]);

  // Area under tobacco curve
  const areaTobaccoAbsolute = useMemo(() => {
    if (!series.length) return "";
    const linePart = series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYAbsolute(d.tobacco_cancer_deaths).toFixed(1)}`).join(" ");
    const bottomClose = `L ${getX(maxYear).toFixed(1)} ${(padTop + chartH).toFixed(1)} L ${getX(minYear).toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`;
    return `${linePart} ${bottomClose}`;
  }, [series]);

  // Indexed Paths
  const pathTotalIndexed = useMemo(() => {
    return series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYIndexed(d.total_indexed_1990).toFixed(1)}`).join(" ");
  }, [series]);

  const pathTobaccoIndexed = useMemo(() => {
    return series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYIndexed(d.tobacco_indexed_1990).toFixed(1)}`).join(" ");
  }, [series]);

  const pathLungIndexed = useMemo(() => {
    return series.map((d: any, i: number) => `${i === 0 ? "M" : "L"} ${getX(d.year).toFixed(1)} ${getYIndexed(d.lung_indexed_1990).toFixed(1)}`).join(" ");
  }, [series]);

  // Organ sites vulnerability
  const tobaccoVulnerableSites = [
    { site: "Lung & Bronchus", fraction: 84.5, color: "#38bdf8", deaths2019: "2.04M", desc: "Direct inhalation toxicity & PM2.5 particulates" },
    { site: "Larynx & Pharynx", fraction: 71.2, color: "#f43f5e", deaths2019: "312k", desc: "Direct mucosal exposure to combustion carcinogens" },
    { site: "Esophageal Cancer", fraction: 52.8, color: "#f59e0b", deaths2019: "498k", desc: "Synergistic cytotoxicity with alcohol & thermal irritation" },
    { site: "Bladder & Urinary", fraction: 46.3, color: "#ec4899", deaths2019: "228k", desc: "Renal excretion of filtered aromatic amine metabolites" },
    { site: "Stomach & Pancreas", fraction: 26.5, color: "#a855f7", deaths2019: "1.49M", desc: "Systemic vascular absorption & chronic mucosal inflammation" },
  ];

  return (
    <section className="case-stage cancer-tobacco-stage" id="tobacco-risk" style={{ margin: "32px 0 40px", width: "100%" }}>
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <p className="mono case-label" style={{ marginBottom: "4px" }}>
            Etiology & Longitudinal Risk Surveillance • 1990–2019
          </p>
          <h3 style={{ margin: 0, fontSize: "1.35rem", color: "var(--ink-heading)" }}>
            Tobacco Attribution vs Total Cancer Mortality Trajectory
          </h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "12px", maxWidth: "720px", lineHeight: 1.5 }}>
            Decoupling behavioral smoking-attributable cancer deaths (+60.2% surge to 2.49M) from total global cancer mortality (+75.3% to 9.67M) and primary lung neoplasms (+91.8% to 2.04M) across three decades of demographic expansion.
          </p>
        </div>
        <span className="mono" style={{ fontSize: "10px", color: "var(--dim)", background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: 3, border: "1px solid var(--line)" }}>
          LONGITUDINAL ATTRIBUTION ENGINE
        </span>
      </div>

      {/* Surface Card Container */}
      <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "22px", borderRadius: "6px", width: "100%" }}>
        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          <div style={{ padding: "12px 14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>1990 TOBACCO CANCER DEATHS</span>
            <strong style={{ display: "block", fontSize: "21px", color: "#f59e0b", fontFamily: "monospace", margin: "4px 0" }}>
              1.55 Million
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              28.13% of all cancer deaths
            </span>
          </div>

          <div style={{ padding: "12px 14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>2019 TOBACCO CANCER DEATHS</span>
            <strong style={{ display: "block", fontSize: "21px", color: "#f43f5e", fontFamily: "monospace", margin: "4px 0" }}>
              2.49 Million
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              25.70% of all cancer deaths
            </span>
          </div>

          <div style={{ padding: "12px 14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>NET 30-YEAR SURGE</span>
            <strong style={{ display: "block", fontSize: "21px", color: "var(--accent)", fontFamily: "monospace", margin: "4px 0" }}>
              +60.16% ▲
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              +933.5k additional annual deaths
            </span>
          </div>

          <div style={{ padding: "12px 14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>LUNG ATTRIBUTION FRACTION</span>
            <strong style={{ display: "block", fontSize: "21px", color: "#38bdf8", fontFamily: "monospace", margin: "4px 0" }}>
              84.5%
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              Leading direct smoking etiology
            </span>
          </div>
        </div>

        {/* Toolbar & Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setActiveMode("absolute")}
              className={`mono ${activeMode === "absolute" ? "active" : ""}`}
              style={{
                padding: "5px 11px",
                fontSize: "11px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                cursor: "pointer",
                background: activeMode === "absolute" ? "var(--accent)" : "var(--panel)",
                color: activeMode === "absolute" ? "#ffffff" : "var(--muted)",
                fontWeight: activeMode === "absolute" ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              Absolute Counts (Millions)
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("indexed")}
              className={`mono ${activeMode === "indexed" ? "active" : ""}`}
              style={{
                padding: "5px 11px",
                fontSize: "11px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                cursor: "pointer",
                background: activeMode === "indexed" ? "var(--accent)" : "var(--panel)",
                color: activeMode === "indexed" ? "#ffffff" : "var(--muted)",
                fontWeight: activeMode === "indexed" ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              Indexed Growth (1990 = 100)
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("stacked")}
              className={`mono ${activeMode === "stacked" ? "active" : ""}`}
              style={{
                padding: "5px 11px",
                fontSize: "11px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                cursor: "pointer",
                background: activeMode === "stacked" ? "var(--accent)" : "var(--panel)",
                color: activeMode === "stacked" ? "#ffffff" : "var(--muted)",
                fontWeight: activeMode === "stacked" ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              Attribution Share (%)
            </button>
          </div>

          {/* Interactive Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "10.5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: 10, height: 3, backgroundColor: "var(--ink-heading)", borderRadius: 1 }} />
              <span className="mono" style={{ color: "var(--ink-heading)" }}>Total Cancer</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: 10, height: 3, backgroundColor: "#f43f5e", borderRadius: 1 }} />
              <span className="mono" style={{ color: "#f43f5e" }}>Tobacco-Attributed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: 10, height: 3, backgroundColor: "#38bdf8", borderRadius: 1 }} />
              <span className="mono" style={{ color: "#38bdf8" }}>Lung & Bronchus</span>
            </div>
          </div>
        </div>

        {/* Interactive SVG Multi-Metric Curve */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px", padding: "12px", position: "relative" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: "100%", height: "auto", display: "block" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const svgX = ((e.clientX - rect.left) / rect.width) * width;
              if (svgX >= padLeft && svgX <= padLeft + chartW) {
                const ratio = (svgX - padLeft) / chartW;
                const approxYr = Math.round(minYear + ratio * (maxYear - minYear));
                setHoveredYear(Math.min(maxYear, Math.max(minYear, approxYr)));
              }
            }}
            onMouseLeave={() => setHoveredYear(2019)}
          >
            <defs>
              <linearGradient id="tobaccoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {activeMode === "absolute" && (
              <>
                {[0, 2.5, 5.0, 7.5, 10.0].map((millions) => {
                  const y = getYAbsolute(millions * 1000000);
                  return (
                    <g key={millions}>
                      <line x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="var(--line)" strokeDasharray="3 3" />
                      <text x={padLeft - 8} y={y + 3} fill="var(--dim)" fontSize="9" fontFamily="monospace" textAnchor="end">
                        {millions === 0 ? "0" : `${millions}M`}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {activeMode === "indexed" && (
              <>
                {[100, 125, 150, 175, 200].map((idxVal) => {
                  const y = getYIndexed(idxVal);
                  return (
                    <g key={idxVal}>
                      <line x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="var(--line)" strokeDasharray="3 3" />
                      <text x={padLeft - 8} y={y + 3} fill="var(--dim)" fontSize="9" fontFamily="monospace" textAnchor="end">
                        {idxVal === 100 ? "100 (Base)" : `+${idxVal - 100}%`}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {activeMode === "stacked" && (
              <>
                {[0, 10, 20, 30, 40].map((pct) => {
                  const y = padTop + chartH - (pct / 40) * chartH;
                  return (
                    <g key={pct}>
                      <line x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="var(--line)" strokeDasharray="3 3" />
                      <text x={padLeft - 8} y={y + 3} fill="var(--dim)" fontSize="9" fontFamily="monospace" textAnchor="end">
                        {pct}%
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* Year X-Axis Labels */}
            {[1990, 1995, 2000, 2005, 2010, 2015, 2019].map((yr) => {
              const x = getX(yr);
              return (
                <g key={yr}>
                  <line x1={x} y1={padTop + chartH} x2={x} y2={padTop + chartH + 4} stroke="var(--line)" />
                  <text x={x} y={padTop + chartH + 16} fill="var(--dim)" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    {yr}
                  </text>
                </g>
              );
            })}

            {/* Render Curves by Mode */}
            {activeMode === "absolute" && (
              <>
                <path d={areaTobaccoAbsolute} fill="url(#tobaccoGrad)" />
                <path d={pathTotalAbsolute} fill="none" stroke="var(--ink-heading)" strokeWidth="2.5" strokeLinecap="round" />
                <path d={pathTobaccoAbsolute} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                <path d={pathLungAbsolute} fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
              </>
            )}

            {activeMode === "indexed" && (
              <>
                <path d={pathLungIndexed} fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
                <path d={pathTotalIndexed} fill="none" stroke="var(--ink-heading)" strokeWidth="2.5" strokeLinecap="round" />
                <path d={pathTobaccoIndexed} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}

            {activeMode === "stacked" && (
              <>
                {/* Visual Area for Share */}
                {series.map((d: any) => {
                  const x = getX(d.year);
                  const barW = chartW / series.length - 2;
                  const barH = (d.tobacco_share_pct / 40) * chartH;
                  const y = padTop + chartH - barH;
                  return (
                    <rect
                      key={d.year}
                      x={x - barW / 2}
                      y={y}
                      width={barW}
                      height={barH}
                      fill={activeData?.year === d.year ? "#f43f5e" : "rgba(244, 63, 94, 0.45)"}
                      rx={2}
                    />
                  );
                })}
              </>
            )}

            {/* Hover Crosshair & Telemetry Dots */}
            {activeData && (
              <g>
                <line
                  x1={getX(activeData.year)}
                  y1={padTop}
                  x2={getX(activeData.year)}
                  y2={padTop + chartH}
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {activeMode === "absolute" && (
                  <>
                    <circle cx={getX(activeData.year)} cy={getYAbsolute(activeData.total_cancer_deaths)} r="5" fill="var(--ink-heading)" stroke="var(--panel)" strokeWidth="2" />
                    <circle cx={getX(activeData.year)} cy={getYAbsolute(activeData.tobacco_cancer_deaths)} r="5" fill="#f43f5e" stroke="var(--panel)" strokeWidth="2" />
                    <circle cx={getX(activeData.year)} cy={getYAbsolute(activeData.lung_cancer_deaths)} r="4" fill="#38bdf8" stroke="var(--panel)" strokeWidth="2" />
                  </>
                )}

                {activeMode === "indexed" && (
                  <>
                    <circle cx={getX(activeData.year)} cy={getYIndexed(activeData.lung_indexed_1990)} r="4" fill="#38bdf8" stroke="var(--panel)" strokeWidth="2" />
                    <circle cx={getX(activeData.year)} cy={getYIndexed(activeData.total_indexed_1990)} r="5" fill="var(--ink-heading)" stroke="var(--panel)" strokeWidth="2" />
                    <circle cx={getX(activeData.year)} cy={getYIndexed(activeData.tobacco_indexed_1990)} r="5" fill="#f43f5e" stroke="var(--panel)" strokeWidth="2" />
                  </>
                )}
              </g>
            )}
          </svg>

          {/* Interactive Inspection Telemetry Bar */}
          {activeData && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                background: "var(--surface-secondary)",
                border: "1px solid var(--line)",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="mono" style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700 }}>
                  YEAR {activeData.year}
                </span>
                <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
                  | Active Cohort Telemetry
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11px", flexWrap: "wrap" }}>
                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: "9.5px" }}>TOTAL CANCER: </span>
                  <strong className="mono" style={{ color: "var(--ink-heading)" }}>
                    {activeData.total_cancer_deaths.toLocaleString()}
                  </strong>
                  <span className="mono" style={{ fontSize: "9px", color: "var(--muted)", marginLeft: "4px" }}>
                    ({activeData.total_indexed_1990}% of 1990)
                  </span>
                </div>

                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: "9.5px" }}>TOBACCO ATTRIBUTED: </span>
                  <strong className="mono" style={{ color: "#f43f5e" }}>
                    {activeData.tobacco_cancer_deaths.toLocaleString()}
                  </strong>
                  <span className="mono" style={{ fontSize: "9px", color: "#f59e0b", marginLeft: "4px" }}>
                    ({activeData.tobacco_share_pct}% share)
                  </span>
                </div>

                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: "9.5px" }}>LUNG CANCER: </span>
                  <strong className="mono" style={{ color: "#38bdf8" }}>
                    {activeData.lung_cancer_deaths.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Anatomical Organ Site Vulnerability Breakdown */}
        <div style={{ marginTop: "22px" }}>
          <span className="mono" style={{ fontSize: "10px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "10px" }}>
            Anatomical Organ Site Vulnerability to Tobacco Inhalation (Attributable Fraction %)
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            {tobaccoVulnerableSites.map((site) => (
              <div
                key={site.site}
                style={{
                  padding: "12px",
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "var(--ink-heading)" }}>{site.site}</strong>
                    <span className="mono" style={{ fontSize: "11px", color: site.color, fontWeight: 700 }}>
                      {site.fraction}%
                    </span>
                  </div>
                  <div style={{ height: "4px", width: "100%", background: "var(--line)", borderRadius: "2px", overflow: "hidden", margin: "6px 0" }}>
                    <div style={{ height: "100%", width: `${site.fraction}%`, backgroundColor: site.color, borderRadius: "2px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "10px", color: "var(--muted)", lineHeight: 1.3 }}>{site.desc}</span>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--dim)", marginLeft: "6px", whiteSpace: "nowrap" }}>
                    {site.deaths2019}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
