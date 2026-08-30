import type { Metadata } from "next";
import Link from "next/link";
import { AmazonCaseStudyToc } from "@/components/AmazonCaseStudyToc";
import { AmazonDashboard } from "@/components/AmazonDashboard";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";

const slug = "amazon-product-intelligence";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Amazon Product Intelligence",
  description: "A static, browser-only analysis dashboard built from a supplied Amazon product and review dataset.",
  alternates: { canonical: "/projects/amazon-product-intelligence/" },
  openGraph: {
    title: "Amazon Product Intelligence — Abimael.Data",
    description: "A static, browser-only analysis dashboard built from a supplied Amazon product and review dataset.",
    url: "/projects/amazon-product-intelligence/",
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Amazon Product Intelligence — Abimael.Data",
    description: "A static, browser-only analysis dashboard built from a supplied Amazon product and review dataset.",
  },
};

export default function AmazonProductIntelligencePage() {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);
  const adjacent = getAdjacentProjects(project);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="project-detail page-width amazon-case-study">
        <Link className="back-link mono" href="/#work">
          ← All work
        </Link>
        <p className="section-label mono">Case study / {project.category}</p>
        <h1>{project.title}</h1>
        <p className="detail-lede">{project.one_liner}</p>

        <div className="tags detail-tags">
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>

        <div className="case-layout">
          <AmazonCaseStudyToc />

          <div className="case-story">
            {/* 01. Overview */}
            <section id="overview" className="case-stage amazon-overview">
              <p className="mono case-label">Executive Overview</p>
              <div className="amazon-overview-grid">
                <div>
                  <span className="mono">Problem</span>
                  <p>{project.problem}</p>
                </div>
                <div>
                  <span className="mono">Approach</span>
                  <p>{project.approach}</p>
                </div>
                <div>
                  <span className="mono">Outcome</span>
                  <p>{project.impact}</p>
                </div>
              </div>
            </section>

            {/* 02. Interactive Data Lab & Live NLP Simulator */}
            <section id="dashboard" className="case-stage amazon-dashboard-stage">
              <p className="mono case-label">Interactive Data Lab & Inference Engine</p>
              <AmazonDashboard />
            </section>

            {/* 03. Comprehensive Case Study Deep-Dive */}
            <section id="case-study" className="case-stage">
              <p className="mono case-label">Analytical Dossier & Empirical Findings</p>
              <MarkdownBody source={project.body} />
            </section>

            {/* 04. System Delivery */}
            <section id="system" className="case-stage" aria-label="Static delivery system">
              <p className="mono case-label">Static Delivery Architecture</p>
              <SystemDiagram nodes={project.system} />
            </section>

            {/* 05. Visual Evidence */}
            <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />

            {/* 06. Lessons Learned */}
            <section className="case-stage" id="lessons">
              <p className="mono case-label">Key Takeaways & Lessons</p>
              <ul className="lesson-list">
                {project.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section className="related-projects">
          <p className="mono">Related systems</p>
          <div>
            {related.map((item) => (
              <Link href={`/projects/${item.slug}/`} key={item.slug}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <i>↗</i>
              </Link>
            ))}
          </div>
        </section>

        <nav className="project-pager" aria-label="Project navigation">
          <Link href={`/projects/${adjacent.previous.slug}/`}>
            <span className="mono">Previous</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
          <Link href={`/projects/${adjacent.next.slug}/`}>
            <span className="mono">Next</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        </nav>
      </article>
      <SiteFooter backHref="/" backLabel="Home ↑" />
    </main>
  );
}
