import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudyToc } from "@/components/CaseStudyToc";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SystemDiagram } from "@/components/SystemDiagram";
import { VisualEvidence } from "@/components/VisualEvidence";
import { MarkdownBody } from "@/components/MarkdownBody";
import { OlistGeoShowcase } from "@/components/OlistGeoShowcase";
import { OlistRfmShowcase } from "@/components/OlistRfmShowcase";
import { OlistPaymentInteractiveShowcase } from "@/components/OlistPaymentInteractiveShowcase";
import { OlistInstallmentAnomalyShowcase } from "@/components/OlistInstallmentAnomalyShowcase";
import { OlistCategoryFinancingShowcase } from "@/components/OlistCategoryFinancingShowcase";
import { CertificateInteractiveShowcase } from "@/components/CertificateInteractiveShowcase";
import { BrentOilInteractiveShowcase } from "@/components/BrentOilInteractiveShowcase";
import { BrentOilRegimesShowcase } from "@/components/BrentOilRegimesShowcase";
import { BrentOilRiskShowcase } from "@/components/BrentOilRiskShowcase";
import { CancerEpidemiologyDashboard } from "@/components/CancerEpidemiologyDashboard";
import { CancerTrendAsdrShowcase } from "@/components/CancerTrendAsdrShowcase";
import { CancerSiteMixShowcase } from "@/components/CancerSiteMixShowcase";
import { CancerGdpScatterShowcase } from "@/components/CancerGdpScatterShowcase";
import { CancerTobaccoRiskShowcase } from "@/components/CancerTobaccoRiskShowcase";
import { CancerTobaccoTableShowcase } from "@/components/CancerTobaccoTableShowcase";
import { getAdjacentProjects, getProjectBySlug, getProjects, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamicParams = false;

type RouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects()
    .filter(
      (p) =>
        p.slug !== "amazon-product-intelligence" &&
        p.slug !== "olist-payment-behavior-analytics" &&
        p.slug !== "banking-transaction-anti-fraud"
    )
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project?.title ?? "Project";
  const description = project?.one_liner ?? siteConfig.description;
  const canonical = `/projects/${slug}/`;
  return {
    title,
    description,
    keywords: project ? [project.category, ...project.tools] : undefined,
    alternates: { canonical },
    openGraph: {
      title: `${title} — Abimael.Data`,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: "article",
    },
    twitter: { card: "summary", title: `${title} — Abimael.Data`, description },
  };
}

export default async function ProjectPage({ params }: RouteProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);
  const adjacent = getAdjacentProjects(project);
  const sections = [
    { id: "problem", title: "Problem", text: project.problem },
    { id: "data", title: "Data", text: "The working records and data signals are described in the local project narrative below." },
    { id: "approach", title: "Approach", text: project.approach },
    { id: "impact", title: "Impact", text: project.impact },
  ];
  const hasEvidence = Boolean(project.evidence?.some((e) => Boolean(e.image && e.image.trim() !== "")));
  const isOlist = project.slug === "olist-e-commerce-logistics-analysis";
  const isOlistPayment = project.slug === "olist-payment-behavior-analytics";
  const isCertificate = project.slug === "certificate-generator-desktop-app";
  const isBrentOil = project.slug === "brent-oil-market-dynamics";
  const isCancer = project.slug === "global-cancer-epidemiology-surveillance";

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="project-detail page-width">
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
          <CaseStudyToc hasEvidence={hasEvidence} />
          <div className="case-story">
            {sections.slice(0, 3).map((section) => (
              <section className="case-stage" id={section.id} key={section.id}>
                <p className="mono case-label">{section.title}</p>
                <p>{section.text}</p>
              </section>
            ))}

            <section className="case-stage" id="system">
              <p className="mono case-label">System</p>
              <SystemDiagram nodes={project.system} />
            </section>

            {/* Standalone Geospatial Logistics & Lead Time Explorer (Olist Logistics) */}
            {isOlist && <OlistGeoShowcase />}

            {/* Standalone 2D RFM Customer Intelligence Matrix (Olist Logistics) */}
            {isOlist && <OlistRfmShowcase />}

            {/* Standalone Payment Method & Installment Elasticity Showcase */}
            {isOlistPayment && <OlistPaymentInteractiveShowcase />}

            {/* Standalone 10x Installment Anomaly Diagnostic Showcase */}
            {isOlistPayment && <OlistInstallmentAnomalyShowcase />}

            {/* Standalone Category Financing Sensitivity Matrix Showcase */}
            {isOlistPayment && <OlistCategoryFinancingShowcase />}

            {/* Standalone Interactive Certificate Canvas & Batch Simulator */}
            {isCertificate && <CertificateInteractiveShowcase />}

            {/* Standalone 35-Year Brent Oil Econometrics & Crisis Shock Showcase */}
            {isBrentOil && <BrentOilInteractiveShowcase />}

            {/* Standalone 03. Four Decades of Market Regimes Showcase */}
            {isBrentOil && <BrentOilRegimesShowcase />}

            {/* Standalone Non-Gaussian Fat-Tail Risk & VaR (95/99) Econometric Showcase */}
            {isBrentOil && <BrentOilRiskShowcase />}

            {/* Standalone Global Cancer Epidemiology & Clinical Survival Dashboard */}
            {isCancer && <CancerEpidemiologyDashboard />}

            {/* Standalone 03. 30-Year Longitudinal Trend & ASDR Trajectory Showcase */}
            {isCancer && <CancerTrendAsdrShowcase />}

            {/* Standalone 04. Malignancy Site Mix & Taxonomy Spectrum Showcase */}
            {isCancer && <CancerSiteMixShowcase />}

            {/* Standalone 2D GDP vs Cancer Mortality Elasticity Showcase */}
            {isCancer && <CancerGdpScatterShowcase />}

            {/* Standalone Tobacco Risk & Smoking Attribution Showcase */}
            {isCancer && <CancerTobaccoRiskShowcase />}

            {/* Standalone Tobacco Longitudinal & Country Risk Matrix Table */}
            {isCancer && <CancerTobaccoTableShowcase />}

            {/* Deep Technical Markdown Narrative & Tables */}
            {project.body && <MarkdownBody source={project.body} />}

            <VisualEvidence projectSlug={project.slug} evidence={project.evidence} />

            <section className="case-stage" id="impact">
              <p className="mono case-label">Impact</p>
              <p>{project.impact}</p>
            </section>

            <section className="case-stage" id="lessons">
              <p className="mono case-label">Lessons</p>
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
