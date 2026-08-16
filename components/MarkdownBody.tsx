import React from "react";

function formatInline(text: string): React.ReactNode[] {
  // Split by inline code, bold, links
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
      parts.push(<strong key={match.index} style={{ color: "#ffffff", fontWeight: 700 }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.85em",
            color: "#ff7a45",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            padding: "2px 6px",
            borderRadius: "3px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            letterSpacing: "0.02em",
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("$") && token.endsWith("$")) {
      parts.push(<span key={match.index} className="mono" style={{ color: "var(--accent)", backgroundColor: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 2, fontSize: 11 }}>{token.slice(1, -1)}</span>);
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
            backgroundColor: "#0a0a0d",
            border: "1px solid var(--line)",
            padding: "16px 20px",
            borderRadius: 3,
            overflowX: "auto",
            margin: "24px 0",
            font: "11px/1.6 'Courier New', monospace",
            color: "#e2e2e8",
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
      nodes.push(
        <div
          key={`math-${i}`}
          style={{
            backgroundColor: "#0d0d12",
            border: "1px solid rgba(255,77,28,0.3)",
            padding: "14px 20px",
            margin: "20px 0",
            borderRadius: 3,
            color: "var(--accent)",
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          {mathContent}
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
            border: "1px solid rgba(255, 77, 28, 0.22)",
            borderLeft: "3px solid var(--accent)",
            padding: "14px 18px",
            margin: "20px 0",
            backgroundColor: "rgba(255, 77, 28, 0.03)",
            borderRadius: 3,
            color: "#d4d4d8",
            fontSize: 13,
            lineHeight: 1.6,
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
        // line 1 is separator |:---|---:|
        const dataRows = tableLines.slice(2).map((row) => row.split("|").slice(1, -1).map((c) => c.trim()));

        nodes.push(
          <div
            key={`table-${i}`}
            className="table-scroll"
            style={{
              margin: "24px 0",
              border: "1px solid var(--line)",
              borderRadius: 3,
              backgroundColor: "#0c0c0f",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "#111116" }}>
                  {headerRow.map((th, thIdx) => (
                    <th
                      key={thIdx}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        color: "var(--accent)",
                        font: "9px 'Courier New', monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: "10px 14px", color: "#d2d2d6", lineHeight: 1.45 }}>
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
            color: "#ffffff",
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
            color: "#e4e4e7",
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
        <ul key={`ul-${i}`} style={{ paddingLeft: 20, margin: "14px 0 20px", color: "#c8c8ce", lineHeight: 1.65, fontSize: 13 }}>
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
        <ol key={`ol-${i}`} style={{ paddingLeft: 22, margin: "14px 0 20px", color: "#c8c8ce", lineHeight: 1.65, fontSize: 13 }}>
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
      <p key={`p-${i}`} style={{ color: "#c5c5cb", lineHeight: 1.7, fontSize: 14, margin: "14px 0" }}>
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return <div className="case-stage markdown-narrative" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 40 }}>{nodes}</div>;
}
