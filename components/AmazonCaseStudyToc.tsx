"use client";

import { useEffect, useState } from "react";

const sections = [
  ["overview", "Overview"],
  ["dashboard", "Data explorer"],
  ["model", "Model evaluation"],
  ["method", "Method"],
  ["limitations", "Limits"],
  ["evidence", "Evidence"],
] as const;

export function AmazonCaseStudyToc() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i][0]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i][0]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="case-toc amazon-toc" aria-label="Amazon case study sections">
      <p className="mono">On this page</p>
      <div className="case-toc-links">
        {sections.map(([id, label], index) => (
          <a
            href={`#${id}`}
            key={id}
            className={activeSection === id ? "active" : ""}
          >
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
