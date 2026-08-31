"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CommandPalette } from "./GlobalUX";
import { LogoBadge } from "./LogoBadge";
import { ThemeToggle } from "./ThemeToggle";

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

const portfolioLinks: NavLinkItem[] = [
  { id: "01", label: "Projects", href: "/#work" },
  { id: "02", label: "Methodology", href: "/#method" },
  { id: "03", label: "Tech Stack", href: "/#skills" },
];

const resourceLinks: NavLinkItem[] = [
  { id: "01", label: "Certifications", href: "/learning/" },
  { id: "02", label: "Opinion", href: "/opinion/" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"portfolio" | "resources" | "cv" | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<"cv" | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setActiveSubmenu(null);
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (menu: "portfolio" | "resources" | "cv") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubmenu(null);
    }, 180);
  };

  const handleSubmenuEnter = () => {
    if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
    setActiveSubmenu("cv");
  };

  const handleSubmenuLeave = () => {
    subTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 180);
  };

  const toggleMenu = (menu: "portfolio" | "resources" | "cv") => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const closeAll = () => {
    setActiveMenu(null);
    setActiveSubmenu(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <Link
        className="brand mono"
        href="/#top"
        style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
        onClick={closeAll}
      >
        <LogoBadge size={26} />
        <span>
          ABIMAEL<span style={{ color: "var(--accent)" }}>.DATA</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className={`site-nav ${mobileMenuOpen ? "open" : ""}`} aria-label="Primary navigation">
        {/* PORTFOLIO DROPDOWN */}
        <div
          className="nav-dropdown"
          onMouseEnter={() => handleMouseEnter("portfolio")}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className={`nav-dropdown-trigger mono ${activeMenu === "portfolio" ? "active" : ""}`}
            onClick={() => toggleMenu("portfolio")}
            aria-expanded={activeMenu === "portfolio"}
            aria-haspopup="true"
          >
            Portfolio
            <span className="dropdown-caret">{activeMenu === "portfolio" ? "▲" : "▼"}</span>
          </button>

          <div className={`nav-dropdown-menu ${activeMenu === "portfolio" ? "is-visible" : ""}`}>
            <div className="dropdown-list">
              {portfolioLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="dropdown-link mono"
                  onClick={closeAll}
                >
                  <span className="link-idx mono">{item.id}</span>
                  <span className="link-title mono">{item.label}</span>
                  <span className="link-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RESOURCES DROPDOWN WITH RIGHT-FLYOUT SUBMENU */}
        <div
          className="nav-dropdown"
          onMouseEnter={() => handleMouseEnter("resources")}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className={`nav-dropdown-trigger mono ${activeMenu === "resources" ? "active" : ""}`}
            onClick={() => toggleMenu("resources")}
            aria-expanded={activeMenu === "resources"}
            aria-haspopup="true"
          >
            Resources
            <span className="dropdown-caret">{activeMenu === "resources" ? "▲" : "▼"}</span>
          </button>

          <div className={`nav-dropdown-menu ${activeMenu === "resources" ? "is-visible" : ""}`}>
            <div className="dropdown-list">
              {resourceLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="dropdown-link mono"
                  onClick={closeAll}
                >
                  <span className="link-idx mono">{item.id}</span>
                  <span className="link-title mono">{item.label}</span>
                  <span className="link-arrow">→</span>
                </Link>
              ))}

              {/* 04. CURRICULUM VITAE WITH RIGHT SUBMENU */}
              <div
                className="has-flyout-item"
                onMouseEnter={handleSubmenuEnter}
                onMouseLeave={handleSubmenuLeave}
              >
                <div
                  className={`dropdown-link flyout-trigger mono ${activeSubmenu === "cv" ? "is-active" : ""}`}
                  onClick={() => setActiveSubmenu((prev) => (prev === "cv" ? null : "cv"))}
                >
                  <span className="link-idx mono">03</span>
                  <span className="link-title mono">Curriculum Vitae</span>
                  <span className="link-arrow" style={{ opacity: 1, transform: "none" }}>▸</span>
                </div>

                {/* Right Flyout Submenu */}
                <div className={`flyout-submenu ${activeSubmenu === "cv" ? "is-visible" : ""}`}>
                  <a
                    href="/cv/Abimael_Firstana_Ultimate_General_Data_CV_EN.pdf"
                    download="Abimael_Firstana_CV_EN.pdf"
                    className="dropdown-link mono"
                    onClick={closeAll}
                  >
                    <span className="link-title mono">English (EN)</span>
                    <span className="link-arrow">↓</span>
                  </a>
                  <a
                    href="/cv/Abimael_Firstana_Ultimate_General_Data_CV_ID.pdf"
                    download="Abimael_Firstana_CV_ID.pdf"
                    className="dropdown-link mono"
                    onClick={closeAll}
                  >
                    <span className="link-title mono">Indonesia (ID)</span>
                    <span className="link-arrow">↓</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DIRECT LINKS */}
        <Link className="nav-direct-link mono" href="/#contact" onClick={closeAll}>
          Contact
        </Link>

        {/* Mobile View */}
        <div className="mobile-drawer-content mono">
          <div className="mobile-section">
            <span className="mobile-section-title">// PORTFOLIO</span>
            {portfolioLinks.map((item) => (
              <Link key={item.label} href={item.href} onClick={closeAll} className="mobile-nav-link">
                <span>{item.id}. {item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mobile-section">
            <span className="mobile-section-title">// RESOURCES</span>
            {resourceLinks.map((item) => (
              <Link key={item.label} href={item.href} onClick={closeAll} className="mobile-nav-link">
                <span>{item.id}. {item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mobile-cv-group">
            <span className="mobile-section-title">// RESUME / CV DOWNLOAD</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px" }}>
              <a
                href="/cv/Abimael_Firstana_Ultimate_General_Data_CV_EN.pdf"
                download="Abimael_Firstana_CV_EN.pdf"
                className="mobile-cv-button mono"
                onClick={closeAll}
              >
                Download EN ↓
              </a>
              <a
                href="/cv/Abimael_Firstana_Ultimate_General_Data_CV_ID.pdf"
                download="Abimael_Firstana_CV_ID.pdf"
                className="mobile-cv-button mono"
                onClick={closeAll}
              >
                Unduh ID ↓
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Actions */}
      <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Minimalist CV Button & Popover */}
        <div
          className="cv-dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter("cv")}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className={`header-cv-trigger mono ${activeMenu === "cv" ? "active" : ""}`}
            onClick={() => toggleMenu("cv")}
            aria-expanded={activeMenu === "cv"}
            aria-haspopup="true"
          >
            <span>CV</span>
            <i style={{ fontStyle: "normal", fontSize: "8px" }}>{activeMenu === "cv" ? "▲" : "▼"}</i>
          </button>

          <div className={`cv-popover ${activeMenu === "cv" ? "is-visible" : ""}`}>
            <a
              href="/cv/Abimael_Firstana_Ultimate_General_Data_CV_EN.pdf"
              download="Abimael_Firstana_CV_EN.pdf"
              className="cv-popover-link mono"
              onClick={() => setActiveMenu(null)}
            >
              <span className="mono">Resume (English)</span>
              <small className="mono">↓</small>
            </a>
            <a
              href="/cv/Abimael_Firstana_Ultimate_General_Data_CV_ID.pdf"
              download="Abimael_Firstana_CV_ID.pdf"
              className="cv-popover-link mono"
              onClick={() => setActiveMenu(null)}
            >
              <span className="mono">Resume (Indonesia)</span>
              <small className="mono">↓</small>
            </a>
          </div>
        </div>

        <ThemeToggle />
        <CommandPalette />

        <button
          className="menu-button mono"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-navigation"
        >
          {mobileMenuOpen ? "✕" : "MENU"}
        </button>
      </div>
    </header>
  );
}
