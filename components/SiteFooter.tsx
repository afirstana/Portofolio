import Link from "next/link";

interface SiteFooterProps {
  wide?: boolean;
  backHref?: string;
  backLabel?: string;
}

const ONGOING_TRACKS = [
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
          href="/learning/aws-ai-academy-2026/"
          className="footer-ongoing"
          role="region"
          aria-label="View Active Certification Track: AWS AI Academy 2026"
        >
          <span className="footer-ongoing-tag mono">
            <span className="pulse-dot" aria-hidden="true" /> ACTIVE TRACK:
          </span>
          <span className="footer-ongoing-title mono">
            AWS AI Academy 2026
          </span>
          <div className="footer-mini-progress mono" aria-label="Progress: Active Cohort (1/100)">
            <span className="footer-prog-label">Active Cohort</span>
            <div className="footer-prog-track">
              <div className="footer-prog-bar" style={{ width: "1%" }} />
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
              <span>ACTIVE LEARNING &amp; COHORTS (1 ONGOING)</span>
            </div>
            <Link href="/learning/" className="popover-progress-badge">
              All Certs (7) ↗
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
            <Link href="/learning/" style={{ color: "inherit", textDecoration: "none", display: "flex", width: "100%", justifyContent: "space-between" }}>
              <span>Lihat 6 sertifikasi terverifikasi lainnya di katalog utama</span>
              <i>↗</i>
            </Link>
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
