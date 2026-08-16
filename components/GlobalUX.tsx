"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const commands = [
  ["Go to work", "#work"],
  ["Open skills", "#skills"],
  ["Inspect playground", "#playground"],
  ["Read approach", "#method"],
  ["Contact Abimael", "#contact"],
] as const;

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () =>
      setProgress(
        Math.min(
          100,
          Math.round(
            (window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100
          )
        )
      );
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [restoreFocus, setRestoreFocus] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setRestoreFocus(true);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") closePalette();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePalette]);
  useEffect(() => {
    if (!open && restoreFocus) {
      triggerRef.current?.focus();
      setRestoreFocus(false);
    }
  }, [open, restoreFocus]);
  const visible = commands.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));
  const go = (target: string) => {
    window.location.hash = target;
    setOpen(false);
    setQuery("");
  };
  return (
    <>
      <button
        ref={triggerRef}
        className="command-trigger mono"
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open navigation command palette"
      >
        ⌘K
      </button>
      {open && (
        <div className="command-backdrop" role="presentation" onMouseDown={closePalette}>
          <div className="command-dialog" role="dialog" aria-modal="true" aria-label="Navigation command palette" onMouseDown={(event) => event.stopPropagation()}>
            <label className="mono" htmlFor="command-search">
              Navigate
            </label>
            <input autoFocus id="command-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a section" />{" "}
            <div aria-live="polite">
              {visible.length ? (
                visible.map(([label, target]) => (
                  <button type="button" onClick={() => go(target)} key={target}>
                    <span>{label}</span>
                    <i>↗</i>
                  </button>
                ))
              ) : (
                <p className="command-empty">No matching shortcut.</p>
              )}
            </div>
            <p className="mono">ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileContactCTA({ email }: { email: string }) {
  return (
    <a className="mobile-contact-cta mono" href={`mailto:${email}`}>
      Contact <span>↗</span>
    </a>
  );
}

export function FloatingBackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 320);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="floating-back-to-top mono"
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <span>Top</span>
      <i aria-hidden="true">↑</i>
    </button>
  );
}
