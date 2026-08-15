"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/content";

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const haystack = `${project.title} ${project.one_liner} ${project.category} ${project.tools.join(" ")}`.toLowerCase();
    return (category === "All" || project.category === category) && haystack.includes(query.trim().toLowerCase());
  }), [category, projects, query]);

  return <section id="work" className="section project-section" aria-labelledby="work-title">
    <div className="page-width">
      <p className="section-label mono">02 / Selected systems</p>
      <div className="project-intro"><h2 id="work-title" className="section-title">Systems with a point of view.</h2><p className="body-copy">Explore focused work in automation, analytics, and machine learning. Each project traces a practical path from source data to a useful decision layer.</p></div>
      <div className="explorer-toolbar">
        <label className="search-field"><span className="mono">Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search systems or tools" type="search" /></label>
        <div className="filter-list" aria-label="Filter projects by category">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      <p className="explorer-count mono" aria-live="polite">{String(visibleProjects.length).padStart(2, "0")} systems shown</p>
      <div className="project-list explorer-list">{visibleProjects.map((project) => <Link className="project-row" key={project.slug} href={`/projects/${project.slug}/`}><span className="mono project-number">{String(project.order).padStart(2, "0")}</span><div className="project-row-content"><p className="project-category mono">{project.category}</p><h3>{project.title}</h3><p>{project.one_liner}</p><div className="tags">{project.tools.slice(0, 4).map((tool) => <span key={tool}>{tool}</span>)}</div></div><span aria-hidden="true" className="project-arrow">↗</span><div className="project-sneak" aria-label={`Sneak peek for ${project.title}`}><div><p className="mono project-sneak-label">{project.preview.eyebrow}</p><div className="project-sneak-metrics">{project.preview.metrics.map((metric) => <span key={metric.label}><b className="mono">{metric.label}</b><em>{metric.value}</em></span>)}</div></div><p className="project-sneak-takeaway"><span className="mono">Signal</span>{project.preview.takeaway}</p></div></Link>)}</div>
      {visibleProjects.length === 0 && <div className="empty-state"><p className="mono">No matching system</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Reset explorer</button></div>}
    </div>
  </section>;
}
