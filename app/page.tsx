import playgroundData from "@/content/data/playground.json";
import { ContactActions } from "@/components/ContactActions";
import { DataPlayground } from "@/components/DataPlayground";
import { HeroCinematic } from "@/components/HeroCinematic";
import { MobileContactCTA, ScrollProgress } from "@/components/GlobalUX";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { SkillMatrix } from "@/components/SkillMatrix";
import { TimelineExplorer } from "@/components/TimelineExplorer";
import { StructuredData } from "@/components/StructuredData";
import { getAbout, getContact, getHero, getMethod, getProjects, getSkills, getTimeline } from "@/lib/content";

export default function HomePage() {
  const hero = getHero(); const about = getAbout(); const projects = getProjects(); const skills = getSkills(); const timeline = getTimeline(); const contact = getContact(); const method = getMethod();
  return <main className="site-shell"><StructuredData /><ScrollProgress /><SiteHeader /><HeroCinematic hero={hero} />
    <Reveal><section id="about" className="section page-width about-layout"><p className="section-label mono">{about.eyebrow}</p><div className="about-content"><div className="system-portrait" role="img" aria-label={about.photo}><span /><i /><b /></div><div><h2 className="section-title">{about.heading}</h2><p className="body-copy">{about.bio_text}</p><ol className="values-list">{about.values.map((value, index) => <li key={value}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{value}</li>)}</ol></div></div></section></Reveal>
    <Reveal><ProjectExplorer projects={projects} /></Reveal>
    <Reveal><section id="method" className="section method-section"><div className="page-width"><p className="section-label mono">{method.eyebrow}</p><h2 className="section-title narrow-title">{method.heading}</h2><div className="method-grid">{method.steps.map((step, index) => <article key={step.title}><span className="mono">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></div></section></Reveal>
    <Reveal><SkillMatrix content={skills} projects={projects} /></Reveal>
    <Reveal><DataPlayground data={playgroundData} /></Reveal>
    <Reveal><TimelineExplorer content={timeline} /></Reveal>
    <Reveal><section id="contact" className="contact-section"><div className="page-width"><p className="section-label mono">{contact.eyebrow}</p><h2>{contact.heading}</h2><a className="contact-cta" href={`mailto:${contact.email}`}>{contact.cta_text} <span>↗</span></a><div className="contact-meta"><div><a href={`mailto:${contact.email}`}>{contact.email}</a><ContactActions email={contact.email} copyLabel={contact.copy_label} /></div><div>{contact.social_links.map((social) => <a key={social.label} href={social.url}>{social.label}</a>)}</div></div></div></section></Reveal>
    <footer className="footer page-width"><span className="mono">Data systems. Analytical clarity. Useful automation.</span><a className="mono" href="#top">Back to top ↑</a></footer><MobileContactCTA email={contact.email} />
  </main>;
}
