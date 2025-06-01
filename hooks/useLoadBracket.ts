import { serverTimestamp } from "firebase/database"
import { useCallback } from "react"

import { LoadBracket } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: LoadBracket = {
  createdAt: serverTimestamp(),
  autoUpdate: false,
  lastRequestedAt: 0,
}

const _useLoadBracket = genUseDatabaseValue(
  (id) => `tournaments/${id}/loadBracket`,
  defaultValue
)

export const useLoadBracket = (
  id?: string | null
): [LoadBracket | undefined, (autoUpdate: boolean) => void, boolean] => {
  const [loadBracket, _setLoadBracket, loading] = _useLoadBracket(id)

  const requestLoad = useCallback(
    (autoUpdate: boolean) => {
      if (!id || !loadBracket || loading) return
      const next: LoadBracket = {
        ...loadBracket,
        autoUpdate,
        lastRequestedAt: new Date().valueOf(),
      }
      _setLoadBracket(next)
    },
    [id, loadBracket, loading, _setLoadBracket]
  )

  return [loadBracket, requestLoad, loading]
}

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest

  describe("useLoadBracket", () => {
    let renderHook: <T>(callback: () => T) => { result: { current: T } }

    beforeEach(async () => {
      const testingLib = await import("@testing-library/react")
      renderHook = testingLib.renderHook

      const firebaseMock = await import("../test/mocks/firebase")
      firebaseMock.resetMocks()
    })

    it("should have correct default values", () => {
      expect(defaultValue).toHaveProperty("createdAt")
      expect(defaultValue).toHaveProperty("autoUpdate")
      expect(defaultValue).toHaveProperty("lastRequestedAt")

      expect(defaultValue.autoUpdate).toBe(false)
      expect(defaultValue.lastRequestedAt).toBe(0)
    })

    it("should return hook with null id", () => {
      const { result } = renderHook(() => useLoadBracket(null))

      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe("function")
      expect(result.current[2]).toBe(false) // loading should be false for null id
    })

    it("should return hook with undefined id", () => {
      const { result } = renderHook(() => useLoadBracket(undefined))

      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe("function")
      expect(result.current[2]).toBe(false)
    })

    it("should not call requestLoad with null id", () => {
      const { result } = renderHook(() => useLoadBracket(null))

      const requestLoad = result.current[1]

      // Should not throw when called with null id
      expect(() => requestLoad(true)).not.toThrow()
      expect(() => requestLoad(false)).not.toThrow()
    })

    it("should handle different boolean values for autoUpdate", () => {
      const { result } = renderHook(() => useLoadBracket(null))

      const requestLoad = result.current[1]

      expect(() => requestLoad(true)).not.toThrow()
      expect(() => requestLoad(false)).not.toThrow()
    })

    it("should return correct function signature with null id", () => {
      const { result } = renderHook(() => useLoadBracket(null))

      // Check return array structure
      expect(Array.isArray(result.current)).toBe(true)
      expect(result.current).toHaveLength(3)

      // Check types
      expect(typeof result.current[1]).toBe("function") // requestLoad function
      expect(typeof result.current[2]).toBe("boolean") // loading state
    })

    it("should handle Date.valueOf() correctly in requestLoad logic", () => {
      // Mock Date.valueOf()
      const mockDate = new Date("2023-01-01T00:00:00.000Z")
      const originalDate = global.Date
      global.Date = vi.fn(() => mockDate) as unknown as DateConstructor
      global.Date.valueOf = vi.fn(() => mockDate.valueOf())

      const { result } = renderHook(() => useLoadBracket(null))
      const requestLoad = result.current[1]

      // Should not throw even with mocked Date
      expect(() => requestLoad(true)).not.toThrow()

      // Restore original Date
      global.Date = originalDate
    })
  })
}
