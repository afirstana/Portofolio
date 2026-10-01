import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MarkdownBody } from "@/components/MarkdownBody";
import { DataMeshArchitectureStudio } from "@/components/DataMeshArchitectureStudio";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const slug = "enterprise-data-mesh-governance-engine";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Enterprise Data Mesh Architecture & Federated Governance Masterclass Handbook — Abimael.Data",
  description:
    "Modul masterclass dan panduan belajar komprehensif arsitektur data terdesentralisasi: Data Mesh, Data as a Product, kontrak data ODCS, kepatuhan UU PDP No. 27/2022, dan persiapan wawancara Data Architect.",
  alternates: { canonical: `/projects/${slug}/` },
  openGraph: {
    title: "Enterprise Data Mesh Architecture & Federated Governance Masterclass Handbook — Abimael.Data",
    description:
      "Panduan belajar arsitektur Data Mesh terdesentralisasi: memecah data monolith ke 5 domain otonom dengan kontrak ODCS, sandboxing interaktif, dan kepatuhan UU PDP.",
    url: `/projects/${slug}/`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Enterprise Data Mesh Architecture Masterclass Handbook — Abimael.Data",
    description:
      "Panduan belajar arsitektur Data Mesh terdesentralisasi dengan studi kasus PT NusaFinance dan persiapan interview Data Architect.",
  },
};

const CURRICULUM_MODULES = [
  { id: "01-titik-temu-arsitektur-monolith-vs-data-mesh-analogi--fondasi", label: "01. Monolith vs Mesh (Analogi Dapur)" },
  { id: "02-4-pilar-utama-data-mesh-zhamak-dehghani", label: "02. 4 Pilar Data Mesh" },
  { id: "03-studi-kasus-nyata-pt-nusafinance-multifinance-alat-berat", label: "03. Kasus PT NusaFinance" },
  { id: "04-pemodelan-5-bounded-context--topologi-domain", label: "04. Topologi 5 Domain (DDD)" },
  { id: "05-anatomi-data-product--standarisasi-output-ports", label: "05. Output Ports (SQL DDL)" },
  { id: "06-data-contracts-odcs--shift-left-cicd-governance", label: "06. Kontrak Data ODCS di CI" },
  { id: "07-kepatuhan-regulasi-enkripsi-masking-uu-pdp--ojk", label: "07. Masking NIK UU PDP & OJK" },
  { id: "08-kueri-analitik-lintas-domain-risk-360-engine", label: "08. Kueri Risk 360 (Trino)" },
  { id: "09-matriks-evaluasi-datsis-ukuran-kebugaran-data-product", label: "09. Matriks Evaluasi DATSIS" },
  { id: "10-architectural-decision-records-adr-001--008", label: "10. 8 Rekaman Keputusan (ADR)" },
  { id: "11-pipeline-verifikasi--penerapan-produksi", label: "11. Verifikasi Docker & CI" },
  { id: "12-panduan-wawancara-data-architect-10-soal--jawaban-tingkat-prinsipal", label: "12. 10 Q&A Wawancara Arsitek" },
  { id: "13-rangkuman-kunci--lembar-belajar-cepat-cheatsheet", label: "13. Cheatsheet & Rangkuman" },
];

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

        {/* Masterclass Header */}
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
              MASTERCLASS // ARCHITECTURE HANDBOOK &amp; STUDY GUIDE
            </span>
            <span
              className="mono"
              style={{
                fontSize: "11px",
                color: "var(--muted)",
              }}
            >
              PROJECT #11 • CURRICULUM GRADE
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

          {/* Masterclass Telemetry Strip */}
          <div
            style={{
              padding: "12px 18px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              alignItems: "center",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            <span><strong style={{ color: "var(--ink-heading)" }}>KURIKULUM:</strong> 13 Modul Belajar</span>
            <span><strong style={{ color: "var(--ink-heading)" }}>KASUS BISNIS:</strong> PT NusaFinance (Alat Berat)</span>
            <span><strong style={{ color: "var(--ink-heading)" }}>REGULASI:</strong> UU PDP No. 27/2022 &amp; POJK 35</span>
            <span><strong style={{ color: "var(--ink-heading)" }}>SIMULASI:</strong> 10 Soal Wawancara Arsitek</span>
            <span style={{ color: "#10b981" }}>● PRODUCTION READY</span>
          </div>
        </div>

        {/* Kurikulum & Navigasi Cepat Modul */}
        <div
          style={{
            marginBottom: "36px",
            padding: "20px",
            backgroundColor: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--accent, #60a5fa)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            // DAFTAR ISI KURIKULUM BELAJAR (QUICK JUMP)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "8px",
            }}
          >
            {CURRICULUM_MODULES.map((mod) => (
              <a
                key={mod.id}
                href={`#${mod.id}`}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "3px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono), monospace",
                  color: "var(--ink)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "border-color 0.15s ease",
                }}
              >
                <span>{mod.label}</span>
                <span style={{ color: "var(--muted)", fontSize: "10px" }}>↓</span>
              </a>
            ))}
          </div>
        </div>

        {/* Visual Architecture Sandbox & Interactive Simulator */}
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              padding: "10px 16px",
              backgroundColor: "rgba(96, 165, 250, 0.08)",
              border: "1px solid rgba(96, 165, 250, 0.2)",
              borderRadius: "4px 4px 0 0",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--accent, #60a5fa)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>// INTERACTIVE ARCHITECTURE LAB (SANDBOX EKSPLORASI)</span>
            <span>UJI COBA 4 MODUL INTERAKTIF</span>
          </div>
          <DataMeshArchitectureStudio />
        </div>

        {/* Full Masterclass Narrative in Markdown */}
        <section
          style={{
            marginTop: "32px",
            marginBottom: "48px",
            borderTop: "1px solid var(--line)",
            paddingTop: "32px",
          }}
        >
          {project.body && <MarkdownBody source={project.body} />}
        </section>

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
