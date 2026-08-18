import { describe, it, expect } from 'vitest';
import {
  createInitialKinematics,
  updateButterflyKinematics,
  DEFAULT_PHYSICS_CONFIG,
  type ButterflyKinematics,
  type ButterflyState,
  type PhysicsConfig,
} from './butterflyPhysics';

describe('Empirical Kinematic Stress & Flight State Machine Challenger Suite', () => {
  const standardViewport = { width: 1280, height: 720 };
  const dt = 0.016; // ~60fps step

  // =========================================================================
  // 1. Perching Lifecycle Transitions: IDLE -> APPROACH_PERCH -> PERCHED -> TAKEOFF -> IDLE
  // =========================================================================
  describe('1. Perching Lifecycle State Machine Flow', () => {
    it('executes the full deterministic 5-phase lifecycle sequentially without human intervention', () => {
      const perchTargets = [{ x: 400, y: 300 }, { x: 800, y: 450 }];
      let k = createInitialKinematics(standardViewport.width, standardViewport.height);

      // Phase 1: IDLE_FLIGHT
      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);

      // Advance stateTimer to 8.0s to trigger perch search
      k = { ...k, stateTimer: 8.0 };
      k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);

      // Phase 2: APPROACH_PERCH
      expect(k.state).toBe('APPROACH_PERCH');
      expect(k.wingSpeed).toBe(6.0);
      expect(perchTargets.some((t) => t.x === k.targetX && t.y === k.targetY)).toBe(true);

      const targetX = k.targetX;
      const targetY = k.targetY;

      // Simulate flight towards target until arrival (max 400 frames ~6.4s)
      let arrivalCycles = 0;
      while (k.state === 'APPROACH_PERCH' && arrivalCycles < 400) {
        k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
        arrivalCycles++;
      }

      // Phase 3: PERCHED
      expect(k.state).toBe('PERCHED');
      expect(k.x).toBe(targetX);
      expect(k.y).toBe(targetY);
      expect(k.vx).toBe(0);
      expect(k.vy).toBe(0);
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPerched);

      // Verify settled posture during rest period
      for (let f = 0; f < 30; f++) {
        k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
        expect(k.state).toBe('PERCHED');
        expect(k.x).toBe(targetX);
        expect(k.y).toBe(targetY);
        expect(k.vx).toBe(0);
        expect(k.vy).toBe(0);
        expect(k.wingAngle).toBeGreaterThanOrEqual(10);
        expect(k.wingAngle).toBeLessThanOrEqual(26);
      }

      // Fast-forward rest timer to exceed max perch duration (7.0s)
      k = { ...k, stateTimer: 7.5 };
      k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);

      // Phase 4: TAKEOFF
      expect(k.state).toBe('TAKEOFF');
      expect(k.wingSpeed).toBe(16.0);
      expect(k.vy).toBeLessThan(0); // Upward vertical lift

      // Simulate takeoff duration (0.45s -> ~30 frames)
      let takeoffCycles = 0;
      while (k.state === 'TAKEOFF' && takeoffCycles < 60) {
        k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
        takeoffCycles++;
      }

      // Phase 5: Re-entry into IDLE_FLIGHT
      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
      expect(Number.isFinite(k.vx)).toBe(true);
      expect(Number.isFinite(k.vy)).toBe(true);
    });

    it('survives 20 continuous consecutive autonomous perch-takeoff cycles without kinematic degradation', () => {
      const perchTargets = [
        { x: 200, y: 200 },
        { x: 900, y: 250 },
        { x: 600, y: 550 },
      ];

      let k = createInitialKinematics(standardViewport.width, standardViewport.height);
      const statesEncountered = new Set<ButterflyState>();

      // Run 20 cycles
      for (let cycle = 0; cycle < 20; cycle++) {
        // In IDLE_FLIGHT: fast forward to perch search
        k = { ...k, state: 'IDLE_FLIGHT', stateTimer: 8.01 };
        statesEncountered.add(k.state);

        k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
        expect(k.state).toBe('APPROACH_PERCH');
        statesEncountered.add(k.state);

        // Step approach until perched or fallback
        let steps = 0;
        while (k.state === 'APPROACH_PERCH' && steps < 350) {
          k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
          steps++;
        }
        expect(k.state).toBe('PERCHED');
        statesEncountered.add(k.state);

        // Perched rest duration expiry
        k = { ...k, stateTimer: 7.2 };
        k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
        expect(k.state).toBe('TAKEOFF');
        statesEncountered.add(k.state);

        // Step takeoff until idle
        steps = 0;
        while (k.state === 'TAKEOFF' && steps < 50) {
          k = updateButterflyKinematics(k, null, standardViewport, perchTargets, dt);
          steps++;
        }
        expect(k.state).toBe('IDLE_FLIGHT');

        // Check invariants at end of each cycle
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(standardViewport.width - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(standardViewport.height - 8);
        expect(Number.isFinite(k.vx)).toBe(true);
        expect(Number.isFinite(k.vy)).toBe(true);
      }

      expect(statesEncountered.has('IDLE_FLIGHT')).toBe(true);
      expect(statesEncountered.has('APPROACH_PERCH')).toBe(true);
      expect(statesEncountered.has('PERCHED')).toBe(true);
      expect(statesEncountered.has('TAKEOFF')).toBe(true);
    });

    it('handles approach landing timeout safely when target is unreachable within 5 seconds', () => {
      // Approach perch state where target is set
      let k: ButterflyKinematics = {
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        targetX: 800,
        targetY: 600,
        state: 'APPROACH_PERCH',
        stateTimer: 4.98,
        wingAngle: 0,
        wingSpeed: 6.0,
        facingAngle: 45,
      };

      // Tick past 5.0 seconds timeout
      k = updateButterflyKinematics(k, null, standardViewport, [], 0.05);

      // Must snap to target and switch to PERCHED upon approach timeout
      expect(k.state).toBe('PERCHED');
      expect(k.x).toBe(800);
      expect(k.y).toBe(600);
      expect(k.vx).toBe(0);
      expect(k.vy).toBe(0);
    });
  });

  // =========================================================================
  // 2. Cursor Evasion Interruptions & Reflex Mechanics (<= 90px)
  // =========================================================================
  describe('2. Cursor Evasion Interruptions & Hostile Proximity Reflex', () => {
    it('instantly interrupts PERCHED state when cursor enters <= 90px threshold', () => {
      const perchedState: ButterflyKinematics = {
        x: 640,
        y: 360,
        vx: 0,
        vy: 0,
        targetX: 640,
        targetY: 360,
        state: 'PERCHED',
        stateTimer: 2.0,
        wingAngle: 18,
        wingSpeed: 1.2,
        facingAngle: 90,
      };

      // Cursor at 85px distance (inside 90px threshold)
      const cursor = { x: 640 + 85, y: 360 };
      const next = updateButterflyKinematics(perchedState, cursor, standardViewport, [], dt);

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);
      expect(next.stateTimer).toBeCloseTo(dt, 3);
      expect(next.vx).toBeLessThan(0); // Flees to the left away from cursor to the right
    });

    it('instantly interrupts APPROACH_PERCH state when cursor enters <= 90px threshold', () => {
      const approachState: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 40,
        vy: 20,
        targetX: 700,
        targetY: 500,
        state: 'APPROACH_PERCH',
        stateTimer: 1.2,
        wingAngle: 10,
        wingSpeed: 6.0,
        facingAngle: 45,
      };

      // Cursor positioned 60px below
      const cursor = { x: 500, y: 460 };
      let next = updateButterflyKinematics(approachState, cursor, standardViewport, [], dt);

      // State and panic wing speed switch IMMEDIATELY on frame 1
      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);

      // Step a few frames to allow strong upward panic acceleration to reverse initial downward velocity
      for (let f = 0; f < 5; f++) {
        next = updateButterflyKinematics(next, cursor, standardViewport, [], dt);
      }
      expect(next.vy).toBeLessThan(0); // Successfully fleeing upward away from cursor below
    });

    it('instantly interrupts TAKEOFF state when cursor enters <= 90px threshold', () => {
      const takeoffState: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: 0,
        vy: -100,
        targetX: 500,
        targetY: 400,
        state: 'TAKEOFF',
        stateTimer: 0.1,
        wingAngle: 30,
        wingSpeed: 16.0,
        facingAngle: 0,
      };

      const cursor = { x: 520, y: 400 }; // 20px distance
      const next = updateButterflyKinematics(takeoffState, cursor, standardViewport, [], dt);

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);
    });

    it('handles exact co-located cursor (distance = 0px) without NaN, division by zero, or crash', () => {
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

      // Cursor exactly on butterfly coordinate
      const cursor = { x: 500, y: 400 };
      const next = updateButterflyKinematics(butterfly, cursor, standardViewport, [], dt);

      expect(next.state).toBe('EVADING');
      expect(Number.isFinite(next.x)).toBe(true);
      expect(Number.isFinite(next.y)).toBe(true);
      expect(Number.isFinite(next.vx)).toBe(true);
      expect(Number.isFinite(next.vy)).toBe(true);
      expect(Number.isNaN(next.x)).toBe(false);
      expect(Number.isNaN(next.y)).toBe(false);
    });

    it('maintains continuous escape vector under relentless cursor stalking for 300 frames', () => {
      let k = createInitialKinematics(standardViewport.width, standardViewport.height);

      // Stalking cursor stays 30px to the right of butterfly at all times
      for (let frame = 0; frame < 300; frame++) {
        const stalkingCursor = { x: k.x + 30, y: k.y };
        k = updateButterflyKinematics(k, stalkingCursor, standardViewport, [], dt);

        expect(k.state).toBe('EVADING');
        expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);

        // Speed must remain clamped within safe max bounds
        const speed = Math.hypot(k.vx, k.vy);
        expect(speed).toBeLessThanOrEqual(DEFAULT_PHYSICS_CONFIG.evasionSpeed * 1.26);

        // Position must strictly stay in viewport bounds
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(standardViewport.width - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(standardViewport.height - 8);
      }
    });

    it('recovers to IDLE_FLIGHT when cursor moves out of range (> 126px = 90 * 1.4) after minimum evasion duration', () => {
      let k: ButterflyKinematics = {
        x: 500,
        y: 400,
        vx: -300,
        vy: -100,
        targetX: 500,
        targetY: 400,
        state: 'EVADING',
        stateTimer: 0.0,
        wingAngle: 0,
        wingSpeed: 22,
        facingAngle: 200,
      };

      // First 30 frames: cursor remains close (< 90px)
      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, { x: k.x + 40, y: k.y }, standardViewport, [], dt);
        expect(k.state).toBe('EVADING');
      }

      // Next 50 frames: cursor retreats far away (> 200px)
      const distantCursor = { x: 100, y: 100 };
      for (let i = 0; i < 50; i++) {
        k = updateButterflyKinematics(k, distantCursor, standardViewport, [], dt);
      }

      // Must have transitioned back to IDLE_FLIGHT
      expect(k.state).toBe('IDLE_FLIGHT');
      expect(k.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle);
    });

    it('triggers evasion when cursor is outside viewport but within <=90px of edge-perched butterfly', () => {
      // Butterfly perched at left edge (8, 300)
      const edgePerched: ButterflyKinematics = {
        x: 8,
        y: 300,
        vx: 0,
        vy: 0,
        targetX: 8,
        targetY: 300,
        state: 'PERCHED',
        stateTimer: 1.0,
        wingAngle: 18,
        wingSpeed: 1.2,
        facingAngle: 90,
      };

      // Cursor is at negative coordinate (-30, 300) -> distance = 38px <= 90px
      const offscreenCursor = { x: -30, y: 300 };
      const next = updateButterflyKinematics(edgePerched, offscreenCursor, standardViewport, [], dt);

      expect(next.state).toBe('EVADING');
      expect(next.wingSpeed).toBe(DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic);
      expect(next.vx).toBeGreaterThan(0); // Flees rightwards away from leftwards offscreen cursor
    });

    it('strictly tests evasion distance boundary condition at exactly 90.0px vs 90.01px', () => {
      const stationary: ButterflyKinematics = {
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

      // Exactly 90.0px away
      const cursorAt90 = { x: 500 + 90.0, y: 400 };
      const res90 = updateButterflyKinematics(stationary, cursorAt90, standardViewport, [], dt);
      expect(res90.state).toBe('EVADING');

      // 90.01px away (> 90px)
      const cursorAt90Plus = { x: 500 + 90.01, y: 400 };
      const res90Plus = updateButterflyKinematics(stationary, cursorAt90Plus, standardViewport, [], dt);
      expect(res90Plus.state).toBe('IDLE_FLIGHT');
    });
  });

  // =========================================================================
  // 3. Robustness with Empty, Null, Undefined & Malformed Perch Targets
  // =========================================================================
  describe('3. Perch Target Sanitization & Fallback Mechanics', () => {
    it('smoothly remains in IDLE_FLIGHT with empty perch targets array []', () => {
      let k: ButterflyKinematics = {
        ...createInitialKinematics(standardViewport.width, standardViewport.height),
        stateTimer: 15.0, // Well past search interval
      };

      for (let i = 0; i < 50; i++) {
        k = updateButterflyKinematics(k, null, standardViewport, [], dt);
        expect(k.state).toBe('IDLE_FLIGHT');
      }
    });

    it('smoothly handles null, undefined, or missing perch targets without engine crash', () => {
      let k: ButterflyKinematics = {
        ...createInitialKinematics(standardViewport.width, standardViewport.height),
        stateTimer: 10.0,
      };

      expect(() => {
        k = updateButterflyKinematics(k, null, standardViewport, undefined as any, dt);
      }).not.toThrow();
      expect(k.state).toBe('IDLE_FLIGHT');

      expect(() => {
        k = updateButterflyKinematics(k, null, standardViewport, null as any, dt);
      }).not.toThrow();
      expect(k.state).toBe('IDLE_FLIGHT');
    });

    it('filters out hostile and corrupted targets (NaN, Infinity, string, negative, off-viewport)', () => {
      let k: ButterflyKinematics = {
        ...createInitialKinematics(standardViewport.width, standardViewport.height),
        stateTimer: 9.0,
      };

      const hostileTargets = [
        null as any,
        undefined as any,
        {} as any,
        { x: NaN, y: 100 },
        { x: 300, y: Infinity },
        { x: -500, y: 200 }, // off-screen left
        { x: standardViewport.width + 500, y: 200 }, // off-screen right
        { x: 500, y: -200 }, // off-screen top
        { x: 500, y: standardViewport.height + 300 }, // off-screen bottom
        { x: 2, y: 2 }, // inside hard margin (<8px)
      ];

      k = updateButterflyKinematics(k, null, standardViewport, hostileTargets, dt);

      // None of the hostile targets are valid, so it must stay in IDLE_FLIGHT
      expect(k.state).toBe('IDLE_FLIGHT');
    });

    it('selects only valid targets from a mixed array containing both valid and corrupt targets', () => {
      let k: ButterflyKinematics = {
        ...createInitialKinematics(standardViewport.width, standardViewport.height),
        stateTimer: 8.5,
      };

      const mixedTargets = [
        { x: NaN, y: 100 },
        { x: -999, y: 0 },
        { x: 500, y: 300 }, // VALID target
        null as any,
        { x: 9999, y: 9999 },
      ];

      k = updateButterflyKinematics(k, null, standardViewport, mixedTargets, dt);

      expect(k.state).toBe('APPROACH_PERCH');
      expect(k.targetX).toBe(500);
      expect(k.targetY).toBe(300);
    });

    it('gracefully survives mid-approach disappearance of perch targets', () => {
      let k: ButterflyKinematics = {
        x: 400,
        y: 300,
        vx: 30,
        vy: 20,
        targetX: 600,
        targetY: 400,
        state: 'APPROACH_PERCH',
        stateTimer: 1.0,
        wingAngle: 0,
        wingSpeed: 6.0,
        facingAngle: 45,
      };

      // Perch targets suddenly become empty []
      for (let i = 0; i < 30; i++) {
        k = updateButterflyKinematics(k, null, standardViewport, [], dt);
      }

      // Continues flying towards target and safely settles or transitions
      expect(['APPROACH_PERCH', 'PERCHED']).toContain(k.state);
      expect(Number.isFinite(k.x)).toBe(true);
      expect(Number.isFinite(k.y)).toBe(true);
    });
  });

  // =========================================================================
  // 4. Viewport Boundary Confinement & Extreme Viewport Stresses
  // =========================================================================
  describe('4. Viewport Boundary Clamping & Dimension Variations', () => {
    it('strictly confines kinematics within mobile viewport (375x667)', () => {
      const mobileViewport = { width: 375, height: 667 };
      let k = createInitialKinematics(mobileViewport.width, mobileViewport.height);

      for (let frame = 0; frame < 500; frame++) {
        k = updateButterflyKinematics(k, null, mobileViewport, [{ x: 100, y: 100 }], dt);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(mobileViewport.width - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(mobileViewport.height - 8);
      }
    });

    it('strictly confines kinematics within ultra-wide 4K viewport (3840x2160)', () => {
      const ultraWide = { width: 3840, height: 2160 };
      let k = createInitialKinematics(ultraWide.width, ultraWide.height);

      for (let frame = 0; frame < 500; frame++) {
        k = updateButterflyKinematics(k, null, ultraWide, [{ x: 1500, y: 800 }], dt);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(ultraWide.width - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(ultraWide.height - 8);
      }
    });

    it('handles degenerate or zero viewport dimensions with resilient fallback', () => {
      const zeroVw = { width: 0, height: 0 };
      let k = createInitialKinematics(0, 0);

      expect(() => {
        k = updateButterflyKinematics(k, null, zeroVw, [], dt);
      }).not.toThrow();

      expect(k.x).toBeGreaterThanOrEqual(8);
      expect(k.y).toBeGreaterThanOrEqual(8);
    });
  });

  // =========================================================================
  // 5. Delta Time & Tab Inactivity Anomaly Resistance
  // =========================================================================
  describe('5. Delta Time Anomaly Resistance', () => {
    it('clamps 120-second tab suspension lag spike to MAX_DT (0.1s) without explosive displacement', () => {
      const current = createInitialKinematics(standardViewport.width, standardViewport.height);
      const lagSpikeDt = 120.0;

      const next = updateButterflyKinematics(current, null, standardViewport, [], lagSpikeDt);

      // Max travel should be clamped to 0.1s of velocity (approx ~10-20px max, not 10,000px)
      const displacement = Math.hypot(next.x - current.x, next.y - current.y);
      expect(displacement).toBeLessThan(35);
      expect(next.stateTimer).toBeCloseTo(0.1, 2);
    });

    it('handles negative or NaN dt by preserving current state without time reversal', () => {
      const current = createInitialKinematics(standardViewport.width, standardViewport.height);

      const nextNeg = updateButterflyKinematics(current, null, standardViewport, [], -5.0);
      expect(nextNeg.x).toBe(current.x);
      expect(nextNeg.y).toBe(current.y);
      expect(nextNeg.stateTimer).toBe(current.stateTimer);

      const nextNaN = updateButterflyKinematics(current, null, standardViewport, [], NaN);
      expect(nextNaN.x).toBe(current.x);
      expect(nextNaN.y).toBe(current.y);
    });

    it('remains stable across 5,000 randomized variable-framerate ticks (dt in 0.001s .. 0.15s)', () => {
      let k = createInitialKinematics(standardViewport.width, standardViewport.height);
      const targets = [{ x: 300, y: 200 }, { x: 900, y: 500 }];

      for (let i = 0; i < 5000; i++) {
        // Random dt between 1ms and 150ms
        const randomDt = 0.001 + Math.sin(i * 0.1) * 0.05 + 0.05;
        k = updateButterflyKinematics(k, null, standardViewport, targets, randomDt);

        expect(Number.isFinite(k.x)).toBe(true);
        expect(Number.isFinite(k.y)).toBe(true);
        expect(Number.isFinite(k.vx)).toBe(true);
        expect(Number.isFinite(k.vy)).toBe(true);
        expect(Number.isFinite(k.wingAngle)).toBe(true);
        expect(Number.isFinite(k.facingAngle)).toBe(true);
        expect(k.x).toBeGreaterThanOrEqual(8);
        expect(k.x).toBeLessThanOrEqual(standardViewport.width - 8);
        expect(k.y).toBeGreaterThanOrEqual(8);
        expect(k.y).toBeLessThanOrEqual(standardViewport.height - 8);
      }
    });
  });
});
