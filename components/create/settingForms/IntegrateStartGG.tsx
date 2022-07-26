import { FC, useCallback, useState } from "react"
import { useFormContext } from "react-hook-form"

import { getEventInfo } from "../../../libs/getEventInfo"
import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./IntegrateStartGG.module.scss"

export const IntegrateStartGG: FC = () => {
  const { register, getValues, watch } = useFormContext()
  const [info, setInfo] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  })
  const key = "integrateStartGG.enabled"
  const textKey = "integrateStartGG.url"
  watch(key)

  const validateStartGGURL = useCallback(async () => {
    const url = getValues("integrateStartGG.url")
    const eventInfo = await getEventInfo(url)
    console.log({ eventInfo })
    if (typeof eventInfo === "string") {
      setInfo({
        type: "error",
        message: eventInfo,
      })
      return
    }
    setInfo({
      type: "success",
      message: `「${eventInfo.tournamentName} ${eventInfo.eventName}」の情報を取得します。`,
    })
  }, [getValues])

  return (
    <div className={styles.container}>
      <BigCheckBox name={key} className="mr-[15px]" />
      <div className={styles.text}>
        <label htmlFor={key}>
          <h4>start.ggと連携する</h4>
          <p>
            start.ggと連携することで配信代の情報やTop8の情報をstart.ggから取得できます。
            <br />
            Grand
            Finalが含まれているトーナメント表のページのURLを入力してください。
          </p>
        </label>
        <input
          type="text"
          {...register(textKey, {
            validate: async (value) => {
              if (!getValues("integrateStartGG.enabled")) return true
              const url = getValues("integrateStartGG.url")
              if (!url) return "URLを入力してください。"
              if (!url.startsWith("https://www.start.gg/tournament/")) {
                return "トーナメントのURLが正しくありません。"
              }
              const urlParts = url.split("/")
              if (urlParts.length < 10) {
                return "トーナメントのURLが正しくありません。"
              }

              const eventInfo = await getEventInfo(url)
              if (typeof eventInfo === "string") {
                setInfo({
                  type: "error",
                  message: eventInfo,
                })
                return
              }
              setInfo({
                type: "success",
                message: `「${eventInfo.tournamentName} ${eventInfo.eventName}」の情報を取得します。`,
              })
              return true
            },
            onChange: validateStartGGURL,
            onBlur: validateStartGGURL,
          })}
          placeholder="https://www.start.gg/tournament/competition/event/singles/brackets/000000/000000"
          disabled={!getValues(key)}
          style={
            !getValues(key)
              ? {
                  opacity: 0.5,
                }
              : {}
          }
        />
        <p
          className={`absolute ${
            info.type === "error"
              ? "text-[color:var(--bb-attention)]"
              : "text-[color:var(--bb-success)]"
          }`}
        >
          {info.message}
        </p>
      </div>
    </div>
  )
}
