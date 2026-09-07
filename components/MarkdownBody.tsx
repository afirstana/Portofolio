import React from "react";

function parseMathToCleanUnicode(raw: string): string {
  return raw
    .replace(/\\begin\{aligned\}/g, "")
    .replace(/\\end\{aligned\}/g, "")
    .replace(/\\text\{([^\}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^\}]+)\}/g, "$1")
    .replace(/\\mathbf\{([^\}]+)\}/g, "$1")
    .replace(/\\operatorname\{([^\}]+)\}/g, "$1")
    .replace(/\\operatorname/g, "")
    .replace(/\\sum_\{i=1\}\^\{?([^\}]+)\}?/g, "∑(i=1..$1)")
    .replace(/\\sum_\{k=1\}\^\{?([^\}]+)\}?/g, "∑(k=1..$1)")
    .replace(/\\sum_\{([^\}]+)\}/g, "∑($1)")
    .replace(/\\sum/g, "∑")
    .replace(/_\{([^\}]+)\}/g, "_$1")
    .replace(/\\mathcal\{M\}/g, "ℳ")
    .replace(/\\mathcal\{T\}/g, "𝒯")
    .replace(/\\mathcal\{R\}/g, "ℛ")
    .replace(/\\mathcal\{([^\}]+)\}/g, "$1")
    .replace(/\\mathbb\{R\}\^?\+?/g, "ℝ⁺")
    .replace(/\\mathbb\{([^\}]+)\}/g, "$1")
    .replace(/\\longmapsto/g, " ⟶ ")
    .replace(/\\longrightarrow/g, " ⟶ ")
    .replace(/\\rightarrow/g, " → ")
    .replace(/\\to\b/g, " → ")
    .replace(/\\in\b/g, " ∈ ")
    .replace(/\\theta/g, "θ")
    .replace(/\\phi/g, "ϕ")
    .replace(/\\delta_k\^2/g, "δₖ²")
    .replace(/\\delta_k/g, "δₖ")
    .replace(/\\delta/g, "δ")
    .replace(/\\gamma_k/g, "γₖ")
    .replace(/\\gamma/g, "γ")
    .replace(/\\kappa/g, "κ")
    .replace(/\\dots/g, "...")
    .replace(/\\cdots/g, "···")
    .replace(/&=/g, " = ")
    .replace(/\\\\/g, "\n")
    .replace(/\\left\(\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\\right\)/g, "($1 / $2)")
    .replace(/\\left\[\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\\right\]/g, "[$1 / $2]")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    .replace(/\\left\s*[\(\[\{]/g, "(")
    .replace(/\\right\s*[\)\]\}]/g, ")")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\arg\\max/g, "argmax")
    .replace(/\\argmax/g, "argmax")
    .replace(/\\max_\{([^\}]+)\}/g, "max[$1]")
    .replace(/\\min_\{([^\}]+)\}/g, "min[$1]")
    .replace(/\\max/g, "max")
    .replace(/\\min/g, "min")
    .replace(/\\qquad/g, "    ")
    .replace(/\\quad\s*and\s*\\quad/g, "   and   ")
    .replace(/\\quad\s*\\text\{and\}\s*\\quad/g, "   and   ")
    .replace(/\\quad/g, "   ")
    .replace(/\\sqrt\{([^\}]+)\}/g, "√($1)")
    .replace(/\\sqrt/g, "√")
    .replace(/\\Delta\s*\\phi/g, "Δϕ")
    .replace(/\\Delta\s*\\lambda/g, "Δλ")
    .replace(/\\Delta\s*([a-zA-Z]+)/g, "Δ$1")
    .replace(/\\phi_1/g, "ϕ₁")
    .replace(/\\phi_2/g, "ϕ₂")
    .replace(/\\lambda_1/g, "λ₁")
    .replace(/\\lambda_2/g, "λ₂")
    .replace(/\\lambda/g, "λ")
    .replace(/\\rho_\{([^\\\}]+)\}/g, "ρ($1)")
    .replace(/\\rho/g, "ρ")
    .replace(/\\arcsin/g, "arcsin")
    .replace(/\\sin\^2/g, "sin²")
    .replace(/\\cos/g, "cos")
    .replace(/\\sin/g, "sin")
    .replace(/\\exp/g, "exp")
    .replace(/\\ln/g, "ln")
    .replace(/\\log/g, "log")
    .replace(/\\times/g, " × ")
    .replace(/\\cdot/g, " · ")
    .replace(/\\approx/g, " ≈ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/\\le\b|\\le(?![a-zA-Z])/g, " ≤ ")
    .replace(/\\ge\b|\\ge(?![a-zA-Z])/g, " ≥ ")
    .replace(/\\pm/g, " ± ")
    .replace(/\\beta_0/g, "β₀")
    .replace(/\\beta_1/g, "β₁")
    .replace(/\\beta/g, "β")
    .replace(/\\alpha/g, "α")
    .replace(/\\epsilon/g, "ε")
    .replace(/\\sigma_X/g, "σ_X")
    .replace(/\\sigma_Y/g, "σ_Y")
    .replace(/\\sigma_t\^2/g, "σₜ²")
    .replace(/\\sigma_t/g, "σₜ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\mu/g, "μ")
    .replace(/\{,\}/g, ",")
    .replace(/\\;/g, " ")
    .replace(/\\,/g, " ")
    .replace(/_i\b/g, "ᵢ")
    .replace(/_0\b/g, "₀")
    .replace(/_1\b/g, "₁")
    .replace(/_2\b/g, "₂")
    .replace(/_k\b/g, "ₖ")
    .replace(/_K\b/g, "ₖ")
    .replace(/_t\b/g, "ₜ")
    .replace(/_s\b/g, "ₛ")
    .replace(/\^2\b/g, "²")
    .replace(/\^3\b/g, "³")
    .replace(/\^7\b/g, "⁷")
    .replace(/\^K\b/g, "ᴷ")
    .replace(/[{}]/g, "")
    .replace(/\\/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
}

function formatInline(text: string): React.ReactNode[] {
  // Pre-process escaped currency symbols so they don't trigger math parsing
  const preprocessed = text.replace(/\\\\\$/g, "§BACKSLASH_DOLLAR§").replace(/\\\$/g, "§DOLLAR§");

  // Split by inline code, bold, links, math
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\$[^\$]+?\$|\[.*?\]\(.*?\)|\<br\s*\/?>)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(preprocessed)) !== null) {
    if (match.index > lastIdx) {
      parts.push(
        preprocessed
          .substring(lastIdx, match.index)
          .replace(/§DOLLAR§/g, "$")
          .replace(/§BACKSLASH_DOLLAR§/g, "\\$")
      );
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      const boldInner = token.slice(2, -2);
      parts.push(
        <strong key={match.index} style={{ color: "var(--ink-heading)", fontWeight: 700 }}>
          {formatInline(boldInner)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      const codeText = token.slice(1, -1).replace(/§DOLLAR§/g, "$");
      const isPositiveDelta = codeText.startsWith("+") || codeText.includes("▲");
      const isNegativeDelta = (codeText.startsWith("-") && codeText.includes("%")) || codeText.includes("▼");

      let badgeBg = "rgba(255, 255, 255, 0.05)";
      let badgeColor = "var(--ink)";
      let badgeBorder = "rgba(255, 255, 255, 0.08)";

      if (isNegativeDelta) {
        badgeBg = "rgba(16, 185, 129, 0.12)";
        badgeColor = "#10b981";
        badgeBorder = "rgba(16, 185, 129, 0.25)";
      } else if (isPositiveDelta) {
        badgeBg = "rgba(244, 63, 94, 0.12)";
        badgeColor = "#f43f5e";
        badgeBorder = "rgba(244, 63, 94, 0.25)";
      }

      parts.push(
        <code
          key={match.index}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.86em",
            color: badgeColor,
            backgroundColor: badgeBg,
            padding: "2px 7px",
            borderRadius: "3px",
            border: `1px solid ${badgeBorder}`,
            letterSpacing: "0.01em",
            fontWeight: isPositiveDelta || isNegativeDelta ? 600 : 400,
          }}
        >
          {codeText}
        </code>
      );
    } else if (token.startsWith("$") && token.endsWith("$")) {
      const mathInner = token.slice(1, -1).replace(/§DOLLAR§/g, "$");
      const cleanInline = parseMathToCleanUnicode(mathInner);
      parts.push(
        <span
          key={match.index}
          style={{
            fontFamily: "var(--font-mono), monospace",
            color: "var(--ink-heading)",
            fontSize: "0.92em",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          {cleanInline}
        </span>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const labelMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (labelMatch) {
        parts.push(
          <a
            key={match.index}
            href={labelMatch[2]}
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            {labelMatch[1].replace(/§DOLLAR§/g, "$")}
          </a>
        );
      } else {
        parts.push(token.replace(/§DOLLAR§/g, "$"));
      }
    } else if (token.startsWith("<br") || token === "<br/>" || token === "<br>") {
      parts.push(<br key={match.index} />);
    } else {
      parts.push(token.replace(/§DOLLAR§/g, "$"));
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < preprocessed.length) {
    parts.push(
      preprocessed
        .substring(lastIdx)
        .replace(/§DOLLAR§/g, "$")
        .replace(/§BACKSLASH_DOLLAR§/g, "\\$")
    );
  }

  return parts;
}


const DIURNAL_HOURLY_DATA = [
  { hour: "00", rate: 19.7, delay: 15.5 },
  { hour: "01", rate: 20.9, delay: 14.7 },
  { hour: "02", rate: 20.4, delay: 11.3 },
  { hour: "03", rate: 19.0, delay: 9.8 },
  { hour: "04", rate: 19.9, delay: 16.6 },
  { hour: "05", rate: 8.9, delay: 5.2, isLaunch: true },
  { hour: "06", rate: 9.4, delay: 4.0, isLaunch: true },
  { hour: "07", rate: 12.1, delay: 4.9 },
  { hour: "08", rate: 13.7, delay: 5.8 },
  { hour: "09", rate: 15.1, delay: 7.2 },
  { hour: "10", rate: 16.3, delay: 8.7 },
  { hour: "11", rate: 17.5, delay: 9.9 },
  { hour: "12", rate: 18.9, delay: 11.2 },
  { hour: "13", rate: 20.6, delay: 13.0 },
  { hour: "14", rate: 22.1, delay: 14.6 },
  { hour: "15", rate: 24.5, delay: 16.2 },
  { hour: "16", rate: 26.1, delay: 17.2 },
  { hour: "17", rate: 27.9, delay: 18.4 },
  { hour: "18", rate: 28.8, delay: 19.8, isPeak: true },
  { hour: "19", rate: 29.5, delay: 20.7, isPeak: true },
  { hour: "20", rate: 29.8, delay: 21.4, isPeak: true },
  { hour: "21", rate: 26.5, delay: 19.2 },
  { hour: "22", rate: 25.1, delay: 18.1 },
  { hour: "23", rate: 24.1, delay: 16.1 },
];

function DiurnalVisualChart() {
  return (
    <div
      className="diurnal-visual-chart"
      style={{
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 24px 20px",
        margin: "28px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          borderBottom: "1px solid var(--line)",
          paddingBottom: 16,
        }}
      >
        <div>
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
            EMPIRICAL GRAPH • 24-HOUR PROGRESSION CURVE
          </span>
          <strong style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", display: "block", marginTop: 4 }}>
            Diurnal Delay Escalation: 8.9% Launch to 29.8% Peak
          </strong>
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "6px 0 0", maxWidth: 760, lineHeight: 1.5 }}>
            Gate delay rate (≥15m) tracking 7.08M commercial flights. Operational entropy escalates non-linearly across successive turns into an evening peak.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)" }}>
            <span style={{ width: 10, height: 10, backgroundColor: "var(--surface-secondary)", border: "1px solid var(--line-strong)", borderRadius: 2 }} />
            <span>Baseline</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--accent)", fontWeight: 700 }}>
            <span style={{ width: 10, height: 10, backgroundColor: "var(--accent)", borderRadius: 2 }} />
            <span>Problem Peak (18:00–20:00)</span>
          </div>
        </div>
      </div>

      {/* Chart Visual Container */}
      <div style={{ position: "relative", width: "100%", height: 210, paddingTop: 28, paddingBottom: 22 }}>
        {/* Y-Axis Horizontal Grid Reference Lines */}
        <div style={{ position: "absolute", inset: "28px 0 22px 0", pointerEvents: "none" }}>
          {[30, 20, 10].map((val) => {
            const topPct = ((35 - val) / 35) * 100;
            return (
              <div
                key={val}
                style={{
                  position: "absolute",
                  top: `${topPct}%`,
                  left: 0,
                  right: 0,
                  borderTop: "1px dashed var(--line)",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span className="mono" style={{ fontSize: 10, color: "var(--muted)", transform: "translateY(-14px)" }}>
                  {val}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Vertical Bars */}
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "flex-end", gap: 3, zIndex: 2 }}>
          {DIURNAL_HOURLY_DATA.map((item) => {
            const heightPct = (item.rate / 35) * 100;
            const isPeak = item.isPeak;
            const isLaunch = item.isLaunch;

            return (
              <div
                key={item.hour}
                style={{
                  flex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {item.hour === "20" && (
                  <div
                    className="mono"
                    style={{
                      position: "absolute",
                      bottom: `calc(${heightPct}% + 6px)`,
                      whiteSpace: "nowrap",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                      backgroundColor: "var(--panel)",
                      padding: "2px 6px",
                      borderRadius: 2,
                      border: "1px solid var(--accent)",
                      zIndex: 3,
                    }}
                  >
                    29.8% Peak (3.3×)
                  </div>
                )}
                {item.hour === "05" && (
                  <div
                    className="mono"
                    style={{
                      position: "absolute",
                      bottom: `calc(${heightPct}% + 6px)`,
                      whiteSpace: "nowrap",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--ink-heading)",
                      backgroundColor: "var(--panel)",
                      padding: "2px 6px",
                      borderRadius: 2,
                      border: "1px solid var(--line-strong)",
                      zIndex: 3,
                    }}
                  >
                    8.9% Launch
                  </div>
                )}
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    backgroundColor: isPeak ? "var(--accent)" : isLaunch ? "rgba(255, 255, 255, 0.4)" : "var(--surface-secondary)",
                    border: isPeak ? "1px solid var(--accent)" : "1px solid var(--line-strong)",
                    borderRadius: "2px 2px 0 0",
                    transition: "all 0.2s ease",
                  }}
                  title={`${item.hour}:00 | Delay Rate: ${item.rate.toFixed(1)}% | Mean Delay: ${item.delay.toFixed(1)}m`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-Axis Hour Markers */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
        {["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "23:00"].map((h) => (
          <span key={h} className="mono" style={{ fontSize: 10.5, color: "var(--muted)" }}>
            {h}
          </span>
        ))}
      </div>

      {/* 3 Callout Cards Underneath */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1,
          backgroundColor: "var(--line)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          overflow: "hidden",
          marginTop: 18,
        }}
      >
        <div style={{ backgroundColor: "var(--panel)", padding: "12px 16px" }}>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)", display: "block" }}>
            05:00–06:00 LAUNCH BASELINE
          </span>
          <strong className="mono" style={{ fontSize: 18, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
            8.9% – 9.4%
          </strong>
          <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>Clean overnight turns</span>
        </div>
        <div style={{ backgroundColor: "var(--panel)", padding: "12px 16px" }}>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--muted)", display: "block" }}>
            12:00–14:00 MIDDAY WAVE
          </span>
          <strong className="mono" style={{ fontSize: 18, color: "var(--ink-heading)", display: "block", marginTop: 4 }}>
            18.9% – 22.1%
          </strong>
          <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>Turn buffers start eroding</span>
        </div>
        <div style={{ backgroundColor: "var(--panel)", padding: "12px 16px", borderLeft: "3px solid var(--accent)" }}>
          <span className="mono" style={{ fontSize: 10.5, color: "var(--accent)", display: "block", fontWeight: 700 }}>
            18:00–20:00 PEAK COMPOUNDING
          </span>
          <strong className="mono" style={{ fontSize: 18, color: "var(--accent)", display: "block", marginTop: 4 }}>
            28.8% – 29.8%
          </strong>
          <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginTop: 2 }}>3.3× diurnal risk multiplier</span>
        </div>
      </div>
    </div>
  );
}

const CAUSALITY_DATA = [
  {
    key: "late_aircraft",
    label: "Late Aircraft Turnaround Ripple",
    shortLabel: "Late Aircraft Ripple",
    pct: 40.44,
    pctDisplay: "40.4%",
    grossMinutes: "41,968,859 min",
    grossHours: "699,481 hrs",
    events: "743,158 events",
    meanDelay: "56.5 min / event",
    color: "var(--accent)",
    textColor: "#ffffff",
    tag: "#1 PROBLEM DRIVER",
    isProblem: true,
    diagnosis: "Upstream flight rotation ripple; previous leg arrival delay cascades past scheduled turnaround buffer.",
  },
  {
    key: "carrier",
    label: "Carrier Internal Operations",
    shortLabel: "Carrier Ops",
    pct: 34.51,
    pctDisplay: "34.5%",
    grossMinutes: "35,820,937 min",
    grossHours: "597,016 hrs",
    events: "789,204 events",
    meanDelay: "45.4 min / event",
    color: "rgba(255, 255, 255, 0.45)",
    textColor: "var(--ink-heading)",
    tag: "AIRLINE IN-HOUSE",
    isProblem: false,
    diagnosis: "Crew duty-time timeouts, line mechanical maintenance, baggage staging, and catering turnaround.",
  },
  {
    key: "nas",
    label: "National Aviation System (NAS)",
    shortLabel: "NAS Airspace",
    pct: 18.90,
    pctDisplay: "18.9%",
    grossMinutes: "19,620,381 min",
    grossHours: "327,006 hrs",
    events: "726,412 events",
    meanDelay: "27.0 min / event",
    color: "rgba(255, 255, 255, 0.25)",
    textColor: "var(--ink-heading)",
    tag: "FAA / AIRSPACE",
    isProblem: false,
    diagnosis: "Air traffic control flow management, runway volume metering, slot holds, and en-route convective deviations.",
  },
  {
    key: "weather",
    label: "Severe Meteorological Weather",
    shortLabel: "Severe Weather",
    pct: 5.97,
    pctDisplay: "6.0%",
    grossMinutes: "6,204,976 min",
    grossHours: "103,416 hrs",
    events: "89,012 events",
    meanDelay: "69.7 min / event",
    color: "rgba(255, 255, 255, 0.15)",
    textColor: "var(--ink-heading)",
    tag: "PEAK SEVERITY",
    isProblem: false,
    diagnosis: "Convective summer thunderstorms, blizzards, zero-visibility fog, and FAA airport ground stop closures.",
  },
  {
    key: "security",
    label: "Security Gate Holds",
    shortLabel: "Security",
    pct: 0.18,
    pctDisplay: "0.2%",
    grossMinutes: "179,914 min",
    grossHours: "2,999 hrs",
    events: "7,411 events",
    meanDelay: "24.3 min / event",
    color: "rgba(255, 255, 255, 0.08)",
    textColor: "var(--muted)",
    tag: "TSA / CONCOURSE",
    isProblem: false,
    diagnosis: "Terminal checkpoint security re-screenings, boarding queue delays, and sterile area perimeter alerts.",
  },
];

function CausalityVisualChart() {
  return (
    <div
      className="causality-visual-chart"
      style={{
        backgroundColor: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: 4,
        padding: "24px 24px 20px",
        margin: "28px 0",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          borderBottom: "1px solid var(--line)",
          paddingBottom: 16,
        }}
      >
        <div>
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", display: "block" }}>
            NATIONAL DELAY CAUSALITY ALLOCATION • 103,795,067 MINUTES
          </span>
          <strong style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--ink-heading)", letterSpacing: "-0.03em", display: "block", marginTop: 4 }}>
            Root Cause Decomposition: The 40.4% Turnaround Ripple Dominance
          </strong>
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "6px 0 0", maxWidth: 780, lineHeight: 1.5 }}>
            Attribution across 7.08M flights demonstrates that cascading rotation turns generate over 41.97M minutes of delay. While severe weather produces the highest individual delay (69.7m), turnaround ripple is the #1 systemic network failure.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)" }}>
            <span style={{ width: 10, height: 10, backgroundColor: "var(--line-strong)", borderRadius: 2 }} />
            <span>Exogenous / Operational</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--accent)", fontWeight: 700 }}>
            <span style={{ width: 10, height: 10, backgroundColor: "var(--accent)", borderRadius: 2 }} />
            <span>Turnaround Ripple (40.4%)</span>
          </div>
        </div>
      </div>

      {/* Proportional Stacked Allocation Bar */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            height: 38,
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            gap: 2,
          }}
        >
          {CAUSALITY_DATA.map((item) => (
            <div
              key={item.key}
              style={{
                width: `${item.pct}%`,
                height: "100%",
                backgroundColor: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "opacity 0.15s ease",
              }}
              title={`${item.label}: ${item.pct.toFixed(2)}% (${item.grossMinutes}) | ${item.events} | Avg: ${item.meanDelay}`}
            >
              {item.pct >= 15 ? (
                <span
                  className="mono"
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: item.key === "late_aircraft" ? "#000000" : "var(--ink-heading)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.shortLabel} ({item.pctDisplay})
                </span>
              ) : item.pct >= 5 ? (
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ink-heading)",
                  }}
                >
                  {item.pctDisplay}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Proportional Summary Legend Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 10,
            fontSize: 11.5,
          }}
          className="mono"
        >
          {CAUSALITY_DATA.map((item) => (
            <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: item.color }} />
              <span style={{ color: item.isProblem ? "var(--accent)" : "var(--muted)", fontWeight: item.isProblem ? 700 : 500 }}>
                {item.shortLabel}: <strong style={{ color: item.isProblem ? "var(--accent)" : "var(--ink)" }}>{item.pctDisplay}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Structured Category Detail Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
          marginTop: 18,
        }}
      >
        {CAUSALITY_DATA.map((item) => (
          <div
            key={item.key}
            style={{
              backgroundColor: "var(--surface)",
              border: item.isProblem ? "1px solid var(--accent)" : "1px solid var(--line)",
              borderLeft: item.isProblem ? "3px solid var(--accent)" : "1px solid var(--line)",
              borderRadius: 3,
              padding: "14px 14px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: item.isProblem ? "var(--accent)" : "var(--muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.tag}
                </span>
                <span className="mono" style={{ fontSize: 10, color: "var(--dim)" }}>
                  {item.pctDisplay}
                </span>
              </div>
              <strong className="mono" style={{ fontSize: 20, color: item.isProblem ? "var(--accent)" : "var(--ink-heading)", display: "block" }}>
                {item.grossMinutes.split(" ")[0]} <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>min</span>
              </strong>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink)", marginTop: 6 }}>
                <strong>{item.meanDelay}</strong>
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2 }}>
                {item.events}
              </div>
            </div>

            <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "10px 0 0", paddingTop: 8, borderTop: "1px solid var(--line)", lineHeight: 1.45 }}>
              {item.diagnosis}
            </p>
          </div>
        ))}
      </div>

      {/* Synthesis Takeaway Footnote */}
      <div
        style={{
          marginTop: 16,
          padding: "12px 16px",
          backgroundColor: "var(--surface-secondary)",
          border: "1px solid var(--line)",
          borderRadius: 3,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <span className="mono" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}>
          DIAGNOSTIC INSIGHT:
        </span>
        <span style={{ fontSize: 12.5, color: "var(--ink)", lineHeight: 1.5 }}>
          While <strong>Severe Weather</strong> registers the highest individual event severity (<strong>69.7 min/delayed flight</strong>), it accounts for only <strong>5.97%</strong> of gross national delay. In stark contrast, <strong>Late Aircraft Turnaround Ripple</strong> drives <strong>40.44% of all lost minutes (41.97M min)</strong>, isolating scheduled aircraft turn buffers as the single most critical lever for network resilience.
        </span>
      </div>
    </div>
  );
}

