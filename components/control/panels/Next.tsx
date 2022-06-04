import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { useMatchIntervalInfo } from "../../../hooks/useMatchIntervalInfo"
import { useOrigin } from "../../../hooks/useOrigin"
import { MatchIntervalInfo as FormType } from "../../../libs/const"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { MatchTypeSelector } from "../../parts/MatchTypeSelector"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { RoundSelector } from "../../parts/RoundSelector"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"
import { StreamQueueTable } from "../parts/StreamQueueTable"

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
                    <RoundSelector
                      round={getValues("round")}
                      setRound={(round) => {
                        form.setValue("round", round)
                      }}
                      disabled={getValues("isNow")}
                    />
                    <MatchTypeSelector
                      matchType={getValues("matchType")}
                      setMatchType={(matchType) => {
                        form.setValue("matchType", matchType)
                      }}
                      disabled={getValues("isNow")}
                    />
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
