import { useRouter } from "next/router"
import { FC, memo, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import { MatchIntervalInfo, Score, Setting } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { MatchTypeSelector } from "../../parts/MatchTypeSelector"
import { NumberForm } from "../../parts/NumberForm"
import { RoundSelector } from "../../parts/RoundSelector"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"
import { StreamQueueTable } from "../parts/StreamQueueTable"

const ScoreAndCamera: FC<{
  setting: Setting
  score: Score
  setScore: (score: Score) => void
  matchIntervalInfo: MatchIntervalInfo
}> = ({ setting, score, setScore, matchIntervalInfo }) => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [showTooltip, setShowTooltip] = useState(false)
  const scoreForm = useForm<Score>()
  const { handleSubmit, reset } = scoreForm
  useEffect(() => {
    reset(score)
  }, [reset, score])

  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }
  scoreForm.watch()
  return (
    <ControlPanel title="スコア&カメラ" url={`${origin}/obs/score/?id=${id}`}>
      <hr />
      <StreamQueueTable
        setting={setting}
        onChange={(queue) => {
          scoreForm.setValue("p1.team", queue.p1?.team ?? "")
          scoreForm.setValue("p1.playerName", queue.p1?.playerName ?? "")
          scoreForm.setValue("p1.score", queue.p1?.score ?? 0)
          scoreForm.setValue("p1.twitterID", queue.p1?.twitterID ?? "")

          scoreForm.setValue("p2.team", queue.p2?.team ?? "")
          scoreForm.setValue("p2.playerName", queue.p2?.playerName ?? "")
          scoreForm.setValue("p2.score", queue.p2?.score ?? 0)
          scoreForm.setValue("p2.twitterID", queue.p2?.twitterID ?? "")
          scoreForm.setValue("round", queue.roundText)
        }}
        id="scoreAndCameraStreamQueueTable"
      />

      <FormProvider {...scoreForm}>
        <form onSubmit={handleSubmit(onScoreSubmit)}>
          <div>
            <div className="flex flex-wrap gap-[3rem] mt-[2rem]">
              <div>
                <h4>1Pデータ</h4>
                <div className="flex flex-wrap gap-[1rem]">
                  <TextForm
                    className="w-[8rem]"
                    label="チーム名"
                    name="p1.team"
                    placeholder="Team"
                    autocomplete="team"
                    cleanValue={score?.p1.team}
                  />
                  <TextForm
                    className="w-[18rem]"
                    label="プレイヤー名"
                    name="p1.playerName"
                    placeholder="Player"
                    autocomplete="playerName"
                    cleanValue={score?.p1.playerName}
                  />
                  <div>
                    <label>スコア</label>
                    <div className="flex gap-[0.5rem]">
                      <Button
                        type="button"
                        mode="small"
                        onClick={() =>
                          scoreForm.setValue(
                            "p1.score",
                            (scoreForm.getValues("p1.score") ?? 0) - 1
                          )
                        }
                      >
                        -1
                      </Button>
                      <NumberForm
                        className="w-[5rem]"
                        name={"p1.score"}
                        cleanValue={score?.p1.score}
                      />
                      <Button
                        type="button"
                        mode="small"
                        onClick={() =>
                          scoreForm.setValue(
                            "p1.score",
                            (scoreForm.getValues("p1.score") ?? 0) + 1
                          )
                        }
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4>2Pデータ</h4>
                <div className="flex flex flex-wrap gap-[1rem]">
                  <TextForm
                    className="w-[8rem]"
                    label="チーム名"
                    name="p2.team"
                    placeholder="Team"
                    autocomplete="team"
                    cleanValue={score?.p2.team}
                  />
                  <TextForm
                    className="w-[18rem]"
                    label="プレイヤー名"
                    name="p2.playerName"
                    placeholder="Player"
                    autocomplete="playerName"
                    cleanValue={score?.p2.playerName}
                  />
                  <div>
                    <label>スコア</label>
                    <div className="flex gap-[0.5rem]">
                      <Button
                        type="button"
                        mode="small"
                        onClick={() =>
                          scoreForm.setValue(
                            "p2.score",
                            (scoreForm.getValues("p2.score") ?? 0) - 1
                          )
                        }
                      >
                        -1
                      </Button>
                      <NumberForm
                        className="w-[5rem]"
                        name={"p2.score"}
                        cleanValue={score?.p2.score}
                      />
                      <Button
                        type="button"
                        mode="small"
                        onClick={() =>
                          scoreForm.setValue(
                            "p2.score",
                            (scoreForm.getValues("p2.score") ?? 0) + 1
                          )
                        }
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {setting?.scoreboard.cameraAndLogo.displayCameraAndTwitterID && (
              <div className="mt-[2rem]">
                <h4 className="mt-0 mb-[0.5rem]">Twitter ID</h4>
                <div className="flex flex-wrap gap-[1rem]">
                  <TextForm
                    className="w-[19rem]"
                    label="1P"
                    name="p1.twitterID"
                    placeholder="@user_name"
                    cleanValue={score?.p1.twitterID}
                  />
                  <TextForm
                    className="w-[19rem]"
                    label="2P"
                    name="p2.twitterID"
                    placeholder="@user_name"
                    cleanValue={score?.p2.twitterID}
                  />
                </div>
              </div>
            )}
            <div className="mt-[2rem]">
              <h4>データのリセット・入れ替え</h4>
              <div className="flex flex-wrap gap-[1rem]">
                <Button
                  type="button"
                  mode="small"
                  onClick={() => {
                    const [p1, p2] = scoreForm.getValues(["p1", "p2"])
                    scoreForm.setValue("p1", p2)
                    scoreForm.setValue("p2", p1)
                  }}
                >
                  1Pと2Pを入れ替える
                </Button>
                <Button
                  light
                  type="button"
                  mode="small"
                  onClick={() => {
                    const [p1, p2] = scoreForm.getValues(["p1", "p2"])
                    scoreForm.setValue("p1", {
                      ...p1,
                      score: 0,
                    })
                    scoreForm.setValue("p2", {
                      ...p2,
                      score: 0,
                    })
                  }}
                >
                  スコアをリセット
                </Button>
                <Button
                  light
                  type="button"
                  mode="small"
                  onClick={() => {
                    scoreForm.setValue("p1", {
                      team: "",
                      playerName: "",
                      score: 0,
                      twitterID: "",
                    })
                    scoreForm.setValue("p2", {
                      team: "",
                      playerName: "",
                      score: 0,
                      twitterID: "",
                    })
                  }}
                >
                  全てリセット
                </Button>
                <Button
                  light
                  type="button"
                  mode="small"
                  onClick={() => {
                    scoreForm.setValue("p1", matchIntervalInfo.p1)
                    scoreForm.setValue("p2", matchIntervalInfo.p2)
                    scoreForm.setValue("round", matchIntervalInfo.round)
                    scoreForm.setValue("matchType", matchIntervalInfo.matchType)
                    scoreForm.setValue("uppercase", matchIntervalInfo.uppercase)
                  }}
                >
                  試合間情報を取得する
                </Button>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h4 className="mt-0 mb-[0.5rem]">ステータス</h4>
            <div className="flex flex-wrap gap-[1rem]">
              <RoundSelector
                round={scoreForm.getValues("round")}
                setRound={(round) => scoreForm.setValue("round", round)}
                cleanValue={score?.round}
              />
              <MatchTypeSelector
                matchType={scoreForm.getValues("matchType")}
                setMatchType={(matchType) =>
                  scoreForm.setValue("matchType", matchType)
                }
                cleanValue={score?.matchType}
              />
              {!setting?.scoreboard.cameraAndLogo.useLogo && (
                <div>
                  <label className="block">大会名</label>
                  <textarea
                    className={`border-[1px] border-[solid] border-[color:var(--light-primary)] rounded-[0.5rem] px-[1rem] py-[0.5rem] focus:outline-none focus:border-[color:var(--bb-beige)] resize-none`}
                    cols={10}
                    rows={3}
                    {...scoreForm.register("tournamentName")}
                    style={
                      score?.tournamentName !==
                      scoreForm.getValues("tournamentName")
                        ? { backgroundColor: "var(--bb-dirty)" }
                        : {}
                    }
                  ></textarea>
                </div>
              )}
            </div>
            <CheckBoxForm
              className="mt-[1rem]"
              label="すべて大文字にする"
              name="uppercase"
              cleanValue={score?.uppercase}
            />
          </div>
          <div className="relative flex gap-[2rem]">
            <Button
              type="submit"
              mode="primary"
              className="w-[19rem] mt-[3rem]"
              full
              tooltipText="適用されました"
              showTooltip={showTooltip}
            >
              適用する
            </Button>
            <Button
              type="button"
              mode="primary"
              className="w-[19rem] mt-[3rem]"
              full
              light
              onClick={() => {
                scoreForm.reset()
              }}
            >
              変更をリセット
            </Button>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}

export default memo(ScoreAndCamera)
