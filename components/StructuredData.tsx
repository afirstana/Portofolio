import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function StructuredData() {
  const projects = getProjects();
  const data = { "@context": "https://schema.org", "@type": "Person", name: "Abimael Firstana", url: siteConfig.url, jobTitle: "Data Analyst", description: siteConfig.description, knowsAbout: ["Data systems", "Automation", "Analytics", "Machine learning"], workExample: projects.map((project) => ({ "@type": "CreativeWork", name: project.title, description: project.one_liner, url: `${siteConfig.url}/projects/${project.slug}/` })) };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
