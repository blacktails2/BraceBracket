import { serverTimestamp } from "firebase/database"

import { ScoreboardColorsMap, Setting } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

export const defaultValue: Setting = {
  createdAt: serverTimestamp(),
  name: "",
  scoreboard: {
    design: {
      layout: "dual",
      color: ScoreboardColorsMap["dual"][0],
    },
    cameraAndLogo: {
      displayCameraAndTwitterID: false,
      useLogo: false,
      dropShadow: "none",
      logoURLs: [],
    },
  },
  integrateStartGG: {
    enabled: false,
    url: "",
  },
  tweetMatch: {
    enabled: false,
    template: `{{round}}
{{p1.team}} {{p1.playerName}} {{p1.twitterID}} vs {{p2.team}} {{p2.playerName}} {{p2.twitterID}}
（配信プラットフォームのURLなど）`,
  },
}

export const useSetting = genUseDatabaseValue<Setting>(
  (id) => `tournaments/${id}/setting`,
  defaultValue
)

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest

  describe('useSetting', () => {
    let renderHook: (callback: () => any) => { result: { current: any } }

    beforeEach(async () => {
      const testingLib = await import('@testing-library/react')
      renderHook = testingLib.renderHook

      const firebaseMock = await import('../test/mocks/firebase')
      firebaseMock.resetMocks()
    })

    it('should have correct default structure', () => {
      expect(defaultValue).toHaveProperty('createdAt')
      expect(defaultValue).toHaveProperty('name')
      expect(defaultValue).toHaveProperty('scoreboard')
      expect(defaultValue).toHaveProperty('integrateStartGG')
      expect(defaultValue).toHaveProperty('tweetMatch')
    })

    it('should have correct default values', () => {
      expect(defaultValue.name).toBe('')
      expect(defaultValue.integrateStartGG.enabled).toBe(false)
      expect(defaultValue.integrateStartGG.url).toBe('')
      expect(defaultValue.tweetMatch.enabled).toBe(false)
    })

    it('should have valid scoreboard structure', () => {
      expect(defaultValue.scoreboard).toHaveProperty('design')
      expect(defaultValue.scoreboard).toHaveProperty('cameraAndLogo')
      
      // Design
      expect(defaultValue.scoreboard.design).toHaveProperty('layout')
      expect(defaultValue.scoreboard.design).toHaveProperty('color')
      expect(defaultValue.scoreboard.design.layout).toBe('dual')
      expect(defaultValue.scoreboard.design.color).toBe(ScoreboardColorsMap['dual'][0])
      
      // Camera and Logo
      expect(defaultValue.scoreboard.cameraAndLogo).toHaveProperty('displayCameraAndTwitterID')
      expect(defaultValue.scoreboard.cameraAndLogo).toHaveProperty('useLogo')
      expect(defaultValue.scoreboard.cameraAndLogo).toHaveProperty('dropShadow')
      expect(defaultValue.scoreboard.cameraAndLogo).toHaveProperty('logoURLs')
      
      expect(defaultValue.scoreboard.cameraAndLogo.displayCameraAndTwitterID).toBe(false)
      expect(defaultValue.scoreboard.cameraAndLogo.useLogo).toBe(false)
      expect(defaultValue.scoreboard.cameraAndLogo.dropShadow).toBe('none')
      expect(Array.isArray(defaultValue.scoreboard.cameraAndLogo.logoURLs)).toBe(true)
      expect(defaultValue.scoreboard.cameraAndLogo.logoURLs).toHaveLength(0)
    })

    it('should have valid tweet template', () => {
      expect(typeof defaultValue.tweetMatch.template).toBe('string')
      expect(defaultValue.tweetMatch.template).toContain('{{round}}')
      expect(defaultValue.tweetMatch.template).toContain('{{p1.team}}')
      expect(defaultValue.tweetMatch.template).toContain('{{p2.team}}')
      expect(defaultValue.tweetMatch.template).toContain('{{p1.playerName}}')
      expect(defaultValue.tweetMatch.template).toContain('{{p2.playerName}}')
    })

    it('should return hook with null id', () => {
      const { result } = renderHook(() => useSetting(null))
      
      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe('function')
      expect(result.current[2]).toBe(false) // loading should be false for null id
    })

    it('should return hook with undefined id', () => {
      const { result } = renderHook(() => useSetting(undefined))
      
      expect(result.current[0]).toEqual(defaultValue)
      expect(typeof result.current[1]).toBe('function')
      expect(result.current[2]).toBe(false)
    })

    it('should handle setValue function call', () => {
      const { result } = renderHook(() => useSetting(null))
      
      const setValue = result.current[1]
      const newSetting = {
        ...defaultValue,
        name: 'Test Tournament',
        scoreboard: {
          ...defaultValue.scoreboard,
          design: {
            layout: 'single',
            color: 'dark_mono'
          }
        },
        integrateStartGG: {
          enabled: true,
          url: 'https://start.gg/tournament/test'
        }
      }
      
      // setValue should not throw with null id
      expect(() => setValue(newSetting)).not.toThrow()
    })

    it('should support all layout types', () => {
      const { result } = renderHook(() => useSetting(null))
      
      const setValue = result.current[1]
      const layouts = ['dual', 'single', 'solid', 'simple'] as const
      
      layouts.forEach(layout => {
        const newSetting = {
          ...defaultValue,
          scoreboard: {
            ...defaultValue.scoreboard,
            design: {
              layout,
              color: ScoreboardColorsMap[layout][0]
            }
          }
        }
        
        expect(() => setValue(newSetting)).not.toThrow()
      })
    })

    it('should handle dropShadow options', () => {
      const { result } = renderHook(() => useSetting(null))
      
      const setValue = result.current[1]
      const dropShadowOptions = ['none', 'light', 'dark'] as const
      
      dropShadowOptions.forEach(dropShadow => {
        const newSetting = {
          ...defaultValue,
          scoreboard: {
            ...defaultValue.scoreboard,
            cameraAndLogo: {
              ...defaultValue.scoreboard.cameraAndLogo,
              dropShadow
            }
          }
        }
        
        expect(() => setValue(newSetting)).not.toThrow()
      })
    })
  })
}
