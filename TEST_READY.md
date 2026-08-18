# Test Suite Ready: Interactive Accent Butterfly Component

## Summary
The comprehensive, opaque-box 4-tier automated test suite for the Interactive Accent Butterfly component has been fully authored, verified, and integrated into the project's test harness.

- **Status**: READY & PASSING
- **Test Runner**: Vitest (`npm test`)
- **Typecheck**: Passed (`npm run typecheck` -> exit code 0)
- **Total Test Files**: 10
- **Total Passing Tests**: 194 (100% pass rate, 0 regressions)
- **InteractiveButterfly Tests**: 84 tests across Tiers 1 to 4

---

## Test Inventory & Tier Coverage

### Test Files
| File Path | Description | Test Count | Status |
|-----------|-------------|:----------:|:------:|
| `components/InteractiveButterfly.test.tsx` | Component integration, DOM structure, 3D wing transforms, pointer tracking, tab visibility, reduced motion, unmount lifecycle, boundary cases, real-world portfolio scenarios | 84 | PASSED |
| `lib/butterflyPhysics.test.ts` | Kinematics engine unit tests (state machine, vectors, evasion, landing, boundary containment) | 31 | PASSED |
| `lib/butterflyPhysics.adversarial.test.ts` | Adversarial kinematic stress tests (100,000 steps, dt jitter, NaN sanitization) | 17 | PASSED |
| `lib/butterflyStressHarness.test.ts` | Flight state automaton challenger suite (perching cycles, evasion reflex, mobile/4K viewports) | 22 | PASSED |
| `lib/interactive-stress.test.ts` | Portfolio interactive dashboards & showcase test suite | 20 | PASSED |
| `lib/content.test.ts` | Content layer tests | 8 | PASSED |
| `lib/final-static-integrity.test.ts` | Final static build integrity tests | 5 | PASSED |
| `lib/opinions.test.ts` | Opinion essays content parser tests | 3 | PASSED |
| `lib/amazon-artifacts.test.ts` | Amazon case study artifact tests | 2 | PASSED |
| `lib/project-sneak-peek.test.ts` | Project preview metadata tests | 2 | PASSED |
| **Total** | **Full Suite** | **194** | **ALL PASSED** |

---

## Tier Breakdown (`components/InteractiveButterfly.test.tsx`)

### Tier 1: Feature Coverage (35 Tests, >=5 per feature)
1. **Container Structure & Zero Click-Blocking** (5 tests):
   - Renders container with `fixed inset-0 pointer-events-none z-50 overflow-hidden select-none`.
   - Sets `aria-hidden="true"` so screen readers ignore cosmetic overlay.
   - Accepts and appends custom `className` prop without stripping defaults.
   - Ensures all internal child elements inherit `pointer-events: none`.
   - Renders 3D perspective wrapper with `perspective: 600px` and `transform-style: preserve-3d`.

2. **3D SVG Dual-Wing & Accent Color Theming** (5 tests):
   - Renders left wing with `transform-origin: 100% 50%` for hinge articulation.
   - Renders right wing with `transform-origin: 0% 50%` for symmetrical hinge articulation.
   - Styles wings with accent color `var(--accent, #f97316)` fill and stroke.
   - Applies subtle glowing drop-shadow filter using `var(--accent-subtle)`.
   - Renders anatomical center body with head, antennae, thorax, and abdomen.

3. **requestAnimationFrame Loop Initiation & DOM Transforms** (5 tests):
   - Initiates `requestAnimationFrame` loop upon mounting.
   - Continuously updates butterfly position across successive rAF ticks.
   - Applies symmetrical opposite 3D rotation to left and right wings.
   - Updates `data-state` attribute reflecting active kinematics state (`IDLE_FLIGHT`).
   - Executes 60 rAF frames continuously with stable numeric transforms without `NaN`.

4. **Passive Pointer / Cursor Tracking** (5 tests):
   - Registers `pointermove` and `mousemove` listeners with `{ passive: true }`.
   - Captures pointer coordinates and updates cursor tracking internally.
   - Registers `pointerleave` and `mouseleave` handlers to clear cursor reference.
   - Resumes responsive tracking when cursor re-enters window after leaving.
   - Tolerates rapid erratic mouse movements without crashing.

5. **Tab Visibility State Machine (Pause & Resume)** (5 tests):
   - Registers `visibilitychange` event listener on `document` upon mounting.
   - Pauses animation loop and cancels rAF when `document.hidden === true`.
   - Preserves butterfly position frozen while tab is hidden.
   - Resumes rAF loop when document becomes visible again.
   - Re-synchronizes `lastTime` clock on resume preventing huge lag teleportation.

6. **prefers-reduced-motion Compliance** (5 tests):
   - Detects `prefers-reduced-motion: reduce` media query upon mounting.
   - Slows wing flapping to gentle breathing rate (0.8Hz) under reduced motion.
   - Keeps butterfly stationary without translation drift under reduced motion.
   - Dynamically adapts when user toggles reduced motion preference in OS.
   - Remains calm without panic evasion even when cursor approaches during reduced motion.

