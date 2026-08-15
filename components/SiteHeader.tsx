"use client";

import { useState } from "react";
import { CommandPalette } from "./GlobalUX";

const links = [["Work", "#work"], ["Method", "#method"], ["Skills", "#skills"], ["Path", "#path"], ["Contact", "#contact"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><a className="brand mono" href="/#top" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}><img src="/icon.png" alt="Logo" width="24" height="24" style={{ borderRadius: "50%", display: "block" }} /><span>ABIMAEL<span style={{ color: "var(--accent)" }}>.DATA</span></span></a><nav className={`site-nav ${open ? "open" : ""}`} aria-label="Primary navigation">{links.map(([label, href]) => <a onClick={() => setOpen(false)} href={`/${href}`} key={href}>{label}</a>)}</nav><div className="header-actions"><CommandPalette /><button className="menu-button mono" onClick={() => setOpen(!open)} type="button" aria-expanded={open} aria-controls="site-navigation">Menu</button></div></header>;
}
