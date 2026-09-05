"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "graph-studio", label: "Graph Studio" },
  { id: "anomaly-manifold", label: "Anomaly Manifold" },
  { id: "pipeline", label: "Pipeline" },
  { id: "formulation", label: "Coulomb-Hooke" },
  { id: "syndicates", label: "Syndicates" },
  { id: "projection", label: "Projection" },
  { id: "feature-space", label: "Feature Space" },
  { id: "diagnostics", label: "Diagnostics" },
  { id: "evidence", label: "Evidence" },
  { id: "impact", label: "Impact" },
  { id: "lessons", label: "Lessons" },
];

export function BankingFraud3DToc() {
  const [activeSection, setActiveSection] = useState<string>("graph-studio");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection(sections[0].id);
        return;
      }

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
            <span>{index < 9 ? `0${index + 1}` : index + 1}</span>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
