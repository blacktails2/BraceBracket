import { FC, useState } from "react"
import { useAsync, useSearchParam } from "react-use"
import OBSWebSocket, { OBSResponseTypes } from "obs-websocket-js"
import { DatabaseReference, ref } from "firebase/database"
import { db } from "../libs/firebase"
import { JsonObject } from "type-fest"

export const OBSController: FC = () => {
  const id = useSearchParam("id")
  const [obsRef] = useState<DatabaseReference>(ref(db, `tournaments/${id}/obs`))

  useAsync(async () => {
    const obs = new OBSWebSocket()

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
    const scenes: string[] = []
    obs.call("GetSceneList").then((data: OBSResponseTypes["GetSceneList"]) => {
      console.log(data)
      scenes.push(
        ...data.scenes
          .map((s) =>
            s && (s as JsonObject).sceneName
              ? ((s as JsonObject).sceneName as string)
              : undefined
          )
          .filter((e: string | undefined): e is string => typeof e === "string")
      )
    })
    let idx = 0
    setInterval(() => {
      idx++
      obs.call("SetCurrentProgramScene", { sceneName: scenes[idx % 3] })
      console.log(scenes[idx % 3])
    }, 1000)
    return () => {
      obs.disconnect()
    }
  }, [])
  return <></>
}
