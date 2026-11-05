import { describe, it, expect } from "vitest"
import { step, type Phase } from "./repCounter"

// Feeds a sequence of elbow angles through step, one per frame, the same way
// the loop in main.ts does, and returns how many reps were counted.
function countReps(angles: number[]): number {
  let phase: Phase = "up"
  let reps = 0
  for (const angle of angles) {
    const [newPhase, repDone] = step(phase, angle)
    phase = newPhase
    if (repDone) reps += 1
  }
  return reps
}

// One realistic curl with jitter: arm straight, wobbling on the way up,
// curled at the top, then back to straight.
const noisyCurl = [
  170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25,
  40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140, 170,
]

describe("step", () => {
  it("counts one clean curl", () => {
    expect(countReps([170, 100, 40, 100, 170])).toBe(1)
  })

  it("counts a noisy, realistic curl", () => {
    expect(countReps(noisyCurl)).toBe(1)
  })

  it("counts three noisy curls in a row", () => {
    expect(countReps([...noisyCurl, ...noisyCurl, ...noisyCurl])).toBe(3)
  })

  it("does not count a half rep that never reaches the top", () => {
    expect(countReps([170, 120, 80, 120, 170])).toBe(0)
  })

  it("does not count a curl that never straightens again", () => {
    expect(countReps([170, 100, 40, 100, 120])).toBe(0)
  })

  it("does not count holding still in the dead zone", () => {
    expect(countReps(Array(30).fill(100))).toBe(0)
  })

  it("does not count jitter around one threshold", () => {
    // Bouncing across the curled threshold alone must not count anything
    expect(countReps([170, 66, 64, 66, 64, 66, 64])).toBe(0)
  })

  describe("thresholds (curled < 65, resting > 135)", () => {
    it("exactly 65 does not reach the top", () => {
      expect(countReps([170, 65, 170])).toBe(0)
    })

    it("64 reaches the top", () => {
      expect(countReps([170, 64, 170])).toBe(1)
    })

    it("exactly 135 does not finish the rep", () => {
      expect(countReps([170, 40, 135])).toBe(0)
    })

    it("136 finishes the rep", () => {
      expect(countReps([170, 40, 136])).toBe(1)
    })
  })
})
