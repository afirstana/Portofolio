"use client";

import React, { useState, useMemo } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerTrendAsdrShowcase() {
  const [trendMetric, setTrendMetric] = useState<"rate" | "count">("rate");
  const [selectedCancer, setSelectedCancer] = useState<string>("Lung & Bronchus");
  const [hoveredTrendYear, setHoveredTrendYear] = useState<number | null>(2019);

  const meta = cancerData.metadata;

  const trendYears = cancerData.global_time_series.map((d) => d.year);
  const minYear = trendYears[0];
  const maxYear = trendYears[trendYears.length - 1];

  const trendPointData = useMemo(() => {
    return cancerData.asdr_trend.map((at, idx) => {
      const gts = cancerData.global_time_series[idx] || ({} as any);
      const yr = at.year;
      const x = 50 + ((yr - minYear) / (maxYear - minYear)) * 640;

      // Rate calculations
      const rateVal = at.rate_per_100k;
      const rateY = 25 + ((160 - rateVal) / 40) * 160;
      const rateBase = cancerData.asdr_trend[0].rate_per_100k;
      const rateDelta = ((rateVal - rateBase) / rateBase) * 100;

      // Count calculations
      const countVal = (gts as any)[selectedCancer] || gts.total_deaths || 0;
      const maxCount = selectedCancer
        ? (cancerData.global_time_series[cancerData.global_time_series.length - 1] as any)[selectedCancer] * 1.15
        : meta.global_deaths_2019 * 1.1;
      const countY = 185 - (countVal / (maxCount || 1)) * 150;
      const countBase = (cancerData.global_time_series[0] as any)[selectedCancer] || cancerData.global_time_series[0].total_deaths || 1;
      const countDelta = ((countVal - countBase) / countBase) * 100;

      return {
        year: yr,
        x,
        rateVal,
        rateY,
        rateDelta,
        countVal,
        countY,
        countDelta,
        totalDeaths: gts.total_deaths || 0,
      };
    });
  }, [trendMetric, selectedCancer, minYear, maxYear, meta.global_deaths_2019]);

  const activeHoverPoint = useMemo(() => {
    if (!hoveredTrendYear) return trendPointData[trendPointData.length - 1];
    return trendPointData.find((p) => p.year === hoveredTrendYear) || trendPointData[trendPointData.length - 1];
  }, [hoveredTrendYear, trendPointData]);

  return (
    <section
      id="longitudinal-trend"
      className="case-stage"
      style={{
        margin: "32px 0 36px",
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "6px",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <span className="mono" style={{ fontSize: "10px", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            03. 30-Year Longitudinal Trend & ASDR Trajectories
          </span>
          <h3 style={{ margin: "4px 0 0", color: "var(--ink-heading)", fontSize: "18px" }}>
            The Epidemiological Divergence Model (1990–2019)
          </h3>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "12px", maxWidth: "680px" }}>
            Interactive dual-metric trajectory simulator. Decoupling the <strong>-15.22% biological risk decline</strong> (Age-Standardized Death Rate per 100k) from the <strong>+75.32% absolute mortality surge</strong> driven by demographic senior cohort expansion.
          </p>
        </div>
        <span className="mono" style={{ fontSize: "10px", color: "var(--dim)", background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: "3px", border: "1px solid var(--line)" }}>
          SPAN: 30 YEARS (1990–2019)
        </span>
      </div>

      {/* 4 KPI Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>1990 BASELINE ASDR</span>
          <strong style={{ display: "block", fontSize: "20px", color: "var(--ink-heading)", fontFamily: "monospace", margin: "3px 0" }}>
            147.93 / 100k
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
            Standardized WHO Demographic Weight
          </span>
        </div>

        <div style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "#10b981" }}>2019 ASDR TRAJECTORY</span>
          <strong style={{ display: "block", fontSize: "20px", color: "#10b981", fontFamily: "monospace", margin: "3px 0" }}>
            125.41 / 100k
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "#10b981", fontWeight: "bold" }}>
            ▼ -15.22% Biological Risk Falling
          </span>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>1990 ABSOLUTE DEATHS</span>
          <strong style={{ display: "block", fontSize: "20px", color: "var(--ink-heading)", fontFamily: "monospace", margin: "3px 0" }}>
            5.52 Million
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
            All 29 Neoplasms Combined
          </span>
        </div>

        <div style={{ background: "rgba(244, 63, 94, 0.06)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "#f43f5e" }}>2019 ABSOLUTE SURGE</span>
          <strong style={{ display: "block", fontSize: "20px", color: "#f43f5e", fontFamily: "monospace", margin: "3px 0" }}>
            9.67 Million
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "#f43f5e", fontWeight: "bold" }}>
            ▲ +75.32% Demographic Longevity
          </span>
        </div>
      </div>

      {/* Main Interactive Graph Box */}
      <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px 20px" }}>
        {/* Controls Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setTrendMetric("rate")}
              style={{
                backgroundColor: trendMetric === "rate" ? "var(--accent)" : "var(--surface-secondary)",
                color: trendMetric === "rate" ? "#000" : "var(--muted)",
                border: "1px solid var(--line)",
                padding: "6px 12px",
                fontSize: "10.5px",
                fontFamily: "monospace",
                borderRadius: "3px",
                cursor: "pointer",
                fontWeight: trendMetric === "rate" ? "bold" : "normal",
                transition: "all 0.15s ease",
              }}
            >
              📉 Age-Standardized Rate (ASDR per 100k)
            </button>
            <button
              onClick={() => setTrendMetric("count")}
              style={{
                backgroundColor: trendMetric === "count" ? "var(--accent)" : "var(--surface-secondary)",
                color: trendMetric === "count" ? "#000" : "var(--muted)",
                border: "1px solid var(--line)",
                padding: "6px 12px",
                fontSize: "10.5px",
                fontFamily: "monospace",
                borderRadius: "3px",
                cursor: "pointer",
                fontWeight: trendMetric === "count" ? "bold" : "normal",
                transition: "all 0.15s ease",
              }}
            >
              📊 Absolute Deaths (Counts by Cancer Site)
            </button>
          </div>

          {trendMetric === "count" && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>Cancer Site:</span>
              <select
                value={selectedCancer}
                onChange={(e) => setSelectedCancer(e.target.value)}
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  color: "var(--ink)",
                  border: "1px solid var(--line)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  borderRadius: "3px",
                }}
              >
                {cancerData.cancer_types_2019.slice(0, 10).map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.type} ({t.share_pct}%)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* SVG Line Chart */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg viewBox="0 0 720 220" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
            {/* Gridlines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = 25 + i * 40;
              const valLabel =
                trendMetric === "rate"
                  ? `${(160 - i * 10).toFixed(0)}/100k`
                  : `${((meta.global_deaths_2019 * (1.1 - i * 0.2)) / 1e6).toFixed(1)}M`;

              return (
                <g key={i}>
                  <line x1="50" y1={y} x2="690" y2={y} stroke="var(--line)" strokeDasharray="2 2" strokeWidth="0.7" />
                  <text x="44" y={y + 3} fill="var(--dim)" fontSize="8" textAnchor="end" fontFamily="monospace">
                    {valLabel}
                  </text>
                </g>
              );
            })}

            {/* X Axis Years */}
            {[1990, 1995, 2000, 2005, 2010, 2015, 2019].map((yr) => {
              const x = 50 + ((yr - minYear) / (maxYear - minYear)) * 640;
              return (
                <text key={yr} x={x} y="200" fill="var(--dim)" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
                  {yr}
                </text>
              );
            })}

            {/* Main Curve */}
            {trendMetric === "rate" ? (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trendPointData.map((d) => `${d.x},${d.rateY}`).join(" ")}
              />
            ) : (
              <polyline
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trendPointData.map((d) => `${d.x},${d.countY}`).join(" ")}
              />
            )}

            {/* Active Hover Crosshair Line & Glowing Point */}
            {activeHoverPoint && (
              <>
                <line
                  x1={activeHoverPoint.x}
                  y1="20"
                  x2={activeHoverPoint.x}
                  y2="190"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.85"
                />
                <circle
                  cx={activeHoverPoint.x}
                  cy={trendMetric === "rate" ? activeHoverPoint.rateY : activeHoverPoint.countY}
                  r="7"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  opacity="0.65"
                />
                <circle
                  cx={activeHoverPoint.x}
                  cy={trendMetric === "rate" ? activeHoverPoint.rateY : activeHoverPoint.countY}
                  r="3.5"
                  fill={trendMetric === "rate" ? "#10b981" : "var(--accent)"}
                  stroke="#fff"
                  strokeWidth="1.5"
                />

                {/* Floating Sneak Peak SVG Tooltip Box */}
                {(() => {
                  const curY = trendMetric === "rate" ? activeHoverPoint.rateY : activeHoverPoint.countY;
                  const tooltipW = 154;
                  const tooltipH = 50;
                  const tooltipX = activeHoverPoint.x > 530 ? activeHoverPoint.x - tooltipW - 10 : activeHoverPoint.x + 12;
                  const tooltipY = Math.max(20, Math.min(135, curY - 24));

                  const valDisplay =
                    trendMetric === "rate"
                      ? `${activeHoverPoint.rateVal} /100k`
                      : `${(activeHoverPoint.countVal / 1e6).toFixed(2)}M Deaths`;

                  const deltaVal = trendMetric === "rate" ? activeHoverPoint.rateDelta : activeHoverPoint.countDelta;
                  const deltaFormatted = deltaVal > 0 ? `+${deltaVal.toFixed(1)}%` : `${deltaVal.toFixed(1)}%`;
                  const deltaColor = trendMetric === "rate" ? (deltaVal <= 0 ? "#10b981" : "#f43f5e") : "var(--accent)";

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
                        opacity="0.95"
                      />
                      <text x={tooltipX + 10} y={tooltipY + 16} fill="var(--dim)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                        YEAR {activeHoverPoint.year} SNEAK PEEK
                      </text>
                      <text x={tooltipX + 10} y={tooltipY + 31} fill="var(--ink-heading)" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        {valDisplay}
                      </text>
                      <text x={tooltipX + 10} y={tooltipY + 43} fill={deltaColor} fontSize="8" fontFamily="monospace">
                        {deltaFormatted} vs 1990 Baseline
                      </text>
                    </g>
                  );
                })()}
              </>
            )}

            {/* Invisible Hover Hitbox Columns for seamless cursor tracking */}
            {trendPointData.map((p) => {
              const stepWidth = 640 / (trendPointData.length - 1);
              return (
                <rect
                  key={p.year}
                  x={p.x - stepWidth / 2}
                  y="15"
                  width={stepWidth}
                  height="180"
                  fill="transparent"
                  style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setHoveredTrendYear(p.year)}
                />
              );
            })}
          </svg>
        </div>

        {/* Persistent Telemetry Sneak Peak Bar */}
        <div style={{ marginTop: "14px", padding: "10px 14px", background: "var(--surface-secondary)", border: "1px solid var(--line)", borderRadius: "3px", minHeight: "48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="mono" style={{ fontSize: "9px", color: "var(--accent)" }}>
              HISTORICAL TELEMETRY SNEAK PEEK • YEAR {activeHoverPoint.year}
            </span>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--ink)", fontFamily: "monospace" }}>
              <strong>
                {trendMetric === "rate"
                  ? `Age-Standardized Rate: ${activeHoverPoint.rateVal} deaths per 100k`
                  : `${selectedCancer}: ${(activeHoverPoint.countVal / 1e6).toFixed(3)}M Fatalities`}
              </strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
              Total Global Deaths: <strong>{(activeHoverPoint.totalDeaths / 1e6).toFixed(2)}M</strong>
            </span>
            <span
              style={{
                fontSize: "9px",
                padding: "3px 8px",
                borderRadius: "2px",
                background:
                  (trendMetric === "rate" ? activeHoverPoint.rateDelta <= 0 : activeHoverPoint.countDelta <= 0)
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(244, 63, 94, 0.2)",
                color:
                  (trendMetric === "rate" ? activeHoverPoint.rateDelta <= 0 : activeHoverPoint.countDelta <= 0)
                    ? "#10b981"
                    : "#f43f5e",
                fontFamily: "monospace",
              }}
            >
              {trendMetric === "rate"
                ? `${activeHoverPoint.rateDelta <= 0 ? "▼" : "▲"} ${Math.abs(activeHoverPoint.rateDelta).toFixed(1)}% vs 1990`
                : `▲ +${activeHoverPoint.countDelta.toFixed(1)}% vs 1990`}
            </span>
          </div>
        </div>

        <p className="mono" style={{ fontSize: "10px", color: "var(--dim)", marginTop: "8px", marginBottom: 0 }}>
          💡 Hover anywhere across the chart to inspect yearly sneak-peek telemetry, mortality rates, and variance vs 1990 baseline.
        </p>
      </div>
    </section>
  );
}

export default CancerTrendAsdrShowcase;
