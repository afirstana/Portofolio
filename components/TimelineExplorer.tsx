"use client";

import type { TimelineContent } from "@/lib/content";

export function TimelineExplorer({ content }: { content: TimelineContent }) {
  return <section id="path" className="section timeline-section" aria-labelledby="path-title"><div className="page-width"><p className="section-label mono">{content.eyebrow}</p><h2 id="path-title" className="section-title narrow-title">{content.heading}</h2>{content.entries.length ? <div className="timeline-list">{content.entries.map((entry, index) => <details className="timeline-item" key={entry.role}><summary><span className="mono">{String(index + 1).padStart(2, "0")}</span><p className="timeline-period mono">{entry.period}</p><div><h3>{entry.role}</h3><p>{entry.description}</p></div><i aria-hidden="true">+</i></summary><div className="timeline-detail"><p>{entry.detail}</p><div className="tags">{entry.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div></details>)}</div> : <div className="empty-state" role="status"><p className="mono">No timeline entries available</p><p>Add entries to <code>content/timeline.md</code>, then rebuild the static site.</p></div>}</div></section>;
}
