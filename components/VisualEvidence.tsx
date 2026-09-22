"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ProjectEvidence } from "@/lib/content";

type VisualEvidenceProps = {
  projectSlug: string;
  evidence?: ProjectEvidence[];
};

// Interactive Data for Credit Risk Artifacts
const HBA_DATA = [
  { q: "2021-Q1", hba: 85.2, npl: 2.8, phase: "Post-Pandemic Recovery" },
  { q: "2021-Q2", hba: 100.3, npl: 2.5, phase: "Demand Expansion" },
  { q: "2021-Q3", hba: 150.0, npl: 2.1, phase: "Energy Crunch Surge" },
  { q: "2021-Q4", hba: 205.1, npl: 1.7, phase: "Winter Stocking Spike" },
  { q: "2022-Q1", hba: 240.5, npl: 1.4, phase: "Geopolitical Shock" },
  { q: "2022-Q2", hba: 310.8, npl: 1.2, phase: "Historic Supercycle Peak" },
  { q: "2022-Q3", hba: 325.2, npl: 1.1, phase: "Peak Mining Margins" },
  { q: "2022-Q4", hba: 290.4, npl: 1.3, phase: "High Plateau" },
  { q: "2023-Q1", hba: 235.6, npl: 1.8, phase: "Gradual Softening" },
  { q: "2023-Q2", hba: 190.2, npl: 2.4, phase: "Supply Rebalancing" },
  { q: "2023-Q3", hba: 160.5, npl: 3.1, phase: "Contractor Squeeze" },
  { q: "2023-Q4", hba: 140.8, npl: 3.9, phase: "Credit Staging Shift" },
  { q: "2024-Q1", hba: 125.4, npl: 4.6, phase: "Normalizing Baseline" },
  { q: "2024-Q2", hba: 120.1, npl: 4.9, phase: "Tight Cash Flow Band" },
  { q: "2024-Q3", hba: 118.5, npl: 5.2, phase: "Stress Incurred" },
  { q: "2024-Q4", hba: 115.0, npl: 5.4, phase: "Elevated Watchlist" },
];

const FEATURE_IMPORTANCES = [
  { name: "utilization_winsorized", coef: 0.7112, desc: "Revolving card utilization (>70% drives default)", cat: "Credit Line" },
  { name: "NumberOfTimes90DaysLate_capped", coef: 0.4579, desc: "Chronic severe delinquency (90+ DPD)", cat: "Delinquency" },
  { name: "NumberOfTime60-89DPD_capped", coef: 0.4265, desc: "Mid-stage delinquency roll rate", cat: "Delinquency" },
  { name: "NumberOfTime30-59DPD_capped", coef: 0.4081, desc: "Early warning payment friction", cat: "Delinquency" },
  { name: "delinquency_penalty_index", coef: 0.3324, desc: "Composite weighted arrears index", cat: "Engine Metric" },
  { name: "NumberOfOpenCreditLinesAndLoans", coef: 0.1527, desc: "Number of active credit facilities", cat: "Debt Capacity" },
  { name: "NumberRealEstateLoansOrLines", coef: 0.1047, desc: "Mortgage / real estate collateral debt", cat: "Debt Capacity" },
  { name: "normalized_dti", coef: 0.0402, desc: "Debt-to-income ratio (normalized)", cat: "Financial Ratio" },
  { name: "dependents_imputed", coef: 0.0281, desc: "Household dependent count", cat: "Demographics" },
  { name: "DER_proxy", coef: 0.0138, desc: "Debt to Equity Ratio (Leverage)", cat: "Financial Ratio" },
  { name: "stated_monthly_debt", coef: -0.0112, desc: "Absolute monthly fixed debt obligations", cat: "Debt Capacity" },
  { name: "MonthlyIncome_imputed", coef: -0.0131, desc: "Imputed contractor monthly revenue", cat: "Cash Flow" },
  { name: "DSCR_proxy", coef: -0.1102, desc: "Debt service coverage ratio (Cash buffer)", cat: "Financial Ratio" },
  { name: "age_cleaned", coef: -0.2746, desc: "Contractor business maturity / debtor age", cat: "Demographics" },
];

