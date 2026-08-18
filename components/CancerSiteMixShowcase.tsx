"use client";

import React, { useState, useMemo } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerSiteMixShowcase() {
  const [hoveredDonutIndex, setHoveredDonutIndex] = useState<number | null>(null);
  const [siteBarFilter, setSiteBarFilter] = useState<"top10" | "digestive" | "all29">("top10");
  const [siteSearch, setSiteSearch] = useState<string>("");
  const [hoveredSite, setHoveredSite] = useState<any | null>(null);

  const meta = cancerData.metadata;

  // Donut slices setup (Top 6 distinct sites + Other 23 sites)
  const donutData = useMemo(() => {
    const top6 = cancerData.cancer_types_2019.slice(0, 6);
    const top6Share = top6.reduce((sum, d) => sum + d.share_pct, 0);
    const top6Deaths = top6.reduce((sum, d) => sum + d.deaths, 0);
    const otherShare = Math.max(0, 100 - top6Share);
    const otherDeaths = meta.global_deaths_2019 - top6Deaths;

    const colors = ["#38bdf8", "var(--accent)", "#f59e0b", "#10b981", "#a855f7", "#ec4899", "var(--dim)"];

    return [
      ...top6.map((item, idx) => ({ ...item, color: colors[idx % colors.length] })),
      { type: "Other 23 Sites", deaths: otherDeaths, share_pct: parseFloat(otherShare.toFixed(1)), color: colors[6] },
    ];
  }, [meta.global_deaths_2019]);

  // Donut Arc calculation helper
  const donutPaths = useMemo(() => {
    let currentAngle = -Math.PI / 2;
    return donutData.map((slice) => {
      const sliceAngle = (slice.share_pct / 100) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const rOuter = 85;
      const rInner = 56;
      const cx = 100;
      const cy = 100;

      const x1 = cx + rOuter * Math.cos(startAngle);
      const y1 = cy + rOuter * Math.sin(startAngle);
      const x2 = cx + rOuter * Math.cos(endAngle);
      const y2 = cy + rOuter * Math.sin(endAngle);

      const x3 = cx + rInner * Math.cos(endAngle);
      const y3 = cy + rInner * Math.sin(endAngle);
      const x4 = cx + rInner * Math.cos(startAngle);
      const y4 = cy + rInner * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;

      return {
        ...slice,
        pathData,
      };
    });
  }, [donutData]);

  // Filtered list for the 29-Cancer Taxonomy Distribution
  const filteredSiteList = useMemo(() => {
    let list = cancerData.cancer_types_2019;

    if (siteBarFilter === "top10") {
      list = list.slice(0, 10);
    } else if (siteBarFilter === "digestive") {
      const digestiveNames = ["Colorectal", "Stomach", "Liver", "Esophageal", "Pancreatic", "Gallbladder & Biliary"];
      list = list.filter((c) => digestiveNames.some((d) => c.type.toLowerCase().includes(d.toLowerCase())));
    }

    if (siteSearch.trim()) {
      const q = siteSearch.toLowerCase().trim();
      list = list.filter((c) => c.type.toLowerCase().includes(q));
    }

    return list;
  }, [siteBarFilter, siteSearch]);

  const maxSiteDeaths = cancerData.cancer_types_2019[0]?.deaths || 2042640;

  return (
    <section
      id="mortality-site-mix"
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
            04. Malignancy Site Mix & Taxonomy Spectrum
          </span>
          <h3 style={{ margin: "4px 0 0", color: "var(--ink-heading)", fontSize: "18px" }}>
            Global Cancer Mortality Composition (2019 Surveillance)
          </h3>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "12px", maxWidth: "680px" }}>
            Decomposing <strong>9.67 Million fatalities</strong> across 29 malignancy classifications. Interactive dynamic Donut Slice Analyzer and 29-Neoplasm Taxonomy Distribution Bar Graph with direct hover telemetry.
          </p>
        </div>
        <span className="mono" style={{ fontSize: "10px", color: "var(--dim)", background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: "3px", border: "1px solid var(--line)" }}>
          PANEL: 29 MALIGNANCY SITES
        </span>
      </div>

      {/* 4 KPI Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "22px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>TOP 3 COMBINED SHARE</span>
          <strong style={{ display: "block", fontSize: "20px", color: "var(--ink-heading)", fontFamily: "monospace", margin: "3px 0" }}>
            42.2%
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "var(--accent)" }}>
            4.09M Deaths (Lung + Colon + Stomach)
          </span>
        </div>

        <div style={{ background: "rgba(56, 189, 248, 0.06)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "#38bdf8" }}>#1 DOMINANT MALIGNANCY</span>
          <strong style={{ display: "block", fontSize: "20px", color: "#38bdf8", fontFamily: "monospace", margin: "3px 0" }}>
            2.04M
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "#38bdf8" }}>
            Lung & Bronchus (21.1% Global Share)
          </span>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>DIGESTIVE SYSTEM SITES</span>
          <strong style={{ display: "block", fontSize: "20px", color: "#f59e0b", fontFamily: "monospace", margin: "3px 0" }}>
            3.32M
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "#f59e0b" }}>
            34.3% Total (5 Major Organs)
          </span>
        </div>

        <div style={{ background: "rgba(244, 63, 94, 0.06)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "12px", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "#f43f5e" }}>FASTEST 30-YR SURGE</span>
          <strong style={{ display: "block", fontSize: "20px", color: "#f43f5e", fontFamily: "monospace", margin: "3px 0" }}>
            +168.2%
          </strong>
          <span className="mono" style={{ fontSize: "10px", color: "#f43f5e" }}>
            Pancreatic (198k ➔ 531k Deaths)
          </span>
        </div>
      </div>

      {/* Top Graphic Section: Donut + Synchronized Proportional Bar Graph */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(250px, 320px) 1fr", gap: "24px", alignItems: "center", marginBottom: "24px", background: "rgba(0,0,0,0.25)", padding: "16px", borderRadius: "4px", border: "1px solid var(--line)" }}>
        {/* Donut Graphic with Dynamic Center Display */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <svg viewBox="0 0 200 200" style={{ width: "230px", height: "230px", overflow: "visible" }}>
            {donutPaths.map((slice, idx) => {
              const isHovered = hoveredDonutIndex === idx;
              return (
                <path
                  key={`${slice.type}-${idx}`}
                  d={slice.pathData}
                  fill={slice.color}
                  stroke={isHovered ? "#fff" : "var(--surface-secondary)"}
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  style={{
                    cursor: "pointer",
                    opacity: hoveredDonutIndex === null || isHovered ? 1 : 0.35,
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    transformOrigin: "100px 100px",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={() => setHoveredDonutIndex(idx)}
                  onMouseLeave={() => setHoveredDonutIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Dynamic Metric Display */}
          {hoveredDonutIndex !== null && donutData[hoveredDonutIndex] ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                width: "120px",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: "8.5px",
                  color: donutData[hoveredDonutIndex].color,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  display: "block",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {donutData[hoveredDonutIndex].type}
              </span>
              <strong style={{ display: "block", fontSize: "16px", color: "var(--ink-heading)", fontFamily: "monospace", margin: "2px 0" }}>
                {(donutData[hoveredDonutIndex].deaths / 1e6).toFixed(2)}M
              </strong>
              <span className="mono" style={{ fontSize: "9px", color: donutData[hoveredDonutIndex].color, fontWeight: "bold" }}>
                {donutData[hoveredDonutIndex].share_pct}% SHARE
              </span>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                width: "110px",
              }}
            >
              <span className="mono" style={{ fontSize: "8.5px", color: "var(--dim)" }}>GLOBAL TOTAL</span>
              <strong style={{ display: "block", fontSize: "16px", color: "var(--ink-heading)", fontFamily: "monospace" }}>9.67M</strong>
              <span className="mono" style={{ fontSize: "8.5px", color: "var(--accent)" }}>FATALITIES</span>
            </div>
          )}
        </div>

        {/* Right Side: Proportional Spectrum Bar Graph */}
        <div style={{ display: "grid", gap: "7px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>
              DOMINANT ONCOLOGY SITE DISTRIBUTION (2019)
            </span>
            <span className="mono" style={{ fontSize: "9px", color: "var(--accent)" }}>
              HOVER TO SYNC DONUT
            </span>
          </div>
          {donutData.map((d, idx) => {
            const isHovered = hoveredDonutIndex === idx;
            const barWidthPct = (d.deaths / (donutData[0].deaths * 1.05)) * 100;
            return (
              <div
                key={`${d.type}-${idx}`}
                onMouseEnter={() => setHoveredDonutIndex(idx)}
                onMouseLeave={() => setHoveredDonutIndex(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 65px",
                  gap: "10px",
                  alignItems: "center",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  padding: "5px 9px",
                  borderRadius: "3px",
                  backgroundColor: isHovered ? "rgba(255, 255, 255, 0.05)" : "transparent",
                  border: isHovered ? `1px solid ${d.color}` : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    color: isHovered ? d.color : "var(--ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: isHovered ? "bold" : "normal",
                  }}
                >
                  {d.type}
                </span>
                <div style={{ height: "9px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${barWidthPct}%`,
                      background: d.color,
                      borderRadius: "2px",
                      boxShadow: isHovered ? `0 0 10px ${d.color}` : "none",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <strong style={{ textAlign: "right", color: isHovered ? d.color : "var(--accent)" }}>
                  {d.share_pct}%
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Full 29-Neoplasm Taxonomy Distribution Bar Graph */}
      <div>
        {/* Graphical Taxonomy Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setSiteBarFilter("top10")}
              style={{
                background: siteBarFilter === "top10" ? "var(--accent)" : "var(--panel)",
                color: siteBarFilter === "top10" ? "#000" : "var(--muted)",
                border: "1px solid var(--line)",
                padding: "5px 10px",
                fontSize: "10px",
                fontFamily: "monospace",
                borderRadius: "2px",
                cursor: "pointer",
                fontWeight: siteBarFilter === "top10" ? "bold" : "normal",
              }}
            >
              Top 10 Lethal Sites
            </button>
            <button
              onClick={() => setSiteBarFilter("digestive")}
              style={{
                background: siteBarFilter === "digestive" ? "var(--accent)" : "var(--panel)",
                color: siteBarFilter === "digestive" ? "#000" : "var(--muted)",
                border: "1px solid var(--line)",
                padding: "5px 10px",
                fontSize: "10px",
                fontFamily: "monospace",
                borderRadius: "2px",
                cursor: "pointer",
                fontWeight: siteBarFilter === "digestive" ? "bold" : "normal",
              }}
            >
              Digestive System Track
            </button>
            <button
              onClick={() => setSiteBarFilter("all29")}
              style={{
                background: siteBarFilter === "all29" ? "var(--accent)" : "var(--panel)",
                color: siteBarFilter === "all29" ? "#000" : "var(--muted)",
                border: "1px solid var(--line)",
                padding: "5px 10px",
                fontSize: "10px",
                fontFamily: "monospace",
                borderRadius: "2px",
                cursor: "pointer",
                fontWeight: siteBarFilter === "all29" ? "bold" : "normal",
              }}
            >
              All 29 Neoplasms
            </button>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
            <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>Search:</span>
            <input
              type="text"
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              placeholder="Filter cancer name..."
              style={{
                backgroundColor: "var(--surface-secondary)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                padding: "3px 8px",
                fontSize: "11px",
                fontFamily: "monospace",
                borderRadius: "2px",
                width: "150px",
              }}
            />
          </label>
        </div>

        {/* Graphical Bar Spectrum Display */}
        <div
          style={{
            display: "grid",
            gap: "7px",
            maxHeight: "360px",
            overflowY: "auto",
            paddingRight: "6px",
            scrollbarWidth: "thin",
          }}
        >
          {filteredSiteList.map((t) => {
            const isHovered = hoveredSite?.type === t.type;
            const barPct = (t.deaths / maxSiteDeaths) * 100;
            const rankNum = cancerData.cancer_types_2019.findIndex((c) => c.type === t.type) + 1;

            return (
              <div
                key={t.type}
                onMouseEnter={() => setHoveredSite(t)}
                onMouseLeave={() => setHoveredSite(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "35px 180px 1fr 90px 60px",
                  gap: "10px",
                  alignItems: "center",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  backgroundColor: isHovered ? "var(--surface-secondary)" : "rgba(255, 255, 255, 0.015)",
                  border: isHovered ? "1px solid var(--accent)" : "1px solid rgba(255, 255, 255, 0.04)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ color: "var(--dim)", fontSize: "10px" }}>#{rankNum}</span>
                <span
                  style={{
                    color: isHovered ? "var(--accent)" : "var(--ink)",
                    fontWeight: isHovered ? "bold" : "normal",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.type}
                </span>
                <div style={{ height: "10px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "2px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${barPct}%`,
                      background: rankNum === 1 ? "#38bdf8" : rankNum <= 5 ? "var(--accent)" : "rgba(255, 255, 255, 0.35)",
                      borderRadius: "2px",
                      boxShadow: isHovered ? "0 0 10px var(--accent)" : "none",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <span style={{ textAlign: "right", color: "var(--dim)", fontSize: "10px" }}>
                  {t.deaths.toLocaleString()}
                </span>
                <strong style={{ textAlign: "right", color: isHovered ? "var(--accent)" : "var(--ink)" }}>
                  {t.share_pct}%
                </strong>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CancerSiteMixShowcase;
