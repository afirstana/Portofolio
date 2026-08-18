"use client";

import React, { useState } from "react";

export function OpinionParadoxInteractive() {
  const [selectedYear, setSelectedYear] = useState<number>(2019);
  const [activeView, setActiveView] = useState<"divergence" | "clusters">("divergence");

  // 1990 to 2019 longitudinal sample milestones
  const milestones = [
    { year: 1990, deaths: 5.52, elderlyPop: 328, asdr: 147.93, label: "1990 Baseline" },
    { year: 1995, deaths: 6.28, elderlyPop: 375, asdr: 144.12, label: "Early Screening" },
    { year: 2000, deaths: 7.04, elderlyPop: 422, asdr: 139.80, label: "Genomic Onset" },
    { year: 2005, deaths: 7.82, elderlyPop: 479, asdr: 135.21, label: "Tobacco Treaty" },
    { year: 2010, deaths: 8.49, elderlyPop: 531, asdr: 131.05, label: "Targeted Era" },
    { year: 2015, deaths: 9.11, elderlyPop: 614, asdr: 128.14, label: "Immunotherapy" },
    { year: 2019, deaths: 9.67, elderlyPop: 703, asdr: 125.41, label: "2019 Record" },
  ];

  // Cross-National ASDR Clusters
  const regionalClusters = [
    { region: "Hungary (Global Highest #1)", asdr: 208.5, driver: "High Tobacco + Alcohol Synergy", color: "#f43f5e", pct: 100 },
    { region: "Serbia (Rank #2)", asdr: 198.9, driver: "Heavy Smoking + Late Stage Diagnosis", color: "#f43f5e", pct: 95.4 },
    { region: "Slovakia (Rank #3)", asdr: 191.5, driver: "High Colorectal / Lung Neoplasm Burden", color: "#f43f5e", pct: 91.8 },
    { region: "Eastern European Mean", asdr: 182.4, driver: "Post-Soviet Healthcare Infrastructure", color: "#f59e0b", pct: 87.5 },
    { region: "Global Baseline Mean", asdr: 125.4, driver: "Standard WHO World Baseline Benchmark", color: "var(--accent)", pct: 60.1 },
    { region: "Western European Mean", asdr: 121.2, driver: "Universal Screening + Adjuvant Access", color: "#38bdf8", pct: 58.1 },
    { region: "East Asia (Japan / S. Korea)", asdr: 98.6, driver: "Universal Endoscopic Gastric Screens", color: "#10b981", pct: 47.3 },
    { region: "Sub-Saharan Africa (Reported)", asdr: 84.2, driver: "Severe Pathology & Registry Latency", color: "#64748b", pct: 40.4 },
  ];

  const current = milestones.find((m) => m.year === selectedYear) || milestones[milestones.length - 1];
  const baseline = milestones[0];

  const deathsDelta = (((current.deaths - baseline.deaths) / baseline.deaths) * 100).toFixed(1);
  const elderlyDelta = (((current.elderlyPop - baseline.elderlyPop) / baseline.elderlyPop) * 100).toFixed(1);
  const asdrDelta = (((current.asdr - baseline.asdr) / baseline.asdr) * 100).toFixed(1);

  // SVG Chart Geometry
  const chartW = 680;
  const chartH = 160;
  const padX = 50;
  const padY = 20;

  // Normalized points for ASDR (120 to 160) and Deaths (5.0 to 10.5)
  const chartPoints = milestones.map((m, idx) => {
    const x = padX + (idx / (milestones.length - 1)) * (chartW - padX * 2);
    const asdrY = padY + ((155 - m.asdr) / (155 - 120)) * (chartH - padY * 2);
    const deathsY = chartH - padY - ((m.deaths - 5.0) / (10.5 - 5.0)) * (chartH - padY * 2);
    return { ...m, x, asdrY, deathsY };
  });

  const asdrPath = chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.asdrY}`).join(" ");
  const deathsPath = chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.deathsY}`).join(" ");
  const activePt = chartPoints.find((p) => p.year === selectedYear) || chartPoints[chartPoints.length - 1];

  return (
    <div
      style={{
        margin: "32px 0 36px",
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "22px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span className="mono" style={{ fontSize: "9px", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Interactive Opinion Simulation • 1990–2019 Empirical Evidence
          </span>
          <h4 style={{ margin: "4px 0 0", color: "var(--ink-heading)", fontSize: "17px" }}>
            {activeView === "divergence"
              ? `The Epidemiological Divergence Model (${selectedYear})`
              : "Cross-National Mortality Disparity Spectrum"}
          </h4>
        </div>

        {/* View Switcher Pills */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setActiveView("divergence")}
            style={{
              background: activeView === "divergence" ? "var(--accent)" : "var(--surface-secondary)",
              color: activeView === "divergence" ? "#000" : "var(--muted)",
              border: `1px solid ${activeView === "divergence" ? "var(--accent)" : "var(--line)"}`,
              padding: "5px 10px",
              fontSize: "10.5px",
              fontFamily: "monospace",
              borderRadius: "3px",
              cursor: "pointer",
              fontWeight: activeView === "divergence" ? "bold" : "normal",
            }}
          >
            📈 30-Year Paradox Curve
          </button>
          <button
            onClick={() => setActiveView("clusters")}
            style={{
              background: activeView === "clusters" ? "var(--accent)" : "var(--surface-secondary)",
              color: activeView === "clusters" ? "#000" : "var(--muted)",
              border: `1px solid ${activeView === "clusters" ? "var(--accent)" : "var(--line)"}`,
              padding: "5px 10px",
              fontSize: "10.5px",
              fontFamily: "monospace",
              borderRadius: "3px",
              cursor: "pointer",
              fontWeight: activeView === "clusters" ? "bold" : "normal",
            }}
          >
            🌍 Regional Disparity Clusters
          </button>
        </div>
      </div>

      {activeView === "divergence" ? (
        <>
          {/* Year Milestone Selector */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px", marginBottom: "16px" }}>
            {milestones.map((m) => (
              <button
                key={m.year}
                onClick={() => setSelectedYear(m.year)}
                style={{
                  background: selectedYear === m.year ? "var(--accent)" : "var(--surface-secondary)",
                  color: selectedYear === m.year ? "#000" : "var(--muted)",
                  border: `1px solid ${selectedYear === m.year ? "var(--accent)" : "var(--line)"}`,
                  padding: "5px 11px",
                  fontSize: "10.5px",
                  fontFamily: "monospace",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontWeight: selectedYear === m.year ? "bold" : "normal",
                  transition: "all 0.15s ease",
                }}
              >
                {m.year}
              </button>
            ))}
          </div>

          {/* 3 Metric Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px", marginBottom: "16px" }}>
            {/* Metric 1: Absolute Deaths */}
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "4px" }}>
              <span className="mono" style={{ fontSize: "8.5px", color: "var(--dim)" }}>GLOBAL CANCER FATALITIES</span>
              <strong style={{ display: "block", fontSize: "20px", color: "#f43f5e", fontFamily: "monospace", margin: "3px 0" }}>
                {current.deaths} Million
              </strong>
              <span className="mono" style={{ fontSize: "9.5px", color: "#f43f5e" }}>
                {Number(deathsDelta) >= 0 ? `▲ +${deathsDelta}%` : `▼ ${deathsDelta}%`} vs 1990
              </span>
            </div>

            {/* Metric 2: Elderly Population (≥65) */}
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", padding: "12px 14px", borderRadius: "4px" }}>
              <span className="mono" style={{ fontSize: "8.5px", color: "var(--dim)" }}>SENIOR POPULATION (≥65)</span>
              <strong style={{ display: "block", fontSize: "20px", color: "#f59e0b", fontFamily: "monospace", margin: "3px 0" }}>
                {current.elderlyPop} Million
              </strong>
              <span className="mono" style={{ fontSize: "9.5px", color: "#f59e0b" }}>
                {Number(elderlyDelta) >= 0 ? `▲ +${elderlyDelta}%` : `▼ ${elderlyDelta}%`} vs 1990
              </span>
            </div>

            {/* Metric 3: Age-Standardized Death Rate */}
            <div style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "12px 14px", borderRadius: "4px" }}>
              <span className="mono" style={{ fontSize: "8.5px", color: "#10b981" }}>AGE-STANDARDIZED RATE (ASDR)</span>
              <strong style={{ display: "block", fontSize: "20px", color: "#10b981", fontFamily: "monospace", margin: "3px 0" }}>
                {current.asdr} / 100k
              </strong>
              <span className="mono" style={{ fontSize: "9.5px", color: "#10b981", fontWeight: "bold" }}>
                {Number(asdrDelta) <= 0 ? `▼ ${asdrDelta}%` : `▲ +${asdrDelta}%`} vs 1990 (Risk Dropping)
              </span>
            </div>
          </div>

          {/* Interactive Dual-Trajectory SVG Chart */}
          <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--line)", borderRadius: "4px", padding: "14px 16px", marginBottom: "14px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <span style={{ fontSize: "9.5px", fontFamily: "monospace", color: "#10b981", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", display: "inline-block" }} />
                  Biological Risk ASDR (-15.2%)
                </span>
                <span style={{ fontSize: "9.5px", fontFamily: "monospace", color: "#f43f5e", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "8px", height: "8px", background: "#f43f5e", borderRadius: "50%", display: "inline-block" }} />
                  Absolute Deaths (+75.3%)
                </span>
              </div>
              <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>
                HOVER NODES TO INSPECT
              </span>
            </div>

            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
              {/* Gridlines */}
              <line x1={padX} y1={padY} x2={chartW - padX} y2={padY} stroke="var(--line)" strokeDasharray="2 2" strokeWidth="0.8" />
              <line x1={padX} y1={chartH / 2} x2={chartW - padX} y2={chartH / 2} stroke="var(--line)" strokeDasharray="2 2" strokeWidth="0.8" />
              <line x1={padX} y1={chartH - padY} x2={chartW - padX} y2={chartH - padY} stroke="var(--line)" strokeDasharray="2 2" strokeWidth="0.8" />

              {/* ASDR Falling Line (Green) */}
              <path d={asdrPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Deaths Rising Line (Red) */}
              <path d={deathsPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Active Tracking Crosshair */}
              <line x1={activePt.x} y1={padY} x2={activePt.x} y2={chartH - padY} stroke="rgba(255,255,255,0.4)" strokeDasharray="3 3" strokeWidth="1" />

              {/* Interactive Nodes */}
              {chartPoints.map((pt) => {
                const isActive = pt.year === selectedYear;
                return (
                  <g key={pt.year} onClick={() => setSelectedYear(pt.year)} style={{ cursor: "pointer" }}>
                    {/* ASDR Dot */}
                    <circle cx={pt.x} cy={pt.asdrY} r={isActive ? 6 : 3.5} fill="#10b981" stroke={isActive ? "#fff" : "none"} strokeWidth="1.5" />
                    {/* Deaths Dot */}
                    <circle cx={pt.x} cy={pt.deathsY} r={isActive ? 6 : 3.5} fill="#f43f5e" stroke={isActive ? "#fff" : "none"} strokeWidth="1.5" />

                    {/* X-Axis Year Labels */}
                    <text x={pt.x} y={chartH - 2} fill={isActive ? "var(--accent)" : "var(--dim)"} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight={isActive ? "bold" : "normal"}>
                      {pt.year}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Key Analytical Takeaway */}
          <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: "3px" }}>
            <p className="mono" style={{ margin: 0, fontSize: "10.5px", color: "var(--muted)", lineHeight: 1.5 }}>
              💡 <strong>The Simpson's Paradox Diagnosis</strong>: While total cancer deaths climbed from <strong>5.52M to 9.67M</strong> due to global life expectancy gains doubling the senior population (328M ➔ 703M), the individual age-standardized mortality risk declined by <strong>-15.22%</strong> (147.9 ➔ 125.4 per 100k).
            </p>
          </div>
        </>
      ) : (
        /* Cross-National Disparity Breakdown View */
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--dim)" }}>
              COUNTRY / REGIONAL CLUSTER
            </span>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--dim)" }}>
              ASDR (/100k) & CLINICAL ETIOLOGY
            </span>
          </div>

          {regionalClusters.map((cluster) => (
            <div
              key={cluster.region}
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr 80px",
                gap: "12px",
                alignItems: "center",
                padding: "7px 12px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--line)",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontSize: "11px",
              }}
            >
              <div>
                <span style={{ color: "var(--ink)", display: "block", fontWeight: "bold" }}>{cluster.region}</span>
                <span style={{ fontSize: "9px", color: "var(--dim)" }}>{cluster.driver}</span>
              </div>

              <div style={{ height: "9px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${cluster.pct}%`,
                    background: cluster.color,
                    borderRadius: "2px",
                  }}
                />
              </div>

              <strong style={{ textAlign: "right", color: cluster.color }}>
                {cluster.asdr} / 100k
              </strong>
            </div>
          ))}

          <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(244, 63, 94, 0.06)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "10px", color: "#f43f5e" }}>
              ⚠️ Eastern Europe (208.5/100k) suffers 2.5x higher mortality than East Asia (98.6/100k), reflecting tobacco exposure and screening gaps rather than genetic divergence.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OpinionParadoxInteractive;
