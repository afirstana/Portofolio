"use client";

import { useEffect, useState } from "react";

export function CaseStudyToc({ hasEvidence = false }: { hasEvidence?: boolean }) {
  const sections = [
    { id: "problem", label: "Problem" },
    { id: "data", label: "Data" },
    { id: "approach", label: "Approach" },
    { id: "system", label: "System" },
    ...(hasEvidence ? [{ id: "evidence", label: "Evidence" }] : []),
    { id: "impact", label: "Impact" },
    { id: "lessons", label: "Lessons" },
  ];

  const [activeSection, setActiveSection] = useState<string>("problem");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasEvidence]);

  return (
    <nav className="case-toc" aria-label="On this page navigation">
      <p className="mono">On this page</p>
      <div className="case-toc-links">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={activeSection === section.id ? "active" : ""}
          >
            <span>0{index + 1}</span>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
