"use client";

import { useEffect, useState } from "react";

export function CaseStudyToc({ hasEvidence = false }: { hasEvidence?: boolean }) {
  const baseSections = [
    { id: "problem", label: "Problem" },
    { id: "data", label: "Data" },
    { id: "approach", label: "Approach" },
    { id: "system", label: "System" },
    ...(hasEvidence ? [{ id: "evidence", label: "Evidence" }] : []),
    { id: "impact", label: "Impact" },
    { id: "lessons", label: "Lessons" },
  ];

  const [availableSections, setAvailableSections] = useState(baseSections);
  const [activeSection, setActiveSection] = useState<string>("problem");

  useEffect(() => {
    // Only keep sections that actually exist on the current page DOM
    const existing = baseSections.filter((s) => Boolean(document.getElementById(s.id)));
    const targetSections = existing.length > 0 ? existing : baseSections;
    setAvailableSections(targetSections);
    setActiveSection(targetSections[0].id);

    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      if (window.scrollY < 120) {
        setActiveSection(targetSections[0].id);
        return;
      }
      for (let i = targetSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(targetSections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(targetSections[i].id);
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
        {availableSections.map((section, index) => (
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
