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

export const ScoreAndCamera: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [score, setScore] = useScore(id)
  const [setting] = useSetting(id)
  const [streamQueue, setStreamQueue] = useState<StreamQueue>([])
  const [attendee, setAttendee] = useState<Attendee>([])
  const scoreForm = useForm<Score>()
  const { handleSubmit, reset } = scoreForm
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
  }
  useEffect(() => {
    reset(score)
  }, [reset, score])
  return (
    <ControlPanel title="スコア&カメラ" url={`${origin}/obs/score?id=${id}`}>
      <hr />
      {setting?.integrateStartGG?.enabled && (
        <>
          <Button
            onClick={() => {
              getStreamQueue(setting?.integrateStartGG?.url).then(
                setStreamQueue
              )
              getAttendee(setting?.integrateStartGG?.url).then(setAttendee)
            }}
            className="mb-[20px]"
          >
            配信台の情報を読み込み
          </Button>
          <datalist id="playerName">
            {Array.from(new Set(attendee.map((a) => a.playerName))).map(
              (playerName) => (
                <option key={playerName} value={playerName} />
              )
            )}
          </datalist>
          <datalist id="team">
            {Array.from(new Set(attendee.map((a) => a.team))).map((team) => (
              <option key={team} value={team} />
            ))}
          </datalist>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Round</th>
                <th>1P Player</th>
                <th>2P Player</th>
                <th>Stream Name</th>
              </tr>
            </thead>
            <tbody>
              {streamQueue.map((stream, index) => (
                <tr key={stream.id}>
                  <td>
                    <input
                      type="radio"
                      name="stream"
                      onChange={() => {
                        scoreForm.setValue("p1.team", stream.p1?.team ?? "")
                        scoreForm.setValue(
                          "p1.playerName",
                          stream.p1?.playerName ?? ""
                        )
                        scoreForm.setValue("p1.score", stream.p1?.score ?? 0)
                        scoreForm.setValue(
                          "p1.twitterID",
                          stream.p1?.twitterID ?? ""
                        )

                        scoreForm.setValue("p2.team", stream.p2?.team ?? "")
                        scoreForm.setValue(
                          "p2.playerName",
                          stream.p2?.playerName ?? ""
                        )
                        scoreForm.setValue("p2.score", stream.p2?.score ?? 0)
                        scoreForm.setValue(
                          "p2.twitterID",
                          stream.p2?.twitterID ?? ""
                        )
                        scoreForm.setValue("round", stream.fullRoundText)
                      }}
                    />
                  </td>
                  <td>{stream.fullRoundText}</td>
                  <td>{stream.p1?.playerName}</td>
                  <td>{stream.p2?.playerName}</td>
                  <td>{stream.streamName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
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
          <PrimaryButton type="submit" className="w-[194px] mt-[30px]" full>
            適用する
          </PrimaryButton>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
