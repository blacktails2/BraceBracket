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
import { StreamQueueTable } from "../parts/StreamQueueTable"
import { SmallButton } from "../../parts/SmallButton"

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
  scoreForm.watch("round")
  scoreForm.watch("matchType")
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
          scoreForm.setValue("round", queue.roundText)
        }}
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
                  />
                  <TextForm
                    className="w-[18rem]"
                    label="プレイヤー名"
                    name="p1.playerName"
                    placeholder="Player"
                    autocomplete="playerName"
                  />
                  <NumberForm
                    className="w-[5rem]"
                    label={"スコア"}
                    name={"p1.score"}
                  />
                  <SmallButton
                    className="mt-[18px]"
                    type="button"
                    onClick={() =>
                      scoreForm.setValue(
                        "p1.score",
                        (scoreForm.getValues("p1.score") ?? 0) + 1
                      )
                    }
                  >
                    +1
                  </SmallButton>
                  <SmallButton
                    className="mt-[18px]"
                    type="button"
                    onClick={() =>
                      scoreForm.setValue(
                        "p1.score",
                        (scoreForm.getValues("p1.score") ?? 0) - 1
                      )
                    }
                  >
                    -1
                  </SmallButton>
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
                  />
                  <TextForm
                    className="w-[18rem]"
                    label="プレイヤー名"
                    name="p2.playerName"
                    placeholder="Player"
                    autocomplete="playerName"
                  />
                  <NumberForm
                    className="w-[5rem]"
                    label="スコア"
                    name="p2.score"
                  />
                  <SmallButton
                    type="button"
                    className="mt-[18px]"
                    onClick={() =>
                      scoreForm.setValue(
                        "p2.score",
                        (scoreForm.getValues("p2.score") ?? 0) + 1
                      )
                    }
                  >
                    +1
                  </SmallButton>
                  <SmallButton
                    type="button"
                    className="mt-[18px]"
                    onClick={() =>
                      scoreForm.setValue(
                        "p2.score",
                        (scoreForm.getValues("p2.score") ?? 0) - 1
                      )
                    }
                  >
                    -1
                  </SmallButton>
                </div>
              </div>
            </div>
            <div className="mt-[2rem]">
              <h4 className="mt-0 mb-[0.5rem]">Twitter ID</h4>
              <div className="flex flex-wrap gap-[1rem]">
                <TextForm
                  className="w-[19rem]"
                  label="1P"
                  name="p1.twitterID"
                  placeholder="@user_name"
                />
                <TextForm
                  className="w-[19rem]"
                  label="2P"
                  name="p2.twitterID"
                  placeholder="@user_name"
                />
              </div>
            </div>
            <div className="mt-[2rem]">
              <h4>データのリセット・入れ替え</h4>
              <div className="flex flex-wrap gap-[1rem]">
                <SmallButton
                  type="button"
                  onClick={() => {
                    const [p1, p2] = scoreForm.getValues(["p1", "p2"])
                    scoreForm.setValue("p1", p2)
                    scoreForm.setValue("p2", p1)
                  }}
                >
                  1Pと2Pを入れ替える
                </SmallButton>
                <SmallButton
                  light
                  type="button"
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
                </SmallButton>
                <SmallButton
                  light
                  type="button"
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
                </SmallButton>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h4 className="mt-0 mb-[0.5rem]">ステータス</h4>
            <div className="flex flex-wrap gap-[1rem]">
              <div>
                <label className="block">ラウンド</label>
                <div className="flex flex-wrap gap-[0.4rem] w-fit">
                  {(() => {
                    const round = scoreForm.getValues("round")
                    const values = [
                      "Winners",
                      "Losers",
                      "Pools",
                      "Grand",
                      "Friendlies",
                    ]
                    return values.map((name) => {
                      return (
                        <>
                          <div
                            className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] cursor-pointer ${
                              round.startsWith(name)
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }`}
                            onClick={() => {
                              let newRound = round
                              let replaced = false
                              for (const r of values) {
                                if (newRound.startsWith(r)) {
                                  newRound = newRound.replace(r, name)
                                  replaced = true
                                  break
                                }
                              }
                              if (!replaced) {
                                newRound = name + newRound
                              }

                              scoreForm.setValue("round", newRound)
                            }}
                          >
                            {name}
                          </div>
                        </>
                      )
                    })
                  })()}
                </div>
                <div className="flex flex-wrap gap-[0.4rem] mt-[1rem] mb-[1rem] max-w-[300px]">
                  {(() => {
                    const values = [
                      "Top256",
                      "Top192",
                      "Top128",
                      "Top96",
                      "Top64",
                      "Top48",
                      "Top32",
                      "Top16",
                      "Top12",
                      "Top8",
                      "Quarters",
                      "Semis",
                      "Final",
                    ]
                    return values.map((name) => {
                      const round = scoreForm.getValues("round")
                      return (
                        <>
                          <div
                            className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] cursor-pointer ${
                              round.endsWith(name)
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }`}
                            onClick={() => {
                              let newRound = round
                              let replaced = false
                              for (const r of values) {
                                if (newRound.endsWith(r)) {
                                  newRound = newRound.replace(r, name)
                                  replaced = true
                                  break
                                }
                              }
                              if (!replaced) {
                                newRound = newRound + name
                              }

                              scoreForm.setValue("round", newRound)
                            }}
                          >
                            {name.replace("Top", "")}
                          </div>
                        </>
                      )
                    })
                  })()}
                </div>
                <TextForm name="round" placeholder="Grand Final" />
              </div>
              <div>
                <label className="block">試合形式</label>
                <div className="flex flex-wrap gap-[0.4rem] mb-[1rem] max-w-[300px]">
                  {(() => {
                    const values = ["Best of 3", "Best of 5"]
                    return values.map((name) => {
                      const matchType = scoreForm.getValues("matchType")
                      return (
                        <>
                          <div
                            className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] cursor-pointer ${
                              matchType.endsWith(name)
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }`}
                            onClick={() => {
                              let newMatchType = matchType
                              let replaced = false
                              for (const r of values) {
                                if (newMatchType.endsWith(r)) {
                                  newMatchType = newMatchType.replace(r, name)
                                  replaced = true
                                  break
                                }
                              }
                              if (!replaced) {
                                newMatchType = newMatchType + name
                              }

                              scoreForm.setValue("matchType", newMatchType)
                            }}
                          >
                            {name.replace("Top", "")}
                          </div>
                        </>
                      )
                    })
                  })()}
                </div>
                <TextForm name="matchType" placeholder="Best of 3" />
              </div>
            </div>
            <CheckBoxForm
              className="mt-[1rem]"
              label="すべて大文字にする"
              name="uppercase"
            />
          </div>
          <div className="relative flex gap-[2rem]">
            <PrimaryButton
              type="submit"
              className="w-[19rem] mt-[3rem]"
              full
              tooltipText="適用されました"
              showTooltip={showTooltip}
            >
              適用する
            </PrimaryButton>
            <PrimaryButton
              type="button"
              className="w-[19rem] mt-[3rem]"
              full
              light
              onClick={() => {
                scoreForm.reset()
              }}
            >
              変更をリセット
            </PrimaryButton>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
