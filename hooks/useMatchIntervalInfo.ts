import { serverTimestamp } from "firebase/database"

import { MatchIntervalInfo } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: MatchIntervalInfo = {
  createdAt: serverTimestamp(),
  p1: {
    team: "Team",
    playerName: "Player1",
    score: 0,
    twitterID: "",
  },
  p2: {
    team: "Team",
    playerName: "Player2",
    score: 0,
    twitterID: "",
  },
  round: "Pools",
  matchType: "Best of 5",
  isNow: false,
  uppercase: false,
}

export const useMatchIntervalInfo = genUseDatabaseValue<MatchIntervalInfo>(
  (id) => `tournaments/${id}/matchIntervalInfo`,
  defaultValue
)

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe("useMatchIntervalInfo", () => {
    let renderHook: <T>(callback: () => T) => { result: { current: T } }

    beforeEach(async () => {
      const testingLib = await import("@testing-library/react")
      renderHook = testingLib.renderHook

      const firebaseMock = await import("../test/mocks/firebase")
      firebaseMock.resetMocks()
    })

    it("should have correct default values", () => {
      expect(defaultValue).toHaveProperty("createdAt")
      expect(defaultValue).toHaveProperty("p1")
      expect(defaultValue).toHaveProperty("p2")
      expect(defaultValue).toHaveProperty("round")
      expect(defaultValue).toHaveProperty("matchType")
      expect(defaultValue).toHaveProperty("isNow")
      expect(defaultValue).toHaveProperty("uppercase")
    })

    it("should have correct default match settings", () => {
      expect(defaultValue.round).toBe("Pools")
      expect(defaultValue.matchType).toBe("Best of 5")
      expect(defaultValue.isNow).toBe(false)
      expect(defaultValue.uppercase).toBe(false)
    })

    it("should have valid player structures", () => {
      // Player 1
      expect(defaultValue.p1).toHaveProperty("team")
      expect(defaultValue.p1).toHaveProperty("playerName")
      expect(defaultValue.p1).toHaveProperty("score")
      expect(defaultValue.p1).toHaveProperty("twitterID")

      expect(defaultValue.p1.team).toBe("Team")
      expect(defaultValue.p1.playerName).toBe("Player1")
      expect(defaultValue.p1.score).toBe(0)
      expect(defaultValue.p1.twitterID).toBe("")

      // Player 2
      expect(defaultValue.p2).toHaveProperty("team")
      expect(defaultValue.p2).toHaveProperty("playerName")
      expect(defaultValue.p2).toHaveProperty("score")
      expect(defaultValue.p2).toHaveProperty("twitterID")

      expect(defaultValue.p2.team).toBe("Team")
      expect(defaultValue.p2.playerName).toBe("Player2")
      expect(defaultValue.p2.score).toBe(0)
      expect(defaultValue.p2.twitterID).toBe("")
    })

    it("should return hook with null id", () => {
      const { result } = renderHook(() => useMatchIntervalInfo(null))

      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe("function")
      expect(result.current[2]).toBe(false) // loading should be false for null id
    })

    it("should return hook with undefined id", () => {
      const { result } = renderHook(() => useMatchIntervalInfo(undefined))

      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe("function")
      expect(result.current[2]).toBe(false)
    })

    it("should handle setValue function call", () => {
      const { result } = renderHook(() => useMatchIntervalInfo(null))

      const setValue = result.current[1]
      const newMatchInfo = {
        ...defaultValue,
        isNow: true,
        round: "Finals",
        matchType: "Best of 3",
        p1: { ...defaultValue.p1, playerName: "Winner1", score: 2 },
        p2: { ...defaultValue.p2, playerName: "Winner2", score: 1 },
      }

      // setValue should not throw with null id
      expect(() => setValue(newMatchInfo)).not.toThrow()
    })

    it("should handle different match types and rounds", () => {
      const { result } = renderHook(() => useMatchIntervalInfo(null))

      const setValue = result.current[1]
      const customMatchInfo = {
        ...defaultValue,
        round: "Grand Finals",
        matchType: "First to 10",
        isNow: true,
        uppercase: true,
      }

      expect(() => setValue(customMatchInfo)).not.toThrow()
    })

    it("should handle boolean flags correctly", () => {
      expect(typeof defaultValue.isNow).toBe("boolean")
      expect(typeof defaultValue.uppercase).toBe("boolean")
      expect(defaultValue.isNow).toBe(false)
      expect(defaultValue.uppercase).toBe(false)
    })
  })
}
