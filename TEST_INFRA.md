# E2E Test Infra: Interactive Accent Butterfly Component

## Test Philosophy
- Opaque-box, requirement-driven. Derives strictly from `ORIGINAL_REQUEST.md`.
- Systematic multi-tier methodology: Feature Isolation, Boundary Value Analysis, Pairwise Combinations, Real-World Portfolio Workloads, and Adversarial Hardening.

## Feature Inventory & Test Coverage
| # | Feature | Source (Requirement) | Tier 1 (Isolation) | Tier 2 (Boundary) | Tier 3 (Cross) | Tier 4 (Workload) |
|---|---------|----------------------|:------------------:|:-----------------:|:--------------:|:-----------------:|
| 1 | F1-PHYSICS | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 2 | F2-EVASION | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 3 | F4-COMPONENT | ORIGINAL_REQUEST §R1 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 4 | F5-PERF-A11Y | ORIGINAL_REQUEST §R3 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| 5 | F6-LAYOUT | ORIGINAL_REQUEST §R1, §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |

## Test Architecture
- Test Runner: Vitest (`npm test`) using JSDOM environment.
- Test Files:
  - `lib/butterflyPhysics.test.ts`: Pure kinematics mathematical unit tests.
  - `components/InteractiveButterfly.test.tsx`: React component, DOM rendering, 3D transforms, pointer evasion, tab visibility, reduced motion, lifecycle.
- Pass/Fail Semantics:
  - Exit code 0 on `npm test` and `npm run typecheck`.
  - 100% test pass rate with 0 regressions across existing 40 test cases.

## Test Tiers
1. **Tier 1: Feature Coverage** (≥5 per feature):
   - DOM mounting & container structure (`fixed inset-0 pointer-events-none z-50`).
   - SVG dual-wing rendering with accent styling (`var(--accent)` / `#f97316`).
   - Flight state transitions (IDLE_FLIGHT -> APPROACH_PERCH -> PERCHED -> TAKEOFF).
   - Evasion threshold detection (cursor within 80-100px triggers instant EVADING state).
   - Passive mousemove listener registration & cleanup.
   - Visibility change pause when `document.hidden === true`.
   - `prefers-reduced-motion` compliance.

2. **Tier 2: Boundary & Corner Cases** (≥5 per feature):
   - Viewport edge collisions and boundary repulsion (x=0, y=0, x=width, y=height).
   - Cursor exactly at proximity threshold (e.g. distance = 85px vs 84px vs 86px).
   - Extreme cursor speed or sudden cursor appearance/disappearance (cursor = null).
   - Delta time spikes (dt = 0, dt = 1.0s, tab resume jump).
   - Zero landing targets available in DOM (graceful fallback).

3. **Tier 3: Cross-Feature Combinations**:
   - Cursor approaching while butterfly is in `PERCHED` state -> immediate abort of perch and transition to `EVADING`.
   - Tab hidden while in `EVADING` flight -> pauses rAF, resumes gracefully on tab focus.
   - Reduced motion enabled while cursor approaches -> stays calm without rapid panic jitter.
   - Resize event while approaching perch -> updates viewport and bounds cleanly.

4. **Tier 4: Real-World Portfolio Application Scenarios**:
   - User interacting with interactive buttons, project cards, and tables while butterfly floats overhead with zero pointer event obstruction.
   - User reading an article on Opinion detail page while butterfly lands quietly on section header and rests for 5 seconds.
   - User rapidly moving mouse across the screen while butterfly maintains fluid, non-jittering evasion.
