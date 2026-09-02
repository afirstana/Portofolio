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
    badge: "DATACAMP VERIFIED",
    status: "100% Certified",
    progressPct: 100,
    modules: [
      "Stage 1: Timed SQL Exam (Score: 174/86)",
      "Stage 2: Practical Business Exam (4/4 Tasks Passed)",
      "Exploratory Statistical Diagnostics & Data Quality",
      "Executive Synthesis & Decision Standards",
    ],
  },
  {
    id: "komdigi-ads",
    name: "Komdigi Associate Data Scientist",
    slug: "komdigi-associate-data-scientist",
    badge: "KOMDIGI DTS",
    status: "12/12 Units Done",
    progressPct: 100,
    modules: [
      "UK 01: Multi-Source Data Collection & Ingestion",
      "UK 02: Exploratory Data Analysis & Skew Diagnostics",
      "UK 03: Automated Cleansing & Preprocessing Pipelines",
      "UK 04–12: Supervised Modeling & Evaluation",
    ],
  },
  {
    id: "komdigi-ds-nasional",
    name: "Komdigi Data Scientist Nasional",
    slug: "komdigi-data-scientist-nasional",
    badge: "KOMDIGI DTS",
    status: "Score: 100.00",
    progressPct: 100,
    modules: [
      "UK 1: CRISP-DM Business Scoping (100.00/100.00)",
      "UK 2: Technical KPI Charters (100.00/100.00)",
      "UK 3: 5-Fold Validation Scenarios (100.00/100.00)",
      "UK 4: 6-Model Benchmark Review (90.00/100.00)",
    ],
  },
  {
    id: "dqlab",
    name: "DQLab Data Science & AI",
    slug: "dqlab-data-science-ai-foundations",
    badge: "DQLAB VERIFIED",
    status: "5 Credentials",
    progressPct: 100,
    modules: [
      "Fundamental SQL Using SELECT Statement",
      "Guide to Learn SQL with AI at DQLab",
      "Guide to Learn Python with AI at DQLab",
      "Python & R Fundamental for Data Science",
    ],
  },
  {
    id: "aws",
    name: "AWS AI Academy 2026",
    slug: "aws-ai-academy-2026",
    badge: "AWS × DICODING",
    status: "Active Cohort",
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
          aria-label="View Verified Certification Track: DataCamp Data Analyst Associate"
        >
          <span className="footer-ongoing-tag mono">
            <span className="pulse-dot" aria-hidden="true" /> VERIFIED CREDENTIAL:
          </span>
          <span className="footer-ongoing-title mono">
            DataCamp Data Analyst Associate
          </span>
          <div className="footer-mini-progress mono" aria-label="Progress: 100% Completed">
            <span className="footer-prog-label">100% Certified</span>
            <div className="footer-prog-track">
              <div className="footer-prog-bar" style={{ width: "100%" }} />
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
              <span>CERTIFICATIONS &amp; ACADEMIES (7 TRACKS)</span>
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
            <span>Klik untuk membuka katalog &amp; silabus lengkap</span>
            <i>↗</i>
          </div>
        </div>
      </div>

      <div className="footer-meta">
        <span className="mono">Data systems. Analytical clarity. Useful automation.</span>
        <span className="mono">© 2026 Abimael Firstana</span>
      </div>
    </footer>
  );
}
