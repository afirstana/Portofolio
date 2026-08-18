# Project: Interactive Accent Butterfly Component

## Architecture
- **Rendering Layer**: Next.js 15 Client Component (`components/InteractiveButterfly.tsx`) mounted in `app/layout.tsx`.
- **Styling & 3D Wings**: SVG dual-wing structure with CSS 3D transforms (`perspective: 600px`, `transform-style: preserve-3d`, `rotateY` flapping), styled with `var(--accent)` (`#ff4d1c` / `#0284c7` / `#f97316`) and subtle drop-shadow glow.
- **Physics & Kinematics Engine**: Decoupled pure kinematics engine (`lib/butterflyPhysics.ts`) managing 5-state automaton (`IDLE_FLIGHT`, `APPROACH_PERCH`, `PERCHED`, `EVADING`, `TAKEOFF`), organic flight trajectories, cursor proximity reflex (<80-100px), viewport boundary containment, and delta-time normalization.
- **Interaction & Performance Layer**: Direct DOM ref updates in `requestAnimationFrame` (zero React re-renders in 60fps loop), `pointer-events: none` on container and elements, `document.hidden` auto-pause, `prefers-reduced-motion` compliance, and full event listener cleanup.
- **Verification Layer**: Dual-track automated testing with Vitest (`lib/butterflyPhysics.test.ts`, `components/InteractiveButterfly.test.tsx`), TypeScript typechecking, and static export build validation.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | F1-PHYSICS | Decoupled kinematics state machine, organic flight vectors, delta-time physics, boundary containment | M1 | ORIGINAL_REQUEST §R2 |
| 2 | F2-EVASION | Cursor evasion reflex (<80-100px radius impulse vector), perching target acquisition & landing | M1 | ORIGINAL_REQUEST §R2 |
| 3 | F3-TESTS | 4-Tier E2E test suite covering feature isolation, boundaries, combinations, and application scenarios | M2 | ORIGINAL_REQUEST §Acceptance Criteria |
| 4 | F4-COMPONENT | `components/InteractiveButterfly.tsx` with 3D SVG wings, accent theming, rAF loop, DOM ref updates | M3 | ORIGINAL_REQUEST §R1, §R2 |
| 5 | F5-PERF-A11Y | `document.hidden` tab visibility pause/resume, `prefers-reduced-motion` support, unmount cleanup | M3 | ORIGINAL_REQUEST §R3 |
| 6 | F6-LAYOUT | Global mounting in `app/layout.tsx`, zero UI blocking (`pointer-events: none`), persistence across routes | M4 | ORIGINAL_REQUEST §R1, §R2 |
| 7 | F7-FINAL-VERIFY | 100% E2E test suite pass (Tiers 1-4), adversarial stress testing (Tier 5), typecheck & static export build pass | M5 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1-Physics-Engine | Pure physics & evasion engine (`lib/butterflyPhysics.ts`, `lib/butterflyPhysics.test.ts`) | none | DONE |
| 2 | M2-E2E-Testing-Infra | Opaque-box 4-tier test suite (`components/InteractiveButterfly.test.tsx`, `TEST_READY.md`) | M1 | PLANNED |
| 3 | M3-Butterfly-Component | React client component with 3D wings, rAF loop, a11y & lifecycle (`components/InteractiveButterfly.tsx`) | M1 | PLANNED |
| 4 | M4-Layout-Integration | Mount globally in `app/layout.tsx`, verify cross-route styling & non-intrusiveness | M3 | PLANNED |
| 5 | M5-Final-Verification | Full E2E verification, Tier 5 adversarial hardening, typecheck, build, forensic audit | M2, M4 | PLANNED |

## Interface Contracts

### `lib/butterflyPhysics.ts` ↔ `components/InteractiveButterfly.tsx`
```typescript
export type ButterflyState = 'IDLE_FLIGHT' | 'APPROACH_PERCH' | 'PERCHED' | 'EVADING' | 'TAKEOFF';

export interface ButterflyKinematics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  state: ButterflyState;
  stateTimer: number;
  wingAngle: number;
  wingSpeed: number;
  facingAngle: number;
}

export interface PhysicsConfig {
  minSpeed: number; // e.g. 60 px/s
  maxSpeed: number; // e.g. 180 px/s
  evasionSpeed: number; // e.g. 450 px/s
  evasionDistance: number; // e.g. 90 px
  perchDurationMin: number; // e.g. 3.0 s
  perchDurationMax: number; // e.g. 7.0 s
  flutterFrequencyIdle: number; // e.g. 10 Hz
  flutterFrequencyPerched: number; // e.g. 1.2 Hz
  flutterFrequencyPanic: number; // e.g. 22 Hz
}

export function createInitialKinematics(viewportWidth: number, viewportHeight: number): ButterflyKinematics;
export function updateButterflyKinematics(
  current: ButterflyKinematics,
  cursor: { x: number; y: number } | null,
  viewport: { width: number; height: number },
  perchTargets: Array<{ x: number; y: number }>,
  dt: number,
  config?: Partial<PhysicsConfig>
): ButterflyKinematics;
```

## Code Layout
- `lib/butterflyPhysics.ts`: Pure mathematics and physics engine (state machine, vectors, evasion, landing).
- `lib/butterflyPhysics.test.ts`: Unit tests for physics engine.
- `components/InteractiveButterfly.tsx`: Client React component with SVG 3D wings, rAF animation, DOM transform styling, event listeners.
- `components/InteractiveButterfly.test.tsx`: Component integration and behavior tests (Tiers 1-4).
- `app/layout.tsx`: Root layout mounting `<InteractiveButterfly />`.
- `TEST_INFRA.md`: Test suite specifications and tier documentation.
- `TEST_READY.md`: Signal that test suite is ready.
