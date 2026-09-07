"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "operations-cockpit", label: "Cockpit Dashboard" },
  { id: "macro-telemetry", label: "01. Macro Telemetry" },
  { id: "afternoon-wave", label: "02. Afternoon Wave" },
  { id: "carrier-league", label: "03. Carrier League" },
  { id: "runway-bottlenecks", label: "04. Runway Bottlenecks" },
  { id: "cause-decomposition", label: "05. Root Cause Attribution" },
  { id: "methodology", label: "06. Architecture & Physics" },
  { id: "takeaways", label: "07. Operational Takeaways" },
];

export function FlightDelay2024Toc() {
  const [activeSection, setActiveSection] = useState<string>("operations-cockpit");

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