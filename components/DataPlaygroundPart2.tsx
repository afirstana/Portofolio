"use client";

import { useMemo, useState } from "react";

type CountryRecord = {
  country: string;
  code: string;
  rate_per_100k: number;
  total_deaths: number;
  deaths_formatted: string;
  rank: number;
};

type SurvivalRecord = {
  cancer_type: string;
  survival_rate: number;
  prognosis: string;
  early_detection: string;
  primary_factor: string;
};

type IncomeTier = {
  tier: string;
  countries_sample: string;
  crude_death_rate: number;
  age_standardized_rate: number;
  aging_population_pct: number;
  healthcare_access: string;
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
      case "Very High":
        return "#10b981"; // Emerald
      case "High":
        return "#34d399";
      case "Moderate":
        return "#fbbf24"; // Amber
      case "Low":
        return "#f97316"; // Orange
      case "Critical":
      case "Very Low":
        return "#ff4d1c"; // Accent coral
      default:
        return "#a0a0a8";
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
              🌍 01. Cross-Country Mortality (35 Nations)
            </button>
            <button
              type="button"
              aria-pressed={activeView === "survival"}
              onClick={() => setActiveView("survival")}
            >
              🧬 02. 5-Year Survival Matrix (15 Cancers)
            </button>
            <button
              type="button"
              aria-pressed={activeView === "income"}
              onClick={() => setActiveView("income")}
            >
              📊 03. GDP & Economic Bracket Dynamics
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

        {/* Summary Metric Cards */}
        <div className="kpi-grid" aria-live="polite">
          <div>
            <span className="mono">Highest 5-Year Survival</span>
            <strong style={{ color: "#10b981" }}>95.2%</strong>
            <p>Testicular & Thyroid cancer with early stage surgical excision.</p>
          </div>
          <div>
            <span className="mono">Lowest 5-Year Survival</span>
            <strong style={{ color: "#ff4d1c" }}>7.2%</strong>
            <p>Pancreatic & Lung cancer due to late-stage asymptomatic onset.</p>
          </div>
          <div>
            <span className="mono">Cross-Country Variance</span>
            <strong>~3.8x</strong>
            <p>Age-standardized rates range from ~75 to 280+ per 100,000 population.</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: CROSS-COUNTRY MORTALITY TABLE                                     */}
        {/* ========================================================================= */}
        {activeView === "countries" && (
          <div className="table-panel" style={{ height: 420, maxHeight: 420, marginTop: 16 }}>
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
                    <th scope="col" style={{ width: 60 }}>Rank</th>
                    <th scope="col">Country / Territory</th>
                    <th scope="col">ISO</th>
                    <th scope="col">Age-Standardized Rate (per 100k)</th>
                    <th scope="col">2019 Total Deaths</th>
                    <th scope="col">Relative Mortality Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map((c) => {
                    const isHighlighted = c.country === "Indonesia";
                    const maxRate = 300;
                    const barWidth = Math.min(100, Math.round((c.rate_per_100k / maxRate) * 100));

                    return (
                      <tr
                        key={c.country}
                        style={{
                          backgroundColor: isHighlighted ? "rgba(255,77,28,0.08)" : "transparent",
                        }}
                      >
                        <td style={{ color: isHighlighted ? "#ff4d1c" : "var(--dim)", fontWeight: "bold" }}>
                          #{c.rank}
                        </td>
                        <td>
                          <strong style={{ color: isHighlighted ? "#ffffff" : "#e0e0e4" }}>
                            {c.country}
                          </strong>
                          {isHighlighted && (
                            <span style={{ marginLeft: 8, fontSize: 9, color: "#ff4d1c", fontFamily: "monospace" }}>
                              [INDONESIA BENCHMARK]
                            </span>
                          )}
                        </td>
                        <td><span className="mono" style={{ color: "var(--dim)" }}>{c.code}</span></td>
                        <td>
                          <span style={{ fontWeight: 700, color: c.rate_per_100k > 180 ? "#ff4d1c" : "#f5f5f4" }}>
                            {c.rate_per_100k}
                          </span>
                        </td>
                        <td>{c.deaths_formatted}</td>
                        <td style={{ width: 140 }}>
                          <div style={{ height: 6, width: "100%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${barWidth}%`,
                                backgroundColor: isHighlighted ? "#ff4d1c" : (c.rate_per_100k > 180 ? "#ff4d1c" : "#a0a0a8"),
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
          <div className="table-panel" style={{ height: 420, maxHeight: 420, marginTop: 16 }}>
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
                  {sortedSurvival.map((s) => (
                    <tr key={s.cancer_type}>
                      <td><strong>{s.cancer_type}</strong></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontWeight: 800, minWidth: 48, color: getPrognosisColor(s.prognosis) }}>
                            {s.survival_rate}%
                          </span>
                          <div style={{ height: 5, width: 90, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${s.survival_rate}%`,
                                backgroundColor: getPrognosisColor(s.prognosis),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 4,
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: GDP & ECONOMIC BRACKET DYNAMICS                                  */}
        {/* ========================================================================= */}
        {activeView === "income" && (
          <div className="table-panel" style={{ height: 420, maxHeight: 420, marginTop: 16 }}>
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
                  {data.income_tiers.map((tier) => (
                    <tr key={tier.tier}>
                      <td><strong>{tier.tier}</strong></td>
                      <td style={{ color: "var(--dim)", fontSize: 11 }}>{tier.countries_sample}</td>
                      <td><span className="mono">{tier.crude_death_rate} / 100k</span></td>
                      <td>
                        <span className="mono" style={{ color: tier.age_standardized_rate > 130 ? "#ff4d1c" : "#f5f5f4", fontWeight: 700 }}>
                          {tier.age_standardized_rate} / 100k
                        </span>
                      </td>
                      <td><span className="mono">{tier.aging_population_pct}%</span></td>
                      <td style={{ color: "#d2d2d5", fontSize: 12, lineHeight: 1.5 }}>
                        {tier.insight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footnote */}
        <p className="playground-note">
          <strong>Analytical Context:</strong> Synthesized from the <em>Global Burden of Disease Study (IHME)</em> and <em>CONCORD-3 Global Cancer Survival Program</em>. 
          Demonstrates reproducible client-side exploratory tables, multi-variable filtering, and clinical metric standardization for epidemiological decision systems.
        </p>
      </div>
    </section>
  );
}
