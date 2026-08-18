"use client";

import React, { useState } from "react";
import cancerData from "@/content/data/cancer_epidemiology_master.json";

export function CancerTobaccoRiskShowcase() {
  const [hoveredYear, setHoveredYear] = useState<number | null>(2019);

  const tobaccoTrend = cancerData.tobacco_trend || [];
  const activeYearData = tobaccoTrend.find((t) => t.year === hoveredYear) || tobaccoTrend[tobaccoTrend.length - 1];

  // Organ sites vulnerability to tobacco
  const tobaccoVulnerableSites = [
    { site: "Trachea, Bronchus & Lung", fraction: 84.5, color: "#38bdf8", desc: "Dominant direct carcinogen inhalation impact" },
    { site: "Larynx & Pharynx", fraction: 71.2, color: "#f43f5e", desc: "Direct mucosal exposure to combustion particulates" },
    { site: "Esophageal Cancer", fraction: 52.8, color: "#f59e0b", desc: "Synergistic toxicity with alcohol and reflux" },
    { site: "Bladder & Urinary Tract", fraction: 46.3, color: "#ec4899", desc: "Renal excretion of filtered aromatic amines" },
    { site: "Stomach & Pancreas", fraction: 26.5, color: "#8b5cf6", desc: "Systemic vascular absorption and chronic inflammation" },
  ];

  return (
    <section className="case-stage cancer-tobacco-stage" id="tobacco-risk" style={{ margin: "32px 0 40px", width: "100%" }}>
      {/* Section Heading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <p className="mono case-label" style={{ marginBottom: "4px" }}>
            Etiology & Behavioral Risk Factors • 1990–2019
          </p>
          <h3 style={{ margin: 0, fontSize: "1.35rem", color: "var(--ink-heading)" }}>
            Tobacco Attribution & Smoking-Induced Mortality Trajectory
          </h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "12px", maxWidth: "700px", lineHeight: 1.5 }}>
            Quantifying the global smoking-attributable cancer fraction: why tobacco still drives ~1 in every 4 cancer deaths worldwide (2.39M deaths in 2019) despite three decades of global taxation and smoking cessation policies.
          </p>
        </div>
        <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
          30-YEAR BEHAVIORAL COHORT MODEL
        </span>
      </div>

      {/* Surface Card Container */}
      <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "22px", borderRadius: "6px", width: "100%" }}>
        {/* Top 4 KPI Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "22px" }}>
          <div style={{ padding: "14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>1990 SMOKING SHARE</span>
            <strong style={{ display: "block", fontSize: "24px", color: "#f43f5e", fontFamily: "monospace", margin: "4px 0" }}>
              27.42%
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              ~1.51M attributed cancer deaths
            </span>
          </div>

          <div style={{ padding: "14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>2019 SMOKING SHARE</span>
            <strong style={{ display: "block", fontSize: "24px", color: "#f59e0b", fontFamily: "monospace", margin: "4px 0" }}>
              24.68%
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              ~2.39M attributed cancer deaths
            </span>
          </div>

          <div style={{ padding: "14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>NET ABSOLUTE SURGE</span>
            <strong style={{ display: "block", fontSize: "24px", color: "var(--accent)", fontFamily: "monospace", margin: "4px 0" }}>
              +57.8%
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              Fatalities rose despite -2.7% rate drop
            </span>
          </div>

          <div style={{ padding: "14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)" }}>LUNG ATTRIBUTION FRACTION</span>
            <strong style={{ display: "block", fontSize: "24px", color: "#38bdf8", fontFamily: "monospace", margin: "4px 0" }}>
              84.5%
            </strong>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)" }}>
              Smoking is primary driver of lung cancer
            </span>
          </div>
        </div>

        {/* Middle Two-Column Section: 30-Year Trajectory Bar Chart + Organ Vulnerability Matrix */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px", alignItems: "stretch" }}>
          {/* Left: Interactive 30-Year Trajectory Bar Chart */}
          <div style={{ background: "var(--panel)", padding: "18px", border: "1px solid var(--line)", borderRadius: "4px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--dim)" }}>
                GLOBAL SMOKING ATTRIBUTION SHARE TRAJECTORY (1990–2019)
              </span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent)" }}>
                HOVER BARS TO INSPECT
              </span>
            </div>

            {/* Visual Bars Container */}
            <div style={{ display: "flex", alignItems: "flex-end", height: "150px", gap: "4px", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              {tobaccoTrend.map((t) => {
                const isHovered = activeYearData?.year === t.year;
                const h = ((t.tobacco_share_pct - 20) / (28 - 20)) * 130;
                return (
                  <div
                    key={t.year}
                    onMouseEnter={() => setHoveredYear(t.year)}
                    style={{
                      flex: 1,
                      height: `${Math.max(12, h)}px`,
                      backgroundColor: isHovered
                        ? "var(--accent)"
                        : t.year === 2019
                        ? "#f59e0b"
                        : "rgba(245, 158, 11, 0.45)",
                      borderRadius: "2px 2px 0 0",
                      cursor: "pointer",
                      boxShadow: isHovered ? "0 0 10px var(--accent)" : "none",
                      transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                      transformOrigin: "bottom",
                      transition: "all 0.15s ease",
                    }}
                  />
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "9px", color: "var(--dim)" }} className="mono">
              <span>1990 (27.42%)</span>
              <span>2000 (26.85%)</span>
              <span>2010 (25.74%)</span>
              <span>2019 (24.68%)</span>
            </div>

            {/* Hover Telemetry Display */}
            <div style={{ marginTop: "14px", padding: "8px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--line)", borderRadius: "3px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--ink)" }}>
                <strong>Year {activeYearData.year}</strong>: Smoking accounted for <strong style={{ color: "var(--accent)" }}>{activeYearData.tobacco_share_pct}%</strong> of all global cancer mortality (~{( (activeYearData.tobacco_share_pct / 100) * (cancerData.global_time_series.find((g) => g.year === activeYearData.year)?.total_deaths || 8000000) / 1e6 ).toFixed(2)}M fatalities).
              </span>
            </div>
          </div>

          {/* Right: Organ Sites Most Vulnerable to Tobacco */}
          <div style={{ background: "var(--panel)", padding: "18px", border: "1px solid var(--line)", borderRadius: "4px" }}>
            <span className="mono" style={{ fontSize: "10px", color: "var(--dim)", display: "block", marginBottom: "12px" }}>
              ORGAN SITE SUSCEPTIBILITY (% ATTRIBUTABLE TO SMOKING)
            </span>

            <div style={{ display: "grid", gap: "10px" }}>
              {tobaccoVulnerableSites.map((site) => (
                <div key={site.site} style={{ display: "grid", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "monospace" }}>
                    <span style={{ color: "var(--ink)" }}>{site.site}</span>
                    <strong style={{ color: site.color }}>{site.fraction}%</strong>
                  </div>
                  <div style={{ height: "7px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "2px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${site.fraction}%`,
                        background: site.color,
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "9px", color: "var(--dim)" }}>{site.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Strategic Epidemiological Takeaway */}
        <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "4px" }}>
          <span className="mono" style={{ fontSize: "9px", color: "#f59e0b", fontWeight: "bold" }}>
            EPIDEMIOLOGICAL PARADOX & PUBLIC HEALTH IMPLICATIONS
          </span>
          <p style={{ margin: "4px 0 0", fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.5 }}>
            While age-standardized smoking rates have dropped globally due to taxation and public health interventions, absolute tobacco cancer deaths surged from 1.51M to 2.39M (+57.8%). This illustrates the demographic lag: cumulative carcinogen exposure over 30–40 years surfaces primarily as populations enter older age cohorts.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CancerTobaccoRiskShowcase;
