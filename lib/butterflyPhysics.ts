/**
 * Pure Kinematics & State Automaton for Interactive Accent Butterfly
 *
 * Implements 5-state discrete flight automaton:
 * - IDLE_FLIGHT: Organic sinusoidal wandering curves within viewport.
 * - APPROACH_PERCH: Critically-damped steering toward selected anchor point.
 * - PERCHED: Settled rest with gentle breathing wing flutter.
 * - EVADING: High-acceleration escape impulse away from mouse cursor.
 * - TAKEOFF: Upward vertical thrust transitioning back to cruise flight.
 */

export type ButterflyState =
  | 'IDLE_FLIGHT'
  | 'APPROACH_PERCH'
  | 'PERCHED'
  | 'EVADING'
  | 'TAKEOFF';

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
  minSpeed: number; // Cruise minimum speed in px/s (e.g. 60)
  maxSpeed: number; // Cruise maximum speed in px/s (e.g. 180)
  evasionSpeed: number; // Escape sprint speed in px/s (e.g. 480)
  evasionDistance: number; // Proximity trigger radius in px (e.g. 90)
  perchDurationMin: number; // Minimum resting duration in seconds (e.g. 3.0)
  perchDurationMax: number; // Maximum resting duration in seconds (e.g. 7.0)
  flutterFrequencyIdle: number; // Wing flap rate in Hz during cruise (e.g. 10)
  flutterFrequencyPerched: number; // Wing flap rate in Hz while perched (e.g. 1.2)
  flutterFrequencyPanic: number; // Wing flap rate in Hz during evasion (e.g. 22)
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  minSpeed: 60,
  maxSpeed: 180,
  evasionSpeed: 480,
  evasionDistance: 90,
  perchDurationMin: 3.0,
  perchDurationMax: 7.0,
  flutterFrequencyIdle: 3.2,
  flutterFrequencyPerched: 0.65,
  flutterFrequencyPanic: 8.0,
};

// Physics constants
const MAX_DT = 0.1; // Max delta time allowed per tick (clamps frame spikes)
const BOUNDARY_MARGIN = 70; // Distance in px from edge where soft repulsion activates
const BOUNDARY_FORCE = 650; // Acceleration magnitude for soft wall repulsion (px/s^2)
const DRAG_COEFFICIENT = 1.6; // Air resistance damping coefficient
const HARD_MARGIN = 8; // Absolute minimum distance from viewport edge
const EVASION_MIN_DURATION = 0.65; // Minimum time in seconds to stay in EVADING state
const TAKEOFF_DURATION = 0.45; // Takeoff thrust duration in seconds
const IDLE_SEARCH_PERCH_INTERVAL = 8.0; // Time in IDLE_FLIGHT before seeking perch target

/**
 * Creates initial kinematics state at the center of the given viewport.
 */
export function createInitialKinematics(
  viewportWidth: number,
  viewportHeight: number
): ButterflyKinematics {
  const safeW = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : 1024;
  const safeH = Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 768;

  const x = Math.max(HARD_MARGIN, Math.min(safeW - HARD_MARGIN, safeW * 0.5));
  const y = Math.max(HARD_MARGIN, Math.min(safeH - HARD_MARGIN, safeH * 0.4));

  // Initial gentle drift heading right-up
  const initialVx = 80;
  const initialVy = -60;
  const facingAngle = (Math.atan2(initialVy, initialVx) * 180) / Math.PI + 90;

  return {
    x,
    y,
    vx: initialVx,
    vy: initialVy,
    targetX: x,
    targetY: y,
    state: 'IDLE_FLIGHT',
    stateTimer: 0,
    wingAngle: 0,
    wingSpeed: DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle,
    facingAngle,
  };
}

/**
 * Helper to compute Euclidean distance between two 2D points.
 */
function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalizes an angle difference to [-180, 180] degrees.
 */
function normalizeAngleDiff(diff: number): number {
  let normalized = diff % 360;
  if (normalized > 180) normalized -= 360;
  if (normalized < -180) normalized += 360;
  return normalized;
}

/**
 * Updates kinematics for a single simulation tick.
 * Pure function: does not mutate `current` input.
 */
