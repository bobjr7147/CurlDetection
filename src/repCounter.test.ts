import { describe, it, expect } from "vitest"
import { step, type Phase } from "./repCounter"

describe("step", () => {
  it("counts one full curl", () => {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    // Act: feed each angle through step, like the loop does per frame
    for (const angle of [170, 100, 40, 100, 170]) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }

    // Assert: the test fails if this isn't true
    expect(reps).toBe(1)
  })

  it("counts one full curl", () => {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    for (const angle of [170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25, 40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140]) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }

    // Assert: the test fails if this isn't true
    expect(reps).toBe(1)
  })
  it("counts two full curls", () => {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    for (const angle of [170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25, 40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140, 170, 165, 172, 154, 160, 120, 100, 103, 87, 92, 87, 92, 70, 40, 30, 25, 40, 45, 42, 60, 80, 90, 85, 105, 120, 111, 130, 140]) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }

    // Assert: the test fails if this isn't true
    expect(reps).toBe(2)
  })

  it("counts three full curls", () => {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    for (const angle of [180, 130, 20, 180, 20, 190, 10, 190]) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }

    // Assert: the test fails if this isn't true
    expect(reps).toBe(3)
  })

  it("half a rep", () => {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    for (const angle of [180, 130, 140]) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }

    // Assert: the test fails if this isn't true
    expect(reps).toBe(0)
  })

  it("holding still is 0 reps", () => {
    // Arrange: starting state, same as in main.ts
    let phase: Phase = "up"
    let reps = 0

    for (const angle of [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]) {
        const [newPhase, repDone] = step(phase, angle)
        phase = newPhase
        if (repDone) reps += 1
    }

    // Assert: the test fails if this isn't true
    expect(reps).toBe(0)
  })
})