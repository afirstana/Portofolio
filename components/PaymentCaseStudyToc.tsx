"use client";

import { useEffect, useState } from "react";

export function PaymentCaseStudyToc({ hasEvidence = false }: { hasEvidence?: boolean }) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const items = [
    { id: "overview", label: "01. Overview" },
    { id: "flowchart", label: "02. Flowchart" },
    { id: "payment-mix", label: "03. Payment Mix" },
    { id: "anomaly", label: "04. 10x Anomaly" },
    { id: "categories", label: "05. Category Matrix" },
    { id: "interactive-dashboard", label: "06. Console" },
    { id: "narrative", label: "07. Analysis" },
    { id: "impact", label: "08. Impact" },
    { id: "lessons", label: "09. Lessons" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(items[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasEvidence]);

  return (
    <nav className="payment-top-toc" aria-label="Quick Section Navigation">
      <div className="toc-inner">
        <span className="mono toc-label">Jump to Section:</span>
        <div className="toc-links">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`mono-btn ${activeSection === item.id ? "active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="toc-status mono">
          <span className="pulse-dot" /> 103.9k Transactions • R$ 16.01M GMV
        </div>
      </div>
    </nav>
  );
}