export function updateButterflyKinematics(
  current: ButterflyKinematics,
  cursor: { x: number; y: number } | null,
  viewport: { width: number; height: number },
  perchTargets: Array<{ x: number; y: number }> = [],
  dt: number,
  config?: Partial<PhysicsConfig>
): ButterflyKinematics {
  // Merge user config with defaults
  const cfg: PhysicsConfig = {
    minSpeed: config?.minSpeed ?? DEFAULT_PHYSICS_CONFIG.minSpeed,
    maxSpeed: config?.maxSpeed ?? DEFAULT_PHYSICS_CONFIG.maxSpeed,
    evasionSpeed: config?.evasionSpeed ?? DEFAULT_PHYSICS_CONFIG.evasionSpeed,
    evasionDistance: config?.evasionDistance ?? DEFAULT_PHYSICS_CONFIG.evasionDistance,
    perchDurationMin: config?.perchDurationMin ?? DEFAULT_PHYSICS_CONFIG.perchDurationMin,
    perchDurationMax: config?.perchDurationMax ?? DEFAULT_PHYSICS_CONFIG.perchDurationMax,
    flutterFrequencyIdle: config?.flutterFrequencyIdle ?? DEFAULT_PHYSICS_CONFIG.flutterFrequencyIdle,
    flutterFrequencyPerched: config?.flutterFrequencyPerched ?? DEFAULT_PHYSICS_CONFIG.flutterFrequencyPerched,
    flutterFrequencyPanic: config?.flutterFrequencyPanic ?? DEFAULT_PHYSICS_CONFIG.flutterFrequencyPanic,
  };

  // Clamp and validate delta time (prevent physics explosion on tab-lag)
  const safeDt = Math.max(0, Math.min(Number.isFinite(dt) ? dt : 0, MAX_DT));
  if (safeDt === 0) {
    return { ...current };
  }

  // Sanitize viewport dimensions
  const vw = Number.isFinite(viewport?.width) && viewport.width > 0 ? viewport.width : 1024;
  const vh = Number.isFinite(viewport?.height) && viewport.height > 0 ? viewport.height : 768;

  // Sanitize current state coordinates
  let x = Number.isFinite(current.x) ? current.x : vw * 0.5;
  let y = Number.isFinite(current.y) ? current.y : vh * 0.5;
  let vx = Number.isFinite(current.vx) ? current.vx : 0;
  let vy = Number.isFinite(current.vy) ? current.vy : 0;
  let targetX = Number.isFinite(current.targetX) ? current.targetX : x;
  let targetY = Number.isFinite(current.targetY) ? current.targetY : y;
  let state: ButterflyState = current.state || 'IDLE_FLIGHT';
  let stateTimer = Number.isFinite(current.stateTimer) ? current.stateTimer + safeDt : safeDt;
  let wingSpeed = cfg.flutterFrequencyIdle;
  let facingAngle = Number.isFinite(current.facingAngle) ? current.facingAngle : 0;

  // Check cursor proximity for evasion trigger
  const hasValidCursor =
    cursor !== null &&
    typeof cursor === 'object' &&
    Number.isFinite(cursor.x) &&
    Number.isFinite(cursor.y);

  let cursorDist = Infinity;
  if (hasValidCursor) {
    cursorDist = distance(x, y, cursor.x, cursor.y);
  }

  const cursorInEvasionRange = hasValidCursor && cursorDist <= cfg.evasionDistance;

  // ==========================================
  // 1. STATE TRANSITIONS & TIMER UPDATES
  // ==========================================

  // Evasion Interrupt: If cursor breaches evasion threshold, immediately trigger EVADING
  if (cursorInEvasionRange && state !== 'EVADING') {
    state = 'EVADING';
    stateTimer = safeDt;
  } else {
    // Normal state transitions
    switch (state) {
      case 'EVADING': {
        if (stateTimer >= EVASION_MIN_DURATION && (!hasValidCursor || cursorDist > cfg.evasionDistance * 1.4)) {
          state = 'IDLE_FLIGHT';
          stateTimer = safeDt;
        }
        break;
      }

      case 'IDLE_FLIGHT': {
        if (stateTimer >= IDLE_SEARCH_PERCH_INTERVAL && Array.isArray(perchTargets) && perchTargets.length > 0) {
          const validTargets = perchTargets.filter(
            (t) =>
              t &&
              Number.isFinite(t.x) &&
              Number.isFinite(t.y) &&
              t.x >= HARD_MARGIN &&
              t.x <= vw - HARD_MARGIN &&
              t.y >= HARD_MARGIN &&
              t.y <= vh - HARD_MARGIN
          );

          if (validTargets.length > 0) {
            const targetIndex = Math.floor(Math.abs(Math.sin(stateTimer * 100)) * validTargets.length) % validTargets.length;
            const chosen = validTargets[targetIndex];
            targetX = chosen.x;
            targetY = chosen.y;
            state = 'APPROACH_PERCH';
            stateTimer = safeDt;
          }
        }
        break;
      }

      case 'APPROACH_PERCH': {
        const distToTarget = distance(x, y, targetX, targetY);
        const currentSpeed = Math.hypot(vx, vy);

        // Arrival threshold: close to spot and decelerated, or landing timeout (5s)
        if ((distToTarget <= 8 && currentSpeed <= 45) || distToTarget <= 4 || stateTimer >= 5.0) {
          x = targetX;
          y = targetY;
          vx = 0;
          vy = 0;
          state = 'PERCHED';
          stateTimer = safeDt;
        }
        break;
      }

      case 'PERCHED': {
        vx = 0;
        vy = 0;
        x = targetX;
        y = targetY;

        const restSeed = Math.abs(Math.sin(targetX * 12.9898 + targetY * 78.233));
        const restDuration = cfg.perchDurationMin + restSeed * (cfg.perchDurationMax - cfg.perchDurationMin);

        if (stateTimer >= restDuration) {
          state = 'TAKEOFF';
          stateTimer = safeDt;
        }
        break;
      }

      case 'TAKEOFF': {
        if (stateTimer >= TAKEOFF_DURATION) {
          state = 'IDLE_FLIGHT';
          stateTimer = safeDt;
        }
        break;
      }
    }
  }

  // Set wing flap rate according to resolved state
  switch (state) {
    case 'PERCHED':
      wingSpeed = cfg.flutterFrequencyPerched;
      break;
    case 'EVADING':
      wingSpeed = cfg.flutterFrequencyPanic;
      break;
    case 'APPROACH_PERCH':
      wingSpeed = 6.0;
      break;
    case 'TAKEOFF':
      wingSpeed = 16.0;
      break;
    case 'IDLE_FLIGHT':
    default:
      wingSpeed = cfg.flutterFrequencyIdle;
      break;
  }

  // ==========================================
  // 2. FORCES & ACCELERATION CALCULATION
  // ==========================================

  let ax = 0;
  let ay = 0;

  if (state === 'EVADING') {
    // High-panic impulse away from cursor
    if (hasValidCursor && cursorDist > 0.0001) {
      const dx = x - cursor.x;
      const dy = y - cursor.y;
      const invDist = 1 / Math.max(cursorDist, 1);
      let escapeDirX = dx * invDist;
      let escapeDirY = dy * invDist;

      // Add lateral jitter to make escape trajectory organic
      const jitterAngle = Math.sin(stateTimer * 20) * 0.45;
      const cosJ = Math.cos(jitterAngle);
      const sinJ = Math.sin(jitterAngle);
      const jitteredX = escapeDirX * cosJ - escapeDirY * sinJ;
      const jitteredY = escapeDirX * sinJ + escapeDirY * cosJ;

      // Panic force scales inversely with distance
      const panicRatio = Math.max(0, 1 - cursorDist / cfg.evasionDistance);
      const panicForce = cfg.evasionSpeed * (1.2 + panicRatio * 1.5);

      ax += jitteredX * panicForce;
      ay += jitteredY * panicForce;
    } else {
      // If cursor disappeared while evading, push forward at evasion speed
      const currentSpeed = Math.hypot(vx, vy) || 1;
      ax += (vx / currentSpeed) * cfg.evasionSpeed;
      ay += (vy / currentSpeed) * cfg.evasionSpeed;
    }
  } else if (state === 'IDLE_FLIGHT') {
    // Multi-harmonic organic sinusoidal wandering forces
    const wanderHarmonic1 = Math.sin(stateTimer * 1.4 + x * 0.005);
    const wanderHarmonic2 = Math.cos(stateTimer * 2.8 + y * 0.005);
    const wanderHarmonic3 = Math.sin(stateTimer * 0.6);

    const wanderSteerAngle = wanderHarmonic1 * 1.8 + wanderHarmonic2 * 0.9 + wanderHarmonic3 * 0.5;
    const wanderForceMagnitude = 110;

    ax += Math.cos(wanderSteerAngle) * wanderForceMagnitude;
    ay += Math.sin(wanderSteerAngle) * wanderForceMagnitude;
  } else if (state === 'APPROACH_PERCH') {
    // Critically-damped arrival steering toward target spot
    const tdx = targetX - x;
    const tdy = targetY - y;
    const tDist = Math.sqrt(tdx * tdx + tdy * tdy);

    if (tDist > 0.001) {
      const approachSpeed = Math.min(cfg.maxSpeed, Math.max(25, tDist * 1.8));
      const targetVx = (tdx / tDist) * approachSpeed;
      const targetVy = (tdy / tDist) * approachSpeed;

      // Proportional steering acceleration
      ax += (targetVx - vx) * 4.5;
      ay += (targetVy - vy) * 4.5;
    }
  } else if (state === 'TAKEOFF') {
    // Strong upward thrust and forward boost away from perch
    const takeoffThrustY = -240; // Negative Y is upward
    const takeoffThrustX = vx !== 0 ? Math.sign(vx) * 120 : (Math.sin(stateTimer * 10) > 0 ? 120 : -120);

    ax += takeoffThrustX;
    ay += takeoffThrustY;
  }

  // ==========================================
  // 3. BOUNDARY REPULSION FIELD
  // ==========================================

  // Soft repulsive potential field near viewport edges
  if (state !== 'PERCHED') {
    // Left boundary
    if (x < BOUNDARY_MARGIN) {
      const depth = (BOUNDARY_MARGIN - x) / BOUNDARY_MARGIN;
      ax += depth * depth * BOUNDARY_FORCE;
    }
    // Right boundary
    if (x > vw - BOUNDARY_MARGIN) {
      const depth = (x - (vw - BOUNDARY_MARGIN)) / BOUNDARY_MARGIN;
      ax -= depth * depth * BOUNDARY_FORCE;
    }
    // Top boundary
    if (y < BOUNDARY_MARGIN) {
      const depth = (BOUNDARY_MARGIN - y) / BOUNDARY_MARGIN;
      ay += depth * depth * BOUNDARY_FORCE;
    }
    // Bottom boundary
    if (y > vh - BOUNDARY_MARGIN) {
      const depth = (y - (vh - BOUNDARY_MARGIN)) / BOUNDARY_MARGIN;
      ay -= depth * depth * BOUNDARY_FORCE;
    }
  }

  // ==========================================
  // 4. KINEMATIC INTEGRATION
  // ==========================================

  if (state !== 'PERCHED') {
    // Apply aerodynamic drag
    const damping = Math.max(0, 1 - DRAG_COEFFICIENT * safeDt);
    vx = vx * damping + ax * safeDt;
    vy = vy * damping + ay * safeDt;

    // Speed clamping based on active state
    const speed = Math.hypot(vx, vy);
    if (state === 'EVADING') {
      const maxEvade = cfg.evasionSpeed * 1.25;
      if (speed > maxEvade) {
        vx = (vx / speed) * maxEvade;
        vy = (vy / speed) * maxEvade;
      }
    } else if (state === 'IDLE_FLIGHT') {
      if (speed > cfg.maxSpeed) {
        vx = (vx / speed) * cfg.maxSpeed;
        vy = (vy / speed) * cfg.maxSpeed;
      } else if (speed < cfg.minSpeed && speed > 0.001) {
        vx = (vx / speed) * cfg.minSpeed;
        vy = (vy / speed) * cfg.minSpeed;
      } else if (speed <= 0.001) {
        vx = cfg.minSpeed * 0.7;
        vy = -cfg.minSpeed * 0.7;
      }
    }

    // Integrate position
    x += vx * safeDt;
    y += vy * safeDt;

    // Hard boundary containment with velocity bounce dampening
    if (x < HARD_MARGIN) {
      x = HARD_MARGIN;
      if (vx < 0) vx = -vx * 0.4;
    } else if (x > vw - HARD_MARGIN) {
      x = vw - HARD_MARGIN;
      if (vx > 0) vx = -vx * 0.4;
    }

    if (y < HARD_MARGIN) {
      y = HARD_MARGIN;
      if (vy < 0) vy = -vy * 0.4;
    } else if (y > vh - HARD_MARGIN) {
      y = vh - HARD_MARGIN;
      if (vy > 0) vy = -vy * 0.4;
    }

    // Smooth heading angle rotation (facing velocity direction)
    const currentSpeed = Math.hypot(vx, vy);
    if (currentSpeed > 2) {
      const targetHeading = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
      const angleDiff = normalizeAngleDiff(targetHeading - facingAngle);
      facingAngle += angleDiff * Math.min(1, 12 * safeDt);
    }
  }

  // ==========================================
  // 5. 3D WING OSCILLATION ANGLE
  // ==========================================

  let wingAngle = 0;
  switch (state) {
    case 'PERCHED':
      // Gentle breathing flutter with calm semi-folded posture (9deg - 19deg)
      wingAngle = 14 + Math.sin(stateTimer * cfg.flutterFrequencyPerched * 2 * Math.PI) * 5;
      break;
    case 'EVADING':
      // Swift panic flapping during cursor evasion (up to 60deg at 8.0Hz)
      wingAngle = Math.sin(stateTimer * cfg.flutterFrequencyPanic * 2 * Math.PI) * 60;
      break;
    case 'APPROACH_PERCH':
      // Very soft braking glide
      wingAngle = Math.sin(stateTimer * 2.2 * 2 * Math.PI) * 35;
      break;
    case 'TAKEOFF':
      // Gentle takeoff strokes
      wingAngle = Math.sin(stateTimer * 5.0 * 2 * Math.PI) * 50;
      break;
    case 'IDLE_FLIGHT':
    default:
      // Soft, graceful cruise flapping (45deg amplitude at ~3.2Hz)
      wingAngle = Math.sin(stateTimer * cfg.flutterFrequencyIdle * 2 * Math.PI) * 45;
      break;
  }

  return {
    x,
    y,
    vx,
    vy,
    targetX,
    targetY,
    state,
    stateTimer,
    wingAngle,
    wingSpeed,
    facingAngle,
  };
}
