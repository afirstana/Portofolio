import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MarkdownBody } from "@/components/MarkdownBody";
import { DataArchitectSimulator } from "@/components/DataArchitectSimulator";
import { DataMeshVisualMasterclass } from "@/components/DataMeshVisualMasterclass";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "enterprise-data-mesh-governance-engine";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Enterprise Data Mesh Architecture & Federated Governance Masterclass Handbook — Abimael.Data",
  description:
    "Modul masterclass visual dan simulator interaktif Data Architect: Data Mesh, Data as a Product, kontrak data ODCS, kepatuhan UU PDP No. 27/2022, dan persiapan wawancara Data Architect.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Enterprise Data Mesh Architecture & Federated Governance Masterclass Handbook — Abimael.Data",
    description:
      "Panduan belajar dan simulator interaktif Data Architect: memecah data monolith ke 5 domain otonom dengan kontrak ODCS, simulasi insiden krisis arsitek, grafik visual, dan kepatuhan UU PDP.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Enterprise Data Mesh Architecture Masterclass & Simulator — Abimael.Data",
    description:
      "Panduan belajar arsitektur Data Mesh terdesentralisasi dengan simulator Data Architect dan persiapan interview.",
  },
};

export default function EnterpriseDataMeshMasterclassPage() {
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const adjacent = getAdjacentProjects(project);
  const related = getRelatedProjects(project);

  return (
    <main className="site-shell">
      <SiteHeader />
      <article className="project-detail page-width-wide">
        <Link className="back-link mono" href="/#work">
          ← Kembali ke Semua Proyek
        </Link>

        {/* Masterclass Visual Hero Header */}
        <div style={{ marginTop: "16px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span
              className="mono"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "3px 8px",
                borderRadius: "3px",
                backgroundColor: "rgba(96, 165, 250, 0.15)",
                color: "var(--accent, #60a5fa)",
                textTransform: "uppercase",
              }}
            >
              SIMULASI DATA ARCHITECT // VISUAL MASTERCLASS HANDBOOK
            </span>
            <span
              className="mono"
              style={{
                fontSize: "11px",
                color: "var(--muted)",
              }}
            >
              PROJECT #11 • INTERACTIVE ARCHITECTURE SUITE
            </span>
          </div>

          <h1 className="payment-hero-title" style={{ fontSize: "clamp(26px, 4vw, 36px)", lineHeight: 1.25, marginBottom: "16px" }}>
            {project.title}
          </h1>

          <p className="detail-lede payment-lede" style={{ maxWidth: "860px", fontSize: "16px", lineHeight: 1.6, color: "var(--ink)" }}>
            {project.one_liner}
          </p>

          {/* Tools & Core Competency Pills */}
          <div className="tags detail-tags" style={{ marginTop: "20px", marginBottom: "24px" }}>
            {project.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* FITUR UTAMA: SIMULATOR DATA ARCHITECT (BLUEPRINT & INCIDENT GAUNTLET) */}
        {/* ================================================================= */}
        <section aria-label="Data Architect Interactive Simulator" style={{ marginBottom: "40px" }}>
          <DataArchitectSimulator />
        </section>

        {/* ================================================================= */}
        {/* MODUL 2: DATA MESH VISUAL MASTERCLASS (GAMBAR & GRAFIK INTERAKTIF) */}
        {/* ================================================================= */}
        <section aria-label="Visual Masterclass & Charts Suite" style={{ marginBottom: "40px" }}>
          <DataMeshVisualMasterclass />
        </section>

        {/* ================================================================= */}
        {/* MODUL 3: DOKUMENTASI TEKNIS & SPESIFIKASI LENGKAP (COLLAPSIBLE)   */}
        {/* ================================================================= */}
        <details
          style={{
            marginTop: "32px",
            marginBottom: "48px",
            border: "1px solid var(--line)",
            borderRadius: "6px",
            backgroundColor: "var(--panel)",
            overflow: "hidden",
          }}
        >
          <summary
            style={{
              padding: "16px 20px",
              cursor: "pointer",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--ink-heading)",
              backgroundColor: "var(--surface)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <span>📖 Buka Naskah &amp; Spesifikasi Arsitektur Lengkap (SQL DDL, ODCS YAML &amp; ADR 001–008)</span>
            <span style={{ fontSize: "11px", color: "var(--accent, #60a5fa)" }}>Klik untuk Membaca Selengkapnya ▾</span>
          </summary>

          <div style={{ padding: "24px 28px" }}>
            {project.body && <MarkdownBody source={project.body} />}
          </div>
        </details>

        {/* Related Systems Navigation */}
        <section className="related-projects">
          <p className="mono">Sistem &amp; Kasus Terkait Lainnya</p>
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

        {/* Adjacent Navigation Pager */}
        <nav className="project-pager" aria-label="Project navigation">
          <Link href={`/projects/${adjacent.previous.slug}/`}>
            <span className="mono">Sebelumnya</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
          <Link href={`/projects/${adjacent.next.slug}/`}>
            <span className="mono">Selanjutnya</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        </nav>
      </article>

      <SiteFooter backHref="/" backLabel="Kembali ke Beranda ↑" />
    </main>
  );
}
