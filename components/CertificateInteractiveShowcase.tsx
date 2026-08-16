"use client";

import React, { useState, useEffect } from "react";

type TemplateTheme = "obsidian" | "gold" | "emerald";

type ParticipantRecord = {
  id: string;
  name: string;
  role: string;
  event: string;
  date: string;
  cert_id: string;
};

const MOCK_ROSTER: ParticipantRecord[] = [
  { id: "1", name: "Dr. Helena Rossi", role: "Keynote Speaker", event: "International Data Engineering Symposium 2024", date: "November 14, 2024", cert_id: "CERT-2024-8841A" },
  { id: "2", name: "Alexandre Silva", role: "Participant (Honors)", event: "Advanced Python Automation Masterclass", date: "November 14, 2024", cert_id: "CERT-2024-8842B" },
  { id: "3", name: "Beatriz Mendonça", role: "Workshop Lead", event: "High-Throughput ETL & Pipeline Architecture", date: "November 14, 2024", cert_id: "CERT-2024-8843C" },
  { id: "4", name: "Gabriel Santos", role: "Participant", event: "Distributed Database & SQL Optimization", date: "November 14, 2024", cert_id: "CERT-2024-8844D" },
  { id: "5", name: "Mariana Oliveira", role: "Panelist", event: "AI & Autonomous Agentic Workflow Summit", date: "November 14, 2024", cert_id: "CERT-2024-8845E" },
];