export function MarkdownBody({ source }: { source: string }) {
  if (!source || !source.trim()) return null;

  const lines = source.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Code block & Visual Flowchart / Pipeline Diagram
    if (line.trim().startsWith("```")) {
      const codeType = line.trim().replace(/^```/, "").trim().toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      const codeLangs = ["python", "py", "sql", "dax", "javascript", "js", "typescript", "ts", "json", "yaml", "yml", "bash", "sh", "html", "css"];
      const isCodeLang = codeLangs.includes(codeType);

      const isDiurnalChart = !isCodeLang && (
        codeType === "diurnal-chart" ||
        codeType === "diurnal" ||
        codeType === "chart" ||
        codeLines.some(l => l.toLowerCase().includes("diurnal delay progression") || l.includes("Launch Wave") || l.includes("Peak) +"))
      );

      if (isDiurnalChart) {
        nodes.push(<DiurnalVisualChart key={`diurnal-chart-${i}`} />);
        continue;
      }

      const isPipelineDiagram = !isCodeLang && (codeType === "pipeline" || codeType === "flowchart" || codeType === "diagram" || (!codeType && codeLines.some(l => l.includes("➔"))));

      if (isPipelineDiagram) {
        // Parse Pipeline Lanes
        const lanes: Array<{ title: string; subtitle?: string; type: "danger" | "success" | "neutral"; steps: Array<{ title: string; desc?: string }> }> = [];
        let currentTitle = "Architecture Flow";
        let currentSubtitle = "";
        let currentType: "danger" | "success" | "neutral" = "neutral";

        for (const cl of codeLines) {
          const trimmed = cl.trim();
          if (!trimmed) continue;

          if (trimmed.includes("➔") || trimmed.includes("->")) {
            const rawSteps = trimmed.split(/➔|->/).map(s => s.trim().replace(/^\[|\]$/g, ""));
            const parsedSteps = rawSteps.map(st => {
              if (st.includes("|")) {
                const [stTitle, stDesc] = st.split("|").map(p => p.trim());
                return { title: stTitle, desc: stDesc };
              }
              return { title: st, desc: "" };
            });

            lanes.push({
              title: currentTitle,
              subtitle: currentSubtitle,
              type: currentType,
              steps: parsedSteps
            });

            // Reset defaults for next lane
            currentTitle = "System Architecture Phase";
            currentSubtitle = "";
            currentType = "neutral";
            continue;
          }

          if (trimmed.toLowerCase().includes("reactive") || trimmed.toLowerCase().includes("conventional") || trimmed.toLowerCase().includes("legacy")) {
            currentTitle = trimmed.replace(/:$/, "").replace(/^Lane:\s*/i, "");
            currentType = "danger";
            if (currentTitle.includes("|")) {
              const parts = currentTitle.split("|").map(p => p.trim());
              currentTitle = parts[0];
              currentSubtitle = parts[1] || "";
            } else {
              currentSubtitle = "Legacy Post-Settlement Backlog (30–90 Days Lag)";
            }
            continue;
          }

          if (trimmed.toLowerCase().includes("proactive") || trimmed.toLowerCase().includes("surveillance") || trimmed.toLowerCase().includes("sql")) {
            currentTitle = trimmed.replace(/:$/, "").replace(/^Lane:\s*/i, "");
            currentType = "success";
            if (currentTitle.includes("|")) {
              const parts = currentTitle.split("|").map(p => p.trim());
              currentTitle = parts[0];
              currentSubtitle = parts[1] || "";
            } else {
              currentSubtitle = "Real-Time Pre-Settlement Stream Defense (0ms Latency)";
            }
            continue;
          }

          if (trimmed.includes("|")) {
            const parts = trimmed.split("|").map(p => p.trim());
            currentTitle = parts[0].replace(/^Lane:\s*/i, "").replace(/:$/, "");
            currentSubtitle = parts[1] || "";
            currentType = "neutral";
            continue;
          }
        }

        if (lanes.length > 0) {
          const isComparison = lanes.some(l => l.type === "danger" || l.type === "success");
          const topBadgeText = isComparison
            ? "ARCHITECTURAL PARADIGM COMPARISON • FLOW DIAGRAM"
            : "SYSTEM ARCHITECTURE • EXECUTION PIPELINE FLOW";

          nodes.push(
            <div key={`pipeline-diagram-${i}`} className="pipeline-diagram-wrapper mono" role="img" aria-label="Visual Architecture Pipeline Comparison Diagram">
              <div className="diagram-top-badge">
                <span className="pulse-dot" />
                <span>{topBadgeText}</span>
              </div>
              <div className="pipeline-lanes-list">
                {lanes.map((lane, lIdx) => (
                  <div key={lIdx} className={`pipeline-lane-card ${lane.type}`}>
                    <div className="lane-header">
                      <div className="lane-title-group">
                        <span className={`lane-type-badge ${lane.type}`}>
                          {lane.type === "danger"
                            ? "⚠️ LEGACY PARADIGM"
                            : lane.type === "success"
                            ? "⚡ PROACTIVE PARADIGM"
                            : "⚡ PIPELINE ARCHITECTURE"}
                        </span>
                        <strong className="lane-title">{lane.title}</strong>
                      </div>
                      {lane.subtitle && <span className={`lane-subtitle ${lane.type}`}>{lane.subtitle}</span>}
                    </div>

                    <div className="pipeline-steps-flex">
                      {lane.steps.map((st, stIdx) => (
                        <React.Fragment key={stIdx}>
                          <div className={`pipeline-step-node ${lane.type} ${stIdx === lane.steps.length - 1 ? "final-node" : ""}`}>
                            <span className="step-num">0{stIdx + 1}</span>
                            <strong className="step-title">{st.title}</strong>
                            {st.desc && <p className="step-desc">{st.desc}</p>}
                          </div>
                          {stIdx < lane.steps.length - 1 && (
                            <div className={`pipeline-flow-arrow ${lane.type}`} aria-hidden="true">
                              <span>➔</span>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          continue;
        }
      }

      nodes.push(
        <pre
          key={`code-${i}`}
          style={{
            backgroundColor: "var(--surface-secondary)",
            border: "1px solid var(--line)",
            padding: "16px 20px",
            borderRadius: 4,
            overflowX: "auto",
            margin: "24px 0",
            font: "11px/1.6 'Courier New', monospace",
            color: "var(--ink)",
          }}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Math block ($$...$$)
    if (line.trim().startsWith("$$")) {
      const mathLines: string[] = [];
      const trimmed = line.trim();
      const isSingleLine = trimmed.length > 2 && trimmed.endsWith("$$") && trimmed.indexOf("$$", 2) === trimmed.length - 2;

      if (isSingleLine) {
        mathLines.push(trimmed.replace(/^\$\$|\$\$$/g, ""));
        i++;
      } else {
        // Multi-line math block
        const firstLine = trimmed.replace(/^\$\$/, "").trim();
        if (firstLine) mathLines.push(firstLine);
        i++;
        while (i < lines.length && !lines[i].trim().endsWith("$$")) {
          mathLines.push(lines[i].trim());
          i++;
        }
        if (i < lines.length) {
          const lastLine = lines[i].trim().replace(/\$\$$/, "").trim();
          if (lastLine) mathLines.push(lastLine);
          i++;
        }
      }

      const mathContent = mathLines.join("\n");
      const cleanMath = parseMathToCleanUnicode(mathContent);

      nodes.push(
        <div
          key={`math-${i}`}
          style={{
            margin: "24px 0",
            padding: "16px 20px",
            backgroundColor: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span className="mono" style={{ fontSize: "10px", fontWeight: 700, color: "var(--ink-heading)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Mathematical Model • Econometric Formulation
            </span>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)", background: "var(--surface)", padding: "2px 8px", borderRadius: 3, border: "1px solid var(--line)" }}>
              SPECIFICATION
            </span>
          </div>
          <div
            style={{
              padding: "14px 18px",
              backgroundColor: "var(--surface-secondary)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              fontFamily: "var(--font-mono), monospace",
              fontSize: "clamp(13px, 1.3vw, 15px)",
              fontWeight: 600,
              color: "var(--ink-heading)",
              textAlign: "center",
              letterSpacing: "0.02em",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
            }}
          >
            {cleanMath}
          </div>
        </div>
      );
      continue;
    }

    // Multi-line Blockquote / Callout Card
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }

      let alertType: string | null = null;
      if (quoteLines.length > 0) {
        const match = quoteLines[0].match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
        if (match) {
          alertType = match[1].toUpperCase();
          quoteLines.shift(); // Remove the [!NOTE] line
        }
      }

      nodes.push(
        <div
          key={`quote-${i}`}
          style={{
            border: "1px solid var(--line)",
            borderLeft: "3px solid var(--accent)",
            padding: "16px 20px",
            margin: "24px 0",
            backgroundColor: "var(--surface-secondary)",
            borderRadius: 4,
            color: "var(--ink)",
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
          {alertType && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
                font: "10px/1.2 monospace",
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.08em",
              }}
            >
              <span className="pulse-dot" />
              <span>{alertType}</span>
            </div>
          )}
          {quoteLines.map((qText, qIdx) => (
            <p key={qIdx} style={{ margin: qIdx === 0 && !alertType ? 0 : "4px 0 0" }}>
              {formatInline(qText)}
            </p>
          ))}
        </div>
      );
      continue;
    }

    // Table
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split("|").slice(1, -1).map((c) => c.trim());
        const alignRow = tableLines[1].split("|").slice(1, -1).map((c) => {
          const t = c.trim();
          if (t.startsWith(":") && t.endsWith(":")) return "center";
          if (t.endsWith(":")) return "right";
          return "left";
        });
        const dataRows = tableLines.slice(2).map((row) => row.split("|").slice(1, -1).map((c) => c.trim()));

        const isLongTable = dataRows.length >= 7;

        if (isLongTable) {
          nodes.push(
            <div key={`table-wrapper-${i}`} style={{ margin: "24px 0" }}>
              <div
                className="top-down-scroll"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "4px 4px 0 0",
                  backgroundColor: "var(--panel)",
                  overflowX: "auto",
                  maxHeight: "360px",
                  overflowY: "auto",
                  position: "relative",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      backgroundColor: "var(--surface)",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.45)",
                    }}
                  >
                    <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "var(--surface)" }}>
                      {headerRow.map((th, thIdx) => {
                        const align = alignRow[thIdx] || "left";
                        return (
                          <th
                            key={thIdx}
                            className="mono"
                            style={{
                              padding: "12px 18px",
                              textAlign: align as any,
                              color: "var(--ink-heading)",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {th}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        style={{
                          borderBottom: rIdx === dataRows.length - 1 ? "none" : "1px solid var(--line)",
                          backgroundColor: rIdx % 2 === 0 ? "rgba(255, 255, 255, 0.015)" : "transparent",
                        }}
                      >
                        {row.map((cell, cIdx) => {
                          const align = alignRow[cIdx] || "left";
                          const isNumeric = /^[+\-0-9,.]+ *(%|m|min|min\.|hrs|s)?$/i.test(cell.replace(/\*\*/g, "").trim());
                          return (
                            <td
                              key={cIdx}
                              style={{
                                padding: "12px 18px",
                                textAlign: align as any,
                                color: "var(--ink)",
                                lineHeight: 1.55,
                                fontFamily: isNumeric ? "var(--font-mono), monospace" : "inherit",
                              }}
                            >
                              {formatInline(cell)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                  padding: "7px 14px",
                  border: "1px solid var(--line)",
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  backgroundColor: "var(--surface-secondary)",
                  fontSize: 10.5,
                  color: "var(--muted)",
                }}
              >
                <span>{dataRows.length} DATA ROWS • TOP-DOWN SCROLL</span>
                <span>↕ SCROLL TABLE (STICKY HEADER)</span>
              </div>
            </div>
          );
        } else {
          nodes.push(
            <div
              key={`table-${i}`}
              className="table-scroll"
              style={{
                margin: "24px 0",
                border: "1px solid var(--line)",
                borderRadius: 4,
                backgroundColor: "var(--panel)",
                overflowX: "auto",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "var(--surface)" }}>
                    {headerRow.map((th, thIdx) => {
                      const align = alignRow[thIdx] || "left";
                      return (
                        <th
                          key={thIdx}
                          className="mono"
                          style={{
                            padding: "12px 18px",
                            textAlign: align as any,
                            color: "var(--ink-heading)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {th}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        borderBottom: rIdx === dataRows.length - 1 ? "none" : "1px solid var(--line)",
                        backgroundColor: rIdx % 2 === 0 ? "rgba(255, 255, 255, 0.015)" : "transparent",
                      }}
                    >
                      {row.map((cell, cIdx) => {
                        const align = alignRow[cIdx] || "left";
                        const isNumeric = /^[+\-0-9,.]+ *(%|m|min|min\.|hrs|s)?$/i.test(cell.replace(/\*\*/g, "").trim());
                        return (
                          <td
                            key={cIdx}
                            style={{
                              padding: "12px 18px",
                              textAlign: align as any,
                              color: "var(--ink)",
                              lineHeight: 1.55,
                              fontFamily: isNumeric ? "var(--font-mono), monospace" : "inherit",
                            }}
                          >
                            {formatInline(cell)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }
    }

    // Heading 2
    if (line.startsWith("## ")) {
      let heading = line.replace("## ", "");
      let sectionId = "";
      const customIdMatch = heading.match(/\{#([a-zA-Z0-9_-]+)\}/);
      if (customIdMatch) {
        sectionId = customIdMatch[1];
        heading = heading.replace(/\{#[a-zA-Z0-9_-]+\}/, "").trim();
      } else if (heading.toLowerCase().includes("formulation")) {
        sectionId = "formulation";
      } else if (heading.toLowerCase().includes("topography")) {
        sectionId = "topography";
      } else if (heading.toLowerCase().includes("projection")) {
        sectionId = "projection";
      } else if (heading.toLowerCase().includes("diagnostics") || heading.toLowerCase().includes("verification")) {
        sectionId = "diagnostics";
      } else {
        sectionId = heading
          .toLowerCase()
          .replace(/^[0-9]+\.\s*/, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      nodes.push(
        <h2
          key={`h2-${i}`}
          id={sectionId}
          style={{
            fontSize: "clamp(20px, 2.2vw, 28px)",
            color: "var(--ink-heading)",
            letterSpacing: "-0.04em",
            marginTop: 48,
            marginBottom: 16,
            borderBottom: "1px solid var(--line)",
            paddingBottom: 10,
          }}
        >
          {heading}
        </h2>
      );
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      const heading = line.replace("### ", "");
      nodes.push(
        <h3
          key={`h3-${i}`}
          style={{
            fontSize: "clamp(16px, 1.6vw, 20px)",
            color: "var(--ink-heading)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginTop: 32,
            marginBottom: 12,
          }}
        >
          {formatInline(heading)}
        </h3>
      );
      i++;
      continue;
    }

    // Heading 4
    if (line.startsWith("#### ")) {
      const heading = line.replace("#### ", "");
      nodes.push(
        <h4
          key={`h4-${i}`}
          style={{
            fontSize: "14px",
            color: "var(--ink-heading)",
            fontWeight: 700,
            marginTop: 22,
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          {formatInline(heading)}
        </h4>
      );
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***") {
      nodes.push(
        <hr
          key={`hr-${i}`}
          style={{
            border: "0",
            borderTop: "1px solid var(--line)",
            margin: "36px 0",
          }}
        />
      );
      i++;
      continue;
    }

    // Unordered List
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        listItems.push(lines[i].trim().replace(/^[-*]\s*/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 20, margin: "14px 0 20px", color: "var(--muted)", lineHeight: 1.65, fontSize: 13 }}>
          {listItems.map((item, lIdx) => (
            <li key={lIdx} style={{ marginBottom: 6 }}>
              {formatInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line.trim())) {
      const orderedItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        orderedItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 22, margin: "14px 0 20px", color: "var(--muted)", lineHeight: 1.65, fontSize: 13 }}>
          {orderedItems.map((item, oIdx) => (
            <li key={oIdx} style={{ marginBottom: 6 }}>
              {formatInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    nodes.push(
      <p key={`p-${i}`} style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14, margin: "14px 0" }}>
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="case-stage markdown-narrative" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 40 }}>{nodes}</div>;
}
