"use client";
import { useEffect, useRef } from "react";

export function Reveal({ children }: { children: React.ReactNode }) { const reference = useRef<HTMLDivElement>(null); useEffect(() => { const node = reference.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { node.classList.add("is-visible"); observer.unobserve(node); } }, { threshold: 0.14 }); observer.observe(node); return () => observer.disconnect(); }, []); return <div ref={reference} className="reveal">{children}</div>; }
