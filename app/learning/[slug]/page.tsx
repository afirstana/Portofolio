import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AwsAcademyInteractiveShowcase } from "@/components/AwsAcademyInteractiveShowcase";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getAdjacentLearningTracks, getLearningTrackBySlug, getLearningTracks } from "@/lib/learning";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

type RouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getLearningTracks().map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const track = getLearningTrackBySlug(slug);
  if (!track) return { title: "Track Not Found" };

  return {
    title: `${track.title} — Abimael.Data`,
    description: track.subtitle,
    alternates: { canonical: `/learning/${track.slug}/` },
    openGraph: {
      title: `${track.title} — Ongoing Learning`,
      description: track.subtitle,
      url: `/learning/${track.slug}/`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function LearningTrackDetailPage({ params }: RouteProps) {
  const { slug } = await params;
  const track = getLearningTrackBySlug(slug);
  if (!track) notFound();

  const { previous, next } = getAdjacentLearningTracks(track);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="page-width learning-reader-shell">
        <header className="learning-reader-header">
          <Link className="back-link mono" href="/learning/">
            ← Back to All Certifications
          </Link>

          <div className="learning-meta-bar mono">
            <span className="learning-badge">{track.badge}</span>
            <span className="learning-dot">•</span>
            <span>{track.provider}</span>
            <span className="learning-dot">•</span>
            <span className="learning-status-pill">
              <span className="pulse-dot" /> {track.status}
            </span>
          </div>

          <h1 className="learning-title">{track.title}</h1>
          <p className="learning-subtitle">{track.subtitle}</p>

          <div className="tags learning-tags">
            {track.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>

        {/* Progress & Timeline Telemetry Strip */}
        <div className="learning-progress-strip detail-strip">
          <div className="learning-progress-info mono">
            <span>TRACK COMPLETION PROGRESS:</span>
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
            <span>STATUS: {track.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Core Thesis Box */}
        <div className="learning-thesis-box" role="region" aria-label="Learning Objectives & Thesis">
          <div className="thesis-box-header">
            <span className="mono">CORE OBJECTIVE &amp; TECHNICAL FOCUS</span>
            <span className="pulse-dot" />
          </div>
          <p className="thesis-content">"{track.thesis}"</p>
        </div>

        {/* Standalone Interactive Academy Learning Lab Showcase (for AWS) */}
        {track.slug === "aws-ai-academy-2026" && (
          <AwsAcademyInteractiveShowcase />
        )}

        {/* Enrolled Modules & Coursework Grid */}
        {track.modules && track.modules.length > 0 && (
          <section className="learning-modules-section">
            <h2 className="modules-section-title mono">// ENROLLED MODULES &amp; CURRICULUM ({track.modules.length})</h2>
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
          </section>
        )}

        {/* Markdown Curriculum & Narrative */}
        <div className="learning-body-container">
          <MarkdownBody source={track.body} />
        </div>

        {/* Adjacent Learning Pager */}
        <nav className="learning-pager" aria-label="Adjacent learning tracks navigation">
          {previous && (
            <Link href={`/learning/${previous.slug}/`} className="learning-pager-link prev">
              <span className="mono">← Previous Track</span>
              <strong>{previous.title}</strong>
            </Link>
          )}
          {next && (
            <Link href={`/learning/${next.slug}/`} className="learning-pager-link next">
              <span className="mono">Next Track →</span>
              <strong>{next.title}</strong>
            </Link>
          )}
        </nav>
      </article>
      <SiteFooter backHref={`/learning/${track.slug}/#top`} backLabel="Top ↑" />
    </main>
  );
}
