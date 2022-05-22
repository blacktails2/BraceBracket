import { useCallback, useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { db } from "../libs/firebase"
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js"
import { useAsync } from "react-use"
import { JsonObject } from "type-fest"
import { set } from "@firebase/database"

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
      console.log("GetSceneList", data)
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

      if (!connect && scenes.sceneList) {
        setSceneList(scenes.sceneList)
      }
      setCurrentScene(scenes.currentScene)
    })
    return () => unsubscribe()
  }, [id, connect, setCurrentScene])

  useEffect(() => {
    if (!id) return
    const obsCurrentSceneRef = ref(db, `tournaments/${id}/obs/currentScene`)
    console.log("current scene", currentScene)
    set(obsCurrentSceneRef, currentScene)
  }, [id, currentScene])

  useEffect(() => {
    if (!id || !connect) return
    const obsSceneListRef = ref(db, `tournaments/${id}/obs/sceneList`)
    console.log("scene list", sceneList)
    set(obsSceneListRef, sceneList)
  }, [id, sceneList, currentScene])

  return [currentScene, setCurrentScene, sceneList]
}
