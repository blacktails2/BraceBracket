import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { NextPageWithLayout } from "../libs/const"
import Link from "next/link"
import { useSceneChanger } from "../hooks/sceneChangerHook"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import styles from "./control.module.scss"
import { useLoadBracket } from "../hooks/useLoadBracket"
import { useRouter } from "next/router"
import { TextboxWithCopy } from "../components/parts/TextboxWithCopy"
import { ScoreAndCamera } from "../components/control/panels/ScoreAndCamera"
import { useOrigin } from "../hooks/useOrigin"
import { Top8Bracket } from "../components/control/panels/Top8Bracket"
import { Next } from "../components/control/panels/Next"
import { MC } from "../components/control/panels/MC"

const Control: NextPageWithLayout = () => {
  const router = useRouter()
  const origin = useOrigin()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.right}>
          <h2>スコアを編集</h2>
        </div>
        <div className={styles.left}>
          <div>
            <div>共有URL:</div>
            <div>
              <TextboxWithCopy text={`${origin}${router.asPath}`} />
            </div>
            <div>歯車</div>
          </div>
          <p>
            URLを共有することで複数人で編集することができます。URLの流失にはご注意ください。
          </p>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <ScoreAndCamera />
        <Next />
        <MC />
        <Top8Bracket />
      </div>
    </div>
  )
}
Control.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Control
