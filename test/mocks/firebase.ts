import { vi } from 'vitest'

// Firebase database snapshot のモック
export const mockSnapshot = {
  val: vi.fn(() => ({})),
  exists: vi.fn(() => true),
}

// Firebase database reference のモック
export const mockRef = {
  child: vi.fn(() => mockRef),
}

// Firebase database のモック
export const mockDatabase = {
  ref: vi.fn(() => mockRef),
  get: vi.fn(() => Promise.resolve(mockSnapshot)),
  set: vi.fn(() => Promise.resolve()),
  onValue: vi.fn((ref, callback) => {
    callback(mockSnapshot)
    return () => {} // unsubscribe function
  }),
  off: vi.fn(),
}

// Firebase database functions のモック
export const mockFirebaseFunctions = {
  ref: vi.fn((db, path) => mockRef),
  get: vi.fn((ref) => Promise.resolve(mockSnapshot)),
  set: vi.fn((ref, value) => Promise.resolve()),
  onValue: vi.fn((ref, callback) => {
    callback(mockSnapshot)
    return () => {} // unsubscribe function
  }),
  off: vi.fn(),
}

// Firebase/database モジュール全体のモック
vi.mock('firebase/database', () => mockFirebaseFunctions)

// libs/firebase のモック
vi.mock('@/libs/firebase', () => ({
  db: mockDatabase,
}))

// テストヘルパー関数
export const resetMocks = () => {
  vi.clearAllMocks()
  mockSnapshot.val.mockReturnValue({})
  mockSnapshot.exists.mockReturnValue(true)
}

export const mockDatabaseValue = (value: any) => {
  mockSnapshot.val.mockReturnValue(value)
  mockSnapshot.exists.mockReturnValue(!!value)
}

export const mockDatabaseError = () => {
  mockSnapshot.exists.mockReturnValue(false)
  mockFirebaseFunctions.get.mockRejectedValue(new Error('Database error'))
}