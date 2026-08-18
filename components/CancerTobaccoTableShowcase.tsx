"use client";

import React, { useState, useMemo } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerTobaccoTableShowcase() {
  const [activeTab, setActiveTab] = useState<"milestones" | "countries">("milestones");
  const [showFull30Years, setShowFull30Years] = useState(false);

  const longitudinalSeries = (cancerData as any).tobacco_comparison_longitudinal || [];
  const topCountries = (cancerData as any).top_countries_tobacco_2019?.slice(0, 10) || [];

  // Filtered longitudinal rows (defaults to 7 clean 5-year milestones)
  const visibleYears = useMemo(() => {
    if (showFull30Years) return longitudinalSeries;
    return longitudinalSeries.filter((d: any) => [1990, 1995, 2000, 2005, 2010, 2015, 2019].includes(d.year));
  }, [longitudinalSeries, showFull30Years]);

  return (
    <section className="case-stage cancer-tobacco-table-stage" id="tobacco-matrix" style={{ margin: "24px 0 36px", width: "100%" }}>
      {/* Surface Card Container */}
      <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "18px 20px", borderRadius: "6px", width: "100%" }}>
        {/* Header & Minimal Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Panel Summary • 1990–2019
            </span>
            <h4 style={{ margin: "2px 0 0", fontSize: "15px", color: "var(--ink-heading)" }}>
              Tobacco Attribution Benchmarks & Country Rankings
            </h4>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("milestones")}
              className={`mono ${activeTab === "milestones" ? "active" : ""}`}
              style={{
                padding: "5px 11px",
                fontSize: "11px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                cursor: "pointer",
                background: activeTab === "milestones" ? "var(--accent)" : "var(--panel)",
                color: activeTab === "milestones" ? "#ffffff" : "var(--muted)",
                fontWeight: activeTab === "milestones" ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              Longitudinal Benchmarks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("countries")}
              className={`mono ${activeTab === "countries" ? "active" : ""}`}
              style={{
                padding: "5px 11px",
                fontSize: "11px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                cursor: "pointer",
                background: activeTab === "countries" ? "var(--accent)" : "var(--panel)",
                color: activeTab === "countries" ? "#ffffff" : "var(--muted)",
                fontWeight: activeTab === "countries" ? 600 : 400,
                transition: "all 0.15s ease",
              }}
            >
              Top 10 Sovereign Nations
            </button>
          </div>
        </div>

        {/* TAB 1: Streamlined Longitudinal Milestones Table */}
        {activeTab === "milestones" && (
          <div>
            <div className="table-scroll" style={{ border: "1px solid var(--line)", borderRadius: "4px", backgroundColor: "var(--panel)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
                    <th style={{ padding: "9px 14px", textAlign: "left", color: "var(--ink-heading)", font: "10px monospace", textTransform: "uppercase" }}>
                      Timeline
                    </th>
                    <th style={{ padding: "9px 14px", textAlign: "right", color: "var(--ink-heading)", font: "10px monospace", textTransform: "uppercase" }}>
                      Total Cancer Deaths
                    </th>
                    <th style={{ padding: "9px 14px", textAlign: "right", color: "#f43f5e", font: "10px monospace", textTransform: "uppercase" }}>
                      Tobacco-Attributed
                    </th>
                    <th style={{ padding: "9px 14px", textAlign: "right", color: "#38bdf8", font: "10px monospace", textTransform: "uppercase" }}>
                      Lung Malignancies
                    </th>
                    <th style={{ padding: "9px 14px", textAlign: "right", color: "#f59e0b", font: "10px monospace", textTransform: "uppercase" }}>
                      Smoking Share (%)
                    </th>
                    <th style={{ padding: "9px 14px", textAlign: "right", color: "var(--accent)", font: "10px monospace", textTransform: "uppercase" }}>
                      Growth vs 1990
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleYears.map((row: any, rIdx: number) => {
                    const isBaseline = row.year === 1990;
                    const isEnd = row.year === 2019;
                    const growthPct = row.year === 1990 ? "Baseline" : `+${(row.tobacco_indexed_1990 - 100).toFixed(1)}% ▲`;

                    return (
                      <tr
                        key={row.year}
                        style={{
                          borderBottom: rIdx === visibleYears.length - 1 ? "none" : "1px solid var(--line)",
                          backgroundColor: isEnd
                            ? "rgba(244, 63, 94, 0.05)"
                            : isBaseline
                            ? "rgba(255, 255, 255, 0.03)"
                            : rIdx % 2 === 0
                            ? "rgba(255, 255, 255, 0.012)"
                            : "transparent",
                        }}
                      >
                        <td style={{ padding: "8px 14px" }}>
                          <span className="mono" style={{ fontWeight: 700, color: isEnd ? "var(--accent)" : isBaseline ? "#ffffff" : "var(--ink)" }}>
                            {row.year} {isBaseline && "(Base)"} {isEnd && "(Latest)"}
                          </span>
                        </td>
                        <td className="mono" style={{ padding: "8px 14px", textAlign: "right", color: "#ffffff", fontWeight: 600 }}>
                          {(row.total_cancer_deaths / 1e6).toFixed(2)}M
                        </td>
                        <td className="mono" style={{ padding: "8px 14px", textAlign: "right", color: "#f43f5e", fontWeight: 600 }}>
                          {(row.tobacco_cancer_deaths / 1e6).toFixed(2)}M
                        </td>
                        <td className="mono" style={{ padding: "8px 14px", textAlign: "right", color: "#38bdf8" }}>
                          {(row.lung_cancer_deaths / 1e6).toFixed(2)}M
                        </td>
                        <td className="mono" style={{ padding: "8px 14px", textAlign: "right", color: "#f59e0b", fontWeight: 700 }}>
                          {row.tobacco_share_pct.toFixed(2)}%
                        </td>
                        <td className="mono" style={{ padding: "8px 14px", textAlign: "right" }}>
                          <span
                            style={{
                              padding: "2px 6px",
                              borderRadius: 2,
                              background: isBaseline ? "rgba(255,255,255,0.04)" : "rgba(244,63,94,0.08)",
                              color: isBaseline ? "var(--dim)" : "#f43f5e",
                              border: isBaseline ? "1px solid var(--line)" : "1px solid rgba(244,63,94,0.2)",
                              fontSize: "10px",
                              fontWeight: 600,
                            }}
                          >
                            {growthPct}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Minimal Toggle for Full 30-Year View */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setShowFull30Years(!showFull30Years)}
                className="mono"
                style={{
                  fontSize: "10px",
                  color: "var(--dim)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                  textDecoration: "underline",
                }}
              >
                {showFull30Years ? "← Collapse to 5-Year Benchmarks" : "View all 30 annual rows (1990–2019) →"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Minimal Top 10 Countries Table */}
        {activeTab === "countries" && (
          <div className="table-scroll" style={{ border: "1px solid var(--line)", borderRadius: "4px", backgroundColor: "var(--panel)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
                  <th style={{ padding: "9px 14px", textAlign: "left", color: "var(--ink-heading)", font: "10px monospace", textTransform: "uppercase", width: "45px" }}>
                    Rank
                  </th>
                  <th style={{ padding: "9px 14px", textAlign: "left", color: "var(--ink-heading)", font: "10px monospace", textTransform: "uppercase" }}>
                    Sovereign Nation
                  </th>
                  <th style={{ padding: "9px 14px", textAlign: "right", color: "#f43f5e", font: "10px monospace", textTransform: "uppercase" }}>
                    Smoking Attributable Share
                  </th>
                  <th style={{ padding: "9px 14px", textAlign: "left", color: "var(--dim)", font: "10px monospace", textTransform: "uppercase", width: "180px" }}>
                    Share Bar
                  </th>
                  <th style={{ padding: "9px 14px", textAlign: "right", color: "var(--accent)", font: "10px monospace", textTransform: "uppercase" }}>
                    vs Global (25.7%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCountries.map((c: any, cIdx: number) => {
                  const barPct = (c.tobacco_share_pct / 45) * 100;
                  return (
                    <tr
                      key={c.code || c.country}
                      style={{
                        borderBottom: cIdx === topCountries.length - 1 ? "none" : "1px solid var(--line)",
                        backgroundColor: cIdx % 2 === 0 ? "rgba(255, 255, 255, 0.012)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "8px 14px" }}>
                        <span className="mono" style={{ fontSize: "10px", color: c.rank <= 3 ? "var(--accent)" : "var(--dim)", fontWeight: 700 }}>
                          #{String(c.rank).padStart(2, "0")}
                        </span>
                      </td>
                      <td style={{ padding: "8px 14px", color: "var(--ink-heading)", fontWeight: 600 }}>
                        {c.country} <span className="mono" style={{ color: "var(--dim)", fontSize: "10px", fontWeight: 400 }}>({c.code})</span>
                      </td>
                      <td className="mono" style={{ padding: "8px 14px", textAlign: "right", color: "#f43f5e", fontWeight: 700 }}>
                        {c.tobacco_share_pct.toFixed(2)}%
                      </td>
                      <td style={{ padding: "8px 14px" }}>
                        <div style={{ height: "5px", width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${barPct}%`,
                              backgroundColor: c.tobacco_share_pct >= 35 ? "#f43f5e" : "#f59e0b",
                              borderRadius: "3px",
                            }}
                          />
                        </div>
                      </td>
                      <td className="mono" style={{ padding: "8px 14px", textAlign: "right" }}>
                        <span style={{ padding: "2px 6px", borderRadius: 2, background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)", fontSize: "10px", fontWeight: 600 }}>
                          +{c.delta_vs_world}% ▲
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
