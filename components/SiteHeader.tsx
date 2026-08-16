"use client";

import { useState } from "react";
import { CommandPalette } from "./GlobalUX";
import { LogoBadge } from "./LogoBadge";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  ["Work", "#work"],
  ["Method", "#method"],
  ["Skills", "#skills"],
  ["Path", "#path"],
  ["Contact", "#contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a
        className="brand mono"
        href="/#top"
        style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
      >
        <LogoBadge size={26} />
        <span>
          ABIMAEL<span style={{ color: "var(--accent)" }}>.DATA</span>
        </span>
      </a>

      <nav className={`site-nav ${open ? "open" : ""}`} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a onClick={() => setOpen(false)} href={`/${href}`} key={href}>
            {label}
          </a>
        ))}
        <div className="mobile-theme-toggle" style={{ display: "none" }}>
          <ThemeToggle />
        </div>
      </nav>

      <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ThemeToggle />
        <CommandPalette />
        <button
          className="menu-button mono"
          onClick={() => setOpen(!open)}
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
        >
          Menu
        </button>
      </div>
    </header>
  );
}
