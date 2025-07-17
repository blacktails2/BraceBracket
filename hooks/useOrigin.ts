import { useEffect, useState } from "react"

export const useOrigin = () => {
  const [origin, setOrigin] = useState("")
  useEffect(() => {
    setOrigin(location.origin)
  }, [])
  return origin
}

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest
  
  describe('useOrigin', () => {
    let renderHook: (callback: () => any) => { result: { current: any } }

    beforeEach(async () => {
      const testingLib = await import('@testing-library/react')
      renderHook = testingLib.renderHook
      
      // location.originをモック
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://example.com',
        },
        writable: true,
      })
    })

    it('should return location origin', () => {
      const { result } = renderHook(() => useOrigin())
      
      // useEffectが実行されてoriginが設定されている
      expect(result.current).toBe('https://example.com')
    })

    it('should handle different origins', async () => {
      // 異なるoriginでテスト
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'http://localhost:3000',
        },
        writable: true,
      })

      const { result } = renderHook(() => useOrigin())
      
      expect(result.current).toBe('http://localhost:3000')
    })

    it('should handle empty location', async () => {
      // location.originが空の場合
      Object.defineProperty(window, 'location', {
        value: {
          origin: '',
        },
        writable: true,
      })

      const { result } = renderHook(() => useOrigin())
      
      expect(result.current).toBe('')
    })
  })
}
