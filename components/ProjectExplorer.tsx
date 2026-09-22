"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/content";

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [, setHoveredProject] = useState<string | null>(null);

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const haystack = `${project.title} ${project.one_liner} ${project.category} ${project.tools.join(" ")}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  }), [projects, query]);

  return (
    <section id="work" className="section project-section" aria-labelledby="work-title">
      <div className="page-width">
        <p className="section-label mono">02 / Selected systems</p>
        <div className="project-intro">
          <h2 id="work-title" className="section-title">Systems with a point of view.</h2>
          <p className="body-copy">
            Explore focused work in automation, analytics, and machine learning. Each project traces a practical path from source data to a useful decision layer.
          </p>
        </div>

        <div className="explorer-toolbar">
          <label className="search-field">
            <span className="mono">Search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search systems or tools" type="search" />
          </label>
          <p className="explorer-count mono" aria-live="polite">{String(visibleProjects.length).padStart(2, "0")} systems shown</p>
        </div>

        <div className="project-list explorer-list">
          {visibleProjects.map((project, index) => {
            return (
              <Link
                className="project-row"
                style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                key={project.slug}
                href={`/projects/${project.slug}/`}
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <span className="mono project-number">{String(project.order).padStart(2, "0")}</span>
                
                <div className="project-row-content">
                  <h3>{project.title}</h3>
                </div>

                <span aria-hidden="true" className="project-arrow">↗</span>

                {/* SNEAK PEEK HOVER DRAWER */}
                <div className="project-sneak" aria-label={`Sneak peek for ${project.title}`}>
                  {/* Visual Blueprint / Thumbnail Card */}
                  <div className="project-sneak-thumb">
                    <div className="project-sneak-blueprint">
                      <div className="project-sneak-blueprint-header">
                        <span className="mono">0{project.order} / SNEAK PEEK</span>
                        <span className="project-sneak-blueprint-dot" />
                      </div>
                      <div className="project-sneak-blueprint-body">
                        <span className="mono project-sneak-blueprint-category">{project.category}</span>
                        <strong className="project-sneak-blueprint-title">{project.title}</strong>
                      </div>
                      <div className="project-sneak-blueprint-tags">
                        {project.tools.slice(0, 2).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Snapshot */}
                  <div className="project-sneak-center">
                    <p className="mono project-sneak-label">{project.preview.eyebrow}</p>
                    <div className="project-sneak-metrics">
                      {project.preview.metrics.map((metric) => (
                        <span key={metric.label}>
                          <b className="mono">{metric.label}</b>
                          <em>{metric.value}</em>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Takeaway Signal */}
                  <p className="project-sneak-takeaway">
                    <span className="mono">Signal</span>
                    {project.preview.takeaway}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {visibleProjects.length === 0 && (
          <div className="empty-state">
            <p className="mono">No matching system</p>
            <button type="button" onClick={() => setQuery("")}>Reset search</button>
          </div>
        )}
      </div>
    </section>
  );
}
