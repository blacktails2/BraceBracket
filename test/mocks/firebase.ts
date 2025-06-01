/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest'

// Firebase database snapshot のモック
export const mockSnapshot = {
  val: vi.fn(() => ({} as Record<string, unknown> | null)),
  exists: vi.fn(() => true),
}

// Firebase database reference のモック
export const mockRef: any = {
  child: vi.fn(() => mockRef),
}

// Firebase database のモック
export const mockDatabase = {
  ref: vi.fn(() => mockRef),
  get: vi.fn(() => Promise.resolve(mockSnapshot)),
  set: vi.fn(() => Promise.resolve()),
  onValue: vi.fn((ref, callback) => {
    callback(mockSnapshot)
    return () => {}
  }),
  off: vi.fn(),
}

// Firebase database functions のモック
export const mockFirebaseFunctions = {
  ref: vi.fn((_db, _path) => mockRef),
  get: vi.fn((_ref) => Promise.resolve(mockSnapshot)),
  set: vi.fn((_ref, _value) => Promise.resolve()),
  onValue: vi.fn((_ref, callback) => {
    callback(mockSnapshot)
    return () => {}
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
  mockSnapshot.val.mockReturnValue({} as Record<string, unknown>)
  mockSnapshot.exists.mockReturnValue(true)
}

export const mockDatabaseValue = (value: Record<string, unknown> | null) => {
  mockSnapshot.val.mockReturnValue(value)
  mockSnapshot.exists.mockReturnValue(!!value)
}

export const mockDatabaseError = () => {
  mockSnapshot.exists.mockReturnValue(false)
  mockFirebaseFunctions.get.mockRejectedValue(new Error('Database error'))
}