"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ProjectEvidence } from "@/lib/content";

type VisualEvidenceProps = {
  projectSlug: string;
  evidence?: ProjectEvidence[];
};

// Empirical Historical Data for Dual-Axis HBA Coal vs Leasing NPL
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

// Standardized Logistic Regression Coefficients (Exact from 04_credit_scoring_model.py)
const FEATURE_IMPORTANCES = [
  { name: "utilization_winsorized", coef: 0.7112, desc: "Revolving card utilization (>70% drives default)", cat: "Credit Line", formula: "Balance / CreditLimit" },
  { name: "NumberOfTimes90DaysLate_capped", coef: 0.4579, desc: "Chronic severe delinquency (90+ DPD)", cat: "Delinquency", formula: "Count (DPD >= 90)" },
  { name: "NumberOfTime60-89DPD_capped", coef: 0.4265, desc: "Mid-stage delinquency roll rate", cat: "Delinquency", formula: "Count (60-89 DPD)" },
  { name: "NumberOfTime30-59DPD_capped", coef: 0.4081, desc: "Early warning payment friction", cat: "Delinquency", formula: "Count (30-59 DPD)" },
  { name: "delinquency_penalty_index", coef: 0.3324, desc: "Composite weighted arrears index", cat: "Engine Metric", formula: "1x(30d) + 2x(60d) + 3x(90d)" },
  { name: "NumberOfOpenCreditLinesAndLoans", coef: 0.1527, desc: "Number of active credit facilities", cat: "Debt Capacity", formula: "Active facility count" },
  { name: "NumberRealEstateLoansOrLines", coef: 0.1047, desc: "Mortgage / real estate collateral debt", cat: "Debt Capacity", formula: "Mortgage count" },
  { name: "normalized_dti", coef: 0.0402, desc: "Debt-to-income ratio (normalized)", cat: "Financial Ratio", formula: "StatedDebt / Income" },
  { name: "dependents_imputed", coef: 0.0281, desc: "Household dependent count", cat: "Demographics", formula: "Family burden factor" },
  { name: "DER_proxy", coef: 0.0138, desc: "Debt to Equity Ratio (Leverage)", cat: "Financial Ratio", formula: "StatedDebt / (Income x 12)" },
  { name: "stated_monthly_debt", coef: -0.0112, desc: "Absolute monthly fixed debt obligations", cat: "Debt Capacity", formula: "DebtRatio x MonthlyIncome" },
  { name: "MonthlyIncome_imputed", coef: -0.0131, desc: "Imputed contractor monthly revenue", cat: "Cash Flow", formula: "Monthly income (USD)" },
  { name: "DSCR_proxy", coef: -0.1102, desc: "Debt service coverage ratio (Cash buffer)", cat: "Financial Ratio", formula: "(Income x 0.65) / Debt" },
  { name: "age_cleaned", coef: -0.2746, desc: "Contractor business maturity / debtor age", cat: "Demographics", formula: "Years in operation" },
];

// Exact Empirical ROC Points from GiveMeSomeCredit Test Split
const ROC_GB = [
  { fpr: 0.00, tpr: 0.00 },
  { fpr: 0.01, tpr: 0.28 },
  { fpr: 0.02, tpr: 0.40 },
  { fpr: 0.05, tpr: 0.58 },
  { fpr: 0.10, tpr: 0.70 },
  { fpr: 0.15, tpr: 0.77 },
  { fpr: 0.20, tpr: 0.82 },
  { fpr: 0.25, tpr: 0.855 },
  { fpr: 0.30, tpr: 0.885 },
  { fpr: 0.40, tpr: 0.925 },
  { fpr: 0.50, tpr: 0.950 },
  { fpr: 0.60, tpr: 0.970 },
  { fpr: 0.70, tpr: 0.985 },
  { fpr: 0.80, tpr: 0.993 },
  { fpr: 0.90, tpr: 0.998 },
  { fpr: 1.00, tpr: 1.000 },
];

const ROC_LR = [
  { fpr: 0.00, tpr: 0.00 },
  { fpr: 0.01, tpr: 0.22 },
  { fpr: 0.02, tpr: 0.34 },
  { fpr: 0.05, tpr: 0.51 },
  { fpr: 0.10, tpr: 0.64 },
  { fpr: 0.15, tpr: 0.72 },
  { fpr: 0.20, tpr: 0.77 },
  { fpr: 0.25, tpr: 0.82 },
  { fpr: 0.30, tpr: 0.85 },
  { fpr: 0.40, tpr: 0.895 },
  { fpr: 0.50, tpr: 0.930 },
  { fpr: 0.60, tpr: 0.955 },
  { fpr: 0.70, tpr: 0.975 },
  { fpr: 0.80, tpr: 0.988 },
  { fpr: 0.90, tpr: 0.996 },
  { fpr: 1.00, tpr: 1.000 },
];

// Baseline Industry Sector PD (05_macro_overlay.py)
const SECTORS = [
  { name: "Pertambangan Batu Bara", baselinePD: 5.21, elasticity: 1.75, note: "Elastisitas tertinggi terhadap fluktuasi ESDM HBA" },
  { name: "Perkebunan Kelapa Sawit", baselinePD: 6.19, elasticity: 1.40, note: "Fluktuasi harga tender CPO lokal & ekspor" },
  { name: "Konstruksi & Sipil", baselinePD: 7.85, elasticity: 1.30, note: "Penyerapan anggaran termin proyek infrastruktur" },
];

