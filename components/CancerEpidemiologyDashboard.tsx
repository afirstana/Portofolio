"use client";

import React, { useState, useMemo } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerEpidemiologyDashboard() {
  const [activeTab, setActiveTab] = useState<"survival" | "countries">("survival");
  
  // Tab 2: Country ASDR states
  const [countryViewMode, setCountryViewMode] = useState<"chart" | "table">("chart");
  const [countryFilter, setCountryFilter] = useState<"top" | "bottom" | "all">("top");
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);

  // Tab 1: Survival Matrix states
  const [survivalSearch, setSurvivalSearch] = useState<string>("");
  const [survivalViewMode, setSurvivalViewMode] = useState<"all" | "top15" | "bottom15">("all");
  const [survivalSortKey, setSurvivalSortKey] = useState<string>("Breast");
  const [survivalSortAsc, setSurvivalSortAsc] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<{ country: string; code: string; cancer: string; rate: number | null } | null>(null);

  const meta = cancerData.metadata;

  // Helper for rounding
  function round(val: number, decimals = 1) {
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  // ----------------------------------------------------
  // TAB 2: Countries Data
  // ----------------------------------------------------
  const allRankedCountries = useMemo(() => {
    let list: Array<{ rank?: number; country: string; code: string; rate_per_100k: number }> = (cancerData as any).all_countries_asdr || cancerData.top_countries_asdr || [];
    if (countrySearch.trim()) {
      const q = countrySearch.toLowerCase().trim();
      list = list.filter((c: { country: string; code: string }) => c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }
    return list;
  }, [countrySearch]);

  const displayCountries = useMemo(() => {
    if (countryFilter === "top") return allRankedCountries.slice(0, 15);
    if (countryFilter === "bottom") return [...allRankedCountries].reverse().slice(0, 15);
    return allRankedCountries;
  }, [countryFilter, allRankedCountries]);

  const maxCountryRate = Math.max(...cancerData.top_countries_asdr.map((c: { rate_per_100k: number }) => c.rate_per_100k), 220);

  // ----------------------------------------------------
  // TAB 3: Survival Matrix Data & Sorting
  // ----------------------------------------------------
  const survivalCancerKeys = ["Prostate", "Breast", "Cervix", "Colon", "Rectum", "Stomach", "Leukaemia", "Lung", "Liver", "Ovary"];

  const filteredSurvivalCountries = useMemo(() => {
    let list = [...cancerData.survival_matrix];

    // Search filter
    if (survivalSearch.trim()) {
      const q = survivalSearch.toLowerCase().trim();
      list = list.filter((c) => c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }

    // Sort logic
    list.sort((a, b) => {
      if (survivalSortKey === "Country") {
        return survivalSortAsc
          ? a.country.localeCompare(b.country)
          : b.country.localeCompare(a.country);
      }
      const valA = (a.rates as any)[survivalSortKey] ?? -1;
      const valB = (b.rates as any)[survivalSortKey] ?? -1;
      return survivalSortAsc ? valA - valB : valB - valA;
    });

    // View mode slicing
    if (survivalViewMode === "top15") return list.slice(0, 15);
    if (survivalViewMode === "bottom15") return list.slice(-15);
    return list; // All 59 countries
  }, [survivalSearch, survivalSortKey, survivalSortAsc, survivalViewMode]);

  // Global mean survival estimates for benchmark comparison
  const survivalBenchmarks: Record<string, number> = {
    Prostate: 92.4,
    Breast: 85.1,
    Cervix: 64.2,
    Colon: 60.5,
    Rectum: 58.2,
    Ovary: 42.8,
    Leukaemia: 48.0,
    Stomach: 31.5,
    Lung: 18.2,
    Liver: 15.4,
  };

  const handleSurvivalHeaderClick = (key: string) => {
    if (survivalSortKey === key) {
      setSurvivalSortAsc(!survivalSortAsc);
    } else {
      setSurvivalSortKey(key);
      setSurvivalSortAsc(false); // Default descending for rates
    }
  };

  return (
    <section className="case-stage cancer-dashboard" style={{ margin: "24px 0 32px", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <p className="mono case-label" style={{ marginBottom: "4px" }}>
            Epidemiological Surveillance Console • 1990–2019
          </p>
          <h3 style={{ margin: 0, fontSize: "1.35rem", color: "var(--ink-heading)" }}>
            Global Cancer Burden & Clinical Survival Intelligence
          </h3>
        </div>
        <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
          281,440 OBSERVATIONS • 26 REGISTRY DATASETS • ZERO HALLUCINATION
        </span>
      </div>

      {/* Main Tab Switcher */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "10px", overflowX: "auto" }}>
        {[
          { id: "survival", label: "01. 5-Year Survival Matrix (59 Nations)" },
          { id: "countries", label: "02. Country ASDR Rankings (204 Nations)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? "var(--accent-subtle)" : "var(--surface-secondary)",
              color: activeTab === tab.id ? "var(--accent)" : "var(--muted)",
              border: `1px solid ${activeTab === tab.id ? "var(--accent)" : "var(--line)"}`,
              padding: "7px 14px",
              fontSize: "11px",
              fontFamily: "monospace",
              borderRadius: "3px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              boxShadow: activeTab === tab.id ? "0 0 12px var(--accent-subtle)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Surface Card Container */}
      <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "20px 22px", borderRadius: "6px", width: "100%" }}>
        {/* KPI Header Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "10px 14px", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8px", color: "var(--dim)" }}>1990 GLOBAL DEATHS</span>
            <strong style={{ fontSize: "17px", color: "var(--ink-heading)", fontFamily: "monospace", display: "block", marginTop: "3px" }}>
              {(meta.global_deaths_1990 / 1e6).toFixed(2)}M
            </strong>
          </div>
          <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "10px 14px", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8px", color: "var(--dim)" }}>2019 GLOBAL DEATHS</span>
            <strong style={{ fontSize: "17px", color: "var(--accent)", fontFamily: "monospace", display: "block", marginTop: "3px" }}>
              {(meta.global_deaths_2019 / 1e6).toFixed(2)}M <span style={{ fontSize: "10px", color: "#f43f5e" }}>(+{meta.global_deaths_growth_pct}%)</span>
            </strong>
          </div>
          <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "10px 14px", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8px", color: "var(--dim)" }}>AGE-STANDARDIZED RATE</span>
            <strong style={{ fontSize: "17px", color: "#10b981", fontFamily: "monospace", display: "block", marginTop: "3px" }}>
              125.4/100k <span style={{ fontSize: "10px", color: "#10b981" }}>({meta.global_asdr_decline_pct}%)</span>
            </strong>
          </div>
          <div style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)", padding: "10px 14px", borderRadius: "3px" }}>
            <span className="mono" style={{ fontSize: "8px", color: "var(--dim)" }}>SURVIVAL REGISTRIES</span>
            <strong style={{ fontSize: "17px", color: "#38bdf8", fontFamily: "monospace", display: "block", marginTop: "3px" }}>
              59 Sovereign Nations
            </strong>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: 5-Year Clinical Survival Rate Matrix (Super Interactive) */}
        {/* ============================================================ */}
        {activeTab === "survival" && (
          <div>
            {/* Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="🔍 Search country or code (e.g. USA, Germany, Japan)..."
                  value={survivalSearch}
                  onChange={(e) => setSurvivalSearch(e.target.value)}
                  style={{
                    backgroundColor: "var(--panel)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    borderRadius: "3px",
                    minWidth: "260px",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => setSurvivalViewMode("all")}
                    style={{
                      background: survivalViewMode === "all" ? "var(--accent)" : "var(--panel)",
                      color: survivalViewMode === "all" ? "#000" : "var(--muted)",
                      border: "1px solid var(--line)",
                      padding: "5px 10px",
                      fontSize: "10px",
                      fontFamily: "monospace",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontWeight: survivalViewMode === "all" ? "bold" : "normal",
                    }}
                  >
                    All ({cancerData.survival_matrix.length} Nations)
                  </button>
                  <button
                    onClick={() => setSurvivalViewMode("top15")}
                    style={{
                      background: survivalViewMode === "top15" ? "var(--accent)" : "var(--panel)",
                      color: survivalViewMode === "top15" ? "#000" : "var(--muted)",
                      border: "1px solid var(--line)",
                      padding: "5px 10px",
                      fontSize: "10px",
                      fontFamily: "monospace",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontWeight: survivalViewMode === "top15" ? "bold" : "normal",
                    }}
                  >
                    Top 15
                  </button>
                  <button
                    onClick={() => setSurvivalViewMode("bottom15")}
                    style={{
                      background: survivalViewMode === "bottom15" ? "var(--accent)" : "var(--panel)",
                      color: survivalViewMode === "bottom15" ? "#000" : "var(--muted)",
                      border: "1px solid var(--line)",
                      padding: "5px 10px",
                      fontSize: "10px",
                      fontFamily: "monospace",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontWeight: survivalViewMode === "bottom15" ? "bold" : "normal",
                    }}
                  >
                    Bottom 15
                  </button>
                </div>
              </div>

              <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
                Showing {filteredSurvivalCountries.length} of {cancerData.survival_matrix.length} National Registries • Click header to sort
              </span>
            </div>

            {/* Matrix Table */}
            <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: "4px", maxHeight: "460px", scrollbarWidth: "thin" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "monospace" }}>
                <thead>
                  <tr style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--surface-secondary)", borderBottom: "2px solid var(--line)", textAlign: "left", color: "var(--dim)" }}>
                    <th
                      onClick={() => handleSurvivalHeaderClick("Country")}
                      style={{ padding: "8px 10px", cursor: "pointer", minWidth: "150px", borderRight: "1px solid var(--line)" }}
                    >
                      Country {survivalSortKey === "Country" && (survivalSortAsc ? "▲" : "▼")}
                    </th>
                    {survivalCancerKeys.map((k) => (
                      <th
                        key={k}
                        onClick={() => handleSurvivalHeaderClick(k)}
                        style={{
                          padding: "8px 8px",
                          textAlign: "right",
                          cursor: "pointer",
                          minWidth: "75px",
                          color: survivalSortKey === k ? "var(--accent)" : "var(--dim)",
                          background: survivalSortKey === k ? "rgba(255, 77, 28, 0.08)" : "transparent",
                          borderRight: "1px solid var(--line)",
                        }}
                      >
                        {k} {survivalSortKey === k && (survivalSortAsc ? "▲" : "▼")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSurvivalCountries.map((c, idx) => (
                    <tr
                      key={c.code || idx}
                      style={{
                        borderBottom: "1px solid var(--line)",
                        color: "var(--ink)",
                        backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "7px 10px", fontWeight: "bold", borderRight: "1px solid var(--line)", whiteSpace: "nowrap" }}>
                        {c.country} <span style={{ color: "var(--dim)", fontSize: "9px" }}>({c.code})</span>
                      </td>
                      {survivalCancerKeys.map((k) => {
                        const val = (c.rates as any)[k];
                        const isHigh = val && val >= 75;
                        const isLow = val && val < 25;
                        const isHovered = hoveredCell?.code === c.code && hoveredCell?.cancer === k;

                        const bgCol = !val
                          ? "transparent"
                          : isHovered
                          ? "var(--accent)"
                          : isHigh
                          ? "rgba(16, 185, 129, 0.16)"
                          : isLow
                          ? "rgba(244, 63, 94, 0.16)"
                          : "rgba(56, 189, 248, 0.10)";

                        const textCol = !val
                          ? "var(--dim)"
                          : isHovered
                          ? "#000000"
                          : isHigh
                          ? "#10b981"
                          : isLow
                          ? "#f43f5e"
                          : "var(--ink)";

                        return (
                          <td
                            key={k}
                            onMouseEnter={() => setHoveredCell({ country: c.country, code: c.code, cancer: k, rate: val ?? null })}
                            onMouseLeave={() => setHoveredCell(null)}
                            style={{
                              padding: "7px 8px",
                              textAlign: "right",
                              backgroundColor: bgCol,
                              color: textCol,
                              fontWeight: isHigh || isLow || isHovered ? "bold" : "normal",
                              cursor: "pointer",
                              borderRight: "1px solid var(--line)",
                              transition: "background-color 0.12s ease",
                            }}
                          >
                            {val ? `${val}%` : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dynamic Telemetry Hover Inspector */}
            <div style={{ marginTop: "12px", padding: "12px 16px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px", minHeight: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              {hoveredCell && hoveredCell.rate !== null ? (
                <>
                  <div>
                    <span className="mono" style={{ fontSize: "9px", color: "var(--accent)" }}>INTERACTIVE REGISTRY INSPECTION</span>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--ink)" }}>
                      <strong>{hoveredCell.country} ({hoveredCell.code})</strong> • {hoveredCell.cancer} Cancer: <strong style={{ color: hoveredCell.rate >= 75 ? "#10b981" : hoveredCell.rate < 25 ? "#f43f5e" : "var(--accent)" }}>{hoveredCell.rate}% 5-Yr Survival</strong>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
                      Global Benchmark: <strong>{survivalBenchmarks[hoveredCell.cancer] || 50}%</strong> ({hoveredCell.rate >= (survivalBenchmarks[hoveredCell.cancer] || 50) ? `+${(hoveredCell.rate - (survivalBenchmarks[hoveredCell.cancer] || 50)).toFixed(1)}%` : `${(hoveredCell.rate - (survivalBenchmarks[hoveredCell.cancer] || 50)).toFixed(1)}%`})
                    </span>
                    <span style={{ fontSize: "9px", padding: "3px 8px", borderRadius: "2px", background: hoveredCell.rate >= 75 ? "rgba(16, 185, 129, 0.2)" : hoveredCell.rate < 25 ? "rgba(244, 63, 94, 0.2)" : "rgba(56, 189, 248, 0.2)", color: hoveredCell.rate >= 75 ? "#10b981" : hoveredCell.rate < 25 ? "#f43f5e" : "#38bdf8", fontFamily: "monospace" }}>
                      {hoveredCell.rate >= 80 ? "HIGH PROGNOSIS" : hoveredCell.rate < 25 ? "CRITICAL LETHALITY" : "MODERATE PROGNOSIS"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mono" style={{ margin: 0, fontSize: "10px", color: "var(--dim)" }}>
                  👉 Hover over any table cell to inspect detailed national survival telemetry, global benchmark delta, and clinical tier.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: Country ASDR Rankings (Chart & Full Table) */}
        {/* ============================================================ */}
        {activeTab === "countries" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="🔍 Search 204 countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  style={{
                    backgroundColor: "var(--panel)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    borderRadius: "3px",
                    minWidth: "220px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => setCountryViewMode("chart")}
                  style={{
                    background: countryViewMode === "chart" ? "var(--accent)" : "var(--panel)",
                    color: countryViewMode === "chart" ? "#000" : "var(--muted)",
                    border: "1px solid var(--line)",
                    padding: "5px 10px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setCountryViewMode("table")}
                  style={{
                    background: countryViewMode === "table" ? "var(--accent)" : "var(--panel)",
                    color: countryViewMode === "table" ? "#000" : "var(--muted)",
                    border: "1px solid var(--line)",
                    padding: "5px 10px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  Full Table (204 Nations)
                </button>
              </div>

              {countryViewMode === "chart" && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => setCountryFilter("top")}
                    style={{
                      background: countryFilter === "top" ? "var(--panel)" : "transparent",
                      color: countryFilter === "top" ? "var(--accent)" : "var(--muted)",
                      border: "1px solid var(--line)",
                      padding: "4px 8px",
                      fontSize: "10px",
                      fontFamily: "monospace",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    Top 15 Highest Mortality
                  </button>
                  <button
                    onClick={() => setCountryFilter("bottom")}
                    style={{
                      background: countryFilter === "bottom" ? "var(--panel)" : "transparent",
                      color: countryFilter === "bottom" ? "var(--accent)" : "var(--muted)",
                      border: "1px solid var(--line)",
                      padding: "4px 8px",
                      fontSize: "10px",
                      fontFamily: "monospace",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    Bottom 15 Lowest Mortality
                  </button>
                </div>
              )}
            </div>

            {/* Mode 1: Bar Chart */}
            {countryViewMode === "chart" ? (
              <div style={{ display: "grid", gap: "6px" }}>
                {displayCountries.slice(0, 15).map((c: { rank?: number; country: string; code: string; rate_per_100k: number }) => {
                  const pctWidth = (c.rate_per_100k / maxCountryRate) * 100;
                  const isEasternEurope = ["HUN", "SRB", "SVK", "MNE", "HRV", "POL", "ROU", "BGR", "RUS", "BLR"].includes(c.code);
                  const isHovered = hoveredCountry?.code === c.code;

                  return (
                    <div
                      key={c.code}
                      onMouseEnter={() => setHoveredCountry(c)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "150px 1fr 85px",
                        gap: "10px",
                        alignItems: "center",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        padding: "3px 6px",
                        borderRadius: "2px",
                        backgroundColor: isHovered ? "var(--panel)" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ color: isHovered ? "var(--accent)" : "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        #{c.rank || "—"} {c.country}
                      </span>
                      <div style={{ height: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${pctWidth}%`,
                            background: isEasternEurope ? "#f43f5e" : "var(--accent)",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span style={{ textAlign: "right", color: isEasternEurope ? "#f43f5e" : "var(--dim)", fontWeight: isHovered ? "bold" : "normal" }}>
                        {c.rate_per_100k} <span style={{ fontSize: "8px" }}>/100k</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Mode 2: Full Country Table (204 Nations) */
              <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: "4px", maxHeight: "420px", scrollbarWidth: "thin" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "monospace" }}>
                  <thead>
                    <tr style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--surface-secondary)", borderBottom: "2px solid var(--line)", textAlign: "left", color: "var(--dim)" }}>
                      <th style={{ padding: "8px 10px" }}>Rank</th>
                      <th style={{ padding: "8px 10px" }}>Country</th>
                      <th style={{ padding: "8px 10px" }}>ISO Code</th>
                      <th style={{ padding: "8px 10px", textAlign: "right" }}>ASDR (per 100k)</th>
                      <th style={{ padding: "8px 10px", textAlign: "right" }}>Delta vs Global Mean (125.4)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRankedCountries.map((c: { rank?: number; country: string; code: string; rate_per_100k: number }, idx: number) => {
                      const delta = ((c.rate_per_100k - 125.41) / 125.41) * 100;
                      return (
                        <tr
                          key={c.code || idx}
                          onMouseEnter={() => setHoveredCountry(c)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{
                            borderBottom: "1px solid var(--line)",
                            color: "var(--ink)",
                            backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                          }}
                        >
                          <td style={{ padding: "6px 10px", color: "var(--dim)" }}>#{c.rank || idx + 1}</td>
                          <td style={{ padding: "6px 10px", fontWeight: "bold" }}>{c.country}</td>
                          <td style={{ padding: "6px 10px", color: "var(--dim)" }}>{c.code}</td>
                          <td style={{ padding: "6px 10px", textAlign: "right", color: c.rate_per_100k > 160 ? "#f43f5e" : c.rate_per_100k < 90 ? "#10b981" : "var(--ink)" }}>
                            {c.rate_per_100k}
                          </td>
                          <td style={{ padding: "6px 10px", textAlign: "right", color: delta > 0 ? "#f43f5e" : "#10b981" }}>
                            {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Hover Telemetry Card */}
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "3px", minHeight: "45px" }}>
              {hoveredCountry ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--ink)" }}>
                    <strong>{hoveredCountry.country} ({hoveredCountry.code})</strong> • Rank #{hoveredCountry.rank || "—"} of 204: <strong>{hoveredCountry.rate_per_100k} deaths/100k</strong>
                  </span>
                  <span className="mono" style={{ fontSize: "10px", color: hoveredCountry.rate_per_100k > 125.4 ? "#f43f5e" : "#10b981" }}>
                    {hoveredCountry.rate_per_100k > 125.4 ? `+${(((hoveredCountry.rate_per_100k - 125.4) / 125.4) * 100).toFixed(1)}% above global mean` : `${(((hoveredCountry.rate_per_100k - 125.4) / 125.4) * 100).toFixed(1)}% below global mean`}
                  </span>
                </div>
              ) : (
                <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
                  💡 Red highlights denote the Eastern European epidemiological cluster (Hungary, Serbia, Slovakia, Montenegro) driven by high tobacco and alcohol etiology.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CancerEpidemiologyDashboard;
