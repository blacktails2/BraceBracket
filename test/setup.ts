// eslint-disable-next-line import/no-unresolved
import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock Firebase for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRef: any = {
  child: vi.fn(),
}
mockRef.child.mockReturnValue(mockRef)

const mockDatabase = {
  ref: vi.fn(() => mockRef),
  get: vi.fn(() => Promise.resolve(mockSnapshot)),
  set: vi.fn(() => Promise.resolve()),
  onValue: vi.fn((ref, callback) => {
    callback(mockSnapshot)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {} // unsubscribe function
  }),
  off: vi.fn(),
}

const mockSnapshot = {
  val: vi.fn(() => ({})),
  exists: vi.fn(() => true),
}

// Mock modules
vi.mock("../libs/firebase", () => ({
  database: mockDatabase,
}))

// Mock window.matchMedia for testing
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
