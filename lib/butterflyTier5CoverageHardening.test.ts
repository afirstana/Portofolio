import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createInitialKinematics,
  updateButterflyKinematics,
  DEFAULT_PHYSICS_CONFIG,
  type ButterflyKinematics,
  type ButterflyState,
  type PhysicsConfig,
} from './butterflyPhysics';

describe('Tier 5 Adversarial Coverage Hardening — Interactive Butterfly Kinematics & Lifecycle', () => {
  // =========================================================================
  // Invariant verification utility
  // =========================================================================
  function assertKinematicInvariants(
    k: ButterflyKinematics,
    viewport: { width: number; height: number },
    cfg: PhysicsConfig = DEFAULT_PHYSICS_CONFIG
  ) {
    const vw = Number.isFinite(viewport?.width) && viewport.width > 0 ? viewport.width : 1024;
    const vh = Number.isFinite(viewport?.height) && viewport.height > 0 ? viewport.height : 768;

    // 1. Strict numeric finiteness on all kinematics fields
    expect(Number.isFinite(k.x), `x must be finite, got ${k.x}`).toBe(true);
    expect(Number.isFinite(k.y), `y must be finite, got ${k.y}`).toBe(true);
    expect(Number.isFinite(k.vx), `vx must be finite, got ${k.vx}`).toBe(true);
    expect(Number.isFinite(k.vy), `vy must be finite, got ${k.vy}`).toBe(true);
    expect(Number.isFinite(k.targetX), `targetX must be finite, got ${k.targetX}`).toBe(true);
    expect(Number.isFinite(k.targetY), `targetY must be finite, got ${k.targetY}`).toBe(true);
    expect(Number.isFinite(k.stateTimer), `stateTimer must be finite, got ${k.stateTimer}`).toBe(true);
    expect(Number.isFinite(k.wingAngle), `wingAngle must be finite, got ${k.wingAngle}`).toBe(true);
    expect(Number.isFinite(k.wingSpeed), `wingSpeed must be finite, got ${k.wingSpeed}`).toBe(true);
    expect(Number.isFinite(k.facingAngle), `facingAngle must be finite, got ${k.facingAngle}`).toBe(true);

    // 2. State validity
    const validStates: ButterflyState[] = [
      'IDLE_FLIGHT',
      'APPROACH_PERCH',
      'PERCHED',
      'EVADING',
      'TAKEOFF',
    ];
    expect(validStates).toContain(k.state);

    // 3. Viewport boundary confinement
    if (vw >= 16 && vh >= 16) {
      expect(k.x).toBeGreaterThanOrEqual(8);
      expect(k.x).toBeLessThanOrEqual(vw - 8);
      expect(k.y).toBeGreaterThanOrEqual(8);
      expect(k.y).toBeLessThanOrEqual(vh - 8);
    } else {
      expect(k.x).toBeGreaterThanOrEqual(0);
      expect(k.y).toBeGreaterThanOrEqual(0);
    }

    // 4. Speed clamping ceiling
    const speed = Math.hypot(k.vx, k.vy);
    const maxSafetySpeed = cfg.evasionSpeed * 1.5 + 50;
    expect(speed).toBeLessThanOrEqual(maxSafetySpeed);

    // 5. Wing angle range
    expect(k.wingAngle).toBeGreaterThanOrEqual(-90);
    expect(k.wingAngle).toBeLessThanOrEqual(90);
  }

  // =========================================================================
  // VECTOR 1: Rapid Mouse Jitter at Border of Evasion Radius (89.9px <-> 90.1px)
  // =========================================================================
  describe('Vector 1: Rapid Mouse Jitter at Border of Evasion Radius (89.9px <-> 90.1px)', () => {
    const standardVp = { width: 1440, height: 900 };

    it('maintains state automaton hysteresis and prevents high-frequency chattering under 89.9px <-> 90.1px jitter', () => {
      // Start in IDLE_FLIGHT at (500, 400)
      let k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 40,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 90,
      };

      const dt = 0.016; // 60fps tick

      // Step 1: Cursor crosses into 89.9px radius
      const insideCursor = { x: k.x + 89.9, y: k.y };
      k = updateButterflyKinematics(k, insideCursor, standardVp, [], dt);

      // Must immediately trigger EVADING state and panic wings
      expect(k.state).toBe('EVADING');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);

      // Step 2: Cursor rapidly oscillates across threshold (89.9px <-> 90.1px) for 35 frames (~0.56s < 0.65s min duration)
      let stateTransitions = 0;
      let previousState = k.state;

      for (let f = 0; f < 35; f++) {
        // Toggle distance every frame
        const jitterDist = f % 2 === 0 ? 90.1 : 89.9;
        const jitterCursor = { x: k.x + jitterDist, y: k.y };

        k = updateButterflyKinematics(k, jitterCursor, standardVp, [], dt);
        assertKinematicInvariants(k, standardVp);

        if (k.state !== previousState) {
          stateTransitions++;
          previousState = k.state;
        }

        // Must STAY locked in EVADING during the minimum evasion duration (0.65s)
        expect(k.state).toBe('EVADING');
      }

      // Zero chattering/flickering occurred: stateTransitions is 0
      expect(stateTransitions).toBe(0);
    });

    it('survives 1,000 frames of chaotic multi-axis sub-pixel jitter around the 90px threshold', () => {
      let k = createInitialKinematics(1440, 900);
      const dt = 0.016;

      for (let i = 0; i < 1000; i++) {
        // Angle rotates continuously, radius jitters between 89.5px and 90.5px
        const angle = (i * 0.15) % (Math.PI * 2);
        const radius = 90.0 + Math.sin(i * 1.7) * 0.95; // 89.05px to 90.95px
        const cursor = {
          x: k.x + Math.cos(angle) * radius,
          y: k.y + Math.sin(angle) * radius,
        };

        k = updateButterflyKinematics(k, cursor, standardVp, [], dt);
        assertKinematicInvariants(k, standardVp);
      }
    });

    it('smoothly de-escalates back to IDLE_FLIGHT once cursor retreats beyond hysteresis distance (126px = 90 * 1.4)', () => {
      let k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: -200,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'EVADING',
        stateTimer: 0.0,
        wingAngle: 0,
        wingSpeed: 22,
        facingAngle: 270,
      };

      const dt = 0.016;

      // 1. Maintain near-boundary jitter for 45 frames (~0.72s > 0.65s min duration) at 100px (still < 126px hysteresis)
      for (let f = 0; f < 45; f++) {
        k = updateButterflyKinematics(k, { x: k.x + 100, y: k.y }, standardVp, [], dt);
        expect(k.state).toBe('EVADING'); // Still evading because dist (100px) <= 126px
      }

      // 2. Cursor retreats beyond hysteresis threshold (> 126px, e.g. 150px)
      for (let f = 0; f < 5; f++) {
        k = updateButterflyKinematics(k, { x: k.x + 150, y: k.y }, standardVp, [], dt);
      }

      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });
  });

  // =========================================================================
  // VECTOR 2: Simultaneous Tab Visibility Toggles and Window Resize Events
  // =========================================================================
  describe('Vector 2: Simultaneous Tab Visibility Toggles and Window Resize Events', () => {
    it('handles simultaneous viewport shrink (1920x1080 -> 400x300) during 30s tab sleep without off-screen teleportation', () => {
      const initialVp = { width: 1920, height: 1080 };
      let k = createInitialKinematics(initialVp.width, initialVp.height);

      // Advance flight to position near lower right (1600, 900)
      k = { ...k, x: 1600, y: 900, vx: 120, vy: 80 };

      // Tab sleep: 30 seconds elapse, simultaneous resize down to (400, 300)
      const shrunkenVp = { width: 400, height: 300 };
      const tabSleepDt = 30.0; // 30s lag spike

      // Update kinematics with shrunken viewport and large dt spike
      k = updateButterflyKinematics(k, null, shrunkenVp, [], tabSleepDt);

      // Coordinate must be instantly and safely clamped within new viewport bounds [8, 392] and [8, 292]
      assertKinematicInvariants(k, shrunkenVp);
      expect(k.x).toBeLessThanOrEqual(shrunkenVp.width - 8);
      expect(k.y).toBeLessThanOrEqual(shrunkenVp.height - 8);
      expect(k.x).toBeGreaterThanOrEqual(8);
      expect(k.y).toBeGreaterThanOrEqual(8);
    });

    it('survives 200 rapid alternating cycles of visibility toggle + random aspect resize', () => {
      let k = createInitialKinematics(1024, 768);

      const viewports = [
        { width: 1920, height: 1080 },
        { width: 375, height: 667 },
        { width: 2560, height: 1440 },
        { width: 320, height: 480 },
        { width: 1440, height: 900 },
        { width: 768, height: 1024 },
      ];

      for (let i = 0; i < 200; i++) {
        const vp = viewports[i % viewports.length];
        const isTabSuspended = i % 3 === 0;
        const dt = isTabSuspended ? 5.0 : 0.016;

        k = updateButterflyKinematics(k, null, vp, [{ x: vp.width * 0.5, y: vp.height * 0.3 }], dt);
        assertKinematicInvariants(k, vp);
      }
    });

    it('handles cursor event occurring simultaneously with tab resume and viewport expand', () => {
      let k: ButterflyKinematics = {
        x: 200,
        y: 200,
        vx: 0,
        vy: 0,
        targetX: 200,
        targetY: 200,
        state: 'PERCHED',
        stateTimer: 2.0,
        wingAngle: 18,
        wingSpeed: 1.2,
        facingAngle: 90,
      };

      const expandedVp = { width: 3840, height: 2160 };
      const cursorAtResume = { x: 230, y: 200 }; // 30px proximity

      k = updateButterflyKinematics(k, cursorAtResume, expandedVp, [], 0.016);

      assertKinematicInvariants(k, expandedVp);
      expect(k.state).toBe('EVADING');
      expect(k.vx).toBeLessThan(0); // Flees left away from cursor to the right
    });
  });

  // =========================================================================
  // VECTOR 3: Long Continuous Flight (1,000,000 Frames Simulation)
  // =========================================================================
  describe('Vector 3: Long Continuous Flight (1,000,000 Frames Simulation)', () => {
    it('survives 1,000,000 continuous simulation steps without numeric drift, coordinate escape, or NaN accumulation', () => {
      const vp = { width: 1600, height: 900 };
      let k = createInitialKinematics(vp.width, vp.height);

      const perchTargets = [
        { x: 300, y: 200 },
        { x: 800, y: 350 },
        { x: 1300, y: 600 },
      ];

      const dt = 0.016; // ~60fps
      let maxSpeedObserved = 0;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      // Run 1,000,000 simulation frames (~4.6 hours of 60fps real-time simulation)
      for (let frame = 1; frame <= 1000000; frame++) {
        // Stochastic cursor harassment every 17 frames
        const hasCursor = frame % 17 === 0;
        const cursor = hasCursor
          ? {
              x: (k.x + Math.sin(frame * 0.01) * 70) % vp.width,
              y: (k.y + Math.cos(frame * 0.01) * 70) % vp.height,
            }
          : null;

        k = updateButterflyKinematics(k, cursor, vp, perchTargets, dt);

        const currentSpeed = Math.hypot(k.vx, k.vy);
        if (currentSpeed > maxSpeedObserved) maxSpeedObserved = currentSpeed;
        if (k.x < minX) minX = k.x;
        if (k.x > maxX) maxX = k.x;
        if (k.y < minY) minY = k.y;
        if (k.y > maxY) maxY = k.y;

        // Verify invariants every 100,000 frames
        if (frame % 100000 === 0) {
          assertKinematicInvariants(k, vp);
        }
      }

      // Final comprehensive invariant validation
      assertKinematicInvariants(k, vp);

      // Boundaries strictly respected across all 1,000,000 frames
      expect(minX).toBeGreaterThanOrEqual(8);
      expect(maxX).toBeLessThanOrEqual(vp.width - 8);
      expect(minY).toBeGreaterThanOrEqual(8);
      expect(maxY).toBeLessThanOrEqual(vp.height - 8);

      // Max velocity never breached safe ceiling
      expect(maxSpeedObserved).toBeLessThanOrEqual(DEFAULT_PHYSICS_CONFIG.evasionSpeed * 1.35);
    });
  });

  // =========================================================================
  // VECTOR 4: Extreme Viewport Aspect Ratios & Corridor Boundary Limits
  // =========================================================================
  describe('Vector 4: Extreme Viewport Aspect Ratios & Corridor Boundary Limits', () => {
    it('operates smoothly in extreme ultra-wide ribbon viewport (10000px x 200px)', () => {
      const ultraWideRibbon = { width: 10000, height: 200 };
      let k = createInitialKinematics(ultraWideRibbon.width, ultraWideRibbon.height);

      for (let frame = 0; frame < 2000; frame++) {
        k = updateButterflyKinematics(k, null, ultraWideRibbon, [{ x: 5000, y: 100 }], 0.016);
        assertKinematicInvariants(k, ultraWideRibbon);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(10000 - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(200 - 8);
      }
    });

    it('operates smoothly in extreme ultra-tall skyscraper viewport (200px x 10000px)', () => {
      const ultraTallSkyscraper = { width: 200, height: 10000 };
      let k = createInitialKinematics(ultraTallSkyscraper.width, ultraTallSkyscraper.height);

      for (let frame = 0; frame < 2000; frame++) {
        k = updateButterflyKinematics(k, null, ultraTallSkyscraper, [{ x: 100, y: 5000 }], 0.016);
        assertKinematicInvariants(k, ultraTallSkyscraper);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(200 - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(10000 - 8);
      }
    });

    it('handles narrow corridor flight without trapped infinite oscillation or force accumulation', () => {
      // 50px wide corridor
      const narrowCorridor = { width: 50, height: 1000 };
      let k = createInitialKinematics(narrowCorridor.width, narrowCorridor.height);

      for (let frame = 0; frame < 500; frame++) {
        k = updateButterflyKinematics(k, null, narrowCorridor, [], 0.016);
        assertKinematicInvariants(k, narrowCorridor);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(50 - 8);
      }
    });

    it('handles micro viewports (20px x 20px) without division by zero or NaN', () => {
      const microVp = { width: 20, height: 20 };
      let k = createInitialKinematics(microVp.width, microVp.height);

      for (let frame = 0; frame < 100; frame++) {
        k = updateButterflyKinematics(k, null, microVp, [], 0.016);
        assertKinematicInvariants(k, microVp);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(12);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(12);
      }
    });

    it('handles degenerate 0x0 and negative dimensions safely using resilient fallback dimensions', () => {
      const degenerateVp = { width: 0, height: -500 };
      let k = createInitialKinematics(degenerateVp.width, degenerateVp.height);

      for (let frame = 0; frame < 50; frame++) {
        k = updateButterflyKinematics(k, null, degenerateVp, [], 0.016);
        assertKinematicInvariants(k, degenerateVp);
      }
    });
  });
});
