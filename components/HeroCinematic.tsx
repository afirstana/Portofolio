"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./HeroCinematic.module.css";

type HeroContent = {
  name: string;
  tagline: string;
  cta_label: string;
  location: string;
  eyebrow: string;
};

const PRELOADER_DURATION_MS = 1850;

export function HeroCinematic({ hero }: { hero: HeroContent }) {
  const [progress, setProgress] = useState(0);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setProgress(100);
      setPreloaderComplete(true);
      setHeroReady(true);
      return;
    }

    const startedAt = performance.now();
    let frameId = 0;
    const updateProgress = (now: number) => {
      const nextProgress = Math.min(100, Math.round(((now - startedAt) / PRELOADER_DURATION_MS) * 100));
      setProgress(nextProgress);
      if (nextProgress < 100) {
        frameId = requestAnimationFrame(updateProgress);
        return;
      }
      setPreloaderComplete(true);
      window.setTimeout(() => setHeroReady(true), 640);
    };

    frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const updatePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (!canHover) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  };

  return (
    <>
      <div className={`${styles.preloader} ${preloaderComplete ? styles.preloaderExit : ""}`} aria-hidden="true">
        <div className={styles.preloaderInner}>
          <span className={styles.preloaderLabel}>System / Load</span>
          <div className={styles.progressTrack}><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
          <p><span>{String(progress).padStart(3, "0")}</span><i>→</i><b>100</b></p>
        </div>
      </div>

      <section id="top" className={styles.heroGrid} data-ready={heroReady} onPointerMove={updatePointer} style={{ "--pointer-x": `${pointer.x}%`, "--pointer-y": `${pointer.y}%` } as CSSProperties}>
        <div className={`${styles.heroInner} page-width`}>
          <div className={`${styles.heroMeta} mono`}><span>{hero.eyebrow}</span><span>{hero.location}</span></div>
          <div className={styles.nameStage}>
            <span className={styles.heroGlow} aria-hidden="true" />
            <h1 className={styles.heroName} aria-label={hero.name}>
              {[...hero.name].map((character, index) => (
                <span
                  aria-hidden="true"
                  className={character === "." ? styles.accentCharacter : undefined}
                  key={`${character}-${index}`}
                  style={{ "--character-delay": `${index * 0.12}s` } as React.CSSProperties}
                >
                  {character === " " ? "\u00a0" : character}
                </span>
              ))}
            </h1>
          </div>
          <p className={styles.heroTagline}>{hero.tagline}</p>
          <a className={`${styles.textLink} mono`} href="#work">{hero.cta_label} <span>↓</span></a>
          <p className={`${styles.heroSignal} mono`}>Data / Design / Decisions</p>
        </div>
      </section>
    </>
  );
}
