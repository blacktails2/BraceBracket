export default function deepCopy<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

// In-Source Tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe("deepCopy", () => {
    it("should create a deep copy of a simple object", () => {
      const original = { a: 1, b: 2 }
      const copied = deepCopy(original)

      expect(copied).toEqual(original)
      expect(copied).not.toBe(original)
    })

    it("should create a deep copy of nested objects", () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: { e: 3 },
        },
      }
      const copied = deepCopy(original)

      expect(copied).toEqual(original)
      expect(copied).not.toBe(original)
      expect(copied.b).not.toBe(original.b)
      expect(copied.b.d).not.toBe(original.b.d)
    })

    it("should create a deep copy of arrays", () => {
      const original = [1, 2, [3, 4, [5, 6]]]
      const copied = deepCopy(original)

      expect(copied).toEqual(original)
      expect(copied).not.toBe(original)
      expect(copied[2]).not.toBe(original[2])
      expect((copied[2] as number[])[2]).not.toBe((original[2] as number[])[2])
    })

    it("should handle primitive values", () => {
      expect(deepCopy(42)).toBe(42)
      expect(deepCopy("hello")).toBe("hello")
      expect(deepCopy(true)).toBe(true)
      expect(deepCopy(null)).toBe(null)
    })

    it("should handle complex mixed data structures", () => {
      const original = {
        name: "test",
        numbers: [1, 2, 3],
        nested: {
          array: [{ id: 1 }, { id: 2 }],
          value: "nested",
        },
      }
      const copied = deepCopy(original)

      expect(copied).toEqual(original)
      expect(copied).not.toBe(original)
      expect(copied.numbers).not.toBe(original.numbers)
      expect(copied.nested).not.toBe(original.nested)
      expect(copied.nested.array).not.toBe(original.nested.array)
      expect(copied.nested.array[0]).not.toBe(original.nested.array[0])
    })

    it("should maintain type information", () => {
      interface TestInterface {
        id: number
        name: string
        items: string[]
      }

      const original: TestInterface = {
        id: 1,
        name: "test",
        items: ["a", "b", "c"],
      }

      const copied = deepCopy(original)
      expect(copied).toEqual(original)
      expect(typeof copied.id).toBe("number")
      expect(typeof copied.name).toBe("string")
      expect(Array.isArray(copied.items)).toBe(true)
    })
  })
}
