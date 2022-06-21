import { useRouter } from "next/router"
import { FC, memo, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import {
  MatchIntervalInfo,
  MatchIntervalInfo as FormType,
  Setting,
} from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { IconButton } from "../parts/IconButton"
import { MatchTypeSelector } from "../parts/MatchTypeSelector"
import { RoundSelector } from "../parts/RoundSelector"
import { StreamQueueTable } from "../parts/StreamQueueTable"
import { TextForm } from "../parts/TextForm"

const Next: FC<{
  setting: Setting
  matchIntervalInfo: MatchIntervalInfo
  setMatchIntervalInfo: (matchIntervalInfo: MatchIntervalInfo) => void
}> = ({ setting, matchIntervalInfo, setMatchIntervalInfo }) => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<FormType>()
  const { reset, handleSubmit, watch, getValues } = form
  useEffect(() => {
    reset(matchIntervalInfo)
  }, [reset, matchIntervalInfo])

  const onSubmit: SubmitHandler<FormType> = (data) => {
    setMatchIntervalInfo(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

  watch()

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="w-full">
              <CheckBoxForm
                label="現在の試合状況を表示する"
                name="isNow"
                cleanValue={matchIntervalInfo?.isNow}
              />
            </div>
            <hr className="my-[1rem] h-[1px] bg-[#c4c4c4]" />
            <div
              style={{
                opacity: getValues("isNow") ? 0.3 : 1,
              }}
              className="flex flex-col gap-[1rem]"
            >
              <div className="flex gap-[1rem]">
                <div className="basis-2/3">
                  <RoundSelector
                    round={form.getValues("round")}
                    setRound={(round) => form.setValue("round", round)}
                    cleanValue={matchIntervalInfo?.round}
                  />
                </div>
                <div className="basis-1/3">
                  <MatchTypeSelector
                    matchType={form.getValues("matchType")}
                    setMatchType={(matchType) =>
                      form.setValue("matchType", matchType)
                    }
                    cleanValue={matchIntervalInfo?.matchType}
                  />
                </div>
              </div>
              <div>
                <CheckBoxForm
                  className="flex flex-col justify-end"
                  label="全て大文字にする"
                  name="uppercase"
                  id="next-uppercase"
                  cleanValue={matchIntervalInfo?.uppercase}
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
                      cleanValue={matchIntervalInfo?.p1.team}
                    />
                    <TextForm
                      name="p1.playerName"
                      placeholder="1P Player"
                      autocomplete="playerName"
                      cleanValue={matchIntervalInfo?.p1.playerName}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-[0.2rem]">
                  <div className="relative text-center text-[1rem]">
                    &nbsp;
                    <h6 className="absolute top-[0px] left-[50%] w-fit translate-x-[-50%] whitespace-nowrap text-center">
                      ALL RESET
                    </h6>
                  </div>
                  <div className="flex">
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-[1rem]">
                  <div className="flex w-full flex-col gap-[0.5rem]">
                    <h6 className="mb-[-0.3rem] w-full text-right">2P</h6>
                    <TextForm
                      name="p2.team"
                      placeholder="2P Team"
                      autocomplete="team"
                      cleanValue={matchIntervalInfo?.p2.team}
                    />
                    <TextForm
                      name="p2.playerName"
                      placeholder="2P Player"
                      autocomplete="playerName"
                      cleanValue={matchIntervalInfo?.p2.playerName}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-center">
                <StreamQueueTable
                  setting={setting}
                  onChange={(queue) => {
                    const p1 = queue.p1 ?? {
                      team: "",
                      playerName: "",
                      score: 0,
                      twitterID: "",
                    }
                    const p2 = queue.p2 ?? {
                      team: "",
                      playerName: "",
                      score: 0,
                      twitterID: "",
                    }

                    if (
                      form.getValues("p1.team") !== p1.team ||
                      form.getValues("p1.playerName") !== p1.playerName ||
                      form.getValues("p2.team") !== p2.team ||
                      form.getValues("p2.playerName") !== p2.playerName
                    ) {
                      form.setValue("p1.team", queue.p1?.team ?? "")
                      form.setValue("p1.playerName", queue.p1?.playerName ?? "")

                      form.setValue("p2.team", queue.p2?.team ?? "")
                      form.setValue("p2.playerName", queue.p2?.playerName ?? "")
                      form.setValue("round", queue.roundText)
                    }
                  }}
                  trackNext={true}
                  id="nextStreamQueueTable"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(Next)
