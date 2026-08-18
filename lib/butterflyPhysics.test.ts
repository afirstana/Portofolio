import { describe, it, expect } from 'vitest';
import {
  createInitialKinematics,
  updateButterflyKinematics,
  DEFAULT_PHYSICS_CONFIG,
  type ButterflyKinematics,
  type ButterflyState,
  type PhysicsConfig,
} from './butterflyPhysics';

describe('Butterfly Physics & Kinematics Engine', () => {
  const defaultViewport = { width: 1200, height: 800 };

  describe('1. Initial State Generation & Boundary Defaults', () => {
    it('creates a valid initial kinematics object within viewport bounds', () => {
      const initial = createInitialKinematics(1200, 800);

      expect(initial.x).toBeGreaterThanOrEqual(8);
      expect(initial.x).toBeLessThanOrEqual(1200 - 8);
      expect(initial.y).toBeGreaterThanOrEqual(8);
      expect(initial.y).toBeLessThanOrEqual(800 - 8);

      expect(initial.state).toBe('IDLE_FLIGHT');
      expect(initial.stateTimer).toBe(0);
      expect(initial.wingAngle).toBe(0);
      expect(initial.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
      expect(Number.isFinite(initial.vx)).toBe(true);
      expect(Number.isFinite(initial.vy)).toBe(true);
      expect(Number.isFinite(initial.facingAngle)).toBe(true);
      expect(initial.targetX).toBe(initial.x);
      expect(initial.targetY).toBe(initial.y);
    });

    it('handles zero or negative viewport dimensions with fallback defaults', () => {
      const fallbackZero = createInitialKinematics(0, 0);
      expect(fallbackZero.x).toBeGreaterThan(0);
      expect(fallbackZero.y).toBeGreaterThan(0);
      expect(fallbackZero.state).toBe('IDLE_FLIGHT');

      const fallbackNegative = createInitialKinematics(-500, -300);
      expect(fallbackNegative.x).toBeGreaterThan(0);
      expect(fallbackNegative.y).toBeGreaterThan(0);
      expect(fallbackNegative.state).toBe('IDLE_FLIGHT');
    });

    it('returns a new immutable object without mutating current state', () => {
      const current = createInitialKinematics(1000, 800);
      const frozenCurrent = Object.freeze({ ...current });

      const next = updateButterflyKinematics(
        frozenCurrent,
        null,
        defaultViewport,
        [],
        0.016
      );

      expect(next).not.toBe(frozenCurrent);
      expect(next.x).not.toBeNaN();
    });
  });

  describe('2. Idle Wandering Flight & Soft Boundary Containment', () => {
    it('updates position over time in IDLE_FLIGHT with continuous velocity integration', () => {
      let k = createInitialKinematics(1000, 800);
      const startX = k.x;
      const startY = k.y;

      for (let i = 0; i < 10; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      expect(k.x).not.toBe(startX);
      expect(k.y).not.toBe(startY);
      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.stateTimer).toBeCloseTo(0.16, 2);
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });

    it('applies soft boundary repulsion when nearing left boundary', () => {
      // Position butterfly near left edge moving leftwards
      const nearLeft: ButterflyKinematics = {
        x: 20,
        y: 400,
        vx: -50,
        vy: 0,
        targetX: 20,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 270,
      };

      let k = nearLeft;
      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      // Repulsion force should decelerate negative vx and turn it rightward
      expect(k.vx).toBeGreaterThan(nearLeft.vx);
      expect(k.x).toBeGreaterThanOrEqual(8);
    });

    it('applies soft boundary repulsion when nearing right boundary', () => {
      const nearRight: ButterflyKinematics = {
        x: defaultViewport.width - 20,
        y: 400,
        vx: 80,
        vy: 0,
        targetX: defaultViewport.width - 20,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 90,
      };

      let k = nearRight;
      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      expect(k.vx).toBeLessThan(nearRight.vx);
      expect(k.x).toBeLessThanOrEqual(defaultViewport.width - 8);
    });

    it('applies soft boundary repulsion when nearing top boundary', () => {
      const nearTop: ButterflyKinematics = {
        x: 500,
        y: 15,
        vx: 0,
        vy: -70,
        targetX: 500,
        targetY: 15,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 0,
      };

      let k = nearTop;
      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      expect(k.vy).toBeGreaterThan(nearTop.vy);
      expect(k.y).toBeGreaterThanOrEqual(8);
    });

    it('applies soft boundary repulsion when nearing bottom boundary', () => {
      const nearBottom: ButterflyKinematics = {
        x: 500,
        y: defaultViewport.height - 15,
        vx: 0,
        vy: 70,
        targetX: 500,
        targetY: defaultViewport.height - 15,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 180,
      };

      let k = nearBottom;
      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      expect(k.vy).toBeLessThan(nearBottom.vy);
      expect(k.y).toBeLessThanOrEqual(defaultViewport.height - 8);
    });
  });

  describe('3. Cursor Proximity Evasion Reflex (<= 90px threshold)', () => {
    it('triggers EVADING state immediately when cursor is within evasion distance', () => {
      const butterfly: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 50,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 2.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 90,
      };

      // Cursor within 60px (< 90px)
      const cursor = { x: 540, y: 400 };

      const next = updateButterflyKinematics(
        butterfly,
        cursor,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);
      expect(next.stateTimer).toBeCloseTo(0.016, 3);
    });

    it('does NOT trigger EVADING state when cursor is far (> 90px)', () => {
      const butterfly: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 50,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 2.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 90,
      };

      // Cursor 200px away (> 90px)
      const cursor = { x: 700, y: 400 };

      const next = updateButterflyKinematics(
        butterfly,
        cursor,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('IDLE_FLIGHT');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });

    it('generates a strong escape vector directly away from cursor (cursor to right -> flees left)', () => {
      const butterfly: ButterflyKinematics = {
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

      // Cursor is to the RIGHT (550, 400), dist = 50px
      const cursor = { x: 550, y: 400 };

      let k = butterfly;
      for (let i = 0; i < 5; i++) {
        k = updateButterflyKinematics(k, cursor, defaultViewport, [], 0.016);
      }

      expect(k.state).toBe('EVADING');
      // Velocity X should accelerate negatively (away to the left)
      expect(k.vx).toBeLessThan(0);
      expect(Math.abs(k.vx)).toBeGreaterThan(50);
    });

    it('generates a strong escape vector directly away from cursor (cursor below -> flees up)', () => {
      const butterfly: ButterflyKinematics = {
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

      // Cursor is BELOW (500, 450), dist = 50px
      const cursor = { x: 500, y: 450 };

      let k = butterfly;
      for (let i = 0; i < 5; i++) {
        k = updateButterflyKinematics(k, cursor, defaultViewport, [], 0.016);
      }

      expect(k.state).toBe('EVADING');
      // Velocity Y should accelerate negatively (upward away from cursor)
      expect(k.vy).toBeLessThan(0);
    });

    it('recovers back to IDLE_FLIGHT after evasion duration and cursor is distant', () => {
      let k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: -300,
        vy: -200,
        targetX: 500,
        targetY: 400,
        state: 'EVADING',
        stateTimer: 0.0,
        wingAngle: 0,
        wingSpeed: 22,
        facingAngle: 220,
      };

      // Simulate evasion flight with cursor distant or gone
      const cursorFar = { x: 900, y: 900 };

      for (let i = 0; i < 60; i++) { // ~0.96s (greater than EVASION_MIN_DURATION 0.65s)
        k = updateButterflyKinematics(k, cursorFar, defaultViewport, [], 0.016);
      }

      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });
  });

  describe('4. Perching Behavior, Approach, Rest & Takeoff', () => {
    it('initiates APPROACH_PERCH when perch targets are available and idle interval reached', () => {
      const targets = [{ x: 300, y: 200 }, { x: 800, y: 600 }];
      const readyForPerch: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 80,
        vy: 40,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 8.5, // >= 8.0s search interval
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 60,
      };

      const next = updateButterflyKinematics(
        readyForPerch,
        null,
        defaultViewport,
        targets,
        0.016
      );

      expect(next.state).toBe('APPROACH_PERCH');
      expect(next.stateTimer).toBeCloseTo(0.016, 3);
      expect(targets.some(t => t.x === next.targetX && t.y === next.targetY)).toBe(true);
    });

    it('steers smoothly toward the selected perch target during APPROACH_PERCH', () => {
      let k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 0,
        vy: 0,
        targetX: 300,
        targetY: 200,
        state: 'APPROACH_PERCH',
        stateTimer: 0.1,
        wingAngle: 0,
        wingSpeed: 6,
        facingAngle: 0,
      };

      for (let i = 0; i < 15; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      // Should steer towards target (x decreasing towards 300, y decreasing towards 200)
      expect(k.vx).toBeLessThan(0);
      expect(k.vy).toBeLessThan(0);
      expect(k.x).toBeLessThan(500);
      expect(k.y).toBeLessThan(400);
    });

    it('lands and transitions to PERCHED state when within arrival distance', () => {
      const nearLanding: ButterflyKinematics = {
        x: 302,
        y: 201,
        vx: -10,
        vy: -5,
        targetX: 300,
        targetY: 200,
        state: 'APPROACH_PERCH',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 6,
        facingAngle: 225,
      };

      const next = updateButterflyKinematics(
        nearLanding,
        null,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('PERCHED');
      expect(next.x).toBe(300);
      expect(next.y).toBe(200);
      expect(next.vx).toBe(0);
      expect(next.vy).toBe(0);
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPerched);
    });

    it('remains PERCHED with zero velocity and gentle breathing wing flutter during rest duration', () => {
      let k: ButterflyKinematics = {
        x: 300,
        y: 200,
        vx: 0,
        vy: 0,
        targetX: 300,
        targetY: 200,
        state: 'PERCHED',
        stateTimer: 0.5,
        wingAngle: 18,
        wingSpeed: 1.2,
        facingAngle: 90,
      };

      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      expect(k.state).toBe('PERCHED');
      expect(k.x).toBe(300);
      expect(k.y).toBe(200);
      expect(k.vx).toBe(0);
      expect(k.vy).toBe(0);
      // Wing angle oscillates in breathing range (10 - 26 deg)
      expect(k.wingAngle).toBeGreaterThanOrEqual(10);
      expect(k.wingAngle).toBeLessThanOrEqual(26);
    });

    it('transitions from PERCHED to TAKEOFF after rest duration expires', () => {
      const finishedRest: ButterflyKinematics = {
        x: 300,
        y: 200,
        vx: 0,
        vy: 0,
        targetX: 300,
        targetY: 200,
        state: 'PERCHED',
        stateTimer: 7.5, // >= perchDurationMax
        wingAngle: 18,
        wingSpeed: 1.2,
        facingAngle: 90,
      };

      const next = updateButterflyKinematics(
        finishedRest,
        null,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('TAKEOFF');
      expect(next.stateTimer).toBeCloseTo(0.016, 3);
    });

    it('applies upward vertical boost in TAKEOFF and transitions to IDLE_FLIGHT', () => {
      let k: ButterflyKinematics = {
        x: 300,
        y: 200,
        vx: 0,
        vy: 0,
        targetX: 300,
        targetY: 200,
        state: 'TAKEOFF',
        stateTimer: 0.0,
        wingAngle: 0,
        wingSpeed: 16,
        facingAngle: 0,
      };

      // Tick a few frames during TAKEOFF
      k = updateButterflyKinematics(k, null, defaultViewport, [], 0.05);
      expect(k.vy).toBeLessThan(0); // Upward velocity
      expect(k.wingSpeed).toBe(16);

      // Run until takeoff completes (> 0.45s)
      for (let i = 0; i < 35; i++) {
        k = updateButterflyKinematics(k, null, defaultViewport, [], 0.016);
      }

      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });
  });

  describe('5. Interrupting Perch / Approach with Cursor Evasion', () => {
    it('breaks PERCHED state immediately when cursor approaches <= 90px', () => {
      const perched: ButterflyKinematics = {
        x: 300,
        y: 200,
        vx: 0,
        vy: 0,
        targetX: 300,
        targetY: 200,
        state: 'PERCHED',
        stateTimer: 1.5,
        wingAngle: 18,
        wingSpeed: 1.2,
        facingAngle: 90,
      };

      // Cursor approaches perched spot (320, 200) -> distance = 20px
      const cursor = { x: 320, y: 200 };

      const next = updateButterflyKinematics(
        perched,
        cursor,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);
      expect(next.stateTimer).toBeCloseTo(0.016, 3);
    });

    it('aborts APPROACH_PERCH immediately when cursor approaches', () => {
      const approaching: ButterflyKinematics = {
        x: 400,
        y: 300,
        vx: -60,
        vy: -30,
        targetX: 200,
        targetY: 100,
        state: 'APPROACH_PERCH',
        stateTimer: 0.8,
        wingAngle: 0,
        wingSpeed: 6,
        facingAngle: 210,
      };

      const cursor = { x: 440, y: 320 }; // distance ~44.7px <= 90px

      const next = updateButterflyKinematics(
        approaching,
        cursor,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);
    });

    it('overrides TAKEOFF state immediately if cursor approaches during launch', () => {
      const takingOff: ButterflyKinematics = {
        x: 300,
        y: 200,
        vx: 40,
        vy: -150,
        targetX: 300,
        targetY: 200,
        state: 'TAKEOFF',
        stateTimer: 0.1,
        wingAngle: 0,
        wingSpeed: 16,
        facingAngle: 340,
      };

      const cursor = { x: 310, y: 210 }; // distance ~14px <= 90px

      const next = updateButterflyKinematics(
        takingOff,
        cursor,
        defaultViewport,
        [],
        0.016
      );

      expect(next.state).toBe('EVADING');
    });
  });

  describe('6. Delta-Time Normalization, Clamping & Tab-Switch Lag Spikes', () => {
    it('returns exact same state when dt is 0', () => {
      const current = createInitialKinematics(1000, 800);
      const next = updateButterflyKinematics(
        current,
        null,
        defaultViewport,
        [],
        0
      );

      expect(next.x).toBe(current.x);
      expect(next.y).toBe(current.y);
      expect(next.stateTimer).toBe(current.stateTimer);
    });

    it('clamps negative dt to 0 safely without NaN or backward time travel', () => {
      const current = createInitialKinematics(1000, 800);
      const next = updateButterflyKinematics(
        current,
        null,
        defaultViewport,
        [],
        -0.5
      );

      expect(next.x).toBe(current.x);
      expect(next.y).toBe(current.y);
      expect(next.stateTimer).toBe(current.stateTimer);
    });

    it('clamps large dt spikes (e.g. 5.0s during tab background) to max dt (0.1s) to prevent physics blowup', () => {
      const current: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 100,
        vy: 0,
        targetX: 500,
        targetY: 400,
        state: 'IDLE_FLIGHT',
        stateTimer: 0.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 90,
      };

      // 5.0s lag spike
      const next = updateButterflyKinematics(
        current,
        null,
        defaultViewport,
        [],
        5.0
      );

      // Max displacement with dt clamped to 0.1s at speed ~100 should be ~10-20px, not 500px!
      expect(Math.abs(next.x - current.x)).toBeLessThan(30);
      expect(next.stateTimer).toBeCloseTo(0.1, 2);
    });
  });

  describe('7. Robust Edge Cases, Coordinate Sanitization & Config Overrides', () => {
    it('handles null and undefined cursor gracefully without error', () => {
      const current = createInitialKinematics(1000, 800);
      expect(() => {
        updateButterflyKinematics(current, null, defaultViewport, [], 0.016);
      }).not.toThrow();
    });

    it('handles empty, null, or undefined perchTargets safely', () => {
      const current: ButterflyKinematics = {
        ...createInitialKinematics(1000, 800),
        stateTimer: 10.0,
      };

      expect(() => {
        updateButterflyKinematics(current, null, defaultViewport, undefined, 0.016);
      }).not.toThrow();

      expect(() => {
        // Test runtime safety for unexpected input
        updateButterflyKinematics(current, null, defaultViewport, null as unknown as Array<{ x: number; y: number }>, 0.016);
      }).not.toThrow();

      const next = updateButterflyKinematics(current, null, defaultViewport, [], 0.016);
      expect(next.state).toBe('IDLE_FLIGHT');
    });

    it('filters out invalid or off-screen perch targets', () => {
      const current: ButterflyKinematics = {
        ...createInitialKinematics(1000, 800),
        stateTimer: 9.0,
      };

      // All targets off-screen or invalid
      const badTargets = [
        { x: -500, y: -200 },
        { x: 9999, y: 9999 },
        { x: NaN, y: 50 },
      ];

      const next = updateButterflyKinematics(
        current,
        null,
        defaultViewport,
        badTargets,
        0.016
      );

      // Should not transition to invalid targets
      expect(next.state).toBe('IDLE_FLIGHT');
    });

    it('sanitizes NaN and infinite values in current state without crashing', () => {
      const corrupted: ButterflyKinematics = {
        x: NaN,
        y: Infinity,
        vx: -Infinity,
        vy: NaN,
        targetX: NaN,
        targetY: NaN,
        state: 'IDLE_FLIGHT',
        stateTimer: NaN,
        wingAngle: NaN,
        wingSpeed: NaN,
        facingAngle: NaN,
      };

      const result = updateButterflyKinematics(
        corrupted,
        null,
        defaultViewport,
        [],
        0.016
      );

      expect(Number.isFinite(result.x)).toBe(true);
      expect(Number.isFinite(result.y)).toBe(true);
      expect(Number.isFinite(result.vx)).toBe(true);
      expect(Number.isFinite(result.vy)).toBe(true);
      expect(Number.isFinite(result.stateTimer)).toBe(true);
    });

    it('supports custom PhysicsConfig parameters', () => {
      const customConfig: Partial<PhysicsConfig> = {
        evasionDistance: 150,
        evasionSpeed: 600,
        flutterFrequencyPanic: 26,
      };

      const current: ButterflyKinematics = {
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

      // Cursor at 130px (greater than default 90px, but within custom 150px)
      const cursor = { x: 630, y: 400 };

      const next = updateButterflyKinematics(
        current,
        cursor,
        defaultViewport,
        [],
        0.016,
        customConfig
      );

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(26);
    });

    it('ensures position strictly stays inside hard boundaries [8, viewport - 8]', () => {
      // Butterfly way out of bounds
      const outOfBounds: ButterflyKinematics = {
        x: -999,
        y: 9999,
        vx: -500,
        vy: 500,
        targetX: 0,
        targetY: 0,
        state: 'IDLE_FLIGHT',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 10,
        facingAngle: 0,
      };

      const next = updateButterflyKinematics(
        outOfBounds,
        null,
        { width: 1000, height: 600 },
        [],
        0.016
      );

      expect(next.x).toBeGreaterThanOrEqual(8);
      expect(next.x).toBeLessThanOrEqual(1000 - 8);
      expect(next.y).toBeGreaterThanOrEqual(8);
      expect(next.y).toBeLessThanOrEqual(600 - 8);
    });
  });
});
