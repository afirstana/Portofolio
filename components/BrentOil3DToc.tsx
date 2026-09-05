"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "manifold-studio", label: "3D Studio" },
  { id: "pipeline", label: "Architecture" },
  { id: "formulation", label: "Formulation" },
  { id: "topography", label: "Topography" },
  { id: "projection", label: "3D Math" },
  { id: "diagnostics", label: "Diagnostics" },
  { id: "evidence", label: "Evidence" },
  { id: "impact", label: "Impact" },
  { id: "lessons", label: "Lessons" },
];

export function BrentOil3DToc() {
  const [activeSection, setActiveSection] = useState<string>("manifold-studio");

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
  }, []);

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
