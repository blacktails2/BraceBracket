import { FC, useMemo, useState } from "react"
import styles from "./Preview.module.scss"
import Image from "next/image"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { useFormContext } from "react-hook-form"
import { useRouter } from "next/router"
import {
  getBracketFilename,
  getCameraFilename,
  getMCFilename,
  getNextFilename,
} from "../../../libs/const"

export const Preview: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const { watch, getValues } = useFormContext()
  const [layout, setLayout] = useState("")
  const [color, setColor] = useState("")
  const [displayCameraAndTwitterID, setDisplayCameraAndTwitterID] =
    useState(false)
  watch(() => {
    setLayout(getValues("scoreboard.design.layout"))
    setColor(getValues("scoreboard.design.color"))
    setDisplayCameraAndTwitterID(
      getValues("scoreboard.cameraAndLogo.displayCameraAndTwitterID")
    )
  })
  const submitText = useMemo(() => {
    if (id) {
      return "スコアボードを更新"
    }
    return "スコアボードを作成"
  }, [id])

  return (
    <div className={styles.previewContainer}>
      <div>
        <div className={styles.previewImageContainer}>
          <div className={styles.outer}>
            {displayCameraAndTwitterID && (
              <div className="absolute z-10">
                <Image
                  src={`/image/create/samples/camera/${getCameraFilename(
                    layout,
                    color
                  )}`}
                  width={340}
                  height={190}
                  alt="カメラ"
                />
              </div>
            )}
            <Image
              src={`/image/create/samples/layout/${layout}/${layout}_${color}.png`}
              width={340}
              height={190}
              alt="スコアボードプレビュー"
            />
          </div>
        </div>
        <div className={styles.previewImageContainer}>
          <div className="absolute z-10">
            <Image
              src={`/image/create/samples/mc/${getMCFilename(layout, color)}`}
              width={340}
              height={190}
              alt="MCプレビュー"
            />
          </div>
          <div className={styles.outer}>
            <Image
              src={`/image/create/samples/next/${getNextFilename(
                layout,
                color
              )}`}
              width={340}
              height={190}
              alt="Nextプレビュー"
            />
          </div>
        </div>
        <div className={styles.previewImageContainer}>
          <Image
            src={`/image/create/samples/top8/${getBracketFilename(
              layout,
              color
            )}`}
            width={340}
            height={190}
            alt="Top8プレビュー"
          />
        </div>
        <PrimaryButton type="submit">{submitText}</PrimaryButton>
      </div>
    </div>
  )
}
