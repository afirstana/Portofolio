"use client";

import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
  part: "dashboards" | "analysis";
}

const SECTIONS: TocItem[] = [
  // PART I: INTERACTIVE DASHBOARDS
  { id: "dashboard-executive", label: "01. Executive", part: "dashboards" },
  { id: "dashboard-geographic", label: "02. Geo Map", part: "dashboards" },
  { id: "dashboard-channels", label: "03. Channels", part: "dashboards" },
  { id: "dashboard-branches", label: "04. Branches", part: "dashboards" },
  { id: "dashboard-behavioral", label: "05. Behavioral", part: "dashboards" },
  { id: "dashboard-forensic", label: "06. Forensic Audit", part: "dashboards" },

  // PART II: DETAILED ANALYSIS & GOVERNANCE
  { id: "overview", label: "07. Context", part: "analysis" },
  { id: "sql-engine", label: "08. SQL Engine", part: "analysis" },
  { id: "live-sandbox", label: "09. Sandbox", part: "analysis" },
  { id: "architecture", label: "10. Architecture", part: "analysis" },
  { id: "findings", label: "11. Findings", part: "analysis" },
  { id: "lessons", label: "12. Lessons", part: "analysis" }
];

export function AntiFraudCaseStudyToc() {
  const [activeSection, setActiveSection] = useState<string>("dashboard-executive");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const sec of [...SECTIONS].reverse()) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activePart = SECTIONS.find((s) => s.id === activeSection)?.part || "dashboards";

  return (
    <nav className="minimal-sticky-toc mono" aria-label="Case Study Navigation">
      <div className="minimal-toc-container">
        {/* Part Mode Switcher Pills */}
        <div className="minimal-part-pills">
          <a
            href="#part-dashboards"
            className={`part-pill ${activePart === "dashboards" ? "active cyan" : ""}`}
          >
            <span className="dot cyan" />
            Consoles (1–6)
          </a>
          <a
            href="#part-analysis"
            className={`part-pill ${activePart === "analysis" ? "active amber" : ""}`}
          >
            <span className="dot amber" />
            Analysis (7–12)
          </a>
        </div>

        {/* Section Links */}
        <div className="minimal-section-links">
          {SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`minimal-toc-link ${activeSection === sec.id ? "active" : ""}`}
            >
              {sec.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
