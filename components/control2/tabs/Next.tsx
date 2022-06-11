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

  watch("isNow")
  watch("round")
  watch("matchType")

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full justify-center">
          <div className="flex gap-[2rem] flex-col w-full max-w-[60rem] justify-center">
            <div className="relative flex gap-[1rem]">
              <Button
                type="submit"
                mode="normal"
                full
                className="w-[12rem]"
                tooltipText="適用されました"
                showTooltip={showTooltip}
              >
                適用する
              </Button>
              <Button
                type="button"
                mode="normal"
                className="w-[12rem]"
                full
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
            <div
              style={{
                opacity: getValues("isNow") ? 0.3 : 1,
              }}
            >
              <h4>次の試合の情報</h4>
              <RoundSelector
                round={getValues("round")}
                setRound={(round) => {
                  form.setValue("round", round)
                }}
                disabled={getValues("isNow")}
                cleanValue={matchIntervalInfo?.round}
              />
              <div className="w-full mt-[1rem]">
                <div className="flex justify-center gap-[1rem]">
                  <div className="flex gap-[0.5rem] w-full">
                    <TextForm
                      className="max-w-[10rem]"
                      label="1P Team"
                      name="p1.team"
                      placeholder="Team"
                      autocomplete="team"
                      cleanValue={matchIntervalInfo?.p1.team}
                    />
                    <TextForm
                      className="w-full max-w-[21rem]"
                      label="Name"
                      name="p1.playerName"
                      placeholder="Player"
                      autocomplete="playerName"
                      cleanValue={matchIntervalInfo?.p1.playerName}
                    />
                  </div>
                  <div className="flex gap-[0.5rem] w-full">
                    <TextForm
                      className="max-w-[10rem]"
                      label="2P Team"
                      name="p2.team"
                      placeholder="Team"
                      autocomplete="team"
                      cleanValue={matchIntervalInfo?.p2.team}
                    />
                    <TextForm
                      className="w-full max-w-[21rem]"
                      label="Name"
                      name="p2.playerName"
                      placeholder="Player"
                      autocomplete="playerName"
                      cleanValue={matchIntervalInfo?.p2.playerName}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <StreamQueueTable
                setting={setting}
                onChange={(queue) => {
                  form.setValue("p1.playerName", queue.p1?.playerName ?? "")
                  form.setValue("p2.playerName", queue.p2?.playerName ?? "")

                  form.setValue("round", queue.roundText)
                }}
                trackNext={true}
                id="nextStreamQueueTable"
              />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(Next)