export function CertificateInteractiveShowcase() {
  const [selectedTheme, setSelectedTheme] = useState<TemplateTheme>("obsidian");
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRecord>(MOCK_ROSTER[0]);
  const [fontSize, setFontSize] = useState<number>(24);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generationComplete, setGenerationComplete] = useState<boolean>(false);

  // Batch simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsGenerating(false);
            setGenerationComplete(true);
            return 100;
          }
          return prev + 5;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleStartBatch = () => {
    setProgress(0);
    setGenerationComplete(false);
    setIsGenerating(true);
  };

  // Theme styling configurations
  const themeStyles = {
    obsidian: {
      bg: "linear-gradient(135deg, #0e0e14 0%, #161622 100%)",
      border: "2px solid var(--accent)",
      accentText: "var(--accent)",
      subText: "#9e9ea8",
      sealBg: "var(--accent-subtle)",
      sealBorder: "var(--accent)",
    },
    gold: {
      bg: "linear-gradient(135deg, #14120a 0%, #221d12 100%)",
      border: "2px solid rgba(245, 158, 11, 0.6)",
      accentText: "#fbbf24",
      subText: "#b5a882",
      sealBg: "rgba(245, 158, 11, 0.15)",
      sealBorder: "#f59e0b",
    },
    emerald: {
      bg: "linear-gradient(135deg, #08140f 0%, #0d2218 100%)",
      border: "2px solid rgba(16, 185, 129, 0.6)",
      accentText: "#34d399",
      subText: "#82b59b",
      sealBg: "rgba(16, 185, 129, 0.15)",
      sealBorder: "#10b981",
    }
  }[selectedTheme];

  return (
    <div
      style={{
        margin: "36px 0",
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "22px 20px",
      }}
      aria-label="Certificate Generator Interactive Simulator"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12, marginBottom: 18 }}>
        <span className="mono" style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          DESKTOP AUTOMATION ENGINE • PYTHON (CUSTOMTKINTER + REPORTLAB + PILLOW)
        </span>
        <h3 style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", margin: "3px 0 0" }}>
          Interactive Certificate Canvas & Live Batch Compilation Simulator
        </h3>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, alignItems: "start", marginBottom: 20 }}>
        {/* Left Column: Live Certificate Canvas Preview */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 9 }}>LIVE 300-DPI VECTOR CANVAS PREVIEW</span>
            <div style={{ display: "flex", gap: 6 }}>
              {(["obsidian", "gold", "emerald"] as TemplateTheme[]).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 8,
                    padding: "3px 7px",
                    backgroundColor: selectedTheme === theme ? "var(--accent)" : "var(--surface-secondary)",
                    color: selectedTheme === theme ? "#ffffff" : "var(--dim)",
                    border: "1px solid var(--line)",
                    borderRadius: 2,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Certificate Card Canvas */}
          <div
            style={{
              background: themeStyles.bg,
              border: themeStyles.border,
              borderRadius: 4,
              padding: "28px 24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              position: "relative",
              minHeight: 250,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              transition: "all 0.25s ease",
            }}
          >
            {/* Header / Org Tag */}
            <div>
              <span className="mono" style={{ fontSize: 9, letterSpacing: "0.2em", color: themeStyles.subText, textTransform: "uppercase" }}>
                CERTIFICATE OF APPRECIATION & EXCELLENCE
              </span>
              <p style={{ margin: "4px 0 0", color: "#8a8a94", fontSize: 11 }}>This certificate is proudly awarded to</p>
            </div>

            {/* Dynamic Stamped Participant Name */}
            <div style={{ margin: "14px 0" }}>
              <h2
                style={{
                  fontSize: fontSize,
                  color: "#ffffff",
                  fontFamily: "'Georgia', serif",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  transition: "font-size 0.15s ease",
                }}
              >
                {selectedParticipant.name}
              </h2>
              <span className="mono" style={{ fontSize: 11, color: themeStyles.accentText, display: "block", marginTop: 4 }}>
                [{selectedParticipant.role.toUpperCase()}]
              </span>
            </div>

            {/* Event & Meta Details */}
            <div>
              <p style={{ margin: 0, color: "#d0d0d8", fontSize: 11, fontWeight: 500 }}>
                {selectedParticipant.event}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
                <span className="mono" style={{ fontSize: 8, color: "#888892" }}>
                  DATE: {selectedParticipant.date.toUpperCase()}
                </span>

                {/* Digital Verified Seal */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: themeStyles.sealBg, border: `1px solid ${themeStyles.sealBorder}`, padding: "2px 6px", borderRadius: 3 }}>
                  <span style={{ fontSize: 9, color: themeStyles.accentText }}>★</span>
                  <span className="mono" style={{ fontSize: 7, color: "#ffffff", letterSpacing: "0.08em" }}>VERIFIED VECTOR ID</span>
                </div>

                <span className="mono" style={{ fontSize: 8, color: "#888892" }}>
                  {selectedParticipant.cert_id}
                </span>
              </div>
            </div>
          </div>

          {/* Canvas Controls: Font Size Slider */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, backgroundColor: "var(--surface-secondary)", padding: "8px 12px", borderRadius: 3, border: "1px solid var(--line)" }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
              TRUE-TYPE DYNAMIC FONT SIZE: <strong style={{ color: "var(--accent)" }}>{fontSize}px</strong>
            </span>
            <input
              type="range"
              min={18}
              max={32}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ accentColor: "var(--accent)", cursor: "pointer", width: 140 }}
            />
          </div>
        </div>

        {/* Right Column: Excel Roster Selector & Batch Runner */}
        <div>
          {/* Excel Roster Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 9 }}>EXCEL ROSTER INGESTION (MOCK PARTICIPANTS)</span>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>5 RECORDS LOADED</span>
          </div>

          {/* Roster Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {MOCK_ROSTER.map((person) => {
              const isCurrent = selectedParticipant.id === person.id;
              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedParticipant(person)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: isCurrent ? "var(--accent-subtle)" : "var(--surface-secondary)",
                    border: isCurrent ? "1px solid var(--accent)" : "1px solid var(--line)",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 12, color: isCurrent ? "var(--ink-heading)" : "var(--ink)" }}>{person.name}</strong>
                    <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>{person.role}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 8, color: isCurrent ? "var(--accent)" : "var(--dim)" }}>{person.cert_id}</span>
                </div>
              );
            })}
          </div>

          {/* Batch Generation Simulator Box */}
          <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "14px", borderRadius: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>BATCH COMPILATION SIMULATOR</span>
              <span className="mono" style={{ fontSize: 8, color: "var(--dim)" }}>500 PDFs • REPORTLAB</span>
            </div>

            <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 11, lineHeight: 1.4 }}>
              Simulates multi-threaded PDF compilation with automated true-type centering and CMYK/RGB 300-DPI rasterization.
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleStartBatch}
              disabled={isGenerating}
              style={{
                width: "100%",
                padding: "9px",
                backgroundColor: isGenerating ? "var(--surface-secondary)" : "var(--accent)",
                color: isGenerating ? "var(--dim)" : "#ffffff",
                border: "1px solid var(--line)",
                borderRadius: 2,
                cursor: isGenerating ? "not-allowed" : "pointer",
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                fontWeight: "bold",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
                marginBottom: 10,
              }}
            >
              {isGenerating ? `COMPILING BATCH... ${progress}%` : "▶ RUN BATCH GENERATION (500 CERTS)"}
            </button>

            {/* Progress Bar */}
            <div style={{ width: "100%", height: 6, backgroundColor: "var(--panel)", borderRadius: 3, overflow: "hidden", border: "1px solid var(--line)", marginBottom: 8 }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "var(--accent)",
                  transition: "width 0.05s linear",
                }}
              />
            </div>

            {/* Telemetry Output */}
            {generationComplete ? (
              <div style={{ backgroundColor: "var(--accent-subtle)", border: "1px solid var(--accent)", padding: "8px 10px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: 11, color: "var(--ink-heading)", display: "block" }}>BATCH COMPILATION COMPLETE!</strong>
                  <span className="mono" style={{ fontSize: 8, color: "var(--ink)" }}>500/500 PDFs GENERATED IN 24.8s (~20.2 CERTS/SEC)</span>
                </div>
                <span style={{ color: "var(--accent)", fontSize: 16 }}>✓</span>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontFamily: "monospace", color: "var(--dim)" }}>
                <span>THROUGHPUT: ~20.2 CERTS/S</span>
                <span>ERROR RATE: 0.00%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Quantitative KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>CYCLE TIME REDUCTION</span>
          <strong style={{ fontSize: 16, color: "var(--accent)", fontFamily: "monospace" }}>99.8% Faster</strong>
          <span style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>From 4 hours to 24.8s</span>
        </div>

        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>BATCH THROUGHPUT</span>
          <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>20.2 certs/sec</strong>
          <span style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>ReportLab multi-thread</span>
        </div>

        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>TYPOGRAPHICAL ERROR</span>
          <strong style={{ fontSize: 16, color: "#10b981", fontFamily: "monospace" }}>0.00% Error</strong>
          <span style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>Direct Excel cell binding</span>
        </div>

        <div style={{ backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line)", padding: "10px 12px", borderRadius: 2 }}>
          <span className="mono" style={{ fontSize: 8, color: "var(--dim)", display: "block" }}>DEPLOYMENT ARCHITECTURE</span>
          <strong style={{ fontSize: 16, color: "var(--ink-heading)", fontFamily: "monospace" }}>Zero-Install .EXE</strong>
          <span style={{ fontSize: 9, color: "var(--muted)", display: "block" }}>PyInstaller standalone</span>
        </div>
      </div>
    </div>
  );
}
