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
import { MatchIntervalInfo } from "../components/control/panels/MatchIntervalInfo"
import { MC } from "../components/control/panels/MC"

const Control: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  const [loadBracket, requestLoad, loading] = useLoadBracket(id)
  const loadBracketForm = useForm<{ phaseGroupId: number }>()
  const onLoadBracketSubmit: SubmitHandler<{ phaseGroupId: number }> = ({
    phaseGroupId,
  }) => {
    requestLoad(phaseGroupId)
  }
  useEffect(() => {
    if (loading) return
    loadBracketForm.reset({ phaseGroupId: loadBracket?.phaseGroupId })
  }, [loading, loadBracketForm, loadBracket])

  const [currentScene, setCurrentScene, sceneList] = useSceneChanger(id, false)
  const sceneForm = useForm<{ currentScene: string }>()
  const onSceneSubmit: SubmitHandler<{ currentScene: string }> = ({
    currentScene,
  }) => {
    setCurrentScene(currentScene)
  }
  useEffect(() => {
    sceneForm.setValue("currentScene", currentScene)
  }, [sceneForm, currentScene])

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
        <MatchIntervalInfo />
        <MC />
        <Top8Bracket />
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <div>
        <Link
          href={{
            pathname: "/create",
            query: {
              id: id,
            },
          }}
        >
          設定に戻る
        </Link>
      </div>
      <div>
        <Link
          href={{
            pathname: "/obs/score",
            query: {
              id: id,
            },
          }}
          passHref
        >
          <a target="_blank">Score OBS用ページ</a>
        </Link>
        <Link
          href={{
            pathname: "/obs/bracket",
            query: {
              id: id,
            },
          }}
          passHref
        >
          <a target="_blank">Bracket OBS用ページ</a>
        </Link>
      </div>
      <form onSubmit={loadBracketForm.handleSubmit(onLoadBracketSubmit)}>
        Top8 読み込み
        <input
          type="text"
          inputMode="decimal"
          {...loadBracketForm.register("phaseGroupId")}
        />
        <button type="submit">読み込み</button>
      </form>
      <form onSubmit={sceneForm.handleSubmit(onSceneSubmit)}>
        OBSのシーン切り替え
        <Controller
          control={sceneForm.control}
          name="currentScene"
          render={({ field }) => (
            <>
              {sceneList.map((scene) => {
                return (
                  <div key={scene}>
                    <label>
                      <input
                        type="radio"
                        {...field}
                        value={scene}
                        checked={field.value === scene}
                      />
                      {scene}
                    </label>
                  </div>
                )
              })}
            </>
          )}
        />
        <button type="submit">反映</button>
      </form>
    </div>
  )
}
Control.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Control
