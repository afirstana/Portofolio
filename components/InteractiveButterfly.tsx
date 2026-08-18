'use client';

import React, { useEffect, useRef } from 'react';
import {
  createInitialKinematics,
  updateButterflyKinematics,
  DEFAULT_PHYSICS_CONFIG,
  type ButterflyKinematics,
  type ButterflyState,
  type PhysicsConfig,
} from '@/lib/butterflyPhysics';

export interface InteractiveButterflyProps {
  className?: string;
  config?: Partial<PhysicsConfig>;
}

export function InteractiveButterfly({ className = '', config }: InteractiveButterflyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const butterflyRef = useRef<HTMLDivElement | null>(null);
  const leftWingRef = useRef<HTMLDivElement | null>(null);
  const rightWingRef = useRef<HTMLDivElement | null>(null);

  const kinematicsRef = useRef<ButterflyKinematics>({
    x: 500,
    y: 300,
    vx: 80,
    vy: -60,
    targetX: 500,
    targetY: 300,
    state: 'IDLE_FLIGHT',
    stateTimer: 0,
    wingAngle: 0,
    wingSpeed: DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle,
    facingAngle: 35,
  });

  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const perchTargetsRef = useRef<Array<{ x: number; y: number }>>([]);
  const viewportRef = useRef<{ width: number; height: number }>({ width: 1024, height: 768 });
  const isPausedRef = useRef<boolean>(false);
  const reducedMotionRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastStateRef = useRef<ButterflyState>('IDLE_FLIGHT');

  useEffect(() => {
    // 1. Viewport Initialization
    const vw = typeof window !== 'undefined' ? (window.innerWidth > 0 ? window.innerWidth : 1024) : 1024;
    const vh = typeof window !== 'undefined' ? (window.innerHeight > 0 ? window.innerHeight : 768) : 768;
    viewportRef.current = { width: vw, height: vh };
    kinematicsRef.current = createInitialKinematics(vw, vh);

    // Initial DOM placement
    if (butterflyRef.current) {
      butterflyRef.current.style.transform = `translate3d(${kinematicsRef.current.x.toFixed(2)}px, ${kinematicsRef.current.y.toFixed(2)}px, 0) rotate(${kinematicsRef.current.facingAngle.toFixed(2)}deg)`;
      butterflyRef.current.setAttribute('data-state', kinematicsRef.current.state);
    }

    // 2. Perch Target Scanner
    const scanPerchTargets = () => {
      if (typeof document === 'undefined') return;

      try {
        const selectors = [
          'h1',
          'h2',
          'h3',
          '.project-row',
          '.section-label',
          '.evidence-card',
          '.system-node',
          'article',
          '[data-perch-target]',
        ].join(', ');

        const elements = document.querySelectorAll(selectors);
        const targets: Array<{ x: number; y: number }> = [];
        const currentVw = viewportRef.current.width;
        const currentVh = viewportRef.current.height;

        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // Element must have dimensions and overlap the visible viewport area
          if (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom >= 0 &&
            rect.top <= currentVh &&
            rect.right >= 0 &&
            rect.left <= currentVw
          ) {
            // Anchor landing coordinate at upper right / top border of element
            const perchX = Math.round(rect.left + Math.min(rect.width * 0.85, Math.max(16, rect.width - 20)));
            const perchY = Math.round(Math.max(16, rect.top));

            if (perchX >= 16 && perchX <= currentVw - 16 && perchY >= 16 && perchY <= currentVh - 16) {
              targets.push({ x: perchX, y: perchY });
            }
          }
        });

        perchTargetsRef.current = targets;
      } catch {
        perchTargetsRef.current = [];
      }
    };

    scanPerchTargets();
    const scanIntervalId = setInterval(scanPerchTargets, 4000);

    // 3. Media Query: prefers-reduced-motion
    let motionQuery: MediaQueryList | null = null;
    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      reducedMotionRef.current = !!e.matches;
    };

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionRef.current = motionQuery.matches;
        if (typeof motionQuery.addEventListener === 'function') {
          motionQuery.addEventListener('change', handleMotionChange);
        } else if (typeof (motionQuery as any).addListener === 'function') {
          (motionQuery as any).addListener(handleMotionChange);
        }
      } catch {
        reducedMotionRef.current = false;
      }
    }

    // 4. Cursor Tracking Handlers
    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerLeave = () => {
      cursorRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    // 5. Window Resize Handler
    const handleResize = () => {
      const newW = window.innerWidth > 0 ? window.innerWidth : 1024;
      const newH = window.innerHeight > 0 ? window.innerHeight : 768;
      viewportRef.current = { width: newW, height: newH };
      scanPerchTargets();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', scanPerchTargets, { passive: true });

    // 6. Tab Visibility Handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      } else {
        isPausedRef.current = false;
        lastTimeRef.current = performance.now();
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 7. High-Performance rAF Loop (Zero React re-renders)
    const animate = (currentTime: number) => {
      if (isPausedRef.current) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      const rawDt = (currentTime - lastTimeRef.current) / 1000;
      const dt = Math.max(0, Math.min(rawDt, 0.1));
      lastTimeRef.current = currentTime;

      if (reducedMotionRef.current) {
        // Reduced motion: Keep resting calmly with slow, gentle wing movement
        const current = kinematicsRef.current;
        current.vx = 0;
        current.vy = 0;
        current.wingSpeed = 0.8;
        current.wingAngle = 16 + Math.sin(currentTime * 0.001 * 0.8 * 2 * Math.PI) * 4;

        if (butterflyRef.current) {
          butterflyRef.current.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0) rotate(${current.facingAngle.toFixed(2)}deg)`;
          if (lastStateRef.current !== 'PERCHED') {
            lastStateRef.current = 'PERCHED';
            butterflyRef.current.setAttribute('data-state', 'PERCHED');
          }
        }
        if (leftWingRef.current) {
          leftWingRef.current.style.transform = `rotateY(${current.wingAngle.toFixed(2)}deg)`;
        }
        if (rightWingRef.current) {
          rightWingRef.current.style.transform = `rotateY(${-current.wingAngle.toFixed(2)}deg)`;
        }
      } else {
        // Standard Kinematic Physics Update
        const next = updateButterflyKinematics(
          kinematicsRef.current,
          cursorRef.current,
          viewportRef.current,
          perchTargetsRef.current,
          dt,
          config
        );
        kinematicsRef.current = next;

        // Direct DOM mutations
        if (butterflyRef.current) {
          butterflyRef.current.style.transform = `translate3d(${next.x.toFixed(2)}px, ${next.y.toFixed(2)}px, 0) rotate(${next.facingAngle.toFixed(2)}deg)`;
          if (lastStateRef.current !== next.state) {
            lastStateRef.current = next.state;
            butterflyRef.current.setAttribute('data-state', next.state);
          }
        }
        if (leftWingRef.current) {
          leftWingRef.current.style.transform = `rotateY(${next.wingAngle.toFixed(2)}deg)`;
        }
        if (rightWingRef.current) {
          rightWingRef.current.style.transform = `rotateY(${-next.wingAngle.toFixed(2)}deg)`;
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(animate);

    // 8. Lifecycle Cleanup
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      clearInterval(scanIntervalId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', scanPerchTargets);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', handleMotionChange);
        } else if (typeof (motionQuery as any).removeListener === 'function') {
          (motionQuery as any).removeListener(handleMotionChange);
        }
      }
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-50 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      data-testid="butterfly-container"
    >
      <div
        ref={butterflyRef}
        className="absolute left-0 top-0 pointer-events-none"
        style={{
          width: '26px',
          height: '26px',
          marginLeft: '-13px',
          marginTop: '-13px',
          willChange: 'transform',
          transform: 'translate3d(50vw, 40vh, 0) rotate(35deg)',
        }}
        data-testid="butterfly"
        data-state="IDLE_FLIGHT"
      >
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            perspective: '600px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Left Wing */}
          <div
            ref={leftWingRef}
            className="absolute pointer-events-none"
            style={{
              right: '50%',
              top: '2px',
              width: '12px',
              height: '20px',
              transformOrigin: '100% 50%',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
            data-testid="left-wing"
          >
            <svg
              viewBox="0 0 13 22"
              className="w-full h-full pointer-events-none"
              style={{
                filter: 'drop-shadow(0 0 4px var(--accent-subtle, rgba(249, 115, 22, 0.45)))',
              }}
            >
              {/* Forewing and Hindwing contour */}
              <path
                d="M13,11 C13,4 8,0 2,0 C0,4 0,9 6,12 C0,14 0,18 3,21 C8,22 13,18 13,11 Z"
                fill="var(--accent, #f97316)"
                fillOpacity="0.85"
                stroke="var(--accent, #f97316)"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              {/* Internal Wing Vein Tracer */}
              <path
                d="M13,11 C9,7 6,5 2,2 M13,11 C8,13 5,16 4,20"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="0.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Right Wing */}
          <div
            ref={rightWingRef}
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '2px',
              width: '12px',
              height: '20px',
              transformOrigin: '0% 50%',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
            data-testid="right-wing"
          >
            <svg
              viewBox="0 0 13 22"
              className="w-full h-full pointer-events-none"
              style={{
                filter: 'drop-shadow(0 0 4px var(--accent-subtle, rgba(249, 115, 22, 0.45)))',
              }}
            >
              {/* Forewing and Hindwing contour */}
              <path
                d="M0,11 C0,4 5,0 11,0 C13,4 13,9 7,12 C13,14 13,18 10,21 C5,22 0,18 0,11 Z"
                fill="var(--accent, #f97316)"
                fillOpacity="0.85"
                stroke="var(--accent, #f97316)"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              {/* Internal Wing Vein Tracer */}
              <path
                d="M0,11 C4,7 7,5 11,2 M0,11 C5,13 8,16 9,20"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="0.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Center Body (Antennae, Head, Thorax, Abdomen) */}
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              width: '6px',
              height: '22px',
              zIndex: 3,
            }}
            data-testid="butterfly-body"
          >
            <svg viewBox="0 0 6 24" className="w-full h-full overflow-visible pointer-events-none">
              {/* Antennae */}
              <path
                d="M2.5,4 C1.5,1.5 0,-0.5 -1.5,-1.5 M3.5,4 C4.5,1.5 6,-0.5 7.5,-1.5"
                stroke="var(--ink, #ffffff)"
                strokeWidth="0.65"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />
              {/* Head */}
              <circle cx="3" cy="4.5" r="1.2" fill="var(--ink, #ffffff)" />
              {/* Thorax */}
              <ellipse cx="3" cy="9.5" rx="1.3" ry="3.5" fill="var(--ink, #ffffff)" opacity="0.95" />
              {/* Abdomen */}
              <ellipse cx="3" cy="16.5" rx="1.0" ry="4.5" fill="var(--ink, #ffffff)" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveButterfly;
