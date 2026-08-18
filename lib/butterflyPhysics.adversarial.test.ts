import { describe, it, expect } from 'vitest';
import {
  createInitialKinematics,
  updateButterflyKinematics,
  DEFAULT_PHYSICS_CONFIG,
  type ButterflyKinematics,
  type ButterflyState,
  type PhysicsConfig,
} from './butterflyPhysics';

describe('Adversarial & Empirical Stress Verification — Butterfly Kinematics', () => {
  const standardViewport = { width: 1440, height: 900 };

  // Helper invariant checker
  function assertInvariants(
    k: ButterflyKinematics,
    viewport = standardViewport,
    cfg = DEFAULT_PHYSICS_CONFIG
  ) {
    const vw = Number.isFinite(viewport?.width) && viewport.width > 0 ? viewport.width : 1024;
    const vh = Number.isFinite(viewport?.height) && viewport.height > 0 ? viewport.height : 768;

    // 1. All numeric fields must be strictly finite (no NaN, Infinity, -Infinity)
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

    // 2. State timer must be non-negative
    expect(k.stateTimer).toBeGreaterThanOrEqual(0);

    // 3. State must be one of the valid 5 states
    const validStates: ButterflyState[] = [
      'IDLE_FLIGHT',
      'APPROACH_PERCH',
      'PERCHED',
      'EVADING',
      'TAKEOFF',
    ];
    expect(validStates).toContain(k.state);

    // 4. Position bounding invariant: strictly within [0, viewportWidth] and [0, viewportHeight]
    expect(k.x).toBeGreaterThanOrEqual(0);
    expect(k.x).toBeLessThanOrEqual(vw);
    expect(k.y).toBeGreaterThanOrEqual(0);
    expect(k.y).toBeLessThanOrEqual(vh);

    // If viewport >= 16, hard margin 8px is strictly respected
    if (vw >= 16 && vh >= 16) {
      expect(k.x).toBeGreaterThanOrEqual(8);
      expect(k.x).toBeLessThanOrEqual(vw - 8);
      expect(k.y).toBeGreaterThanOrEqual(8);
      expect(k.y).toBeLessThanOrEqual(vh - 8);
    }

    // 5. Velocity magnitude safety clamp
    const speed = Math.hypot(k.vx, k.vy);
    const maxAllowedSpeed = cfg.evasionSpeed * 1.5 + 50; // Safety ceiling
    expect(speed).toBeLessThanOrEqual(maxAllowedSpeed);

    // 6. Wing angle within realistic bounds [-90, 90]
    expect(k.wingAngle).toBeGreaterThanOrEqual(-90);
    expect(k.wingAngle).toBeLessThanOrEqual(90);
  }

  describe('Vector 1: 10,000 Continuous Simulation Steps', () => {
    it('survives 10,000 continuous idle wandering steps with stable coordinates and finite values', () => {
      let k = createInitialKinematics(1440, 900);
      assertInvariants(k);

      for (let step = 0; step < 10000; step++) {
        k = updateButterflyKinematics(k, null, standardViewport, [], 0.016);
        if (step % 500 === 0) {
          assertInvariants(k);
        }
      }

      assertInvariants(k);
    });

    it('survives 10,000 steps with aggressive perching and takeoff cycles', () => {
      let k = createInitialKinematics(1440, 900);
      const perchTargets = [
        { x: 200, y: 150 },
        { x: 700, y: 350 },
        { x: 1200, y: 600 },
        { x: 400, y: 800 },
      ];

      const stateOccurrences: Record<ButterflyState, number> = {
        IDLE_FLIGHT: 0,
        APPROACH_PERCH: 0,
        PERCHED: 0,
        EVADING: 0,
        TAKEOFF: 0,
      };

      for (let step = 0; step < 10000; step++) {
        k = updateButterflyKinematics(k, null, standardViewport, perchTargets, 0.016);
        stateOccurrences[k.state]++;
        if (step % 1000 === 0) {
          assertInvariants(k);
        }
      }

      assertInvariants(k);
      // Verify that all peaceful states were cycled through
      expect(stateOccurrences.IDLE_FLIGHT).toBeGreaterThan(0);
      expect(stateOccurrences.APPROACH_PERCH).toBeGreaterThan(0);
      expect(stateOccurrences.PERCHED).toBeGreaterThan(0);
      expect(stateOccurrences.TAKEOFF).toBeGreaterThan(0);
    });

    it('survives 100,000 continuous simulation steps under stochastic dt and chaotic inputs without drift or NaN', () => {
      let k = createInitialKinematics(1920, 1080);
      const vp = { width: 1920, height: 1080 };
      const targets = [
        { x: 300, y: 200 },
        { x: 1000, y: 500 },
        { x: 1600, y: 800 },
      ];

      for (let step = 0; step < 100000; step++) {
        const dt = 0.008 + (step % 25) * 0.002; // 8ms to 56ms
        const hasCursor = step % 5 === 0;
        const cursor = hasCursor
          ? { x: (k.x + step * 7) % 1920, y: (k.y + step * 11) % 1080 }
          : null;

        k = updateButterflyKinematics(k, cursor, vp, targets, dt);

        if (step % 10000 === 0) {
          assertInvariants(k, vp);
        }
      }

      assertInvariants(k, vp);
    });
  });

  describe('Vector 2: Rapid Delta Time (dt) Oscillations & Spikes (0s to 10s)', () => {
    it('handles rapid dt jitter between 0s, micro-seconds, and 10s spikes without velocity explosion', () => {
      let k = createInitialKinematics(1440, 900);
      const dtList = [
        0,
        1e-9,
        0.0001,
        0.016,
        0.033,
        0.1,
        0.5,
        1.0,
        5.0,
        10.0,
        0,
        -0.016,
        -10,
        100.0,
      ];

      for (let i = 0; i < 1000; i++) {
        const dt = dtList[i % dtList.length];
        const prevK = { ...k };
        k = updateButterflyKinematics(k, null, standardViewport, [], dt);

        assertInvariants(k);

        // When dt is zero or negative, state should be unchanged
        if (dt <= 0) {
          expect(k.x).toBe(prevK.x);
          expect(k.y).toBe(prevK.y);
          expect(k.stateTimer).toBe(prevK.stateTimer);
        }
      }
    });

    it('clamps 10-second tab suspension lag spike to MAX_DT (0.1s) safely', () => {
      const kStart = createInitialKinematics(1440, 900);
      kStart.vx = 150;
      kStart.vy = 100;

      const kAfterSpike = updateButterflyKinematics(
        kStart,
        null,
        standardViewport,
        [],
        10.0 // 10s lag spike
      );

      assertInvariants(kAfterSpike);
      // dt clamped to 0.1s, maximum displacement is ~15-20px, not 1500px!
      const displacement = Math.hypot(kAfterSpike.x - kStart.x, kAfterSpike.y - kStart.y);
      expect(displacement).toBeLessThan(30);
      expect(kAfterSpike.stateTimer).toBeCloseTo(0.1, 2);
    });
  });

  describe('Vector 3: Infinite, NaN & Corrupted Data Ingestion', () => {
    it('sanitizes state with NaN, +/-Infinity, and missing properties', () => {
      const totallyCorrupted: any = {
        x: NaN,
        y: Infinity,
        vx: -Infinity,
        vy: NaN,
        targetX: 'invalid' as any,
        targetY: null as any,
        state: null,
        stateTimer: NaN,
        wingAngle: Infinity,
        wingSpeed: NaN,
        facingAngle: undefined as any,
      };

      const sanitized = updateButterflyKinematics(
        totallyCorrupted,
        null,
        standardViewport,
        [],
        0.016
      );

      assertInvariants(sanitized);
      expect(sanitized.x).toBeGreaterThanOrEqual(8);
      expect(sanitized.y).toBeGreaterThanOrEqual(8);
      expect(sanitized.state).toBe('IDLE_FLIGHT');
      expect(sanitized.stateTimer).toBeCloseTo(0.016, 3);
    });

    it('documents handling of externally corrupted negative stateTimer', () => {
      const negativeTimerState: ButterflyKinematics = {
        ...createInitialKinematics(1440, 900),
        stateTimer: -50.0,
      };

      const next = updateButterflyKinematics(
        negativeTimerState,
        null,
        standardViewport,
        [],
        0.016
      );

      // Number.isFinite(-50) is true, so it advances monotonically by dt (-49.984)
      expect(Number.isFinite(next.stateTimer)).toBe(true);
      expect(next.stateTimer).toBeGreaterThan(negativeTimerState.stateTimer);
    });

    it('safely rejects corrupted cursor objects (NaN, Infinity, malformed types)', () => {
      const k = createInitialKinematics(1440, 900);

      const malformedCursors: any[] = [
        { x: NaN, y: 100 },
        { x: 100, y: Infinity },
        { x: -Infinity, y: -Infinity },
        { x: '100', y: '200' },
        {},
        null,
        undefined,
        false,
        123,
        [],
      ];

      for (const badCursor of malformedCursors) {
        const next = updateButterflyKinematics(k, badCursor, standardViewport, [], 0.016);
        assertInvariants(next);
        // None of these invalid cursors should trigger EVADING
        expect(next.state).toBe('IDLE_FLIGHT');
      }
    });

    it('safely handles malformed viewports (0, negative, NaN, Infinity)', () => {
      const k = createInitialKinematics(1440, 900);

      const malformedViewports: any[] = [
        { width: 0, height: 0 },
        { width: -500, height: -300 },
        { width: NaN, height: 800 },
        { width: Infinity, height: Infinity },
        null,
        undefined,
      ];

      for (const badVp of malformedViewports) {
        const next = updateButterflyKinematics(k, null, badVp, [], 0.016);
        assertInvariants(next);
      }
    });

    it('safely filters corrupted perch targets array', () => {
      const k: ButterflyKinematics = {
        ...createInitialKinematics(1440, 900),
        stateTimer: 10.0, // Ready to perch
      };

      const corruptedTargets: any = [
        null,
        undefined,
        { x: NaN, y: 50 },
        { x: 50, y: Infinity },
        { x: -999, y: 500 }, // Off-screen
        { x: 2000, y: 500 }, // Off-screen
        'invalid-target',
        {},
        { x: 300, y: 200 }, // Only this one is valid
      ];

      const next = updateButterflyKinematics(
        k,
        null,
        standardViewport,
        corruptedTargets,
        0.016
      );

      assertInvariants(next);
      expect(next.state).toBe('APPROACH_PERCH');
      expect(next.targetX).toBe(300);
      expect(next.targetY).toBe(200);
    });
  });

  describe('Vector 4: Cursor Teleportation & Proximity Evasion (<90px Reflex)', () => {
    it('triggers evasion deterministically within <90px and NOT at >90px', () => {
      const k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 50,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 90,
      };

      // Test boundary: 89.9px vs 90.1px
      const insideCursor = { x: 500 + 89.9, y: 400 };
      const outsideCursor = { x: 500 + 90.1, y: 400 };

      const evaded = updateButterflyKinematics(k, insideCursor, standardViewport, [], 0.016);
      expect(evaded.state).toBe('EVADING');
      expect(evaded.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);

      const notEvaded = updateButterflyKinematics(k, outsideCursor, standardViewport, [], 0.016);
      expect(notEvaded.state).toBe('IDLE_FLIGHT');
      expect(notEvaded.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });

    it('handles exact co-location (cursor distance = 0px) without NaN or singularity', () => {
      const k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 0,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 0,
      };

      const coLocatedCursor = { x: 500, y: 400 };

      const next = updateButterflyKinematics(k, coLocatedCursor, standardViewport, [], 0.016);
      assertInvariants(next);
      expect(next.state).toBe('EVADING');
      expect(Number.isNaN(next.vx)).toBe(false);
      expect(Number.isNaN(next.vy)).toBe(false);
    });

    it('generates escape velocity directing away from cursor', () => {
      const k: ButterflyKinematics = {
        x: 500,
        y: 500,
        vx: 0,
        vy: 0,
        targetX: 500,
        targetY: 500,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 0,
      };

      // Test cursor in all 4 cardinal quadrants
      const scenarios = [
        { cursor: { x: 550, y: 500 }, expectedVxSign: -1 }, // Cursor Right -> Flee Left (vx < 0)
        { cursor: { x: 450, y: 500 }, expectedVxSign: 1 },  // Cursor Left -> Flee Right (vx > 0)
        { cursor: { x: 500, y: 550 }, expectedVySign: -1 }, // Cursor Below -> Flee Up (vy < 0)
        { cursor: { x: 500, y: 450 }, expectedVySign: 1 },  // Cursor Above -> Flee Down (vy > 0)
      ];

      for (const scenario of scenarios) {
        let sim = k;
        for (let t = 0; t < 5; t++) {
          sim = updateButterflyKinematics(sim, scenario.cursor, standardViewport, [], 0.016);
        }

        expect(sim.state).toBe('EVADING');
        if (scenario.expectedVxSign !== undefined) {
          expect(Math.sign(sim.vx)).toBe(scenario.expectedVxSign);
        }
        if (scenario.expectedVySign !== undefined) {
          expect(Math.sign(sim.vy)).toBe(scenario.expectedVySign);
        }
      }
    });

    it('handles supersonic cursor teleportation (jumping across viewport 100 times)', () => {
      let k = createInitialKinematics(1440, 900);

      for (let i = 0; i < 100; i++) {
        // Cursor jumps wildly
        const cursor = {
          x: (i * 379) % 1440,
          y: (i * 251) % 900,
        };

        k = updateButterflyKinematics(k, cursor, standardViewport, [], 0.016);
        assertInvariants(k);
      }
    });
  });

  describe('Vector 5: Determinism, Purity & State Machine Exhaustiveness', () => {
    it('is strictly deterministic: identical inputs yield identical outputs bit-for-bit', () => {
      const initial = createInitialKinematics(1440, 900);
      const cursor = { x: 500, y: 450 };
      const targets = [{ x: 300, y: 200 }];

      const run1 = updateButterflyKinematics(initial, cursor, standardViewport, targets, 0.016);
      const run2 = updateButterflyKinematics(initial, cursor, standardViewport, targets, 0.016);

      expect(run1).toEqual(run2);
    });

    it('does not mutate input state object or perchTargets array', () => {
      const initial = createInitialKinematics(1440, 900);
      const frozenInitial = Object.freeze({ ...initial });
      const targets = Object.freeze([{ x: 300, y: 200 }]);

      expect(() => {
        updateButterflyKinematics(frozenInitial, null, standardViewport, targets as any, 0.016);
      }).not.toThrow();
    });

    it('handles extreme corner pinning: butterfly pinned in corner with cursor encroaching', () => {
      // Pinned at (8, 8) top-left corner
      let k: ButterflyKinematics = {
        x: 8,
        y: 8,
        vx: -50,
        vy: -50,
        targetX: 8,
        targetY: 8,
        state: 'EVADING',
        stateTimer: 0.1,
        wingAngle: 0,
        wingSpeed: 22,
        facingAngle: 225,
      };

      // Cursor directly at (30, 30) pushing butterfly into corner
      const cursor = { x: 30, y: 30 };

      for (let i = 0; i < 60; i++) {
        k = updateButterflyKinematics(k, cursor, standardViewport, [], 0.016);
        assertInvariants(k);
        // Position must NOT break boundary
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeGreaterThanOrEqual(8);
      }
    });
  });
});
