// Phase down means the arm is lowering, phase up means the arm is raising
// A curl is complete when it has been raised and then lowered, so we count a rep when the phase changes from down to up
export type Phase = "down" | "up"
const RESTING_ANGLE = 135
const CURLED_ANGLE = 65

export function step (phase: Phase, angle: number): [Phase, boolean] {
  if (phase === "down" && angle > RESTING_ANGLE) {
    return ["up", true]
  }
  else if (phase === "up" && angle < CURLED_ANGLE) {
    return ["down", false]
  }
  else {
    return [phase, false]
  }
}