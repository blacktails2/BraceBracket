import { useCallback, useEffect, useState } from "react"
import { set } from "@firebase/database"
import { onValue, ref } from "firebase/database"
import { JsonObject } from "type-fest"
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js"
import { useAsync } from "react-use"

import { db } from "../libs/firebase"

export const useSceneChanger = (
  id: string | undefined | null,
  connect: boolean
): [string, (nextScene: string) => void, string[]] => {
  const [obs, setOBS] = useState<OBSWebSocket>()
  const [sceneList, setSceneList] = useState<string[]>([])
  const [currentScene, _setCurrentScene] = useState<string>("")
  useAsync(async () => {
    if (obs?.identified) {
      await obs.disconnect()
    }
    setOBS(new OBSWebSocket())
  }, [])

  const setCurrentScene = useCallback(
    (nextScene: string) => {
      if (!id || !obs) return
      if (currentScene !== nextScene && sceneList.includes(nextScene)) {
        _setCurrentScene(nextScene)
        if (connect) {
          obs.call("SetCurrentProgramScene", {
            sceneName: nextScene,
          })
        }
      }
    },
    [id, connect, obs, sceneList, currentScene]
  )

  useAsync(async () => {
    if (!id || !connect || !obs) return

    if (obs?.identified) {
      await obs.disconnect()
    }
    try {
      const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
        "ws://localhost:4444",
        "",
        {
          rpcVersion: 1,
        }
      )
      console.log(
        `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
      )
    } catch (error) {
      console.error("Failed to connect", error)
    }

    obs.call("GetSceneList").then((data: OBSResponseTypes["GetSceneList"]) => {
      setSceneList(
        data.scenes
          .map((s) =>
            s && (s as JsonObject).sceneName
              ? ((s as JsonObject).sceneName as string)
              : undefined
          )
          .filter((e: string | undefined): e is string => typeof e === "string")
      )
      _setCurrentScene(data.currentProgramSceneName)
    })

    return () => {
      obs.disconnect()
    }
  }, [obs])

  useEffect(() => {
    if (!id) return
    const obsScenesRef = ref(db, `tournaments/${id}/obs`)
    const unsubscribe = onValue(obsScenesRef, (snapshot) => {
      const scenes = snapshot.val()
      if (!scenes) return
      console.log("scenes", scenes)

      if (
        !connect &&
        scenes.sceneList &&
        JSON.stringify(scenes.sceneList) !== JSON.stringify(sceneList)
      ) {
        setSceneList(scenes.sceneList)
      }
      setCurrentScene(scenes.currentScene)
    })
    return () => unsubscribe()
  }, [id, connect, sceneList, setCurrentScene])

  useEffect(() => {
    if (!id) return
    const obsCurrentSceneRef = ref(db, `tournaments/${id}/obs/currentScene`)
    console.log("current scene", currentScene)
    if (sceneList.includes(currentScene)) {
      set(obsCurrentSceneRef, currentScene)
    }
  }, [id, currentScene])

  useEffect(() => {
    if (!id || !connect) return
    const obsSceneListRef = ref(db, `tournaments/${id}/obs/sceneList`)
    console.log("scene list", sceneList)
    set(obsSceneListRef, sceneList)
  }, [id, connect, sceneList, currentScene])

  return [currentScene, setCurrentScene, sceneList]
}

// In-Source Test
if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest

  describe('useSceneChanger', () => {
    let renderHook: (callback: () => any) => { result: { current: any } }

    beforeEach(async () => {
      const testingLib = await import('@testing-library/react')
      renderHook = testingLib.renderHook

      const firebaseMock = await import('../test/mocks/firebase')
      firebaseMock.resetMocks()

      // Mock OBS WebSocket
      vi.doMock('obs-websocket-js', () => ({
        default: vi.fn(() => ({
          identified: false,
          connect: vi.fn(() => Promise.resolve({
            obsWebSocketVersion: '5.0.0',
            negotiatedRpcVersion: 1
          })),
          disconnect: vi.fn(() => Promise.resolve()),
          call: vi.fn(() => Promise.resolve({
            scenes: [],
            currentProgramSceneName: ''
          }))
        }))
      }))

      // Mock react-use
      vi.doMock('react-use', () => ({
        useAsync: vi.fn()
      }))

      // Mock console methods
      vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should return initial state with null id', () => {
      const { result } = renderHook(() => useSceneChanger(null, false))
      
      expect(result.current[0]).toBe('') // currentScene
      expect(typeof result.current[1]).toBe('function') // setCurrentScene
      expect(Array.isArray(result.current[2])).toBe(true) // sceneList
      expect(result.current[2]).toHaveLength(0)
    })

    it('should return initial state with undefined id', () => {
      const { result } = renderHook(() => useSceneChanger(undefined, false))
      
      expect(result.current[0]).toBe('')
      expect(typeof result.current[1]).toBe('function')
      expect(Array.isArray(result.current[2])).toBe(true)
      expect(result.current[2]).toHaveLength(0)
    })

    it('should handle setCurrentScene with null id', () => {
      const { result } = renderHook(() => useSceneChanger(null, false))
      
      const setCurrentScene = result.current[1]
      
      // Should not throw with null id
      expect(() => setCurrentScene('Scene1')).not.toThrow()
    })

    it('should handle basic function signature', () => {
      // Only test with null/undefined to avoid Firebase dependency
      const { result } = renderHook(() => useSceneChanger(null, false))
      
      expect(Array.isArray(result.current)).toBe(true)
      expect(result.current).toHaveLength(3)
      
      // Check types
      expect(typeof result.current[0]).toBe('string')    // currentScene
      expect(typeof result.current[1]).toBe('function')  // setCurrentScene
      expect(Array.isArray(result.current[2])).toBe(true) // sceneList
    })

    it('should handle both connect boolean values with null id', () => {
      // Test with connect: false
      const { result: resultNoConnect } = renderHook(() => useSceneChanger(null, false))
      expect(typeof resultNoConnect.current[1]).toBe('function')
      
      // Test with connect: true  
      const { result: resultConnect } = renderHook(() => useSceneChanger(null, true))
      expect(typeof resultConnect.current[1]).toBe('function')
    })
  })
}