7. **Unmount Lifecycle & Complete Event Cleanup** (5 tests):
   - Cancels active `requestAnimationFrame` when component unmounts.
   - Clears periodic perch target scanning interval upon unmounting.
   - Removes all `pointermove`, `mousemove`, `pointerleave`, and `mouseleave` listeners on unmount.
   - Removes `resize` and `scroll` listeners on unmount.
   - Removes `visibilitychange` listener and media query listener on unmount.

---

### Tier 2: Boundary & Corner Cases (25 Tests, >=5 per feature)
1. **Zero & Extreme Viewport Dimensions** (5 tests):
   - Handles 0x0 viewport dimensions with graceful fallback (1024x768).
   - Handles negative viewport dimensions (-1920x-1080) safely.
   - Confines butterfly strictly within compact mobile viewport (320x568).
   - Scales smoothly to ultra-wide 4K display (3840x2160).
   - Handles dynamic on-the-fly viewport resizing from 4K to mobile without glitch.

2. **Cursor Proximity Threshold Boundaries** (5 tests):
   - Triggers evasion when cursor approaches at 85px (inside 90px trigger).
   - Triggers evasion at boundary threshold 89.9px.
   - Does NOT trigger evasion when cursor is outside threshold at >90px.
   - Handles exact co-located cursor (distance = 0px) without singularity or `NaN`.
   - Recovers back to `IDLE_FLIGHT` after evasion period when cursor moves away.

3. **Cursor Sudden Departure & Null Handling** (5 tests):
   - Continues safe flight when cursor suddenly departs window mid-evasion.
   - Smoothly returns to cruise flight after cursor departs.
   - Handles negative cursor coordinates (cursor moved to second monitor above/left).
   - Handles cursor moved beyond viewport width/height safely.
   - Tolerates non-numeric event payloads without crashing.

4. **Rapid Mount / Unmount Stress & Custom Props** (5 tests):
   - Survives 30 rapid sequential mount/unmount cycles without dangling animation frames.
   - Supports custom `PhysicsConfig` props overriding evasion distance.
   - Supports partial `PhysicsConfig` props merging cleanly with defaults.
   - Handles empty config prop `{}` without error.
   - Survives unmount occurring immediately before scheduled frame callback.

5. **DOM Without Perch Targets & Target Element Filtering** (5 tests):
   - Operates smoothly when DOM has zero perchable headers or cards.
   - Filters out elements with zero width or zero height (hidden elements).
   - Filters out elements that are completely scrolled out of viewport (`rect.bottom < 0`).
   - Filters out elements positioned completely beyond viewport height (`rect.top > vh`).
   - Dynamically picks up newly discovered perch targets upon periodic scan interval.

---

### Tier 3: Cross-Feature Combinations (12 Tests)
1. **Proximity Evasion Interrupts Perching & Approach States** (3 tests):
   - Breaks `PERCHED` resting state immediately when cursor approaches within <=90px.
   - Aborts `APPROACH_PERCH` vector instantly when cursor approaches.
   - Overrides takeoff thrust immediately if cursor approaches during launch.

2. **Tab Hiding Interacts with Active Flight & Evasion** (3 tests):
   - Pauses rAF immediately when tab is hidden mid-evasion without state corruption.
   - Resumes remaining evasion duration cleanly after tab becomes visible again.
   - Survives 10 rapid tab visibility toggle cycles without breaking kinematic invariants.

3. **Cursor Interaction During Reduced Motion** (3 tests):
   - Does not trigger panic jitter when cursor approaches during reduced motion.
   - Instantly reactivates evasion reflex when reduced motion is disabled while cursor is nearby.
   - Smoothly dampens high-speed evasion to 0 velocity when reduced motion is enabled mid-flight.

4. **Window Resizing During Flight & Scrolling** (3 tests):
   - Recalculates viewport bounds and rescans perch targets on window resize.
   - Rescans perch targets on window scroll event.
   - Clamps coordinates safely when window is shrunken smaller than butterfly current coordinate.

---

### Tier 4: Real-World Portfolio Application Scenarios (12 Tests)
1. **Zero UI Interference on Interactive Elements** (3 tests):
   - Allows pointer events to pass through container to underlying buttons.
   - Allows navigation links and form inputs to remain 100% clickable.
   - Preserves text selection capabilities with `select-none` only on butterfly cosmetic layer.

2. **Perching Target Discovery across Portfolio Pages** (5 tests):
   - Discovers and targets `h1` main heading on Homepage ("Abimael").
   - Discovers and targets `.project-row` cards in Work Showcase section.
   - Discovers and targets `.section-label` headers across sections.
   - Discovers and targets `.evidence-card` and `.system-node` elements on Case Study pages.
   - Discovers `[data-perch-target]` explicitly annotated landing spots.

3. **Route Transition Simulation across Portfolio Pages** (2 tests):
   - Seamlessly updates perch targets when user navigates to Opinion detail page.
   - Maintains continuous flight coordinates during route change without resetting to center.

4. **End-to-End User Reading & Cursor Interaction Workflow** (2 tests):
   - Executes realistic reading session: gentle wander -> landing on header -> cursor scare -> evasion -> calm flight.
   - Survives full user session with tab backgrounding and multi-cursor gestures.

---

## How to Run the Test Suite

```bash
# Run all test suites
npm test

# Run type checking
npm run typecheck

# Run butterfly component tests specifically
npx vitest run components/InteractiveButterfly.test.tsx
```
