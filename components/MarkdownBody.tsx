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
            fontFamily: "'Courier New', Courier, monospace",
            color: "var(--ink-heading)",
            fontSize: "0.95em",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.02em",
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
            margin: "26px 0",
            padding: "18px 22px",
            backgroundColor: "var(--panel)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="pulse-dot" />
              <span className="mono" style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Mathematical Model • Econometric Formulation
              </span>
            </div>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", background: "rgba(255,255,255,0.03)", padding: "2px 8px", borderRadius: 3, border: "1px solid var(--line)" }}>
              FORMULATION SPECIFICATION
            </span>
          </div>
          <div
            style={{
              padding: "18px 22px",
              backgroundColor: "#07080c",
              border: "1px solid var(--line)",
              borderRadius: 4,
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(14px, 1.35vw, 16px)",
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center",
              letterSpacing: "0.03em",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.5)",
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
        const dataRows = tableLines.slice(2).map((row) => row.split("|").slice(1, -1).map((c) => c.trim()));

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
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
                  {headerRow.map((th, thIdx) => (
                    <th
                      key={thIdx}
                      style={{
                        padding: "11px 16px",
                        textAlign: thIdx === 0 ? "left" : thIdx === headerRow.length - 1 ? "left" : "left",
                        color: "var(--ink-heading)",
                        font: "10px/1.2 monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{
                      borderBottom: rIdx === dataRows.length - 1 ? "none" : "1px solid var(--line)",
                      backgroundColor: rIdx % 2 === 0 ? "rgba(255, 255, 255, 0.012)" : "transparent",
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: "11px 16px", color: "var(--ink)", lineHeight: 1.5 }}>
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
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
            color: "var(--accent)",
            letterSpacing: "-0.03em",
            marginTop: 28,
            marginBottom: 12,
          }}
        >
          {heading}
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
