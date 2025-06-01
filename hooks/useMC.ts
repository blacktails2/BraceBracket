import { serverTimestamp } from "firebase/database"

import { MC } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: MC = {
  createdAt: serverTimestamp(),
  mcList: [
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
  ],
}

export const useMC = genUseDatabaseValue<MC>(
  (id) => `tournaments/${id}/mc`,
  defaultValue
)

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe("useMC", () => {
    let renderHook: <T>(callback: () => T) => { result: { current: T } }

    beforeEach(async () => {
      const testingLib = await import("@testing-library/react")
      renderHook = testingLib.renderHook

      const firebaseMock = await import("../test/mocks/firebase")
      firebaseMock.resetMocks()
    })

    it("should have correct default structure", () => {
      expect(defaultValue).toHaveProperty("createdAt")
      expect(defaultValue).toHaveProperty("mcList")
      expect(Array.isArray(defaultValue.mcList)).toBe(true)
      expect(defaultValue.mcList).toHaveLength(4)
    })

    it("should have valid MC list structure", () => {
      defaultValue.mcList.forEach((mc) => {
        expect(mc).toHaveProperty("team")
        expect(mc).toHaveProperty("playerName")
        expect(mc).toHaveProperty("twitterID")
        expect(mc).toHaveProperty("score")

        expect(typeof mc.team).toBe("string")
        expect(typeof mc.playerName).toBe("string")
        expect(typeof mc.twitterID).toBe("string")
        expect(typeof mc.score).toBe("number")

        // Default values should be empty strings and 0
        expect(mc.team).toBe("")
        expect(mc.playerName).toBe("")
        expect(mc.twitterID).toBe("")
        expect(mc.score).toBe(0)
      })
    })

    it("should return hook with null id", () => {
      const { result } = renderHook(() => useMC(null))

      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe("function")
      expect(result.current[2]).toBe(false) // loading should be false for null id
    })

    it("should return hook with undefined id", () => {
      const { result } = renderHook(() => useMC(undefined))

      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe("function")
      expect(result.current[2]).toBe(false)
    })

    it("should handle setValue function call", () => {
      const { result } = renderHook(() => useMC(null))

      const setValue = result.current[1]
      const newMC = {
        ...defaultValue,
        mcList: [
          {
            team: "Team1",
            playerName: "Player1",
            twitterID: "@player1",
            score: 1,
          },
          {
            team: "Team2",
            playerName: "Player2",
            twitterID: "@player2",
            score: 2,
          },
          { team: "", playerName: "", twitterID: "", score: 0 },
          { team: "", playerName: "", twitterID: "", score: 0 },
        ],
      }

      // setValue should not throw with null id
      expect(() => setValue(newMC)).not.toThrow()
    })

    it("should support empty MC list", () => {
      const { result } = renderHook(() => useMC(null))

      const setValue = result.current[1]
      const emptyMC = {
        ...defaultValue,
        mcList: [],
      }

      expect(() => setValue(emptyMC)).not.toThrow()
    })

    it("should support MC list with different lengths", () => {
      const { result } = renderHook(() => useMC(null))

      const setValue = result.current[1]
      const customMC = {
        ...defaultValue,
        mcList: [
          {
            team: "SingleTeam",
            playerName: "SinglePlayer",
            twitterID: "@single",
            score: 5,
          },
        ],
      }

      expect(() => setValue(customMC)).not.toThrow()
    })
  })
}
