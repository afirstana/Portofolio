"use client";

import { useMemo, useState } from "react";

type CountryRecord = {
  country: string;
  code: string;
  rate_per_100k: number;
  total_deaths: number;
  deaths_formatted: string;
  vs_global_pct: number;
  vs_global_label: string;
  region: string;
  top_cancer_cause: string;
  risk_factors: string;
  clinical_insight: string;
  screening_coverage: string;
  rank: number;
};

type SurvivalRecord = {
  cancer_type: string;
  survival_rate: number;
  prognosis: string;
  stage_1_survival: string;
  stage_4_survival: string;
  early_detection: string;
  primary_factor: string;
  clinical_takeaway: string;
};

type IncomeTier = {
  tier: string;
  countries_sample: string;
  crude_death_rate: number;
  age_standardized_rate: number;
  aging_population_pct: number;
  healthcare_access: string;
  screening_coverage: string;
  dominant_cancers: string;
  insight: string;
};

type Part2Data = {
  metadata: {
    title: string;
    source: string;
    country_count: number;
    survival_types_count: number;
  };
  countries: CountryRecord[];
  survival_matrix: SurvivalRecord[];
  income_tiers: IncomeTier[];
};

type ActiveView = "countries" | "survival" | "income";

export function DataPlaygroundPart2({ data }: { data: Part2Data }) {
  const [activeView, setActiveView] = useState<ActiveView>("countries");
  const [searchQuery, setSearchQuery] = useState("");

  // Country sorting state
  const [countrySortKey, setCountrySortKey] = useState<"rate_per_100k" | "total_deaths" | "country">("rate_per_100k");
  const [countrySortOrder, setCountrySortOrder] = useState<"asc" | "desc">("desc");

  // Survival sorting state
  const [survivalSortOrder, setSurvivalSortOrder] = useState<"asc" | "desc">("desc");

  // Hover state for interactive inspection (defaults to Indonesia or benchmark)
  const [hoveredCountry, setHoveredCountry] = useState<CountryRecord | null>(
    data.countries.find((c) => c.country === "Indonesia") || data.countries[0]
  );
  const [hoveredSurvival, setHoveredSurvival] = useState<SurvivalRecord | null>(
    data.survival_matrix.find((s) => s.cancer_type === "Lung Cancer") || data.survival_matrix[0]
  );
  const [hoveredIncome, setHoveredIncome] = useState<IncomeTier | null>(data.income_tiers[0]);

  // Filtered and sorted countries
  const filteredCountries = useMemo(() => {
    return data.countries
      .filter((c) => {
        const query = searchQuery.trim().toLowerCase();
        return c.country.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        const multiplier = countrySortOrder === "asc" ? 1 : -1;
        if (countrySortKey === "country") {
          return a.country.localeCompare(b.country) * multiplier;
        }
        return (a[countrySortKey] - b[countrySortKey]) * multiplier;
      });
  }, [data.countries, searchQuery, countrySortKey, countrySortOrder]);

  // Sorted survival matrix
  const sortedSurvival = useMemo(() => {
    return [...data.survival_matrix].sort((a, b) => {
      return survivalSortOrder === "asc"
        ? a.survival_rate - b.survival_rate
        : b.survival_rate - a.survival_rate;
    });
  }, [data.survival_matrix, survivalSortOrder]);

  const toggleCountrySort = (key: "rate_per_100k" | "total_deaths" | "country") => {
    if (countrySortKey === key) {
      setCountrySortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setCountrySortKey(key);
      setCountrySortOrder("desc");
    }
  };

  const getPrognosisColor = (prognosis: string) => {
    switch (prognosis) {
      case "Critical":
      case "Very Low":
        return "var(--accent)";
      default:
        return "#d4d4d8";
    }
  };

  return (
    <section id="playground-matrix" className="section playground-section" aria-labelledby="matrix-title">
      <div className="page-width">
        <p className="section-label mono">05.2 / Cross-national & survival intelligence</p>

        <div className="playground-heading">
          <h2 id="matrix-title" className="section-title">
            Global Benchmarks & Clinical Survival Matrix.
          </h2>
          <p className="body-copy">
            Multi-dimensional comparative intelligence. Trace country-by-country mortality disparities across <strong>35 nations</strong>, 
            the <strong>13x spread in 5-year survival rates</strong> across 15 cancer classes, and the non-linear relationship between GDP and cancer outcomes.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="playground-controls">
          <div className="filter-list" aria-label="Select analytical perspective">
            <button
              type="button"
              aria-pressed={activeView === "countries"}
              onClick={() => setActiveView("countries")}
            >
              01. Cross-Country Mortality (35 Nations)
            </button>
            <button
              type="button"
              aria-pressed={activeView === "survival"}
              onClick={() => setActiveView("survival")}
            >
              02. 5-Year Survival Matrix (15 Cancers)
            </button>
            <button
              type="button"
              aria-pressed={activeView === "income"}
              onClick={() => setActiveView("income")}
            >
              03. GDP & Economic Bracket Dynamics
            </button>
          </div>

          {activeView === "countries" && (
            <label className="search-field" style={{ margin: 0 }}>
              <span className="mono">Search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter country or code..."
                type="search"
                style={{ width: 180 }}
              />
            </label>
          )}
        </div>

        {/* Signal-Driven KPI Cards */}
        <div className="kpi-grid" aria-live="polite">
          <div>
            <span className="mono">HIGHEST 5-YEAR SURVIVAL</span>
            <strong>95.2%</strong>
            <p>Testicular & Thyroid cancer with early stage surgical excision.</p>
          </div>
          <div>
            <span className="mono" style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
              LOWEST 5-YEAR SURVIVAL (CRITICAL)
            </span>
            <strong style={{ color: "var(--accent)", textShadow: "0 0 24px rgba(255,77,28,0.2)" }}>
              7.2%
            </strong>
            <p>Pancreatic & Lung cancer due to late-stage asymptomatic onset.</p>
          </div>
          <div>
            <span className="mono">CROSS-COUNTRY VARIANCE</span>
            <strong>~3.8x</strong>
            <p>Age-standardized rates range from ~75 to 280+ per 100,000 population.</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: CROSS-COUNTRY MORTALITY TABLE                                     */}
        {/* ========================================================================= */}
        {activeView === "countries" && (
          <div className="table-panel" style={{ height: 380, maxHeight: 380, marginTop: 16 }}>
            <div className="table-heading">
              <p className="mono">
                Comparative Country Matrix ({filteredCountries.length} Nations)
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  aria-pressed={countrySortKey === "rate_per_100k"}
                  onClick={() => toggleCountrySort("rate_per_100k")}
                >
                  Rate / 100k {countrySortKey === "rate_per_100k" ? (countrySortOrder === "asc" ? "↑" : "↓") : ""}
                </button>
                <button
                  type="button"
                  aria-pressed={countrySortKey === "total_deaths"}
                  onClick={() => toggleCountrySort("total_deaths")}
                >
                  Total Deaths {countrySortKey === "total_deaths" ? (countrySortOrder === "asc" ? "↑" : "↓") : ""}
                </button>
                <button
                  type="button"
                  aria-pressed={countrySortKey === "country"}
                  onClick={() => toggleCountrySort("country")}
                >
                  Name {countrySortKey === "country" ? (countrySortOrder === "asc" ? "↑" : "↓") : ""}
                </button>
              </div>
            </div>

            <div className="table-scroll">
              <table aria-label="Cross-country cancer mortality table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: 50 }}>Rank</th>
                    <th scope="col">Country / Territory</th>
                    <th scope="col">ISO</th>
                    <th scope="col">Age-Standardized Rate (per 100k)</th>
                    <th scope="col">2019 Total Deaths</th>
                    <th scope="col">Relative Mortality Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map((c) => {
                    const isSelected = hoveredCountry?.country === c.country;
                    const isIndonesia = c.country === "Indonesia";
                    const maxRate = 300;
                    const barWidth = Math.min(100, Math.round((c.rate_per_100k / maxRate) * 100));

                    return (
                      <tr
                        key={c.country}
                        onMouseEnter={() => setHoveredCountry(c)}
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(255,77,28,0.1)"
                            : isIndonesia
                            ? "rgba(255,77,28,0.03)"
                            : "transparent",
                          cursor: "pointer",
                          transition: "all 0.15s ease-out",
                          borderLeft: isSelected ? "3px solid var(--accent)" : "3px solid transparent",
                        }}
                      >
                        <td style={{ color: isSelected || isIndonesia ? "var(--accent)" : "var(--dim)", fontWeight: "bold" }}>
                          #{c.rank}
                        </td>
                        <td>
                          <strong style={{ color: isSelected ? "#ffffff" : (isIndonesia ? "var(--accent)" : "#e0e0e4") }}>
                            {c.country}
                          </strong>
                          {isIndonesia && (
                            <span style={{ marginLeft: 8, fontSize: 8, color: "var(--accent)", fontFamily: "monospace", border: "1px solid var(--accent)", padding: "1px 4px", borderRadius: 2 }}>
                              ID
                            </span>
                          )}
                        </td>
                        <td><span className="mono" style={{ color: "var(--dim)" }}>{c.code}</span></td>
                        <td>
                          <span style={{ fontWeight: 700, color: c.rate_per_100k > 180 ? "var(--accent)" : "#f5f5f4" }}>
                            {c.rate_per_100k}
                          </span>
                        </td>
                        <td>{c.deaths_formatted}</td>
                        <td style={{ width: 130 }}>
                          <div style={{ height: 6, width: "100%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${barWidth}%`,
                                backgroundColor: isSelected || isIndonesia ? "var(--accent)" : (c.rate_per_100k > 180 ? "var(--accent)" : "#707078"),
                                transition: "width 0.3s ease-out",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: 5-YEAR SURVIVAL RATES MATRIX                                      */}
        {/* ========================================================================= */}
        {activeView === "survival" && (
          <div className="table-panel" style={{ height: 380, maxHeight: 380, marginTop: 16 }}>
            <div className="table-heading">
              <p className="mono">
                Clinical 5-Year Survival Matrix (15 Primary Classifications)
              </p>
              <div>
                <button
                  type="button"
                  aria-pressed={true}
                  onClick={() => setSurvivalSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                >
                  Survival Rate {survivalSortOrder === "asc" ? "↑ (Lowest First)" : "↓ (Highest First)"}
                </button>
              </div>
            </div>

            <div className="table-scroll">
              <table aria-label="5-year cancer survival rates table">
                <thead>
                  <tr>
                    <th scope="col">Cancer Classification</th>
                    <th scope="col">5-Year Survival Rate</th>
                    <th scope="col">Prognosis Tier</th>
                    <th scope="col">Early Detection Modality</th>
                    <th scope="col">Primary Clinical / Staging Factor</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSurvival.map((s) => {
                    const isSelected = hoveredSurvival?.cancer_type === s.cancer_type;
                    return (
                      <tr
                        key={s.cancer_type}
                        onMouseEnter={() => setHoveredSurvival(s)}
                        style={{
                          backgroundColor: isSelected ? "rgba(255,77,28,0.1)" : "transparent",
                          cursor: "pointer",
                          transition: "all 0.15s ease-out",
                          borderLeft: isSelected ? "3px solid var(--accent)" : "3px solid transparent",
                        }}
                      >
                        <td>
                          <strong style={{ color: isSelected ? "#ffffff" : "#e0e0e4" }}>
                            {s.cancer_type}
                          </strong>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontWeight: 800, minWidth: 46, color: getPrognosisColor(s.prognosis) }}>
                              {s.survival_rate}%
                            </span>
                            <div style={{ height: 6, width: 80, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                              <div
                                style={{
                                  height: "100%",
                                  width: `${s.survival_rate}%`,
                                  backgroundColor: getPrognosisColor(s.prognosis),
                                  transition: "width 0.3s ease-out",
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 10,
                              padding: "2px 7px",
                              borderRadius: 3,
                              backgroundColor: "rgba(255,255,255,0.06)",
                              color: getPrognosisColor(s.prognosis),
                              fontWeight: 700,
                            }}
                          >
                            {s.prognosis}
                          </span>
                        </td>
                        <td style={{ color: "#d5d5d8" }}>{s.early_detection}</td>
                        <td style={{ color: "var(--muted)", fontSize: 11 }}>{s.primary_factor}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: GDP & ECONOMIC BRACKET DYNAMICS                                  */}
        {/* ========================================================================= */}
        {activeView === "income" && (
          <div className="table-panel" style={{ height: 380, maxHeight: 380, marginTop: 16 }}>
            <div className="table-heading">
              <p className="mono">
                Socio-Economic Income Tier & Epidemiological Transition
              </p>
              <span style={{ color: "var(--dim)", fontSize: 9, fontFamily: "monospace" }}>
                WORLD BANK INCOME TIERS (1990–2019)
              </span>
            </div>

            <div className="table-scroll">
              <table aria-label="Income tier cancer epidemiology table">
                <thead>
                  <tr>
                    <th scope="col">Income Bracket</th>
                    <th scope="col">Representative Nations</th>
                    <th scope="col">Crude Mortality</th>
                    <th scope="col">Age-Standardized Rate</th>
                    <th scope="col">Population 65+ (%)</th>
                    <th scope="col">Epidemiological Finding & Diagnostic Mechanism</th>
                  </tr>
                </thead>
                <tbody>
                  {data.income_tiers.map((tier) => {
                    const isSelected = hoveredIncome?.tier === tier.tier;
                    return (
                      <tr
                        key={tier.tier}
                        onMouseEnter={() => setHoveredIncome(tier)}
                        style={{
                          backgroundColor: isSelected ? "rgba(255,77,28,0.1)" : "transparent",
                          cursor: "pointer",
                          transition: "all 0.15s ease-out",
                          borderLeft: isSelected ? "3px solid var(--accent)" : "3px solid transparent",
                        }}
                      >
                        <td>
                          <strong style={{ color: isSelected ? "#ffffff" : "#e0e0e4" }}>
                            {tier.tier}
                          </strong>
                        </td>
                        <td style={{ color: "var(--dim)", fontSize: 11 }}>{tier.countries_sample}</td>
                        <td><span className="mono">{tier.crude_death_rate} / 100k</span></td>
                        <td>
                          <span className="mono" style={{ color: tier.age_standardized_rate > 130 ? "var(--accent)" : "#f5f5f4", fontWeight: 700 }}>
                            {tier.age_standardized_rate} / 100k
                          </span>
                        </td>
                        <td><span className="mono">{tier.aging_population_pct}%</span></td>
                        <td style={{ color: "#d2d2d5", fontSize: 11, lineHeight: 1.5 }}>
                          {tier.insight}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MINIMALIST HOVER INTELLIGENCE DRAWER (LOCATED CLEANLY BELOW TABLE)        */}
        {/* ========================================================================= */}
        <div
          style={{
            marginTop: 12,
            backgroundColor: "#0a0a0d",
            border: "1px solid var(--line)",
            borderRadius: 3,
            padding: "12px 16px",
            fontSize: 12,
          }}
          aria-live="polite"
        >
          {activeView === "countries" && hoveredCountry && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                    {hoveredCountry.country}
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
                    [{hoveredCountry.code}] • RANK #{hoveredCountry.rank}
                  </span>
                  {hoveredCountry.country === "Indonesia" && (
                    <span className="mono" style={{ fontSize: 8, color: "var(--accent)", border: "1px solid var(--accent)", padding: "0 4px", borderRadius: 2 }}>
                      ID BENCHMARK
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--dim)", marginLeft: 6 }}>
                    ({hoveredCountry.region} • {hoveredCountry.vs_global_label})
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>RATE:</span>
                    <strong style={{ fontSize: 13, color: "var(--accent)", fontFamily: "monospace" }}>{hoveredCountry.rate_per_100k} <small style={{ fontSize: 9, color: "var(--muted)" }}>/100k</small></strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>DEATHS:</span>
                    <strong style={{ fontSize: 13, color: "#ffffff", fontFamily: "monospace" }}>{hoveredCountry.deaths_formatted}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, fontSize: 11, color: "var(--muted)" }}>
                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block", marginBottom: 2 }}>LEADING CAUSES</span>
                  <p style={{ margin: 0, color: "#d5d5d8" }}>{hoveredCountry.top_cancer_cause}</p>
                </div>
                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block", marginBottom: 2 }}>PRIMARY RISK FACTOR</span>
                  <p style={{ margin: 0, color: "#d5d5d8" }}>{hoveredCountry.risk_factors}</p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block", marginBottom: 2 }}>CLINICAL FINDING</span>
                  <p style={{ margin: 0, color: "#a0a0a8", lineHeight: 1.45 }}>{hoveredCountry.clinical_insight}</p>
                </div>
              </div>
            </div>
          )}

          {activeView === "survival" && hoveredSurvival && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                    {hoveredSurvival.cancer_type}
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: getPrognosisColor(hoveredSurvival.prognosis) }}>
                    [{hoveredSurvival.prognosis} PROGNOSIS]
                  </span>
                  <span style={{ fontSize: 11, color: "var(--dim)", marginLeft: 6 }}>
                    Detection: {hoveredSurvival.early_detection}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>5-YR SURVIVAL:</span>
                    <strong style={{ fontSize: 14, color: getPrognosisColor(hoveredSurvival.prognosis), fontFamily: "monospace" }}>{hoveredSurvival.survival_rate}%</strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>STAGE I vs IV:</span>
                    <span style={{ fontSize: 12, color: "#ffffff", fontWeight: "bold" }}>{hoveredSurvival.stage_1_survival}</span>
                    <span style={{ color: "var(--dim)", margin: "0 3px" }}>vs</span>
                    <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: "bold" }}>{hoveredSurvival.stage_4_survival}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 10, fontSize: 11, color: "var(--muted)" }}>
                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block", marginBottom: 2 }}>STAGING FACTOR</span>
                  <p style={{ margin: 0, color: "#d5d5d8" }}>{hoveredSurvival.primary_factor}</p>
                </div>
                <div>
                  <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block", marginBottom: 2 }}>CLINICAL TAKEAWAY</span>
                  <p style={{ margin: 0, color: "#a0a0a8", lineHeight: 1.45 }}>{hoveredSurvival.clinical_takeaway}</p>
                </div>
              </div>
            </div>
          )}

          {activeView === "income" && hoveredIncome && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                    {hoveredIncome.tier}
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
                    [HEALTHCARE: {hoveredIncome.healthcare_access}]
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>STANDARDIZED:</span>
                    <strong style={{ fontSize: 13, color: "var(--accent)", fontFamily: "monospace" }}>{hoveredIncome.age_standardized_rate} <small style={{ fontSize: 9, color: "var(--muted)" }}>/100k</small></strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>CRUDE:</span>
                    <strong style={{ fontSize: 13, color: "#ffffff", fontFamily: "monospace" }}>{hoveredIncome.crude_death_rate} <small style={{ fontSize: 9, color: "var(--muted)" }}>/100k</small></strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 9, color: "var(--dim)", marginRight: 6 }}>65+ SHARE:</span>
                    <strong style={{ fontSize: 13, color: "#ffffff", fontFamily: "monospace" }}>{hoveredIncome.aging_population_pct}%</strong>
                  </div>
                </div>
              </div>

              <div>
                <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block", marginBottom: 2 }}>EPIDEMIOLOGICAL MECHANISM</span>
                <p style={{ margin: 0, color: "#a0a0a8", fontSize: 11, lineHeight: 1.45 }}>{hoveredIncome.insight}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footnote */}
        <p className="playground-note">
          <strong>Analytical Context:</strong> Synthesized from the <em>Global Burden of Disease Study (IHME)</em> and <em>CONCORD-3 Global Cancer Survival Program</em>. 
          Demonstrates reproducible client-side exploratory tables, multi-variable filtering, and clinical metric standardization for epidemiological decision systems.
        </p>
      </div>
    </section>
  );
}
