"use client";

import { useEffect, useState } from "react";

export function PaymentCaseStudyToc({ hasEvidence = false }: { hasEvidence?: boolean }) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const items = [
    { id: "overview", label: "01. Overview" },
    { id: "interactive-dashboard", label: "02. Live Dashboard" },
    { id: "system", label: "03. Data Pipeline" },
    { id: "narrative", label: "04. Empirical Analysis" },
    ...(hasEvidence ? [{ id: "evidence", label: "05. Visual Evidence" }] : []),
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