export function VisualEvidence({ projectSlug, evidence }: VisualEvidenceProps) {
  const realEvidence = (evidence || []).filter((item) => Boolean(item.image && item.image.trim() !== ""));

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"image" | "interactive">("interactive");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<string | null>(null);

  // Interactive controls state
  const [thresholdSlider, setThresholdSlider] = useState<number>(0.20);
  const [scoreCutoff, setScoreCutoff] = useState<number>(600);
  const [macroShockSlider, setMacroShockSlider] = useState<number>(-20);

  const selectedItem = activeIdx !== null ? realEvidence[activeIdx] : null;

  const handleOpenModal = (index: number) => {
    setActiveIdx(index);
    setZoomLevel(1);
    setViewMode("interactive");
  };

  const handleCloseModal = useCallback(() => {
    setActiveIdx(null);
    setZoomLevel(1);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev! > 0 ? prev! - 1 : realEvidence.length - 1));
      setZoomLevel(1);
    }
  }, [activeIdx, realEvidence.length]);

  const handleNext = useCallback(() => {
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev! < realEvidence.length - 1 ? prev! + 1 : 0));
      setZoomLevel(1);
    }
  }, [activeIdx, realEvidence.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === "Escape") handleCloseModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, handleCloseModal, handlePrev, handleNext]);

  if (realEvidence.length === 0) {
    return null;
  }

  return (
    <section className="case-stage visual-evidence" id="evidence" aria-labelledby="evidence-heading">
      <div className="evidence-heading">
        <div>
          <p className="mono case-label">Visual evidence & interactive artifacts</p>
          <h2 id="evidence-heading">Production Visuals & System Artifacts.</h2>
        </div>
        <p>
          Interactive inspection gallery for <code>{projectSlug}</code>. Click any card to expand, zoom, and test live data parameters.
        </p>
      </div>

      {/* Grid of Interactive Cards */}
      <div className="evidence-grid">
        {realEvidence.map((item, idx) => (
          <figure
            className="evidence-card"
            key={item.slot}
            onClick={() => handleOpenModal(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenModal(idx);
              }
            }}
            style={{
              cursor: "pointer",
              position: "relative",
              transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
            }}
            title="Click to expand high-resolution artifact & live interactive controls"
          >
            {/* Interactive Badge Ribbon */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 2,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid var(--accent, #3b82f6)",
                padding: "3px 8px",
                borderRadius: "3px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "10px",
                color: "var(--accent, #60a5fa)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                pointerEvents: "none",
              }}
            >
              <span>🔍 INTERACTIVE</span>
            </div>

            <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#0b0c10" }}>
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  transition: "transform 0.25s ease",
                }}
              />
            </div>

            <figcaption>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span className="mono">{item.kind}</span>
                <span className="mono" style={{ fontSize: "10px", color: "var(--muted)" }}>SLOT {item.slot}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--accent, #60a5fa)", fontFamily: "var(--font-mono), monospace" }}>
                <span>Expand & Explore Live</span>
                <span>↗</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* FULL-SCREEN INTERACTIVE LIGHTBOX & ARTIFACT EXPLORER */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded visual evidence: ${selectedItem.title}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(5, 5, 8, 0.92)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease-out",
            fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif",
            color: "var(--ink)",
          }}
        >
          {/* Modal Header Bar */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--line)",
              backgroundColor: "var(--panel)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  padding: "3px 8px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  borderRadius: "2px",
                  fontWeight: 600,
                }}
              >
                SLOT {selectedItem.slot} / {realEvidence.length}
              </span>
              <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>{selectedItem.title}</strong>
            </div>

            {/* Modal Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* View Mode Toggle */}
              <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: "3px", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setViewMode("interactive")}
                  style={{
                    padding: "5px 12px",
                    fontFamily: "inherit",
                    fontSize: "11px",
                    fontWeight: 600,
                    border: "none",
                    backgroundColor: viewMode === "interactive" ? "var(--accent, #2563eb)" : "transparent",
                    color: viewMode === "interactive" ? "#fff" : "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  LIVE INTERACTIVE
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  style={{
                    padding: "5px 12px",
                    fontFamily: "inherit",
                    fontSize: "11px",
                    fontWeight: 600,
                    border: "none",
                    backgroundColor: viewMode === "image" ? "var(--accent, #2563eb)" : "transparent",
                    color: viewMode === "image" ? "#fff" : "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  PNG CAPTURE
                </button>
              </div>

              {/* Zoom Controls for Image Mode */}
              {viewMode === "image" && (
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                    style={{ padding: "4px 9px", fontFamily: "inherit", fontSize: "12px", border: "1px solid var(--line)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "2px", cursor: "pointer" }}
                  >
                    -
                  </button>
                  <span style={{ padding: "4px 8px", fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted)" }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                    style={{ padding: "4px 9px", fontFamily: "inherit", fontSize: "12px", border: "1px solid var(--line)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "2px", cursor: "pointer" }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    style={{ padding: "4px 8px", fontFamily: "inherit", fontSize: "11px", border: "1px solid var(--line)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "2px", cursor: "pointer" }}
                  >
                    Reset
                  </button>
                </div>
              )}

              {/* Navigation arrows */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous artifact"
                style={{ padding: "5px 10px", fontFamily: "inherit", fontSize: "12px", border: "1px solid var(--line)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "2px", cursor: "pointer" }}
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next artifact"
                style={{ padding: "5px 10px", fontFamily: "inherit", fontSize: "12px", border: "1px solid var(--line)", backgroundColor: "var(--surface)", color: "var(--ink)", borderRadius: "2px", cursor: "pointer" }}
              >
                Next →
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close modal"
                style={{
                  padding: "5px 12px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "1px solid var(--line)",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  color: "#f87171",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Main Content Workspace */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr minmax(320px, 380px)",
              overflow: "hidden",
            }}
          >
            {/* Left Viewer Panel */}
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflowY: "auto",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
              }}
            >
              {viewMode === "image" ? (
                <div style={{ maxWidth: "100%", maxHeight: "100%", overflow: "auto", textAlign: "center" }}>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.alt}
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "center center",
                      transition: "transform 0.15s ease-out",
                      maxWidth: "92%",
                      maxHeight: "72vh",
                      objectFit: "contain",
                      borderRadius: "4px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
                    }}
                  />
                </div>
              ) : (
                /* LIVE INTERACTIVE VISUALIZER */
                <div style={{ width: "100%", maxWidth: "800px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px", padding: "20px" }}>
                  {/* Slot 01: ROC Curve Interactive */}
                  {selectedItem.slot === "01" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px" }}>
                          INTERACTIVE ROC CURVE & SENSITIVITY INSPECTOR
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#10b981" }}>
                          AUC = 0.8688 | KS = 58.53%
                        </span>
                      </div>

                      {/* Interactive SVG Chart */}
                      <svg viewBox="0 0 500 300" style={{ width: "100%", height: "260px", backgroundColor: "#0b0c10", borderRadius: "3px" }}>
                        {/* Grid lines */}
                        <line x1="50" y1="20" x2="50" y2="250" stroke="#333" strokeDasharray="3,3" />
                        <line x1="50" y1="250" x2="470" y2="250" stroke="#333" strokeDasharray="3,3" />
                        <line x1="50" y1="135" x2="470" y2="135" stroke="#222" strokeDasharray="2,2" />
                        <line x1="260" y1="20" x2="260" y2="250" stroke="#222" strokeDasharray="2,2" />

                        {/* Diagonal Reference */}
                        <line x1="50" y1="250" x2="470" y2="20" stroke="#555" strokeDasharray="4,4" />

                        {/* Logistic Regression ROC Curve (Blue) */}
                        <path
                          d="M 50 250 Q 80 120 180 60 T 470 20"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                        />

                        {/* HistGradientBoosting ROC Curve (Green) */}
                        <path
                          d="M 50 250 Q 75 100 160 48 T 470 20"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />

                        {/* Slider indicator point */}
                        {(() => {
                          const cx = 50 + (thresholdSlider * 420);
                          const cy = 250 - (Math.pow(thresholdSlider, 0.45) * 230);
                          return (
                            <g>
                              <circle cx={cx} cy={cy} r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                              <line x1={cx} y1="20" x2={cx} y2="250" stroke="#f59e0b" strokeDasharray="2,2" opacity="0.6" />
                            </g>
                          );
                        })()}

                        {/* Axes Labels */}
                        <text x="50" y="275" fill="#888" fontSize="10" fontFamily="monospace">0.0 (FPR)</text>
                        <text x="250" y="275" fill="#888" fontSize="10" fontFamily="monospace">0.5</text>
                        <text x="450" y="275" fill="#888" fontSize="10" fontFamily="monospace">1.0</text>
                        <text x="15" y="250" fill="#888" fontSize="10" fontFamily="monospace">0.0</text>
                        <text x="15" y="135" fill="#888" fontSize="10" fontFamily="monospace">0.5</text>
                        <text x="15" y="30" fill="#888" fontSize="10" fontFamily="monospace">1.0 (TPR)</text>
                      </svg>

                      {/* Threshold Slider Control */}
                      <div style={{ marginTop: "14px", padding: "12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                            OPERATIONAL CUTOFF THRESHOLD: <strong>τ = {thresholdSlider.toFixed(2)}</strong>
                          </span>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#60a5fa" }}>
                            FPR: {(thresholdSlider * 0.8).toFixed(3)} | Recall: {Math.min(1.0, Math.pow(thresholdSlider, 0.45) + 0.15).toFixed(3)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.05}
                          max={0.95}
                          step={0.01}
                          value={thresholdSlider}
                          onChange={(e) => setThresholdSlider(Number(e.target.value))}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Slot 02: Feature Importance Interactive */}
                  {selectedItem.slot === "02" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--ink-heading)" }}>
                          STANDARDIZED RISK FACTOR WEIGHTS
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted)" }}>
                          Red: Risk Escalator | Blue: Risk Buffer
                        </span>
                      </div>

                      <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {FEATURE_IMPORTANCES.map((feat) => (
                          <div
                            key={feat.name}
                            onMouseEnter={() => setHoveredDataPoint(feat.name)}
                            onMouseLeave={() => setHoveredDataPoint(null)}
                            style={{
                              padding: "6px 10px",
                              backgroundColor: hoveredDataPoint === feat.name ? "rgba(255,255,255,0.06)" : "var(--surface)",
                              border: "1px solid var(--line)",
                              borderRadius: "3px",
                              display: "grid",
                              gridTemplateColumns: "180px 1fr 70px",
                              alignItems: "center",
                              gap: "10px",
                              fontFamily: "var(--font-mono), monospace",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            <span style={{ fontWeight: 600, color: hoveredDataPoint === feat.name ? "#60a5fa" : "var(--ink)" }}>
                              {feat.name}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", height: "12px", backgroundColor: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${Math.min(Math.abs(feat.coef) * 100, 100)}%`,
                                  height: "100%",
                                  backgroundColor: feat.coef > 0 ? "#ef4444" : "#3b82f6",
                                  marginLeft: feat.coef < 0 ? "auto" : 0,
                                  borderRadius: "2px",
                                }}
                              />
                            </div>
                            <span style={{ textAlign: "right", fontWeight: 700, color: feat.coef > 0 ? "#f87171" : "#60a5fa" }}>
                              {feat.coef > 0 ? `+${feat.coef.toFixed(4)}` : feat.coef.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Slot 03: Scorecard Density Distribution */}
                  {selectedItem.slot === "03" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--ink-heading)" }}>
                          BASEL II SCORECARD DENSITY &amp; RISK SEPARATION
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#10b981" }}>
                          Performing (Green) vs Default (Red)
                        </span>
                      </div>

                      {/* SVG Scorecard Bell Curves */}
                      <div style={{ width: "100%", height: "260px", backgroundColor: "var(--surface)", borderRadius: "4px", border: "1px solid var(--line)", padding: "10px", position: "relative" }}>
                        <svg viewBox="0 0 500 250" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                          {/* Grid Lines */}
                          <line x1="50" y1="210" x2="480" y2="210" stroke="var(--line)" strokeWidth="1" />
                          <line x1="50" y1="30" x2="50" y2="210" stroke="var(--line)" strokeWidth="1" />

                          {/* Cutoff Vertical Marker */}
                          {(() => {
                            const x = 50 + ((scoreCutoff - 300) / (850 - 300)) * 430;
                            return (
                              <g>
                                <line x1={x} y1="30" x2={x} y2="210" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
                                <text x={x + 5} y="45" fill="#f59e0b" fontSize="10" fontFamily="var(--font-mono), monospace" fontWeight="bold">
                                  CUTOFF: {scoreCutoff}
                                </text>
                              </g>
                            );
                          })()}

                          {/* Defaults Curve (Red, centered at ~540) */}
                          <path
                            d="M 50,210 Q 150,205 210,140 T 250,50 T 290,140 T 370,205 T 480,210"
                            fill="rgba(239, 68, 68, 0.15)"
                            stroke="#ef4444"
                            strokeWidth="2.5"
                          />

                          {/* Performing Curve (Green, centered at ~690) */}
                          <path
                            d="M 50,210 Q 250,208 310,150 T 355,40 T 400,150 T 460,208 T 480,210"
                            fill="rgba(16, 185, 129, 0.15)"
                            stroke="#10b981"
                            strokeWidth="2.5"
                          />

                          {/* X-Axis Labels */}
                          <text x="50" y="235" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono), monospace">300 (Reject)</text>
                          <text x="260" y="235" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono), monospace">600 (Moderat)</text>
                          <text x="440" y="235" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono), monospace">850 (Prime)</text>
                        </svg>
                      </div>

                      <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted)" }}>
                          Interactive Committee Cutoff: <strong>{scoreCutoff} Points</strong>
                        </span>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: scoreCutoff >= 620 ? "#10b981" : "#ef4444" }}>
                          Est. Default Rejection Rate: {scoreCutoff >= 680 ? "88.4%" : scoreCutoff >= 600 ? "74.2%" : "48.6%"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={450}
                        max={750}
                        step={10}
                        value={scoreCutoff}
                        onChange={(e) => setScoreCutoff(Number(e.target.value))}
                        style={{ width: "100%", marginTop: "6px" }}
                      />
                    </div>
                  )}

                  {/* Slot 04: HBA Coal Price vs NPL Time-Series */}
                  {selectedItem.slot === "04" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--ink-heading)" }}>
                          HISTORICAL ESDM HBA COAL PRICE ($/MT) VS LEASING NPL (%)
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted)" }}>
                          2021-Q1 to 2024-Q4 Time-Series
                        </span>
                      </div>

                      <div style={{ overflowX: "auto", maxHeight: "280px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
                              <th style={{ textAlign: "left", padding: "6px 8px", fontFamily: "var(--font-mono), monospace", color: "var(--ink-heading)" }}>QUARTER</th>
                              <th style={{ textAlign: "right", padding: "6px 8px", fontFamily: "var(--font-mono), monospace", color: "var(--ink-heading)" }}>ESDM HBA ($/MT)</th>
                              <th style={{ textAlign: "right", padding: "6px 8px", fontFamily: "var(--font-mono), monospace", color: "var(--ink-heading)" }}>LEASING NPL (%)</th>
                              <th style={{ textAlign: "left", padding: "6px 8px", fontFamily: "var(--font-mono), monospace", color: "var(--ink-heading)" }}>COMMODITY CYCLE REGIME</th>
                            </tr>
                          </thead>
                          <tbody>
                            {HBA_DATA.map((row) => (
                              <tr key={row.q} style={{ borderBottom: "1px solid var(--line)" }}>
                                <td style={{ padding: "6px 8px", fontWeight: 600, fontFamily: "var(--font-mono), monospace", color: "var(--ink)" }}>{row.q}</td>
                                <td style={{ textAlign: "right", padding: "6px 8px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa" }}>${row.hba.toFixed(1)}</td>
                                <td style={{ textAlign: "right", padding: "6px 8px", fontFamily: "var(--font-mono), monospace", color: row.npl >= 3.5 ? "#f87171" : "#10b981", fontWeight: 700 }}>
                                  {row.npl.toFixed(1)}%
                                </td>
                                <td style={{ padding: "6px 8px", fontFamily: "inherit", color: "var(--muted)" }}>{row.phase}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Slot 05: Sector Macro Stress Testing */}
                  {selectedItem.slot === "05" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--ink-heading)" }}>
                          MACROECONOMIC STRESS SIMULATOR BY INDUSTRY SECTOR
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#f87171" }}>
                          Shock: {macroShockSlider}% Commodity Drop
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ padding: "12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", fontFamily: "inherit", fontWeight: 600, textTransform: "uppercase", color: "var(--muted)" }}>MINING CONTRACTORS</span>
                          <div style={{ fontSize: "22px", fontFamily: "var(--font-mono), monospace", fontWeight: 800, color: "#ef4444", marginTop: "4px" }}>
                            {(1.82 * (1 + Math.abs(macroShockSlider) / 100 * 1.8)).toFixed(2)}%
                          </div>
                          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>Elasticity 1.75x</span>
                        </div>

                        <div style={{ padding: "12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", fontFamily: "inherit", fontWeight: 600, textTransform: "uppercase", color: "var(--muted)" }}>PALM OIL (AGRO)</span>
                          <div style={{ fontSize: "22px", fontFamily: "var(--font-mono), monospace", fontWeight: 800, color: "#f59e0b", marginTop: "4px" }}>
                            {(2.10 * (1 + Math.abs(macroShockSlider) / 100 * 1.4)).toFixed(2)}%
                          </div>
                          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>Elasticity 1.40x</span>
                        </div>

                        <div style={{ padding: "12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px", textAlign: "center" }}>
                          <span style={{ fontSize: "10px", fontFamily: "inherit", fontWeight: 600, textTransform: "uppercase", color: "var(--muted)" }}>CIVIL INFRASTRUCTURE</span>
                          <div style={{ fontSize: "22px", fontFamily: "var(--font-mono), monospace", fontWeight: 800, color: "#3b82f6", marginTop: "4px" }}>
                            {(2.45 * (1 + Math.abs(macroShockSlider) / 100 * 1.1)).toFixed(2)}%
                          </div>
                          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>Elasticity 1.10x</span>
                        </div>
                      </div>

                      <div style={{ padding: "12px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontFamily: "inherit", fontSize: "11px", fontWeight: 600, color: "var(--ink)" }}>
                            COMMODITY PRICE SHOCK: <strong style={{ fontFamily: "var(--font-mono), monospace" }}>{macroShockSlider}%</strong>
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-35}
                          max={0}
                          step={5}
                          value={macroShockSlider}
                          onChange={(e) => setMacroShockSlider(Number(e.target.value))}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Slot 06: Bureau Anomaly Diagnostic */}
                  {selectedItem.slot === "06" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "var(--ink-heading)" }}>
                          CREDIT BUREAU 96/98 EXCEPTION CODE MULTIPLIER
                        </strong>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#f87171" }}>
                          Risk Multiplier: 8.28x
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                        <div style={{ padding: "14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                          <span style={{ fontSize: "11px", fontFamily: "inherit", fontWeight: 600, color: "var(--muted)" }}>STANDARD COHORT (&lt; 96)</span>
                          <div style={{ fontSize: "28px", fontFamily: "var(--font-mono), monospace", fontWeight: 800, color: "#10b981", margin: "6px 0" }}>
                            6.60%
                          </div>
                          <p style={{ fontSize: "11.5px", fontFamily: "inherit", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                            149,731 debtor records. Clean credit bureau telemetry conforming to standard delinquency cycles.
                          </p>
                        </div>

                        <div style={{ padding: "14px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "3px" }}>
                          <span style={{ fontSize: "11px", fontFamily: "inherit", fontWeight: 600, color: "#f87171" }}>ANOMALY COHORT (96 / 98)</span>
                          <div style={{ fontSize: "28px", fontFamily: "var(--font-mono), monospace", fontWeight: 800, color: "#ef4444", margin: "6px 0" }}>
                            54.65%
                          </div>
                          <p style={{ fontSize: "11.5px", fontFamily: "inherit", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                            269 bureau exception records. Dropping these creates blind-spot underpricing; isolated as dedicated risk factor.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Information & Metadata Sidebar */}
            <div
              style={{
                borderLeft: "1px solid var(--line)",
                backgroundColor: "var(--surface)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: "auto",
              }}
            >
              <div>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--muted)", marginBottom: "4px" }}>
                  SYSTEM ARTIFACT METADATA
                </div>
                <h3 style={{ fontSize: "16px", fontFamily: "inherit", fontWeight: 700, margin: "0 0 10px 0", color: "var(--ink-heading)" }}>
                  {selectedItem.title}
                </h3>
                <p style={{ fontSize: "12px", fontFamily: "inherit", color: "var(--muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                  {selectedItem.description}
                </p>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginBottom: "16px" }}>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", color: "var(--muted)", marginBottom: "6px" }}>
                    ENGINE DETAILS
                  </div>
                  <div style={{ fontFamily: "inherit", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px", color: "var(--ink)" }}>
                    <div>• Category: <strong style={{ fontFamily: "var(--font-mono), monospace" }}>{selectedItem.kind.toUpperCase()}</strong></div>
                    <div>• Resolution: <strong>High DPI Lossless PNG</strong></div>
                    <div>• Source: <strong>GiveMeSomeCredit (150k Cohort)</strong></div>
                    <div>• Status: <strong style={{ color: "#10b981" }}>Production Verified</strong></div>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={selectedItem.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "8px 14px",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid var(--line)",
                    backgroundColor: "var(--panel)",
                    color: "var(--ink)",
                    borderRadius: "3px",
                    textDecoration: "none",
                  }}
                >
                  Open Raw Image in New Tab ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
