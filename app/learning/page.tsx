import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getLearningTracks } from "@/lib/learning";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ongoing Learning & Specializations — Abimael.Data",
  description:
    "Active technical tracks, enterprise cloud academies, and specialized certifications in AI, machine learning, and data engineering.",
  alternates: { canonical: "/learning/" },
  openGraph: {
    title: "Ongoing Learning & Specializations — Abimael.Data",
    description:
      "Active technical tracks, enterprise cloud academies, and specialized certifications in AI, machine learning, and data engineering.",
    url: "/learning/",
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function LearningIndexPage() {
  const tracks = getLearningTracks();

  return (
    <main className="site-shell">
      <SiteHeader />
      <div className="page-width learning-page-shell">
        <header className="learning-index-header">
          <Link className="back-link mono" href="/#work">
            ← Back to Home
          </Link>
          <p className="section-label mono">09 / Continuous Education & Academies</p>
          <h1 className="section-title">Ongoing Learning & Specializations.</h1>
          <p className="body-copy">
            Active professional development tracks, cloud scholarships, and hands-on technical training programs. 
            Documenting structured skill acquisition in Artificial Intelligence, Cloud Infrastructure, and Spec-Driven Engineering.
          </p>
        </header>

        <div className="learning-list">
          {tracks.map((track, index) => (
            <article key={track.slug} className="learning-card">
              <div className="learning-card-header">
                <span className="mono learning-number">
                  0{index + 1}
                </span>
                <div className="learning-meta mono">
                  <span className="learning-provider">{track.provider}</span>
                  <span className="learning-dot">•</span>
                  <span>{track.category}</span>
                  <span className="learning-dot">•</span>
                  <span className="learning-status-pill">
                    <span className="pulse-dot" /> {track.status}
                  </span>
                </div>
              </div>

              <h2 className="learning-card-title">
                <Link href={`/learning/${track.slug}/`}>
                  {track.title}
                </Link>
              </h2>
              <p className="learning-card-subtitle">{track.subtitle}</p>

              {/* Progress Bar & Milestone Status */}
              <div className="learning-progress-strip">
                <div className="learning-progress-info mono">
                  <span>OVERALL TRACK PROGRESS:</span>
                  <strong className="progress-fraction-val">{track.progressFraction || `${track.progressPct}/100`} ({track.progressPct}%)</strong>
                </div>
                <div className="learning-progress-bar">
                  <div
                    className="learning-progress-fill"
                    style={{ width: `${track.progressPct}%` }}
                  />
                </div>
                <div className="learning-timeline-meta mono">
                  <span>TIMELINE: {track.startDate.toUpperCase()} – {track.endDate.toUpperCase()}</span>
                  <span className="learning-badge-tag">{track.badge}</span>
                </div>
              </div>

              {/* Enrolled Modules Grid Preview */}
              <div className="learning-modules-preview">
                <p className="mono modules-header-title">ENROLLED COURSEWORK & LAB MODULES ({track.modules.length}):</p>
                <div className="learning-modules-grid">
                  {track.modules.map((m) => (
                    <div key={m.name} className="learning-module-item">
                      <div className="module-item-top">
                        <strong className="module-item-name">{m.name}</strong>
                        <span className="mono module-item-level">{m.level}</span>
                      </div>
                      <p className="module-item-desc">{m.summary}</p>
                      <div className="module-item-footer">
                        <span className="mono module-status-tag">Status: {m.status}</span>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono module-link"
                        >
                          Curriculum ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="learning-card-footer">
                <div className="tags">
                  {track.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link href={`/learning/${track.slug}/`} className="learning-read-action mono">
                  Explore full syllabus & notes <i aria-hidden="true">→</i>
                </Link>
              </div>
            </article>
          ))}

          {tracks.length === 0 && (
            <div className="empty-state">
              <p className="mono">No active learning tracks found</p>
              <Link className="mono" href="/#work">
                Return to home
              </Link>
            </div>
          )}
        </div>
      </div>
      <SiteFooter backHref="/learning/#top" backLabel="Top ↑" />
    </main>
  );
}
