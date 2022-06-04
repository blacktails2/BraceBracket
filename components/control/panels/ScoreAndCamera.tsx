import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import { useScore } from "../../../hooks/useScore"
import { useSetting } from "../../../hooks/useSetting"
import { Score } from "../../../libs/const"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { MatchTypeSelector } from "../../parts/MatchTypeSelector"
import { NumberForm } from "../../parts/NumberForm"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { RoundSelector } from "../../parts/RoundSelector"
import { SmallButton } from "../../parts/SmallButton"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"
import { StreamQueueTable } from "../parts/StreamQueueTable"

export const ScoreAndCamera: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [score, setScore] = useScore(id)
  const [setting] = useSetting(id)
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
            {setting?.scoreboard.cameraAndLogo.displayCameraAndTwitterID && (
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
            )}
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
              <RoundSelector
                round={scoreForm.getValues("round")}
                setRound={(round) => scoreForm.setValue("round", round)}
              />
              <MatchTypeSelector
                matchType={scoreForm.getValues("matchType")}
                setMatchType={(matchType) =>
                  scoreForm.setValue("matchType", matchType)
                }
              />
              {!setting?.scoreboard.cameraAndLogo.useLogo && (
                <div>
                  <label className="block">大会名</label>
                  <textarea
                    className={`border-[1px] border-[solid] border-[color:var(--light-primary)] rounded-[0.5rem] px-[1rem] py-[0.5rem] focus:outline-none focus:border-[color:var(--bb-beige)] resize-none`}
                    cols={10}
                    rows={3}
                    {...scoreForm.register("tournamentName")}
                  ></textarea>
                </div>
              )}
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
