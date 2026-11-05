import { describe, it, expect } from "vitest"
import { step, type Phase } from "./repCounter"


function countReps(angles: number[]) {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    // Act: feed each angle through step, like the loop does per frame
    for (const angle of angles) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }
    return reps
}

describe("step", () => {
  it("counts one full curl simple", () => {
    const reps = countReps([170, 100, 40, 100, 170])

    // Assert: the test fails if this isn't true
    expect(reps).toBe(1)
  })

  it("counts one full curl complex", () => {
    const reps = countReps([170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25, 40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140])

    // Assert: the test fails if this isn't true
    expect(reps).toBe(1)
  })


  it("counts two full curls", () => {
    const reps = countReps([170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25, 40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140, 170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25, 40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140])

    // Assert: the test fails if this isn't true
    expect(reps).toBe(2)
  })

  it("counts three full curls", () => {
    const reps = countReps([180, 130, 20, 180, 20, 172, 10, 172])

    // Assert: the test fails if this isn't true
    expect(reps).toBe(3)
  })

  it("half a rep", () => {
    const reps = countReps([180, 130, 140])

    // Assert: the test fails if this isn't true
    expect(reps).toBe(0)
  })
  
  it("holding still is 0 reps", () => {
    const reps = countReps([100, 100, 100, 100, 100, 100, 100, 100, 100, 100])

    // Assert: the test fails if this isn't true
    expect(reps).toBe(0)
  })
})