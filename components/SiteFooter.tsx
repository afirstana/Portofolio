import Link from "next/link";

interface SiteFooterProps {
  wide?: boolean;
  backHref?: string;
  backLabel?: string;
}

const ONGOING_TRACKS = [
  {
    id: "datacamp",
    name: "DataCamp Data Analyst Associate",
    slug: "datacamp-data-analyst-associate",
    badge: "DATACAMP CERTIFICATION",
    status: "30-Day Window",
    progressPct: 10,
    modules: [
      "Timed SQL Technical Assessment",
      "Exploratory Data Analysis (EDA)",
      "Hands-On Practical Business Case Exam",
      "Data Management & Decisioning Standards",
    ],
  },
  {
    id: "aws",
    name: "AWS AI Academy 2026",
    slug: "aws-ai-academy-2026",
    badge: "AWS × DICODING",
    status: "Active Cohort (1/100)",
    progressPct: 1,
    modules: [
      "Spec-Driven Development dengan Kiro",
      "Belajar Dasar Cloud dan Gen AI di AWS",
      "Memulai Pemrograman dengan Python",
      "Belajar Machine Learning untuk Pemula",
    ],
  },
] as const;

export function SiteFooter({
  wide = false,
  backHref = "#top",
  backLabel = "Back to top ↑",
}: SiteFooterProps) {
  return (
    <footer className={`footer ${wide ? "page-width-wide" : "page-width"}`}>
      <div className="footer-ongoing-wrapper">
        <Link
          href="/learning/datacamp-data-analyst-associate/"
          className="footer-ongoing"
          role="region"
          aria-label="View Active Certification Track: DataCamp Data Analyst Associate"
        >
          <span className="footer-ongoing-tag mono">
            <span className="pulse-dot" aria-hidden="true" /> ACTIVE CERTIFICATION:
          </span>
          <span className="footer-ongoing-title mono">
            DataCamp Data Analyst Associate
          </span>
          <div className="footer-mini-progress mono" aria-label="Progress: 30-Day Window">
            <span className="footer-prog-label">30-Day Window</span>
            <div className="footer-prog-track">
              <div className="footer-prog-bar" style={{ width: "10%" }} />
            </div>
          </div>
          <span className="footer-ongoing-arrow mono" aria-hidden="true">
            View Track ↗
          </span>
        </Link>

        {/* Floating Hover Popover Box */}
        <div className="footer-ongoing-floating-popover" role="tooltip" aria-hidden="true">
          <div className="floating-popover-header mono">
            <div className="popover-header-title">
              <span className="pulse-dot" />
              <span>ACTIVE CERTIFICATIONS &amp; ACADEMIES (2 ENROLLED)</span>
            </div>
            <Link href="/learning/" className="popover-progress-badge">
              View All ↗
            </Link>
          </div>

          <div className="floating-tracks-accordion">
            {ONGOING_TRACKS.map((track) => (
              <div key={track.id} className="floating-track-group">
                <div className="track-group-header mono">
                  <span className="track-group-name">{track.name}</span>
                  <span className="track-group-status">{track.status}</span>
                </div>
                <ul className="floating-modules-list">
                  {track.modules.map((moduleName, index) => (
                    <li key={moduleName} className="floating-module-item">
                      <span className="mono module-num">0{index + 1}</span>
                      <span className="module-name">{moduleName}</span>
                    </li>
                  ))}
                </ul>
                <div className="track-link-row mono">
                  <Link href={`/learning/${track.slug}/`} className="track-direct-link">
                    Explore {track.name} Syllabus &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="floating-popover-footer mono">
            <span>Klik untuk membuka silabus lengkap &amp; interactive lab</span>
            <i>↗</i>
          </div>
        </div>
      </div>

      <div className="footer-meta">
        <span className="mono">Data systems. Analytical clarity. Useful automation.</span>
        <Link className="mono footer-back-link" href={backHref}>
          {backLabel}
        </Link>
      </div>
    </footer>
  );
}
