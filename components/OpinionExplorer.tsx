"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { OpinionArticle } from "@/lib/opinions";

export function OpinionExplorer({ opinions }: { opinions: OpinionArticle[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(opinions.map((o) => o.category)))];

  const filtered = useMemo(() => {
    return opinions.filter((item) => {
      const matchCat = category === "All" || item.category === category;
      const haystack = `${item.title} ${item.subtitle} ${item.thesis} ${item.tags.join(" ")}`.toLowerCase();
      const matchQuery = !query.trim() || haystack.includes(query.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [opinions, category, query]);

  return (
    <div className="opinion-explorer">
      {/* Telemetry Summary Bar */}
      <div className="cert-telemetry-bar mono" style={{ marginBottom: "28px" }}>
        <div className="cert-stat-item">
          <span className="cert-stat-label">ESSAYS</span>
          <strong className="cert-stat-val">0{opinions.length}</strong>
        </div>
        <div className="cert-stat-divider" />
        <div className="cert-stat-item">
          <span className="cert-stat-label">TOPICS</span>
          <strong className="cert-stat-val" style={{ color: "var(--accent)" }}>{categories.length - 1} CATEGORIES</strong>
        </div>
        <div className="cert-stat-divider" />
        <div className="cert-stat-item">
          <span className="cert-stat-label">STATUS</span>
          <strong className="cert-stat-val">PUBLISHED &amp; LIVE</strong>
        </div>
        <div className="cert-stat-divider" />
        <div className="cert-stat-item">
          <span className="cert-stat-label">FOCUS</span>
          <strong className="cert-stat-val">SYSTEMS, DATA &amp; DECISION ENGINES</strong>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="opinion-toolbar">
        <div className="opinion-category-pills" aria-label="Filter essays by topic">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`opinion-pill-btn mono ${category === cat ? "is-active" : ""}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="opinion-search-wrapper">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter essays..."
            className="opinion-search-input mono"
            type="search"
          />
        </div>
      </div>

      {/* Compact Monochrome Data Table */}
      <div className="cert-table-container">
        <div className="cert-table-header mono">
          <span className="col-idx">#</span>
          <span className="col-program">ESSAY / PERSPECTIVE</span>
          <span className="col-provider">TOPIC &amp; TAGS</span>
          <span className="col-status">READ TIME &amp; DATE</span>
          <span className="col-action">ACTION</span>
        </div>

        <div className="cert-table-body">
          {filtered.map((article, index) => (
            <Link
              key={article.slug}
              href={`/opinion/${article.slug}/`}
              className="cert-table-row"
            >
              <div className="col-idx mono">
                <span className="idx-number">0{index + 1}</span>
              </div>

              <div className="col-program">
                <strong className="program-title">{article.title}</strong>
                <p className="program-subtitle">{article.subtitle}</p>
              </div>

              <div className="col-provider">
                <span className="provider-name">{article.category}</span>
                <span className="category-tag mono">
                  {article.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
                </span>
              </div>

              <div className="col-status">
                <div className="status-top mono" style={{ marginBottom: 0 }}>
                  <span className="status-pill" style={{ color: "var(--ink)" }}>
                    {article.readTime}
                  </span>
                  <span className="progress-pct">{article.date}</span>
                </div>
              </div>

              <div className="col-action mono">
                <span className="action-button">
                  Read Essay <i aria-hidden="true">→</i>
                </span>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="cert-empty-state mono" style={{ padding: "30px", textAlign: "center" }}>
              <span>// No matching essays found. </span>
              <button
                type="button"
                className="reset-btn mono"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Footnote */}
      <div className="cert-catalog-footnote mono">
        <span>// EDITORIAL INTEGRITY: Unfiltered production retrospectives, system trade-offs, and software economics.</span>
      </div>
    </div>
  );
}
