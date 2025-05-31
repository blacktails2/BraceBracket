import { useRouter } from "next/router"
import OBSWebSocket from "obs-websocket-js"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAsync, useUnmount } from "react-use"

import { Connect } from "../components/connect/Connect"
import { useIntegrateOBS } from "../hooks/useIntegrateOBS"
import { NextPageWithLayout } from "../libs/const"

const ConnectPage: NextPageWithLayout = () => {
  const obs = useRef(new OBSWebSocket())
  useUnmount(() => {
    obs.current.disconnect()
  })

  const router = useRouter()
  const id = router.query.id as string
  const [integrateOBS, setIntegrateOBS, loadingIntegrateOBS] = useIntegrateOBS(
    id,
    true
  )
  const [loadedIntegrateOBS, setLoadedIntegrateOBS] = useState(false)

  useEffect(() => {
    if (integrateOBS && !loadingIntegrateOBS && !loadedIntegrateOBS) {
      setLoadedIntegrateOBS(true)
      setIntegrateOBS((integrateOBS) => {
        if (!integrateOBS) {
          return integrateOBS
        }
        return {
          ...integrateOBS,
          state: {
            currentScene: "",
            sceneList: [],
            connected: false,
          },
        }
      })
    }
  }, [integrateOBS, loadingIntegrateOBS, loadedIntegrateOBS, setIntegrateOBS])

  const updateSceneList = useCallback(async () => {
    const sceneList = await obs.current.call("GetSceneList")
    console.log(sceneList)

    setIntegrateOBS((integrateOBS) => {
      if (!integrateOBS) {
        return integrateOBS
      }

      return {
        ...integrateOBS,
        state: {
          connected: true,
          sceneList: (sceneList.scenes
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .sort((a, b) => (b?.sceneIndex ?? 0) - (a?.sceneIndex ?? 0))
            .map((scene) => scene.sceneName)
            .filter((s) => !!s) || []) as string[],
          currentScene: sceneList.currentProgramSceneName,
        },
      }
    })
  }, [setIntegrateOBS])

  const onConnectionClosed = useCallback(() => {
    setIntegrateOBS((integrateOBS) => {
      if (!integrateOBS) {
        return integrateOBS
      }
      return {
        ...integrateOBS,
        state: {
          connected: false,
          currentScene: "",
          sceneList: [],
        },
      }
    })
  }, [setIntegrateOBS])

  const connectFunc = useCallback(
    async (url: string, password: string) => {
      try {
        await obs.current.disconnect()
        const { obsWebSocketVersion, negotiatedRpcVersion } =
          await obs.current.connect(url, password, {
            rpcVersion: 1,
          })
        console.log(
          `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
        )

        obs.current.on("CurrentProgramSceneChanged", (data) => {
          console.log(data)
          setIntegrateOBS((integrateOBS) => {
            if (!integrateOBS) return integrateOBS
            return {
              ...integrateOBS,
              state: {
                ...integrateOBS.state,
                currentScene: data.sceneName,
              },
            }
          })
        })

        obs.current.on("SceneListChanged", updateSceneList)
        obs.current.on("SceneNameChanged", updateSceneList)
        obs.current.on("ConnectionClosed", onConnectionClosed)
        await updateSceneList()
      } catch (e) {
        console.error(e)
      }
    },
    [setIntegrateOBS, updateSceneList, onConnectionClosed]
  )

  useAsync(async () => {
    if (
      integrateOBS &&
      integrateOBS.operation.queue &&
      integrateOBS.operation.queue.length > 0
    ) {
      try {
        const { type, scene } = integrateOBS.operation.queue[0]
        await setIntegrateOBS((integrateOBS) => {
          if (!integrateOBS) return integrateOBS

          return {
            ...integrateOBS,
            operation: {
              queue: integrateOBS.operation.queue.slice(1),
            },
          }
        })
        if (type === "changeScene") {
          await obs.current.call("SetCurrentProgramScene", {
            sceneName: scene,
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [integrateOBS, setIntegrateOBS])

  if (!integrateOBS || loadingIntegrateOBS) return null

  return (
    <Connect
      connect={connectFunc}
      integrateOBS={integrateOBS}
      setIntegrateOBS={setIntegrateOBS}
    />
  )
}

export default ConnectPage
