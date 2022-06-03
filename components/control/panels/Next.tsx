import { FC, useEffect, useState } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { useOrigin } from "../../../hooks/useOrigin"
import { useRouter } from "next/router"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useMatchIntervalInfo } from "../../../hooks/useMatchIntervalInfo"
import { MatchIntervalInfo as FormType } from "../../../libs/const"
import { TextForm } from "../../parts/TextForm"
import { SelectForm } from "../../parts/SelectForm"
import { Button } from "../../parts/Button"
import { StreamQueueTable } from "../parts/StreamQueueTable"
import { NumberForm } from "../../parts/NumberForm"
import { SmallButton } from "../../parts/SmallButton"

export const Next: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [matchIntervalInfo, setMatchIntervalInfo, loading] =
    useMatchIntervalInfo(id)
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<FormType>()
  const { reset, handleSubmit, watch, getValues } = form
  const onSubmit: SubmitHandler<FormType> = (data) => {
    setMatchIntervalInfo(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }
  useEffect(() => {
    if (loading || !matchIntervalInfo) return

    reset(matchIntervalInfo)
  }, [loading, matchIntervalInfo, reset])

  watch("isNow")
  watch("round")
  watch("matchType")

  return (
    <ControlPanel title="試合間情報" url={`${origin}/obs/next/?id=${id}`}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <div className="overflow-x-auto">
            <StreamQueueTable
              onChange={(queue) => {
                form.setValue("p1.playerName", queue.p1?.playerName ?? "")
                form.setValue("p2.playerName", queue.p2?.playerName ?? "")

                form.setValue("round", queue.roundText)
              }}
            />
          </div>
          <CheckBoxForm
            label="現在の試合状況を表示する"
            name="isNow"
            className="mt-[1rem]"
          />
          <div
            style={{
              opacity: getValues("isNow") ? 0.3 : 1,
            }}
          >
            <div className="flex flex-wrap gap-[3rem]">
              <div>
                <h4 className="mt-[2rem] mb-[0.5rem]">
                  次の試合のプレイヤー名
                </h4>
                <div className="flex flex-wrap gap-[1rem]">
                  <div>
                    <div className="flex flex-wrap gap-[1rem]">
                      <TextForm
                        className="w-[8rem]"
                        label="1P チーム名"
                        name="p1.team"
                        placeholder="Team"
                        autocomplete="team"
                      />
                      <TextForm
                        className="w-[18rem]"
                        label="1P プレイヤー名"
                        name="p1.playerName"
                        placeholder="Player"
                        autocomplete="playerName"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex flex-wrap gap-[1rem]">
                      <TextForm
                        className="w-[8rem]"
                        label="2P チーム名"
                        name="p2.team"
                        placeholder="Team"
                        autocomplete="team"
                      />
                      <TextForm
                        className="w-[18rem]"
                        label="2P プレイヤー名"
                        name="p2.playerName"
                        placeholder="Player"
                        autocomplete="playerName"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mt-[2rem] mb-[0.5rem]">次の試合のステータス</h4>
                <div>
                  <div className="flex flex-wrap gap-[1rem]">
                    <div>
                      <label className="block">ラウンド</label>
                      <div className="flex flex-wrap gap-[0.4rem] w-fit">
                        {(() => {
                          const round = form.getValues("round")
                          const isNow = form.getValues("isNow")
                          const values = [
                            "Winners",
                            "Losers",
                            "Pools",
                            "Grand",
                            "Friendlies",
                          ]
                          return values.map((name) => {
                            return (
                              <div
                                key={name}
                                className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] ${
                                  round?.startsWith(name)
                                    ? "bg-black text-white"
                                    : "bg-white text-black"
                                } ${isNow ? "" : "cursor-pointer"}`}
                                onClick={() => {
                                  if (isNow) {
                                    return
                                  }
                                  let newRound = round ?? ""
                                  let replaced = false
                                  for (const r of values) {
                                    if (newRound?.startsWith(r)) {
                                      newRound = newRound.replace(r, name)
                                      replaced = true
                                      break
                                    }
                                  }
                                  if (!replaced) {
                                    newRound = name + newRound
                                  }

                                  form.setValue("round", newRound)
                                }}
                              >
                                {name}
                              </div>
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
                            const round = form.getValues("round")
                            const isNow = form.getValues("isNow")
                            return (
                              <div
                                key={name}
                                className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] ${
                                  round?.endsWith(name)
                                    ? "bg-black text-white"
                                    : "bg-white text-black"
                                } ${isNow ? "" : "cursor-pointer"}`}
                                onClick={() => {
                                  if (isNow) {
                                    return
                                  }
                                  let newRound = round ?? ""
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

                                  form.setValue("round", newRound)
                                }}
                              >
                                {name.replace("Top", "")}
                              </div>
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
                          const isNow = form.getValues("isNow")
                          return values.map((name) => {
                            const matchType = form.getValues("matchType")
                            return (
                              <div
                                key={name}
                                className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] cursor-pointer ${
                                  matchType?.endsWith(name)
                                    ? "bg-black text-white"
                                    : "bg-white text-black"
                                } ${isNow ? "" : "cursor-pointer"}`}
                                onClick={() => {
                                  if (isNow) {
                                    return
                                  }
                                  let newMatchType = matchType ?? ""
                                  let replaced = false
                                  for (const r of values) {
                                    if (newMatchType.endsWith(r)) {
                                      newMatchType = newMatchType.replace(
                                        r,
                                        name
                                      )
                                      replaced = true
                                      break
                                    }
                                  }
                                  if (!replaced) {
                                    newMatchType = newMatchType + name
                                  }

                                  form.setValue("matchType", newMatchType)
                                }}
                              >
                                {name.replace("Top", "")}
                              </div>
                            )
                          })
                        })()}
                      </div>
                      <TextForm name="matchType" placeholder="Best of 3" />
                    </div>
                  </div>
                  <CheckBoxForm
                    label="すべて大文字にする"
                    name="uppercase"
                    id="next.uppercase"
                    className="mt-[10px]"
                    disabled={getValues("isNow")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[2rem]">
            <PrimaryButton
              type="submit"
              className="w-[194px] mt-[30px]"
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
                form.reset()
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
