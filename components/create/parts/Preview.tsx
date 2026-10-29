import { useRouter } from "next/router"
import { FC, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Button } from "../../parts/Button"
import {
  PreviewBracket,
  PreviewInterval,
  PreviewScore,
} from "../../parts/Preview"

import styles from "./Preview.module.scss"

export const Preview: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const { watch, getValues } = useFormContext()
  const [displayCameraAndTwitterID, setDisplayCameraAndTwitterID] =
    useState(false)
  watch(() => {
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
    <div className={styles.container}>
      <div className={styles.previewContainer}>
        <div>
          <PreviewScore displayCameraAndTwitterID={displayCameraAndTwitterID} />
          <PreviewInterval onMC={true} />
          <PreviewBracket />
          <Button mode="primary" type="submit">
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  )
}
