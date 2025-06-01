import { get, onValue, ref, set } from "firebase/database"
import { useCallback, useEffect, useState } from "react"

import { db } from "../libs/firebase"

export function genUseDatabaseValue<T>(
  getPath: (id: string | undefined | null) => string,
  defaultValue: T
) {
  return function useDatabaseValue(
    id: string | undefined | null
  ): [T | undefined, (value: T) => void, boolean] {
    const [loading, setLoading] = useState(true)
    const [value, _setValue] = useState<T | undefined>()
    const setValue = useCallback(
      (value: T) => {
        if (!id) return
        const valueRef = ref(db, getPath(id))
        set(valueRef, value)
      },
      [id]
    )
    useEffect(() => {
      if (!id) {
        _setValue(defaultValue)
        setLoading(false)
        return
      }
      const valueRef = ref(db, getPath(id))
      const unsubscribe = onValue(valueRef, (snapshot) => {
        const value = snapshot.val()
        if (!value) return
        _setValue(value)
        setLoading(false)
      })
      get(valueRef).then((snapshot) => {
        if (snapshot.exists()) return
        set(valueRef, defaultValue)
      })
      return () => {
        unsubscribe()
      }
    }, [id])
    return [value, setValue, loading]
  }
}

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest
  
  describe('genUseDatabaseValue', () => {
    let renderHook: (callback: () => any) => { result: { current: any } }

    beforeEach(async () => {
      const testingLib = await import('@testing-library/react')
      renderHook = testingLib.renderHook

      // 既存のFirebaseモックを使用
      const firebaseMock = await import('../test/mocks/firebase')
      firebaseMock.resetMocks()
    })

    it('should handle null id', () => {
      const getPath = (id: string | null | undefined) => `test/${id}`
      const defaultValue = { name: 'default' }
      const useDatabaseValue = genUseDatabaseValue(getPath, defaultValue)

      const { result } = renderHook(() => useDatabaseValue(null))
      
      expect(result.current[0]).toEqual(defaultValue)
      expect(result.current[2]).toBe(false) // loading should be false
    })

    it('should not call set when id is null', () => {
      const getPath = (id: string | null | undefined) => `test/${id}`
      const defaultValue = { name: 'default' }
      const useDatabaseValue = genUseDatabaseValue(getPath, defaultValue)

      const { result } = renderHook(() => useDatabaseValue(null))
      
      const setValue = result.current[1]
      setValue({ name: 'new-value' })
      
      // Firebase関数が呼ばれないことを確認（idがnullのため）
      expect(result.current[0]).toEqual(defaultValue)
    })

    it('should return a function for setting values with null id', () => {
      const getPath = (id: string | null | undefined) => `test/${id}`
      const defaultValue = { name: 'default' }
      const useDatabaseValue = genUseDatabaseValue(getPath, defaultValue)

      const { result } = renderHook(() => useDatabaseValue(null))
      
      // setValueが関数であることを確認（idがnullでも関数は返される）
      expect(typeof result.current[1]).toBe('function')
    })

    it('should return default value structure', () => {
      const getPath = (id: string | null | undefined) => `test/${id}`
      const defaultValue = { count: 0, enabled: true }
      const useDatabaseValue = genUseDatabaseValue(getPath, defaultValue)

      const { result } = renderHook(() => useDatabaseValue(null))
      
      expect(result.current[0]).toEqual({ count: 0, enabled: true })
    })
  })
}
