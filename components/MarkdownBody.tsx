import React from "react";

function parseMathToCleanUnicode(raw: string): string {
  return raw
    .replace(/\\text\{([^\}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^\}]+)\}/g, "$1")
    .replace(/\\mathbf\{([^\}]+)\}/g, "$1")
    .replace(/\\left\s*[\(\[\{]/g, "(")
    .replace(/\\right\s*[\)\]\}]/g, ")")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\sqrt\{([^\}]+)\}/g, "√($1)")
    .replace(/\\sqrt/g, "√")
    .replace(/\\Delta\s*\\phi/g, "Δϕ")
    .replace(/\\Delta\s*\\lambda/g, "Δλ")
    .replace(/\\Delta\s*([a-zA-Z]+)/g, "Δ$1")
    .replace(/\\phi_1/g, "ϕ₁")
    .replace(/\\phi_2/g, "ϕ₂")
    .replace(/\\phi/g, "ϕ")
    .replace(/\\lambda_1/g, "λ₁")
    .replace(/\\lambda_2/g, "λ₂")
    .replace(/\\lambda/g, "λ")
    .replace(/\\arcsin/g, "arcsin")
    .replace(/\\sin\^2/g, "sin²")
    .replace(/\\cos/g, "cos")
    .replace(/\\sin/g, "sin")
    .replace(/\\ln/g, "ln")
    .replace(/\\log/g, "log")
    .replace(/\\times/g, " × ")
    .replace(/\\cdot/g, " · ")
    .replace(/\\approx/g, " ≈ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/\\le\b|\\le(?![a-zA-Z])/g, " ≤ ")
    .replace(/\\ge\b|\\ge(?![a-zA-Z])/g, " ≥ ")
    .replace(/\\pm/g, " ± ")
    .replace(/\\sum_\{i=1\}\^\{([^\}]+)\}/g, "∑(i=1..$1)")
    .replace(/\\sum_\{([^\}]+)\}/g, "∑($1)")
    .replace(/\\sum/g, "∑")
    .replace(/\\beta_0/g, "β₀")
    .replace(/\\beta_1/g, "β₁")
    .replace(/\\beta/g, "β")
    .replace(/\\alpha/g, "α")
    .replace(/\\epsilon/g, "ε")
    .replace(/\\sigma/g, "σ")
    .replace(/\\mu/g, "μ")
    .replace(/\\frac\{([^\}]+)\}\{([^\}]+)\}/g, "($1 / $2)")
    .replace(/\{,\}/g, ",")
    .replace(/_i\b/g, "ᵢ")
    .replace(/_0\b/g, "₀")
    .replace(/_1\b/g, "₁")
    .replace(/_2\b/g, "₂")
    .replace(/_k\b/g, "ₖ")
    .replace(/_K\b/g, "ₖ")
    .replace(/\^2\b/g, "²")
    .replace(/\^3\b/g, "³")
    .replace(/\^K\b/g, "ᴷ")
    .replace(/[{}]/g, "")
    .replace(/\\/g, "")
    .trim();
}

function formatInline(text: string): React.ReactNode[] {
  // Split by inline code, bold, links, math
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\$[^\$]+?\$|\[.*?\]\(.*?\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(<strong key={match.index} style={{ color: "var(--ink-heading)", fontWeight: 700 }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      const codeText = token.slice(1, -1);
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
      const cleanInline = parseMathToCleanUnicode(token.slice(1, -1));
      parts.push(
        <span
          key={match.index}
          className="mono"
          style={{
            color: "var(--ink-heading)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            padding: "2px 7px",
            borderRadius: 3,
            border: "1px solid var(--line)",
            fontSize: 11.5,
            fontWeight: 600,
          }}
        >
          {cleanInline}
        </span>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const labelMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (labelMatch) {
        parts.push(<a key={match.index} href={labelMatch[2]} style={{ color: "var(--accent)", textDecoration: "underline" }}>{labelMatch[1]}</a>);
      } else {
        parts.push(token);
      }
    } else {
      parts.push(token);
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
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

    // Code block
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
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
      const mathContent = line.trim().replace(/^\$\$|\$\$$/g, "");
      const cleanMath = parseMathToCleanUnicode(mathContent);

      nodes.push(
        <div
          key={`math-${i}`}
          style={{
            margin: "24px 0",
            padding: "16px 20px",
            backgroundColor: "var(--surface-secondary)",
            border: "1px solid var(--line)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Mathematical Model • Econometric Formulation
            </span>
            <span className="mono" style={{ fontSize: "9px", color: "var(--dim)", background: "rgba(255,255,255,0.03)", padding: "2px 6px", borderRadius: 2, border: "1px solid var(--line)" }}>
              FORMULATION SPECIFICATION
            </span>
          </div>
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "#0a0a0d",
              border: "1px solid var(--line)",
              borderRadius: 3,
              fontFamily: "'Courier New', monospace",
              fontSize: "15px",
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center",
              letterSpacing: "0.04em",
              overflowX: "auto",
            }}
          >
            {cleanMath}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Multi-line Blockquote Card
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      nodes.push(
        <div
          key={`quote-${i}`}
          style={{
            border: "1px solid var(--line)",
            borderLeft: "3px solid var(--accent)",
            padding: "16px 20px",
            margin: "22px 0",
            backgroundColor: "var(--surface-secondary)",
            borderRadius: 4,
            color: "var(--ink)",
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
          {quoteLines.map((qText, qIdx) => (
            <p key={qIdx} style={{ margin: qIdx === 0 ? 0 : "8px 0 0" }}>
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
      const heading = line.replace("## ", "");
      nodes.push(
        <h2
          key={`h2-${i}`}
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
            fontSize: 13,
            color: "var(--ink-heading)",
            fontFamily: "'Courier New', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginTop: 22,
            marginBottom: 8,
          }}
        >
          {heading}
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
