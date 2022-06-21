import { FC, memo, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { MatchIntervalInfo, Score, Setting } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { IconButton } from "../parts/IconButton"
import { MatchTypeSelector } from "../parts/MatchTypeSelector"
import { NumberForm } from "../parts/NumberForm"
import { RoundSelector } from "../parts/RoundSelector"
import { StreamQueueTable } from "../parts/StreamQueueTable"
import { TextForm } from "../parts/TextForm"

const ScoreAndCamera: FC<{
  setting: Setting
  score: Score
  setScore: (score: Score) => void
  matchIntervalInfo: MatchIntervalInfo
}> = ({ setting, score, setScore, matchIntervalInfo }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<Score>()
  const { handleSubmit, reset } = form
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
  form.watch()
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onScoreSubmit)}>
          <div className="flex w-full justify-center">
            <div className="flex w-full max-w-[55rem] flex-col justify-center gap-[1rem]">
              <div className="relative mb-[1rem] flex gap-[1rem]">
                <Button
                  type="submit"
                  mode="small"
                  tooltipText="適用されました"
                  showTooltip={showTooltip}
                >
                  適用する
                </Button>
                <Button
                  type="button"
                  mode="small"
                  light
                  onClick={() => {
                    form.reset()
                  }}
                >
                  変更をリセット
                </Button>
              </div>
              <div className="flex gap-[1rem]">
                <div className="basis-2/3">
                  <RoundSelector
                    round={form.getValues("round")}
                    setRound={(round) => form.setValue("round", round)}
                    cleanValue={score?.round}
                  />
                </div>
                <div className="basis-1/3">
                  <MatchTypeSelector
                    matchType={form.getValues("matchType")}
                    setMatchType={(matchType) =>
                      form.setValue("matchType", matchType)
                    }
                    cleanValue={score?.matchType}
                  />
                </div>
              </div>
              <div>
                <CheckBoxForm
                  className="flex flex-col justify-end"
                  label="全て大文字にする"
                  id="score-uppercase"
                  name="uppercase"
                  cleanValue={score?.uppercase}
                />
              </div>
              <hr className="my-[1rem] h-[1px] bg-[#c4c4c4]" />
              <div className="flex w-full justify-center gap-[0.5rem]">
                <div className="flex w-full gap-[1rem]">
                  <div className="flex w-full flex-col gap-[0.5rem]">
                    <h6 className="mb-[-0.3rem]">1P</h6>
                    <TextForm
                      name="p1.team"
                      placeholder="1P Team"
                      autocomplete="team"
                      cleanValue={score?.p1.team}
                    />
                    <TextForm
                      name="p1.playerName"
                      placeholder="1P Player"
                      autocomplete="playerName"
                      cleanValue={score?.p1.playerName}
                    />
                    {setting.scoreboard.cameraAndLogo
                      .displayCameraAndTwitterID && (
                      <TextForm
                        name="p1.twitterID"
                        placeholder="@1PTwitterID"
                        cleanValue={score?.p1.twitterID}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-[0.5rem]">
                  <h6 className="mb-[-0.3rem] text-center">ALL RESET</h6>
                  <div className="flex gap-[0.5rem]">
                    <div>
                      <div className="flex flex-col gap-[0.5rem]">
                        <IconButton
                          onClick={() =>
                            form.setValue(
                              "p1.score",
                              (form.getValues("p1.score") || 0) + 1
                            )
                          }
                          icon="/icons/exposure_plus_1.svg"
                          style={{
                            backgroundSize: "1.6rem",
                          }}
                          mode="primary"
                        />
                        <NumberForm
                          className="w-[2.8rem]"
                          name={"p1.score"}
                          cleanValue={score?.p1.score}
                        />
                        <IconButton
                          onClick={() =>
                            form.setValue(
                              "p1.score",
                              (form.getValues("p1.score") || 0) - 1
                            )
                          }
                          icon="/icons/exposure_neg_1.svg"
                          style={{
                            backgroundSize: "1.6rem",
                          }}
                          mode="primary"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col gap-[0.5rem]">
                        <IconButton
                          onClick={() => {
                            form.setValue("p1", {
                              team: "",
                              playerName: "",
                              score: 0,
                              twitterID: "",
                            })
                            form.setValue("p2", {
                              team: "",
                              playerName: "",
                              score: 0,
                              twitterID: "",
                            })
                          }}
                          icon="/icons/backspace.svg"
                        />
                        <IconButton
                          onClick={() => {
                            const [p1, p2] = form.getValues(["p1", "p2"])
                            form.setValue("p1", p2)
                            form.setValue("p2", p1)
                          }}
                          icon="/icons/swap_horiz.svg"
                        />
                        <IconButton
                          onClick={() => {
                            const [p1, p2] = form.getValues(["p1", "p2"])
                            form.setValue("p1", {
                              ...p1,
                              score: 0,
                            })
                            form.setValue("p2", {
                              ...p2,
                              score: 0,
                            })
                          }}
                          icon="/icons/exposure.svg"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col gap-[0.5rem]">
                        <IconButton
                          onClick={() =>
                            form.setValue(
                              "p2.score",
                              (form.getValues("p2.score") || 0) + 1
                            )
                          }
                          icon="/icons/exposure_plus_1.svg"
                          style={{
                            backgroundSize: "1.6rem",
                          }}
                          mode="primary"
                        />
                        <NumberForm
                          className="w-[2.8rem]"
                          name={"p2.score"}
                          cleanValue={score?.p2.score}
                        />
                        <IconButton
                          onClick={() =>
                            form.setValue(
                              "p2.score",
                              (form.getValues("p2.score") || 0) - 1
                            )
                          }
                          icon="/icons/exposure_neg_1.svg"
                          style={{
                            backgroundSize: "1.6rem",
                          }}
                          mode="primary"
                        />
                      </div>
                    </div>
                  </div>
                  <h6 className="mt-[-0.3rem] text-center">SCORE RESET</h6>
                </div>
                <div className="flex w-full gap-[1rem]">
                  <div className="flex w-full flex-col gap-[0.5rem]">
                    <h6 className="mb-[-0.3rem] w-full text-right">2P</h6>
                    <TextForm
                      name="p2.team"
                      placeholder="2P Team"
                      autocomplete="team"
                      cleanValue={score?.p2.team}
                    />
                    <TextForm
                      name="p2.playerName"
                      placeholder="2P Player"
                      autocomplete="playerName"
                      cleanValue={score?.p2.playerName}
                    />
                    {setting.scoreboard.cameraAndLogo
                      .displayCameraAndTwitterID && (
                      <TextForm
                        name="p2.twitterID"
                        placeholder="@2PTwitterID"
                        cleanValue={score?.p2.twitterID}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-center">
                <StreamQueueTable
                  setting={setting}
                  onChange={(queue) => {
                    form.setValue("p1.team", queue.p1?.team ?? "")
                    form.setValue("p1.playerName", queue.p1?.playerName ?? "")
                    form.setValue("p1.score", queue.p1?.score ?? 0)
                    form.setValue("p1.twitterID", queue.p1?.twitterID ?? "")

                    form.setValue("p2.team", queue.p2?.team ?? "")
                    form.setValue("p2.playerName", queue.p2?.playerName ?? "")
                    form.setValue("p2.score", queue.p2?.score ?? 0)
                    form.setValue("p2.twitterID", queue.p2?.twitterID ?? "")
                    form.setValue("round", queue.roundText)
                  }}
                  id="scoreAndCameraStreamQueueTable"
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default memo(ScoreAndCamera)
