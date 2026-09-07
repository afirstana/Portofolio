"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  stagger?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.08,
  direction = "up",
  stagger = false,
}: RevealProps) {
  const reference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = reference.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              node.classList.add("is-visible");
            }, delay);
          } else {
            node.classList.add("is-visible");
          }
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const classes = [
    "reveal",
    direction !== "none" ? `reveal-${direction}` : "",
    stagger ? "stagger-children" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={reference} className={classes}>
      {children}
    </div>
  );
}
