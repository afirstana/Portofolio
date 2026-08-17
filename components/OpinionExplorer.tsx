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
      {/* Search and Category Filter Toolbar */}
      <div className="explorer-toolbar">
        <label className="search-field">
          <span className="mono">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search essays, tags, or themes..."
            type="search"
          />
        </label>
        <div className="filter-list" aria-label="Filter essays by topic">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count Indicator */}
      <p className="explorer-count mono" aria-live="polite">
        {String(filtered.length).padStart(2, "0")} perspectives published
      </p>

      {/* List of Opinion Cards */}
      <div className="opinion-list">
        {filtered.map((article, index) => (
          <Link
            key={article.slug}
            href={`/opinion/${article.slug}/`}
            className="opinion-card"
          >
            {article.coverImage && (
              <div className="opinion-card-cover">
                <img
                  src={article.coverImage}
                  alt={`Cover artwork for ${article.title}`}
                  loading="lazy"
                />
              </div>
            )}

            <div className="opinion-card-body">
              <div className="opinion-card-header">
                <span className="mono opinion-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="opinion-meta mono">
                  <span className="opinion-category">{article.category}</span>
                  <span className="opinion-dot">•</span>
                  <span>{article.readTime}</span>
                  <span className="opinion-dot">•</span>
                  <span>{article.date}</span>
                </div>
              </div>

              <h3 className="opinion-card-title">{article.title}</h3>
              <p className="opinion-card-subtitle">{article.subtitle}</p>

              {/* Thesis Teaser Callout */}
              <div className="opinion-thesis-teaser">
                <span className="mono">Core Thesis:</span>
                <p>"{article.thesis}"</p>
              </div>

              <div className="opinion-card-footer">
                <div className="tags">
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="opinion-read-action mono">
                  Read essay <i aria-hidden="true">↗</i>
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <p className="mono">No matching perspectives found</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
