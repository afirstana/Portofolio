import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getLearningTracks } from "@/lib/learning";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certifications & Continuous Learning — Abimael.Data",
  description:
    "Catalog of verified industry certifications, cloud technical scholarships, and specialized engineering tracks in AI, machine learning, and data analytics.",
  alternates: { canonical: "/learning/" },
  openGraph: {
    title: "Certifications & Continuous Learning — Abimael.Data",
    description:
      "Catalog of verified industry certifications, cloud technical scholarships, and specialized engineering tracks in AI, machine learning, and data analytics.",
    url: "/learning/",
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function LearningIndexPage() {
  const tracks = getLearningTracks();
  const totalModules = tracks.reduce((sum, t) => sum + (t.modules?.length || 0), 0);

  return (
    <main className="site-shell">
      <SiteHeader />
      <div className="page-width cert-catalog-shell">
        <header className="cert-catalog-header">
          <Link className="back-link mono" href="/#work">
            ← Back to Home
          </Link>
          <p className="section-label mono">02 / Credentials &amp; Academies</p>
          <h1 className="section-title">Certifications &amp; Continuous Learning.</h1>
          <p className="body-copy">
            Catalog of formal industry certifications, enterprise cloud scholarships, and structured continuous education programs.
            Click any certification row below to inspect its comprehensive syllabus, examination pillars, and technical notes.
          </p>

          {/* Telemetry Summary Bar */}
          <div className="cert-telemetry-bar mono">
            <div className="cert-stat-item">
              <span className="cert-stat-label">TRACKS</span>
              <strong className="cert-stat-val">0{tracks.length}</strong>
            </div>
            <div className="cert-stat-divider" />
            <div className="cert-stat-item">
              <span className="cert-stat-label">STATUS</span>
              <strong className="cert-stat-val" style={{ color: "var(--accent)" }}>ACTIVE COHORTS</strong>
            </div>
            <div className="cert-stat-divider" />
            <div className="cert-stat-item">
              <span className="cert-stat-label">TOTAL MODULES</span>
              <strong className="cert-stat-val">{totalModules} MODULES</strong>
            </div>
            <div className="cert-stat-divider" />
            <div className="cert-stat-item">
              <span className="cert-stat-label">STANDARDS</span>
              <strong className="cert-stat-val">SPEC-DRIVEN &amp; TIMED EXAMS</strong>
            </div>
          </div>
        </header>

        {/* Compact Monochrome Data Table */}
        <div className="cert-table-container">
          <div className="cert-table-header mono">
            <span className="col-idx">#</span>
            <span className="col-program">CERTIFICATION / PROGRAM</span>
            <span className="col-provider">AUTHORITY / PROVIDER</span>
            <span className="col-status">PROGRESS &amp; STATUS</span>
            <span className="col-action">ACTION</span>
          </div>

          <div className="cert-table-body">
            {tracks.map((track, index) => (
              <Link
                key={track.slug}
                href={`/learning/${track.slug}/`}
                className="cert-table-row"
              >
                <div className="col-idx mono">
                  <span className="idx-number">0{index + 1}</span>
                </div>

                <div className="col-program">
                  <div className="program-title-wrapper">
                    <strong className="program-title">{track.title}</strong>
                    <span className="program-badge mono">{track.badge}</span>
                  </div>
                  <p className="program-subtitle">{track.subtitle}</p>
                </div>

                <div className="col-provider">
                  <span className="provider-name">{track.provider}</span>
                  <span className="category-tag mono">{track.category}</span>
                </div>

                <div className="col-status">
                  <div className="status-top mono">
                    <span className="status-pill">
                      <span className="pulse-dot" /> {track.status}
                    </span>
                    <span className="progress-pct">{track.progressPct}%</span>
                  </div>
                  <div className="mini-progress-bar">
                    <div
                      className="mini-progress-fill"
                      style={{ width: `${Math.max(track.progressPct, 4)}%` }}
                    />
                  </div>
                </div>

                <div className="col-action mono">
                  <span className="action-button">
                    View Syllabus <i aria-hidden="true">→</i>
                  </span>
                </div>
              </Link>
            ))}

            {tracks.length === 0 && (
              <div className="cert-empty-state mono">
                <span>// No certification records found</span>
              </div>
            )}
          </div>
        </div>

        {/* Verification Footnote */}
        <div className="cert-catalog-footnote mono">
          <span>// CERTIFICATION INTEGRITY: All examination criteria, timed assessments, and capstone submissions are verified by their respective certification authorities.</span>
        </div>
      </div>
      <SiteFooter backHref="/learning/#top" backLabel="Top ↑" />
    </main>
  );
}
