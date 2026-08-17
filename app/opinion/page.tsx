import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { OpinionExplorer } from "@/components/OpinionExplorer";
import { getOpinions } from "@/lib/opinions";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Opinions & Essays — Abimael.Data",
  description:
    "Long-form essays on analytical decision systems, e-commerce unit economics, data architecture, and pragmatic engineering.",
  alternates: { canonical: "/opinion/" },
  openGraph: {
    title: "Opinions & Essays — Abimael.Data",
    description:
      "Long-form essays on analytical decision systems, e-commerce unit economics, data architecture, and pragmatic engineering.",
    url: "/opinion/",
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function OpinionIndexPage() {
  const opinions = getOpinions();

  return (
    <main className="site-shell">
      <SiteHeader />
      <div className="page-width opinion-page-shell">
        <header className="opinion-index-header">
          <Link className="back-link mono" href="/#work">
            ← Back to Home
          </Link>
          <p className="section-label mono">08 / Perspectives & Essays</p>
          <h1 className="section-title">Opinions on Systems, Data & Software.</h1>
          <p className="body-copy">
            Essays on the intersection of data analysis, operational decision engines, and pragmatic toolmaking. 
            Reflecting on real production lessons beyond sanitized case studies.
          </p>
        </header>

        <OpinionExplorer opinions={opinions} />
      </div>
    </main>
  );
}
