import { serverTimestamp } from "firebase/database"

import { Score } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

export const defaultValue: Score = {
  createdAt: serverTimestamp(),
  matchType: "Best of 3",
  p1: {
    playerName: "P1 Name",
    score: 0,
    team: "P1 Team",
    twitterID: "",
  },
  p2: {
    playerName: "P2 Name",
    score: 0,
    team: "P2 Team",
    twitterID: "",
  },
  round: "Pools",
  uppercase: false,
}

export const useScore = genUseDatabaseValue<Score>(
  (id) => `tournaments/${id}/score`,
  defaultValue
)

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe('useScore', () => {
    let renderHook: (callback: () => any) => { result: { current: any } }

    beforeEach(async () => {
      const testingLib = await import('@testing-library/react')
      renderHook = testingLib.renderHook

      const firebaseMock = await import('../test/mocks/firebase')
      firebaseMock.resetMocks()
    })

    it('should have correct default values', () => {
      expect(defaultValue.matchType).toBe('Best of 3')
      expect(defaultValue.p1.playerName).toBe('P1 Name')
      expect(defaultValue.p2.playerName).toBe('P2 Name')
      expect(defaultValue.p1.score).toBe(0)
      expect(defaultValue.p2.score).toBe(0)
      expect(defaultValue.round).toBe('Pools')
      expect(defaultValue.uppercase).toBe(false)
    })

    it('should have valid player structure', () => {
      expect(defaultValue.p1).toHaveProperty('playerName')
      expect(defaultValue.p1).toHaveProperty('score')
      expect(defaultValue.p1).toHaveProperty('team')
      expect(defaultValue.p1).toHaveProperty('twitterID')
      
      expect(defaultValue.p2).toHaveProperty('playerName')
      expect(defaultValue.p2).toHaveProperty('score')
      expect(defaultValue.p2).toHaveProperty('team')
      expect(defaultValue.p2).toHaveProperty('twitterID')
    })

    it('should return hook with null id', () => {
      const { result } = renderHook(() => useScore(null))
      
      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe('function')
      expect(result.current[2]).toBe(false) // loading should be false for null id
    })

    it('should return hook with undefined id', () => {
      const { result } = renderHook(() => useScore(undefined))
      
      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe('function')
      expect(result.current[2]).toBe(false)
    })

    it('should handle setValue function call with null id', () => {
      const { result } = renderHook(() => useScore(null))
      
      const setValue = result.current[1]
      const newScore = {
        ...defaultValue,
        p1: { ...defaultValue.p1, score: 1 }
      }
      
      // setValue should not throw with null id
      expect(() => setValue(newScore)).not.toThrow()
    })

    it('should return setValue function', () => {
      const { result } = renderHook(() => useScore(null))
      
      // useScoreが正しいsetValue関数を返すことを確認
      expect(typeof result.current[1]).toBe('function')
    })
  })
}
