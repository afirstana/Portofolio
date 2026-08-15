"use client";

const sections = ["Problem", "Data", "Approach", "System", "Evidence", "Impact", "Lessons"];

export function CaseStudyToc() {
  return <nav className="case-toc" aria-label="On this page"><p className="mono">On this page</p>{sections.map((section, index) => <a key={section} href={`#${section.toLowerCase()}`}><span>{String(index + 1).padStart(2, "0")}</span>{section}</a>)}</nav>;
}
