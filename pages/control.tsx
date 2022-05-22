import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { NextPageWithLayout, Score } from "../libs/const"
import { useScore } from "../hooks/scoreHook"
import Link from "next/link"
import { useSceneChanger } from "../hooks/sceneChangerHook"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import styles from "./control.module.scss"
import { Button } from "../components/parts/Button"
import { ControlCard } from "../components/control/parts/ControlCard"
import { MockImg } from "../components/parts/MockImg"
import { useLoadBracket } from "../hooks/bracketHook"
import { useRouter } from "next/router"

const Control: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string

  const [score, setScore] = useScore(id)
  const scoreForm = useForm<Score>()
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
  }
  useEffect(() => {
    scoreForm.reset(score)
  }, [scoreForm, score])

  const [loadBracket, requestLoad] = useLoadBracket(id)
  const loadBracketForm = useForm<{ phaseGroupId: number }>()
  const onLoadBracketSubmit: SubmitHandler<{ phaseGroupId: number }> = ({
    phaseGroupId,
  }) => {
    requestLoad(phaseGroupId)
  }
  useEffect(() => {
    loadBracketForm.reset({ phaseGroupId: loadBracket.phaseGroupId })
  }, [loadBracketForm, loadBracket])

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
      <form onSubmit={scoreForm.handleSubmit(onScoreSubmit)}>
        <div>
          <div style={{ display: "flex" }}>
            <div>
              <div>1Pチーム名</div>
              <input type="text" {...scoreForm.register("p1_team")} />
            </div>
            <div>
              <div>1Pプレイヤー名</div>
              <input type="text" {...scoreForm.register("p1_player_name")} />
            </div>
            <div>
              <div>1Pスコア</div>
              <input type="number" {...scoreForm.register("p1_score")} />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <div>2Pチーム名</div>
              <input type="text" {...scoreForm.register("p2_team")} />
            </div>
            <div>
              <div>2Pプレイヤー名</div>
              <input type="text" {...scoreForm.register("p2_player_name")} />
            </div>
            <div>
              <div>2Pスコア</div>
              <input type="number" {...scoreForm.register("p2_score")} />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <div>ラウンド</div>
              <input type="text" {...scoreForm.register("round")} />
            </div>
            <div>
              <div>試合形式</div>
              <input type="text" {...scoreForm.register("match_type")} />
            </div>
            <div>
              <div>大会名</div>
              <input type="text" {...scoreForm.register("tournament_name")} />
            </div>
          </div>
          <button type="submit">反映</button>
        </div>
      </form>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.right}>
          <h2>スコアを編集</h2>
        </div>
        <div className={styles.left}>
          <Button>全ての情報を適用</Button>
          <div>クリップ</div>
          <div>歯車</div>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <ControlCard>
          <div className={styles.imageContainer}>
            <MockImg width={398} height={223} />
          </div>
          <div className={styles.cardTitle}>スコア&カメラ</div>
        </ControlCard>
      </div>
    </div>
  )
}
Control.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Control
