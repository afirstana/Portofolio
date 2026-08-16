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
      border: "2px solid rgba(255, 77, 28, 0.4)",
      accentText: "var(--accent)",
      subText: "#9e9ea8",
      sealBg: "rgba(255, 77, 28, 0.15)",
      sealBorder: "var(--accent)",
    },
    gold: {
      bg: "linear-gradient(135deg, #14120a 0%, #221d12 100%)",
      border: "2px solid rgba(245, 158, 11, 0.5)",
      accentText: "#fbbf24",
      subText: "#b5a882",
      sealBg: "rgba(245, 158, 11, 0.15)",
      sealBorder: "#f59e0b",
    },
    emerald: {
      bg: "linear-gradient(135deg, #08140f 0%, #0d2218 100%)",
      border: "2px solid rgba(16, 185, 129, 0.5)",
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
        backgroundColor: "#07070a",
        border: "1px solid #1c1c24",
        borderRadius: 4,
        padding: "22px 20px",
      }}
      aria-label="Certificate Generator Interactive Simulator"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid #181822", paddingBottom: 12, marginBottom: 18 }}>
        <span className="mono" style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          DESKTOP AUTOMATION ENGINE • PYTHON (CUSTOMTKINTER + REPORTLAB + PILLOW)
        </span>
        <h3 style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "#ffffff", letterSpacing: "-0.03em", margin: "3px 0 0" }}>
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
                    backgroundColor: selectedTheme === theme ? "var(--accent)" : "#121218",
                    color: selectedTheme === theme ? "#ffffff" : "#888892",
                    border: "1px solid #22222c",
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
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
              <p style={{ margin: "0 0 12px", color: themeStyles.subText, fontSize: 11, lineHeight: 1.4 }}>
                For outstanding contribution during <strong style={{ color: "#ffffff" }}>{selectedParticipant.event}</strong>
              </p>

              {/* Footer Meta Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, fontSize: 9 }}>
                <div style={{ textAlign: "left" }}>
                  <span className="mono" style={{ color: "var(--dim)", display: "block" }}>ISSUE DATE:</span>
                  <span className="mono" style={{ color: "#d0d0d8" }}>{selectedParticipant.date}</span>
                </div>

                {/* Decorative Verified Seal */}
                <div
                  style={{
                    backgroundColor: themeStyles.sealBg,
                    border: `1px solid ${themeStyles.sealBorder}`,
                    padding: "3px 8px",
                    borderRadius: 3,
                  }}
                >
                  <span className="mono" style={{ color: themeStyles.accentText, fontSize: 8 }}>★ VERIFIED CREDENTIAL ★</span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="mono" style={{ color: "var(--dim)", display: "block" }}>UNIQUE ID:</span>
                  <span className="mono" style={{ color: "#d0d0d8" }}>{selectedParticipant.cert_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Excel Roster Selector & Controls */}
        <div style={{ backgroundColor: "#0a0a0e", border: "1px solid #1c1c26", borderRadius: 3, padding: "16px 18px" }}>
          <span className="mono" style={{ color: "var(--accent)", fontSize: 9, display: "block", marginBottom: 8 }}>
            EXCEL ROSTER SIMULATOR (.XLSX / .CSV)
          </span>

          <p style={{ margin: "0 0 10px", color: "#a0a0a8", fontSize: 11 }}>
            Select a participant record to test dynamic TrueType font auto-centering and column schema mapping:
          </p>

          {/* Roster List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {MOCK_ROSTER.map((p) => {
              const isSelected = selectedParticipant.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedParticipant(p)}
                  style={{
                    padding: "7px 10px",
                    backgroundColor: isSelected ? "rgba(255,77,28,0.12)" : "#0e0e14",
                    border: isSelected ? "1px solid var(--accent)" : "1px solid #1a1a24",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 400, color: isSelected ? "#ffffff" : "#c0c0c8" }}>
                    {p.name}
                  </span>
                  <span className="mono" style={{ fontSize: 8, color: isSelected ? "var(--accent)" : "var(--dim)" }}>
                    {p.role}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic Coordinate / Font Adjuster */}
          <div style={{ borderTop: "1px solid #161620", paddingTop: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span className="mono" style={{ color: "var(--dim)", fontSize: 8 }}>NAME FONT SIZE: {fontSize}px</span>
            </div>
            <input
              type="range"
              min="18"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
            />
          </div>

          {/* Batch Trigger Button */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleStartBatch}
            style={{
              width: "100%",
              padding: "10px 14px",
              backgroundColor: isGenerating ? "#22222a" : "var(--accent)",
              color: "#ffffff",
              border: "none",
              borderRadius: 3,
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              fontWeight: 700,
              cursor: isGenerating ? "not-allowed" : "pointer",
              letterSpacing: "0.05em",
              transition: "background 0.2s ease",
            }}
          >
            {isGenerating ? `COMPILING BATCH... (${progress}%)` : "▶ RUN BATCH COMPILATION (500 CERTS)"}
          </button>
        </div>
      </div>

      {/* High-Speed Batch Telemetry & Progress Bar */}
      <div style={{ backgroundColor: "#0b0b10", border: "1px solid #1a1a24", borderRadius: 3, padding: "14px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="mono" style={{ color: "var(--accent)", fontSize: 9 }}>BATCH COMPILATION ENGINE</span>
            {generationComplete && (
              <span className="mono" style={{ fontSize: 8, color: "#34d399", backgroundColor: "rgba(16,185,129,0.15)", padding: "1px 5px", borderRadius: 2 }}>
                ✓ 500 PDFS GENERATED IN 24.8s
              </span>
            )}
          </div>

          <span className="mono" style={{ fontSize: 9, color: "var(--dim)" }}>
            THROUGHPUT: ~20.2 CERTS/SEC • 300 DPI
          </span>
        </div>

        {/* Progress Bar Container */}
        <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
          <div
            style={{
              height: "100%",
              width: `${isGenerating ? progress : (generationComplete ? 100 : 0)}%`,
              backgroundColor: generationComplete ? "#34d399" : "var(--accent)",
              transition: "width 0.1s ease-out",
            }}
          />
        </div>

        {/* 3 Metric Summary Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 10 }}>
          <div>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block" }}>MANUAL WORKFLOW</span>
            <strong style={{ color: "#ef4444", fontFamily: "monospace" }}>~4.0 Hours (Canva/Photoshop)</strong>
          </div>
          <div>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block" }}>AUTOMATED EXECUTION</span>
            <strong style={{ color: "#34d399", fontFamily: "monospace" }}>24.8 Seconds (99.8% Faster)</strong>
          </div>
          <div>
            <span className="mono" style={{ color: "var(--dim)", fontSize: 8, display: "block" }}>DEPLOYMENT SPEC</span>
            <strong style={{ color: "#ffffff", fontFamily: "monospace" }}>Zero-Install Standalone .EXE</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
