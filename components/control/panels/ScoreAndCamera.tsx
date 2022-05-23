import { FC, useEffect } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { Button } from "../../parts/Button"
import styles from "./ScoreAndCamera.module.scss"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useScore } from "../../../hooks/useScore"
import { Score } from "../../../libs/const"
import { useRouter } from "next/router"
import { useOrigin } from "../../../hooks/useOrigin"
import { TextForm } from "../../parts/TextForm"
import { NumberForm } from "../../parts/NumberForm"

export const ScoreAndCamera: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [score, setScore] = useScore(id)
  const scoreForm = useForm<Score>()
  const { handleSubmit, reset, register } = scoreForm
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
  }
  useEffect(() => {
    reset(score)
  }, [reset, score])
  return (
    <ControlPanel title="スコア&カメラ" url={`${origin}/obs/score?id=${id}`}>
      <FormProvider {...scoreForm}>
        <form onSubmit={handleSubmit(onScoreSubmit)}>
          <hr />
          <Button>start.ggから配信代の情報を取得</Button>
          <div>
            <div className={styles.playersContainer}>
              <div className={styles.playerContainer}>
                <h4>1Pデータ</h4>
                <div>
                  <TextForm
                    className={styles.team}
                    label="チーム名"
                    name="p1.team"
                    placeholder="Team"
                  />
                  <TextForm
                    className={styles.playerName}
                    label="プレイヤー名"
                    name="p1.playerName"
                    placeholder="Player"
                  />
                  <NumberForm
                    label={"スコア"}
                    name={"p1.score"}
                    className={styles.score}
                  />
                </div>
              </div>
              <div className={styles.playerContainer}>
                <h4>2Pデータ</h4>
                <div>
                  <TextForm
                    className={styles.team}
                    label="チーム名"
                    name="p2.team"
                    placeholder="Team"
                  />
                  <TextForm
                    className={styles.playerName}
                    label="プレイヤー名"
                    name="p2.playerName"
                    placeholder="Player"
                  />
                  <NumberForm
                    label="スコア"
                    name="p2.score"
                    className={styles.score}
                  />
                </div>
              </div>
            </div>
            <div className={styles.twitterIDContainer}>
              <h4>Twitter ID</h4>
              <div>
                <TextForm
                  className={styles.playerName}
                  label="1P"
                  name="p1.twitterID"
                  placeholder="@user_name"
                />
                <TextForm
                  className={styles.playerName}
                  label="2P"
                  name="p2.twitterID"
                  placeholder="@user_name"
                />
              </div>
            </div>
          </div>
          <hr />
          <div className={styles.statusContainer}>
            <h4>ステータス</h4>
            <div>
              <div>
                <label>ラウンド</label>
                <div className={styles.selectContainer}>
                  <select {...register("round")}>
                    <option value="Pools">Pools</option>
                  </select>
                </div>
              </div>
              <div>
                <label>試合形式</label>
                <div className={styles.selectContainer}>
                  <select {...register("matchType")}>
                    <option value="Best of 5">Best of 5</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="uppercase"
                  {...register("uppercase")}
                />
                <label htmlFor="uppercase"></label>
              </div>
              <label htmlFor="uppercase">すべて大文字にする</label>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button type="submit">適用する</Button>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
