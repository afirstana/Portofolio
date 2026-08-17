import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { MarkdownBody } from "@/components/MarkdownBody";
import { getAdjacentOpinions, getOpinionBySlug, getOpinions } from "@/lib/opinions";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

type RouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getOpinions().map((opinion) => ({ slug: opinion.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getOpinionBySlug(slug);
  if (!article) {
    return { title: "Opinion — Abimael.Data" };
  }

  const canonical = `/opinion/${slug}/`;
  return {
    title: `${article.title} — Abimael.Data`,
    description: article.subtitle,
    keywords: [article.category, ...article.tags],
    alternates: { canonical },
    openGraph: {
      title: `${article.title} — Abimael.Data`,
      description: article.subtitle,
      url: canonical,
      siteName: siteConfig.name,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${article.title} — Abimael.Data`,
      description: article.subtitle,
    },
  };
}

export default async function OpinionArticlePage({ params }: RouteProps) {
  const { slug } = await params;
  const article = getOpinionBySlug(slug);
  if (!article) notFound();

  const { previous, next } = getAdjacentOpinions(article);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="page-width opinion-reader-shell">
        <div className="opinion-reader-header">
          <Link className="back-link mono" href="/opinion/">
            ← All opinions & essays
          </Link>
          
          <div className="opinion-meta-bar mono">
            <span className="opinion-badge">{article.category}</span>
            <span className="opinion-divider">•</span>
            <span>{article.readTime}</span>
            <span className="opinion-divider">•</span>
            <span>{article.date}</span>
          </div>

          <h1 className="opinion-title">{article.title}</h1>
          <p className="opinion-subtitle">{article.subtitle}</p>

          <div className="tags opinion-tags">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Editorial Cover Artwork */}
        {article.coverImage && (
          <figure className="opinion-hero-cover">
            <img
              src={article.coverImage}
              alt={`Editorial technical visualization for ${article.title}`}
            />
            <figcaption className="mono">
              Fig. 01 / Architectural Concept Visualization • {article.title}
            </figcaption>
          </figure>
        )}

        {/* Executive Thesis TL;DR Callout */}
        <div className="opinion-thesis-box" role="region" aria-label="Executive Thesis">
          <div className="thesis-box-header">
            <span className="mono">EXECUTIVE THESIS / CORE ARGUMENT</span>
            <span className="thesis-dot" />
          </div>
          <p className="thesis-content">"{article.thesis}"</p>
        </div>

        {/* Deep Markdown Narrative */}
        <div className="opinion-body-container">
          <MarkdownBody source={article.body} />
        </div>

        {/* Adjacent Opinion Pager */}
        <nav className="opinion-pager" aria-label="Adjacent essays navigation">
          {previous && (
            <Link href={`/opinion/${previous.slug}/`} className="opinion-pager-link prev">
              <span className="mono">← Previous Perspective</span>
              <strong>{previous.title}</strong>
            </Link>
          )}
          {next && (
            <Link href={`/opinion/${next.slug}/`} className="opinion-pager-link next">
              <span className="mono">Next Perspective →</span>
              <strong>{next.title}</strong>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
