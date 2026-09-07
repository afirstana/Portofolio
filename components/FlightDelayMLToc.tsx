"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "predictive-dispatch-studio", label: "Interactive Dispatch Studio" },
  { id: "operational-crisis", label: "01. The Reactive Dispatch Crisis" },
  { id: "target-formulation", label: "02. Dual-Stage Target Formulation" },
  { id: "feature-pipeline", label: "03. Zero-Leakage Feature Pipeline" },
  { id: "model-tournament", label: "04. Algorithmic Tournament" },
  { id: "explainable-shap", label: "05. SHAP Factor Attribution" },
  { id: "threshold-economics", label: "06. Dynamic Threshold Economics" },
  { id: "production-mlops", label: "07. Production MLOps & Resilience" },
];

export function FlightDelayMLToc() {
  const [activeSection, setActiveSection] = useState<string>("predictive-dispatch-studio");

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
