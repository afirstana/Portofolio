import Link from "next/link";

interface SiteFooterProps {
  wide?: boolean;
  backHref?: string;
  backLabel?: string;
}

const ONGOING_MODULES = [
  "Spec-Driven Development dengan Kiro",
  "Belajar Dasar Cloud dan Gen AI di AWS",
  "Memulai Pemrograman dengan Python",
  "Belajar Machine Learning untuk Pemula",
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
          aria-label="View Ongoing Learning Track: AWS AI Academy 2026"
        >
          <span className="footer-ongoing-tag mono">
            <span className="pulse-dot" aria-hidden="true" /> ONGOING LEARNING:
          </span>
          <span className="footer-ongoing-title mono">
            AWS AI Academy 2026
          </span>
          <div className="footer-mini-progress mono" aria-label="Progress: 1/100">
            <span className="footer-prog-label">1/100</span>
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
              <span>AWS AI ACADEMY 2026 • 4 KELAS TERDAFTAR</span>
            </div>
            <span className="popover-progress-badge">Prog: 1/100</span>
          </div>

          <ul className="floating-modules-list">
            {ONGOING_MODULES.map((moduleName, index) => (
              <li key={moduleName} className="floating-module-item">
                <span className="mono module-num">0{index + 1}</span>
                <span className="module-name">{moduleName}</span>
                <span className="mono module-status-badge">Active</span>
              </li>
            ))}
          </ul>

          <div className="floating-popover-footer mono">
            <span>Klik untuk membuka silabus &amp; interactive lab</span>
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
