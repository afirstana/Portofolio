"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "3d-airspace", label: "3D Airspace Studio" },
  { id: "geodesic-math", label: "01. Geodesic Math & Spherical 3D" },
  { id: "surface-elevation", label: "02. Surface Taxi Elevation" },
  { id: "ripple-propagation", label: "03. 50 Corridors Ripple Flow" },
  { id: "hub-scorecard", label: "04. Top 30 Hubs Scorecard" },
  { id: "webgl-engine", label: "05. WebGL Shader & Particle Physics" },
  { id: "methodology", label: "06. Architecture & 3D Payload" },
  { id: "takeaways", label: "07. Operational Takeaways" },
];

export function FlightDelay3DToc() {
  const [activeSection, setActiveSection] = useState<string>("3d-airspace");

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
