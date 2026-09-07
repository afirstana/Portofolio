"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "airspace-manifold", label: "3D Airspace Studio" },
  { id: "orthodromic-geometry", label: "01. Airspace Geometry" },
  { id: "surface-elevation", label: "02. Taxi-Out Topography" },
  { id: "ripple-propagation", label: "03. Turnaround Ripple" },
  { id: "hub-scorecard", label: "04. Top 30 Scorecard" },
  { id: "mathematical-projection", label: "05. Spherical Math" },
  { id: "canvas-architecture", label: "06. 60 FPS Engine" },
];

export function FlightDelay3DToc() {
  const [activeSection, setActiveSection] = useState<string>("airspace-manifold");

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
