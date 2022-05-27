import { FC, useEffect, useState } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useScore } from "../../../hooks/useScore"
import { Score } from "../../../libs/const"
import { useRouter } from "next/router"
import { useOrigin } from "../../../hooks/useOrigin"
import { TextForm } from "../../parts/TextForm"
import { NumberForm } from "../../parts/NumberForm"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { SelectForm } from "../../parts/SelectForm"
import { getStreamQueue, StreamQueue } from "../../../libs/getStreamQueue"
import { useSetting } from "../../../hooks/useSetting"
import styles from "./kesu.module.scss"
import { Button } from "../../parts/Button"
import { Attendee, getAttendee } from "../../../libs/getAttendee"
import { StreamQueueTable } from "../parts/StreamQueueTable"

export const ScoreAndCamera: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [score, setScore] = useScore(id)
  const [showTooltip, setShowTooltip] = useState(false)
  const scoreForm = useForm<Score>()
  const { handleSubmit, reset } = scoreForm
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }
  useEffect(() => {
    reset(score)
  }, [reset, score])
  return (
    <ControlPanel title="スコア&カメラ" url={`${origin}/obs/score/?id=${id}`}>
      <hr />
      <StreamQueueTable
        onChange={(queue) => {
          scoreForm.setValue("p1.team", queue.p1?.team ?? "")
          scoreForm.setValue("p1.playerName", queue.p1?.playerName ?? "")
          scoreForm.setValue("p1.score", queue.p1?.score ?? 0)
          scoreForm.setValue("p1.twitterID", queue.p1?.twitterID ?? "")

          scoreForm.setValue("p2.team", queue.p2?.team ?? "")
          scoreForm.setValue("p2.playerName", queue.p2?.playerName ?? "")
          scoreForm.setValue("p2.score", queue.p2?.score ?? 0)
          scoreForm.setValue("p2.twitterID", queue.p2?.twitterID ?? "")
          scoreForm.setValue("round", queue.fullRoundText)
        }}
      />

      <FormProvider {...scoreForm}>
        <form onSubmit={handleSubmit(onScoreSubmit)}>
          <div>
            <div className="flex flex-wrap gap-[30px] mt-[20px]">
              <div>
                <h4>1Pデータ</h4>
                <div className="flex gap-[10px]">
                  <TextForm
                    className="w-[100px]"
                    label="チーム名"
                    name="p1.team"
                    placeholder="Team"
                    autocomplete="team"
                  />
                  <TextForm
                    className="w-[218px]"
                    label="プレイヤー名"
                    name="p1.playerName"
                    placeholder="Player"
                    autocomplete="playerName"
                  />
                  <NumberForm
                    className="w-[60px]"
                    label={"スコア"}
                    name={"p1.score"}
                  />
                </div>
              </div>
              <div>
                <h4>2Pデータ</h4>
                <div className="flex gap-[10px]">
                  <TextForm
                    className="w-[100px]"
                    label="チーム名"
                    name="p2.team"
                    placeholder="Team"
                    autocomplete="team"
                  />
                  <TextForm
                    className="w-[218px]"
                    label="プレイヤー名"
                    name="p2.playerName"
                    placeholder="Player"
                    autocomplete="playerName"
                  />
                  <NumberForm
                    className="w-[60px]"
                    label="スコア"
                    name="p2.score"
                  />
                </div>
              </div>
            </div>
            <div className="mt-[20px]">
              <h4 className="mt-0 mb-[5px]">Twitter ID</h4>
              <div className="flex flex-wrap gap-[10px]">
                <TextForm
                  className="w-[194px]"
                  label="1P"
                  name="p1.twitterID"
                  placeholder="@user_name"
                />
                <TextForm
                  className="w-[194px]"
                  label="2P"
                  name="p2.twitterID"
                  placeholder="@user_name"
                />
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h4 className="mt-0 mb-[5px]">ステータス</h4>
            <div className="flex flex-wrap gap-[10px]">
              <SelectForm
                label="ラウンド"
                name="round"
                options={[
                  { text: "Pools", value: "Pools" },
                  {
                    text: "Losers Quarter-Final",
                    value: "Losers Quarter-Final",
                  },
                  { text: "Losers Semi-Final", value: "Losers Semi-Final" },
                  { text: "Losers Final", value: "Losers Final" },
                  {
                    text: "Winners Quarter-Final",
                    value: "Winners Quarter-Final",
                  },
                  { text: "Winners Semi-Final", value: "Winners Semi-Final" },
                  { text: "Winners Final", value: "Winners Final" },
                  { text: "Grand Final", value: "Grand Final" },
                ]}
              />
              <SelectForm
                label="試合形式"
                name="matchType"
                options={[
                  { text: "Best of 3", value: "Best of 3" },
                  { text: "Best of 5", value: "Best of 5" },
                ]}
              />
            </div>
            <CheckBoxForm
              className="mt-[10px]"
              label="すべて大文字にする"
              name="uppercase"
            />
          </div>
          <div className="relative flex">
            <PrimaryButton type="submit" className="w-[194px] mt-[30px]" full>
              適用する
            </PrimaryButton>
            <div
              className={styles.popup}
              style={{ display: showTooltip ? "block" : "none" }}
            >
              適用されました
            </div>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