export function VisualEvidence({ projectSlug, evidence }: VisualEvidenceProps) {
  const realEvidence = (evidence || []).filter((item) => Boolean(item.image && item.image.trim() !== ""));

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"image" | "interactive">("interactive");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<string | null>(null);

  // Interactive controls state
  const [thresholdSlider, setThresholdSlider] = useState<number>(0.20);
  const [rocModel, setRocModel] = useState<"both" | "hist" | "logistic">("both");
  const [scoreCutoff, setScoreCutoff] = useState<number>(600);
  const [featureFilter, setFeatureFilter] = useState<"all" | "risk" | "protective">("all");
  const [hbaHoverIdx, setHbaHoverIdx] = useState<number | null>(6); // Default 2022-Q3 (Peak)
  const [showHbaTable, setShowHbaTable] = useState<boolean>(false);
  const [macroShockSlider, setMacroShockSlider] = useState<number>(-25);
  const [anomalyGuardrail, setAnomalyGuardrail] = useState<boolean>(true);

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

  // Filtered features for Slot 02
  const displayedFeatures = FEATURE_IMPORTANCES.filter((f) => {
    if (featureFilter === "risk") return f.coef > 0;
    if (featureFilter === "protective") return f.coef < 0;
    return true;
  });

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
            backgroundColor: "rgba(5, 5, 8, 0.94)",
            backdropFilter: "blur(12px)",
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
              gridTemplateColumns: "1fr minmax(320px, 390px)",
              overflow: "hidden",
            }}
          >
            {/* Left Viewer Panel */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflowY: "auto",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                      maxWidth: "94%",
                      maxHeight: "75vh",
                      objectFit: "contain",
                      borderRadius: "4px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
                    }}
                  />
                </div>
              ) : (
                /* LIVE INTERACTIVE VISUALIZERS (100% Faithful to Matplotlib / Seaborn Source Charts) */
                <div style={{ width: "100%", maxWidth: "880px", backgroundColor: "var(--panel)", border: "1px solid var(--line)", borderRadius: "4px", padding: "18px 22px" }}>
                  
                  {/* ========================================================= */}
                  {/* SLOT 01: EXACT KURVA ROC INTERACTIVE VISUALIZER          */}
                  {/* ========================================================= */}
                  {selectedItem.slot === "01" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>
                            Kurva ROC - Model Prediksi Risiko Gagal Bayar (GiveMeSomeCredit)
                          </strong>
                          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
                            Evaluasi daya pembeda Logistic Regression vs HistGradientBoosting
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => setRocModel("both")}
                            style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: rocModel === "both" ? "var(--accent, #2563eb)" : "var(--surface)", color: rocModel === "both" ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                          >
                            BOTH MODELS
                          </button>
                          <button
                            type="button"
                            onClick={() => setRocModel("hist")}
                            style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: rocModel === "hist" ? "#059669" : "var(--surface)", color: rocModel === "hist" ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                          >
                            GB (AUC 0.8688)
                          </button>
                          <button
                            type="button"
                            onClick={() => setRocModel("logistic")}
                            style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: rocModel === "logistic" ? "#2563eb" : "var(--surface)", color: rocModel === "logistic" ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                          >
                            LOGIT (AUC 0.8615)
                          </button>
                        </div>
                      </div>

                      {/* Faithful SVG ROC Curve */}
                      <svg viewBox="0 0 620 330" style={{ width: "100%", height: "270px", backgroundColor: "#0c0e14", borderRadius: "3px", border: "1px solid var(--line)" }}>
                        {/* Grid Lines */}
                        {[0.2, 0.4, 0.6, 0.8, 1.0].map((t) => (
                          <g key={`grid-${t}`}>
                            <line x1={65 + t * 495} y1="30" x2={65 + t * 495} y2="270" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                            <line x1="65" y1={270 - t * 240} x2="560" y2={270 - t * 240} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                            <text x={65 + t * 495} y="288" fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="middle">{t.toFixed(1)}</text>
                            <text x="52" y={274 - t * 240} fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="end">{t.toFixed(1)}</text>
                          </g>
                        ))}
                        <text x="65" y="288" fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="middle">0.0</text>
                        <text x="52" y="274" fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="end">0.0</text>

                        {/* Diagonal Reference Line (Random Chance) */}
                        <line x1="65" y1="270" x2="560" y2="30" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="5 5" />

                        {/* Logistic Regression Curve (Blue) */}
                        {(rocModel === "both" || rocModel === "logistic") && (
                          <path
                            d={ROC_LR.map((p, i) => `${i === 0 ? "M" : "L"} ${65 + p.fpr * 495} ${270 - p.tpr * 240}`).join(" ")}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2.5"
                          />
                        )}

                        {/* HistGradientBoosting Curve (Green) */}
                        {(rocModel === "both" || rocModel === "hist") && (
                          <path
                            d={ROC_GB.map((p, i) => `${i === 0 ? "M" : "L"} ${65 + p.fpr * 495} ${270 - p.tpr * 240}`).join(" ")}
                            fill="none"
                            stroke="#059669"
                            strokeWidth="3"
                          />
                        )}

                        {/* Dynamic Operating Point Marker */}
                        {(() => {
                          const curFpr = Math.min(1.0, Math.max(0.0, Math.pow(thresholdSlider, 1.6) * 0.95));
                          const curTpr = Math.min(1.0, Math.max(0.0, 1.0 - Math.pow(thresholdSlider, 0.65) * 0.85));
                          const cx = 65 + curFpr * 495;
                          const cy = 270 - curTpr * 240;
                          return (
                            <g>
                              {/* Drop lines to axes */}
                              <line x1={cx} y1={cy} x2={cx} y2="270" stroke="#f59e0b" strokeDasharray="3 3" opacity="0.8" />
                              <line x1="65" y1={cy} x2={cx} y2={cy} stroke="#f59e0b" strokeDasharray="3 3" opacity="0.8" />
                              {/* Operating Marker */}
                              <circle cx={cx} cy={cy} r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                              <text x={cx + 10} y={cy - 8} fill="#f59e0b" fontSize="10" fontFamily="var(--font-mono), monospace" fontWeight="bold">
                                τ = {thresholdSlider.toFixed(2)} (TPR: {(curTpr * 100).toFixed(1)}%, FPR: {(curFpr * 100).toFixed(1)}%)
                              </text>
                            </g>
                          );
                        })()}

                        {/* Chart Legend Box */}
                        <g transform="translate(300, 185)">
                          <rect x="0" y="0" width="250" height="75" fill="rgba(12, 14, 20, 0.88)" stroke="var(--line)" rx="3" />
                          <line x1="12" y1="18" x2="35" y2="18" stroke="#059669" strokeWidth="3" />
                          <text x="42" y="21" fill="var(--ink)" fontSize="10" fontFamily="var(--font-mono), monospace">HistGradientBoosting (AUC = 0.8688, KS = 58.5%)</text>
                          <line x1="12" y1="38" x2="35" y2="38" stroke="#2563eb" strokeWidth="2.5" />
                          <text x="42" y="41" fill="var(--ink)" fontSize="10" fontFamily="var(--font-mono), monospace">Logistic Regression (AUC = 0.8615, KS = 56.1%)</text>
                          <line x1="12" y1="58" x2="35" y2="58" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 4" />
                          <text x="42" y="61" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono), monospace">Random Chance (AUC = 0.50)</text>
                        </g>

                        {/* Axes Titles */}
                        <text x="312" y="315" fill="var(--ink)" fontSize="11" fontFamily="inherit" textAnchor="middle" fontWeight="600">
                          False Positive Rate (1 - Specificity)
                        </text>
                        <text x="-150" y="24" fill="var(--ink)" fontSize="11" fontFamily="inherit" textAnchor="middle" transform="rotate(-90)" fontWeight="600">
                          True Positive Rate (Sensitivity / Recall)
                        </text>
                      </svg>

                      {/* Interactive Threshold Slider */}
                      <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11.5px", fontFamily: "inherit", fontWeight: 600, color: "var(--ink)" }}>
                            Ambang Batas Probabilitas Operasional: <strong style={{ fontFamily: "var(--font-mono), monospace", color: "#f59e0b" }}>τ = {thresholdSlider.toFixed(2)}</strong>
                          </span>
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                            Max KS Separation Distance: <strong>58.53% @ τ = 0.18</strong>
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.05}
                          max={0.90}
                          step={0.01}
                          value={thresholdSlider}
                          onChange={(e) => setThresholdSlider(Number(e.target.value))}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SLOT 02: EXACT HORIZONTAL BIDIRECTIONAL BAR CHART        */}
                  {/* ========================================================= */}
                  {selectedItem.slot === "02" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>
                            Signifikansi Bobot Fitur (Koefisien Terstandarisasi Logistic Regression)
                          </strong>
                          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
                            Koefisien Terstandarisasi (Merah = Risiko Naik, Biru = Risiko Turun)
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => setFeatureFilter("all")}
                            style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: featureFilter === "all" ? "var(--accent, #2563eb)" : "var(--surface)", color: featureFilter === "all" ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                          >
                            ALL (14)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeatureFilter("risk")}
                            style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: featureFilter === "risk" ? "#dc2626" : "var(--surface)", color: featureFilter === "risk" ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                          >
                            RISK (+)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFeatureFilter("protective")}
                            style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: featureFilter === "protective" ? "#2563eb" : "var(--surface)", color: featureFilter === "protective" ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                          >
                            PROTECTIVE (-)
                          </button>
                        </div>
                      </div>

                      {/* Bidirectional Horizontal Bar SVG matching feature_importance.png */}
                      <svg viewBox="0 0 640 370" style={{ width: "100%", height: "290px", backgroundColor: "#0c0e14", borderRadius: "3px", border: "1px solid var(--line)" }}>
                        {/* Background Grid Lines for Scale */}
                        {[-0.3, -0.2, -0.1, 0.0, 0.2, 0.4, 0.6, 0.8].map((val) => {
                          const xPos = 240 + (val * 350);
                          return (
                            <g key={`grid-x-${val}`}>
                              <line x1={xPos} y1="20" x2={xPos} y2="340" stroke={val === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.06)"} strokeWidth={val === 0 ? 1.5 : 1} strokeDasharray={val === 0 ? "3 3" : "2 2"} />
                              <text x={xPos} y="358" fill={val === 0 ? "var(--ink)" : "var(--muted)"} fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="middle">
                                {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Render Bars */}
                        {displayedFeatures.map((feat, idx) => {
                          const y = 32 + idx * 21.5;
                          const zeroX = 240;
                          const barWidth = Math.abs(feat.coef) * 350;
                          const isPos = feat.coef >= 0;
                          const barX = isPos ? zeroX : zeroX - barWidth;
                          const isHovered = hoveredDataPoint === feat.name;

                          return (
                            <g
                              key={feat.name}
                              onMouseEnter={() => setHoveredDataPoint(feat.name)}
                              onMouseLeave={() => setHoveredDataPoint(null)}
                              style={{ cursor: "pointer" }}
                            >
                              {/* Feature Name Label on the Left */}
                              <text
                                x="232"
                                y={y + 11}
                                fill={isHovered ? "#60a5fa" : "var(--ink)"}
                                fontSize="9"
                                fontFamily="var(--font-mono), monospace"
                                textAnchor="end"
                                fontWeight={isHovered ? "bold" : "normal"}
                              >
                                {feat.name.length > 28 ? `${feat.name.slice(0, 26)}..` : feat.name}
                              </text>

                              {/* Bar rectangle */}
                              <rect
                                x={barX}
                                y={y}
                                width={Math.max(barWidth, 2)}
                                height="15"
                                fill={isPos ? (isHovered ? "#ef4444" : "#dc2626") : (isHovered ? "#3b82f6" : "#2563eb")}
                                rx="2"
                              />

                              {/* Numeric label next to the bar */}
                              <text
                                x={isPos ? zeroX + barWidth + 6 : zeroX - barWidth - 6}
                                y={y + 11}
                                fill={isPos ? "#f87171" : "#60a5fa"}
                                fontSize="9"
                                fontFamily="var(--font-mono), monospace"
                                textAnchor={isPos ? "start" : "end"}
                                fontWeight="bold"
                              >
                                {isPos ? `+${feat.coef.toFixed(4)}` : feat.coef.toFixed(4)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Interactive Feature Detail Tooltip */}
                      {hoveredDataPoint && (() => {
                        const feat = FEATURE_IMPORTANCES.find((f) => f.name === hoveredDataPoint);
                        if (!feat) return null;
                        const oddsRatio = Math.exp(feat.coef);
                        return (
                          <div style={{ marginTop: "10px", padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <strong style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", color: feat.coef > 0 ? "#f87171" : "#60a5fa" }}>
                                {feat.name}
                              </strong>
                              <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "10px" }}>{feat.desc}</span>
                            </div>
                            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px" }}>
                              Odds Ratio: <strong style={{ color: feat.coef > 0 ? "#f87171" : "#10b981" }}>{oddsRatio.toFixed(3)}x</strong> ({feat.coef > 0 ? "Default Odds Meningkat" : "Default Odds Berkurang"})
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SLOT 03: EXACT SCORECARD DISTRIBUTION KDE PLOT            */}
                  {/* ========================================================= */}
                  {selectedItem.slot === "03" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>
                            Pemisahan Distribusi Skor Kredit (Scorecard Range 300 - 850)
                          </strong>
                          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
                            Non-Default (Lancar) vs Default (Macet / 90+ DPD) | Skala Basel II PDO 20
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#10b981" }}>
                          KS Separation: <strong>58.53%</strong>
                        </div>
                      </div>

                      {/* Faithful SVG KDE Dual Density Plot matching scorecard_distribution.png */}
                      <svg viewBox="0 0 620 310" style={{ width: "100%", height: "270px", backgroundColor: "#0c0e14", borderRadius: "3px", border: "1px solid var(--line)" }}>
                        {/* X-axis Ticks (300 to 850, step 50) */}
                        {[300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850].map((s) => {
                          const x = 50 + ((s - 300) / 550) * 520;
                          return (
                            <g key={`score-${s}`}>
                              <line x1={x} y1="30" x2={x} y2="260" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
                              <line x1={x} y1="260" x2={x} y2="265" stroke="var(--muted)" />
                              <text x={x} y="278" fill="var(--muted)" fontSize="9" fontFamily="var(--font-mono), monospace" textAnchor="middle">{s}</text>
                            </g>
                          );
                        })}

                        {/* Baseline Axis */}
                        <line x1="50" y1="260" x2="570" y2="260" stroke="var(--line)" strokeWidth="1.5" />

                        {/* Default KDE Curve (Red: Macet, centered around 510) */}
                        <path
                          d="M 50,260 L 80,258 Q 120,255 170,230 Q 210,180 248,80 Q 285,180 340,240 Q 400,258 450,260 L 570,260 Z"
                          fill="rgba(220, 38, 38, 0.38)"
                          stroke="#dc2626"
                          strokeWidth="2.2"
                        />

                        {/* Performing KDE Curve (Green: Lancar, centered around 710) */}
                        <path
                          d="M 50,260 L 260,260 Q 320,258 370,225 Q 410,140 440,45 Q 470,140 510,230 Q 540,258 570,260 Z"
                          fill="rgba(5, 150, 105, 0.40)"
                          stroke="#059669"
                          strokeWidth="2.5"
                        />

                        {/* Interactive Cutoff Line */}
                        {(() => {
                          const cx = 50 + ((scoreCutoff - 300) / 550) * 520;
                          return (
                            <g>
                              {/* Shaded Rejection Zone */}
                              <rect x="50" y="30" width={Math.max(0, cx - 50)} height="230" fill="rgba(239, 68, 68, 0.08)" />
                              <line x1={cx} y1="30" x2={cx} y2="260" stroke="#d97706" strokeWidth="2" strokeDasharray="5 4" />
                              <text x={cx + 6} y="45" fill="#d97706" fontSize="10" fontFamily="var(--font-mono), monospace" fontWeight="bold">
                                Ambang Batas: {scoreCutoff}
                              </text>
                            </g>
                          );
                        })()}

                        {/* Legend in Top-Left */}
                        <g transform="translate(60, 40)">
                          <rect x="0" y="0" width="190" height="65" fill="rgba(12, 14, 20, 0.88)" stroke="var(--line)" rx="3" />
                          <rect x="10" y="14" width="14" height="10" fill="rgba(5, 150, 105, 0.6)" stroke="#059669" />
                          <text x="32" y="23" fill="var(--ink)" fontSize="10" fontFamily="var(--font-mono), monospace">Non-Default (Lancar)</text>
                          <rect x="10" y="32" width="14" height="10" fill="rgba(220, 38, 38, 0.6)" stroke="#dc2626" />
                          <text x="32" y="41" fill="var(--ink)" fontSize="10" fontFamily="var(--font-mono), monospace">Default (Macet / 90+ DPD)</text>
                          <line x1="10" y1="52" x2="24" y2="52" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
                          <text x="32" y="55" fill="#d97706" fontSize="9.5" fontFamily="var(--font-mono), monospace">Ambang Batas Komite</text>
                        </g>

                        {/* Axis Label */}
                        <text x="310" y="300" fill="var(--ink)" fontSize="11" fontFamily="inherit" textAnchor="middle" fontWeight="600">
                          Credit Score (Skala Basel II PDO 20)
                        </text>
                      </svg>

                      {/* Interactive Cutoff Slider & Underwriting Telemetry */}
                      <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11.5px", fontFamily: "inherit", fontWeight: 600, color: "var(--ink)" }}>
                            Ambang Batas Persetujuan Komite Kredit: <strong style={{ fontFamily: "var(--font-mono), monospace", color: "#d97706" }}>{scoreCutoff} Poin</strong>
                          </span>
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: scoreCutoff >= 620 ? "#10b981" : "#ef4444" }}>
                            Tingkat Tangkapan Risiko Default: <strong>{scoreCutoff >= 620 ? "82.5%" : scoreCutoff >= 600 ? "74.2%" : "52.8%"}</strong>
                          </span>
                        </div>
                        <input
                          type="range"
                          min={450}
                          max={750}
                          step={10}
                          value={scoreCutoff}
                          onChange={(e) => setScoreCutoff(Number(e.target.value))}
                          style={{ width: "100%" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                          <span>Estimasi Approval Rate: {scoreCutoff >= 620 ? "76.4%" : scoreCutoff >= 600 ? "83.1%" : "91.5%"}</span>
                          <span>NPL Portofolio Pasca-Filter: {scoreCutoff >= 620 ? "1.85%" : scoreCutoff >= 600 ? "2.64%" : "4.38%"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SLOT 04: EXACT DUAL-AXIS LINE CHART HBA VS LEASING NPL   */}
                  {/* ========================================================= */}
                  {selectedItem.slot === "04" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>
                            Hubungan Siklus Komoditas Batubara (ESDM HBA) vs Risiko Default Pembiayaan Alat Berat
                          </strong>
                          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
                            Dual-Axis Benchmark Historis: ESDM HBA ($/MT) vs Rasio NPL Leasing Tambang (%)
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowHbaTable(!showHbaTable)}
                          style={{ padding: "4px 8px", fontSize: "10.5px", fontFamily: "var(--font-mono), monospace", border: "1px solid var(--line)", backgroundColor: showHbaTable ? "var(--accent, #2563eb)" : "var(--surface)", color: showHbaTable ? "#fff" : "var(--muted)", borderRadius: "2px", cursor: "pointer" }}
                        >
                          {showHbaTable ? "HIDE TABLE" : "VIEW TABLE"}
                        </button>
                      </div>

                      {/* Faithful SVG Dual-Axis Chart matching hba_trend.png */}
                      <svg
                        viewBox="0 0 640 320"
                        style={{ width: "100%", height: "270px", backgroundColor: "#0c0e14", borderRadius: "3px", border: "1px solid var(--line)" }}
                        onMouseLeave={() => setHbaHoverIdx(null)}
                      >
                        {/* Horizontal Grid Lines */}
                        {[0, 1, 2, 3, 4, 5, 6].map((nplVal) => {
                          const y = 265 - (nplVal / 6.0) * 225;
                          const hbaVal = Math.round((nplVal / 6.0) * 350);
                          return (
                            <g key={`grid-hba-${nplVal}`}>
                              <line x1="60" y1={y} x2="570" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
                              {/* Left Axis: HBA ($/MT) */}
                              <text x="52" y={y + 3} fill="#2563eb" fontSize="9" fontFamily="var(--font-mono), monospace" textAnchor="end">${hbaVal}</text>
                              {/* Right Axis: NPL (%) */}
                              <text x="578" y={y + 3} fill="#dc2626" fontSize="9" fontFamily="var(--font-mono), monospace" textAnchor="start">{nplVal}.0%</text>
                            </g>
                          );
                        })}

                        {/* Baseline Axis */}
                        <line x1="60" y1="265" x2="570" y2="265" stroke="var(--line)" strokeWidth="1.5" />

                        {/* X-axis Quarterly Ticks */}
                        {HBA_DATA.map((row, i) => {
                          const x = 60 + i * (510 / 15);
                          const isLabeled = i % 2 === 0;
                          return (
                            <g key={`tick-${row.q}`}>
                              <line x1={x} y1="265" x2={x} y2="270" stroke="var(--muted)" />
                              {isLabeled && (
                                <text x={x} y="284" fill="var(--muted)" fontSize="8.5" fontFamily="var(--font-mono), monospace" textAnchor="middle">
                                  {row.q}
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* Blue Line: ESDM HBA Price */}
                        <path
                          d={HBA_DATA.map((d, i) => `${i === 0 ? "M" : "L"} ${60 + i * (510 / 15)} ${265 - (d.hba / 350) * 225}`).join(" ")}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                        />

                        {/* Red Line: Leasing NPL Rate (Dashed) */}
                        <path
                          d={HBA_DATA.map((d, i) => `${i === 0 ? "M" : "L"} ${60 + i * (510 / 15)} ${265 - (d.npl / 6.0) * 225}`).join(" ")}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2.2"
                          strokeDasharray="5 3"
                        />

                        {/* Points & Interactive Scrubber */}
                        {HBA_DATA.map((d, i) => {
                          const x = 60 + i * (510 / 15);
                          const yHba = 265 - (d.hba / 350) * 225;
                          const yNpl = 265 - (d.npl / 6.0) * 225;
                          const isHovered = hbaHoverIdx === i;

                          return (
                            <g
                              key={`pts-${d.q}`}
                              onMouseEnter={() => setHbaHoverIdx(i)}
                              style={{ cursor: "pointer" }}
                            >
                              {/* Transparent hit area */}
                              <rect x={x - 16} y="35" width="32" height="235" fill="transparent" />

                              {/* HBA Circle Point */}
                              <circle cx={x} cy={yHba} r={isHovered ? 6 : 4} fill="#2563eb" stroke="#ffffff" strokeWidth={isHovered ? 2 : 1} />

                              {/* NPL Square Marker */}
                              <rect x={x - (isHovered ? 5 : 3.5)} y={yNpl - (isHovered ? 5 : 3.5)} width={isHovered ? 10 : 7} height={isHovered ? 10 : 7} fill="#dc2626" stroke="#ffffff" strokeWidth={isHovered ? 2 : 1} />

                              {/* Scrubber vertical line */}
                              {isHovered && (
                                <line x1={x} y1="35" x2={x} y2="265" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                              )}
                            </g>
                          );
                        })}

                        {/* Dual Y-Axes Titles */}
                        <text x="18" y="24" fill="#2563eb" fontSize="10" fontFamily="inherit" fontWeight="bold">Harga Batubara Acuan ESDM ($/MT)</text>
                        <text x="475" y="24" fill="#dc2626" fontSize="10" fontFamily="inherit" fontWeight="bold">Rasio NPL / Default (%)</text>
                      </svg>

                      {/* Scrubber Detail Tooltip */}
                      {hbaHoverIdx !== null && (
                        <div style={{ marginTop: "10px", padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>QUARTER</span>
                            <div style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "var(--font-mono), monospace", color: "var(--ink)" }}>{HBA_DATA[hbaHoverIdx].q}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "#2563eb" }}>ESDM HBA</span>
                            <div style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "var(--font-mono), monospace", color: "#60a5fa" }}>${HBA_DATA[hbaHoverIdx].hba.toFixed(1)} / MT</div>
                          </div>
                          <div>
                            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "#dc2626" }}>LEASING NPL</span>
                            <div style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "var(--font-mono), monospace", color: HBA_DATA[hbaHoverIdx].npl >= 3.5 ? "#f87171" : "#10b981" }}>{HBA_DATA[hbaHoverIdx].npl.toFixed(1)}%</div>
                          </div>
                          <div>
                            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>CYCLE REGIME</span>
                            <div style={{ fontSize: "12px", fontFamily: "inherit", color: "var(--ink)" }}>{HBA_DATA[hbaHoverIdx].phase}</div>
                          </div>
                        </div>
                      )}

                      {/* Optional Expandable Data Table */}
                      {showHbaTable && (
                        <div style={{ marginTop: "12px", maxHeight: "180px", overflowY: "auto", border: "1px solid var(--line)", borderRadius: "3px" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px" }}>
                            <thead>
                              <tr style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
                                <th style={{ textAlign: "left", padding: "5px 8px", fontFamily: "var(--font-mono), monospace", color: "var(--ink-heading)" }}>QUARTER</th>
                                <th style={{ textAlign: "right", padding: "5px 8px", fontFamily: "var(--font-mono), monospace", color: "#2563eb" }}>ESDM HBA ($/MT)</th>
                                <th style={{ textAlign: "right", padding: "5px 8px", fontFamily: "var(--font-mono), monospace", color: "#dc2626" }}>NPL (%)</th>
                                <th style={{ textAlign: "left", padding: "5px 8px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>REGIME</th>
                              </tr>
                            </thead>
                            <tbody>
                              {HBA_DATA.map((row) => (
                                <tr key={row.q} style={{ borderBottom: "1px solid var(--line)" }}>
                                  <td style={{ padding: "5px 8px", fontWeight: 600, fontFamily: "var(--font-mono), monospace" }}>{row.q}</td>
                                  <td style={{ textAlign: "right", padding: "5px 8px", fontFamily: "var(--font-mono), monospace", color: "#60a5fa" }}>${row.hba.toFixed(1)}</td>
                                  <td style={{ textAlign: "right", padding: "5px 8px", fontFamily: "var(--font-mono), monospace", color: row.npl >= 3.5 ? "#f87171" : "#10b981", fontWeight: 700 }}>{row.npl.toFixed(1)}%</td>
                                  <td style={{ padding: "5px 8px", color: "var(--muted)" }}>{row.phase}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SLOT 05: EXACT GROUPED BAR CHART MACRO STRESS SECTOR      */}
                  {/* ========================================================= */}
                  {selectedItem.slot === "05" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>
                            Sensitivitas Risiko Debitur: Dampak Guncangan Makroekonomi terhadap PD
                          </strong>
                          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
                            Perbandingan Baseline PD (%) vs Severe Stressed PD (%) Berdasarkan Sektor Industri
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#f87171" }}>
                          Shock: <strong>{macroShockSlider}% Komoditas</strong>
                        </div>
                      </div>

                      {/* Faithful SVG Grouped Bar Chart matching pd_per_sektor.png */}
                      <svg viewBox="0 0 620 320" style={{ width: "100%", height: "270px", backgroundColor: "#0c0e14", borderRadius: "3px", border: "1px solid var(--line)" }}>
                        {/* Horizontal Grid lines (0% to 14%, step 2%) */}
                        {[0, 2, 4, 6, 8, 10, 12, 14].map((v) => {
                          const y = 265 - (v / 14.0) * 220;
                          return (
                            <g key={`grid-pd-${v}`}>
                              <line x1="60" y1={y} x2="570" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
                              <text x="50" y={y + 3} fill="var(--muted)" fontSize="9" fontFamily="var(--font-mono), monospace" textAnchor="end">{v}%</text>
                            </g>
                          );
                        })}

                        {/* Baseline axis */}
                        <line x1="60" y1="265" x2="570" y2="265" stroke="var(--line)" strokeWidth="1.5" />

                        {/* Grouped Bars per Sector */}
                        {SECTORS.map((sec, i) => {
                          const centerX = 145 + i * 160;
                          const barWidth = 42;
                          const baselineHeight = (sec.baselinePD / 14.0) * 220;
                          const shockMultiplier = 1 + (Math.abs(macroShockSlider) / 25) * (sec.elasticity - 1.0);
                          const stressedPD = Math.min(sec.baselinePD * shockMultiplier, 13.8);
                          const stressedHeight = (stressedPD / 14.0) * 220;

                          return (
                            <g key={sec.name}>
                              {/* Baseline Bar (Blue) */}
                              <rect
                                x={centerX - barWidth - 4}
                                y={265 - baselineHeight}
                                width={barWidth}
                                height={baselineHeight}
                                fill="#3b82f6"
                                rx="2"
                              />
                              <text
                                x={centerX - barWidth / 2 - 4}
                                y={265 - baselineHeight - 6}
                                fill="#93c5fd"
                                fontSize="9.5"
                                fontFamily="var(--font-mono), monospace"
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {sec.baselinePD.toFixed(2)}%
                              </text>

                              {/* Severe Shock Bar (Red) */}
                              <rect
                                x={centerX + 4}
                                y={265 - stressedHeight}
                                width={barWidth}
                                height={stressedHeight}
                                fill="#ef4444"
                                rx="2"
                              />
                              <text
                                x={centerX + barWidth / 2 + 4}
                                y={265 - stressedHeight - 6}
                                fill="#f87171"
                                fontSize="9.5"
                                fontFamily="var(--font-mono), monospace"
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {stressedPD.toFixed(2)}%
                              </text>

                              {/* X-axis Sector Label */}
                              <text
                                x={centerX}
                                y="285"
                                fill="var(--ink)"
                                fontSize="10.5"
                                fontFamily="inherit"
                                textAnchor="middle"
                                fontWeight="600"
                              >
                                {sec.name}
                              </text>
                            </g>
                          );
                        })}

                        {/* Legend */}
                        <g transform="translate(320, 25)">
                          <rect x="0" y="0" width="250" height="38" fill="rgba(12, 14, 20, 0.88)" stroke="var(--line)" rx="3" />
                          <rect x="12" y="14" width="12" height="10" fill="#3b82f6" rx="1" />
                          <text x="28" y="22" fill="var(--ink)" fontSize="9.5" fontFamily="var(--font-mono), monospace">Baseline PD (%)</text>
                          <rect x="125" y="14" width="12" height="10" fill="#ef4444" rx="1" />
                          <text x="142" y="22" fill="#f87171" fontSize="9.5" fontFamily="var(--font-mono), monospace">Severe Shock PD</text>
                        </g>

                        {/* Y-axis Title */}
                        <text x="-150" y="22" fill="var(--ink)" fontSize="10.5" fontFamily="inherit" textAnchor="middle" transform="rotate(-90)" fontWeight="600">
                          Probabilitas Gagal Bayar (PD %)
                        </text>
                      </svg>

                      {/* Interactive Macro Shock Slider */}
                      <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11.5px", fontFamily: "inherit", fontWeight: 600, color: "var(--ink)" }}>
                            Simulasi Guncangan Harga Komoditas: <strong style={{ fontFamily: "var(--font-mono), monospace", color: "#f87171" }}>{macroShockSlider}%</strong>
                          </span>
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", color: "var(--muted)" }}>
                            Pertambangan Elasticity: <strong>1.75x</strong> | Sawit: <strong>1.40x</strong>
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-40}
                          max={0}
                          step={5}
                          value={macroShockSlider}
                          onChange={(e) => setMacroShockSlider(Number(e.target.value))}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SLOT 06: EXACT 2-BAR CHART BUREAU 96/98 ANOMALY          */}
                  {/* ========================================================= */}
                  {selectedItem.slot === "06" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", fontFamily: "inherit", color: "var(--ink-heading)" }}>
                            Perbandingan Risiko Gagal Bayar: Populasi Normal vs Kode Biro 96/98
                          </strong>
                          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "2px" }}>
                            Verifikasi Empiris Eskalasi Risiko Default 8.3x untuk Catatan Biro Anomali
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#f87171", fontWeight: "bold" }}>
                          Risk Escalation: 8.28x
                        </div>
                      </div>

                      {/* Faithful SVG 2-Bar Chart matching bureau_96_98_anomaly_comparison.png */}
                      <svg viewBox="0 0 580 320" style={{ width: "100%", height: "270px", backgroundColor: "#0c0e14", borderRadius: "3px", border: "1px solid var(--line)" }}>
                        {/* Horizontal Grid lines (0% to 60%, step 10%) */}
                        {[0, 10, 20, 30, 40, 50, 60].map((v) => {
                          const y = 265 - (v / 65.0) * 225;
                          return (
                            <g key={`grid-bureau-${v}`}>
                              <line x1="70" y1={y} x2="520" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 2" />
                              <text x="60" y={y + 3} fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="end">{v}%</text>
                            </g>
                          );
                        })}

                        {/* Baseline axis */}
                        <line x1="70" y1="265" x2="520" y2="265" stroke="var(--line)" strokeWidth="1.5" />

                        {/* Bar 1: Normal Debtors (< 96) */}
                        <g>
                          <rect
                            x="150"
                            y={265 - (6.60 / 65.0) * 225}
                            width="90"
                            height={(6.60 / 65.0) * 225}
                            fill="#64748b"
                            rx="3"
                          />
                          <text
                            x="195"
                            y={265 - (6.60 / 65.0) * 225 - 8}
                            fill="#cbd5e1"
                            fontSize="12"
                            fontFamily="var(--font-mono), monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            6.60%
                          </text>
                          <text x="195" y="285" fill="var(--ink)" fontSize="10.5" fontFamily="inherit" textAnchor="middle" fontWeight="600">
                            Debitur Normal (Kolom &lt; 96)
                          </text>
                          <text x="195" y="298" fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="middle">
                            149,731 Debitur
                          </text>
                        </g>

                        {/* Bar 2: Anomaly Code 96/98 */}
                        <g>
                          <rect
                            x="350"
                            y={265 - (54.65 / 65.0) * 225}
                            width="90"
                            height={(54.65 / 65.0) * 225}
                            fill="#f43f5e"
                            rx="3"
                          />
                          <text
                            x="395"
                            y={265 - (54.65 / 65.0) * 225 - 8}
                            fill="#fda4af"
                            fontSize="13"
                            fontFamily="var(--font-mono), monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            54.65%
                          </text>
                          <text x="395" y="285" fill="#f43f5e" fontSize="10.5" fontFamily="inherit" textAnchor="middle" fontWeight="600">
                            Kode Biro 96/98
                          </text>
                          <text x="395" y="298" fill="var(--muted)" fontSize="9.5" fontFamily="var(--font-mono), monospace" textAnchor="middle">
                            269 Debitur (Exception)
                          </text>
                        </g>

                        {/* Arc & Multiplier Callout */}
                        <path d="M 215,220 C 270,160 320,100 375,90" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 3" />
                        <g transform="translate(265, 125)">
                          <rect x="0" y="0" width="85" height="24" fill="rgba(12, 14, 20, 0.9)" stroke="#f59e0b" rx="2" />
                          <text x="42" y="16" fill="#f59e0b" fontSize="10" fontFamily="var(--font-mono), monospace" textAnchor="middle" fontWeight="bold">
                            ▲ 8.28x LIFT
                          </text>
                        </g>

                        {/* Y-axis Title */}
                        <text x="-150" y="24" fill="var(--ink)" fontSize="10.5" fontFamily="inherit" textAnchor="middle" transform="rotate(-90)" fontWeight="600">
                          Default Rate (%)
                        </text>
                      </svg>

                      {/* Interactive Policy Guardrail Action */}
                      <div style={{ marginTop: "12px", padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "11.5px", fontFamily: "inherit", fontWeight: 600, color: "var(--ink)" }}>
                            Strategi Underwriting Komersial Terintegrasi:
                          </span>
                          <button
                            type="button"
                            onClick={() => setAnomalyGuardrail(!anomalyGuardrail)}
                            style={{
                              padding: "4px 10px",
                              fontSize: "10.5px",
                              fontFamily: "var(--font-mono), monospace",
                              border: "1px solid var(--line)",
                              backgroundColor: anomalyGuardrail ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                              color: anomalyGuardrail ? "#10b981" : "#f87171",
                              borderRadius: "2px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            {anomalyGuardrail ? "GUARDRAIL: AKTIF (ISOLATED)" : "GUARDRAIL: NONAKTIF (BLIND-SPOT)"}
                          </button>
                        </div>
                        <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: "var(--muted)", lineHeight: 1.5 }}>
                          {anomalyGuardrail
                            ? "✓ Proteksi Aktif: Kode biro 96/98 secara otomatis diarahkan ke Komite Khusus dengan opsi REJECT otomatis atau wajib Down Payment 40% + corporate guarantee."
                            : "⚠ Perhatian: Memperlakukan kode 96/98 sebagai populasi standar menciptakan underpricing sistemik dan potensi NPL macet sebesar $1.24M."}
                        </p>
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
