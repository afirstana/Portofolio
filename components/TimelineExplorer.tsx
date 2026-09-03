"use client";

import Link from "next/link";
import type { TimelineContent } from "@/lib/content";

export function TimelineExplorer({ content }: { content: TimelineContent }) {
  if (!content.entries?.length) {
    return (
      <section id="path" className="section timeline-section" aria-labelledby="path-title">
        <div className="page-width">
          <p className="section-label mono">{content.eyebrow}</p>
          <h2 id="path-title" className="section-title narrow-title">{content.heading}</h2>
          <div className="empty-state" role="status">
            <p className="mono">No timeline entries available</p>
            <p>Add entries to <code>content/timeline.md</code>, then rebuild the static site.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="path" className="section timeline-section" aria-labelledby="path-title">
      <div className="page-width">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <p className="section-label mono">{content.eyebrow}</p>
            <h2 id="path-title" className="section-title narrow-title" style={{ margin: 0 }}>
              {content.heading}
            </h2>
          </div>
          <span className="mono" style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.06em", paddingBottom: 6 }}>
            [CHRONOLOGICAL SYSTEM TRAJECTORY • 3 PHASES]
          </span>
        </div>

        <div className="timeline-list">
          {content.entries.map((entry, index) => {
            const isPresent = entry.period.toUpperCase().includes("PRESENT") || entry.period.toUpperCase().includes("NOW");

            return (
              <details
                className="timeline-item"
                key={entry.role}
                open={index === 0 ? true : undefined}
              >
                <summary>
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <div className="timeline-period mono" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ color: isPresent ? "var(--ink-heading)" : "var(--dim)", fontWeight: isPresent ? 700 : 400 }}>
                      {entry.period}
                    </span>
                    {isPresent && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: "8.5px",
                          fontWeight: 700,
                          color: "var(--accent)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        <span className="pulse-dot" style={{ width: 5, height: 5, backgroundColor: "var(--accent)", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 6px var(--accent)" }} />
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div>
                    <h3>{entry.role}</h3>
                    <p>{entry.description}</p>
                  </div>
                  <i aria-hidden="true">+</i>
                </summary>

                <div className="timeline-detail">
                  <div
                    style={{
                      borderLeft: "2px solid var(--accent)",
                      paddingLeft: 14,
                      marginBottom: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.015)",
                      padding: "12px 16px",
                      borderRadius: "0 4px 4px 0",
                    }}
                  >
                    <p style={{ color: "var(--ink)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                      {entry.detail}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 16 }}>
                    <div className="tags" style={{ margin: 0 }}>
                      {entry.tools.map((tool) => (
                        <span key={tool}>{tool}</span>
                      ))}
                    </div>

                    <Link
                      href="#work"
                      className="mono"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 10,
                        color: "var(--accent)",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                      }}
                    >
                      <span>INSPECT CASE STUDIES</span>
                      <span>↓</span>
                    </Link>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

