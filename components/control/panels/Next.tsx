import { FC, useEffect } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useOrigin } from "../../../hooks/useOrigin"
import {
  MatchIntervalInfo,
  MatchIntervalInfo as FormType,
} from "../../../libs/const"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { SelectForm } from "../../parts/SelectForm"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"
import { StreamQueueTable } from "../parts/StreamQueueTable"

export const Next: FC<{
  id?: string
  matchIntervalInfo?: MatchIntervalInfo
  setMatchIntervalInfo: (value: MatchIntervalInfo) => void
  loading: boolean
}> = ({ id, matchIntervalInfo, setMatchIntervalInfo, loading }) => {
  const origin = useOrigin()
  const form = useForm<FormType>()
  const { reset, handleSubmit, watch, getValues } = form
  const onSubmit: SubmitHandler<FormType> = (data) => {
    setMatchIntervalInfo(data)
  }

  useEffect(() => {
    if (loading || !matchIntervalInfo) return

    reset(matchIntervalInfo)
  }, [loading, matchIntervalInfo, reset])

  watch("isNow")

  return (
    <ControlPanel title="試合間情報" url={`${origin}/obs/next/?id=${id}`}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <StreamQueueTable
            onChange={(queue) => {
              form.setValue("p1.playerName", queue.p1?.playerName ?? "")
              form.setValue("p2.playerName", queue.p2?.playerName ?? "")

              form.setValue("round", queue.roundText)
            }}
          />
          <CheckBoxForm
            label="現在の試合状況を表示する"
            name="isNow"
            className="mt-[10px]"
          />
          <div
            style={{
              opacity: getValues("isNow") ? 0.3 : 1,
            }}
          >
            <div className="flex gap-[30px]">
              <div>
                <h4 className="mt-[20px] mb-[5px]">次の試合のプレイヤー名</h4>
                <div className="flex flex-col gap-[10px]">
                  <TextForm
                    label="P1"
                    name="p1.playerName"
                    placeholder="PlayerName"
                    autocomplete="playerName"
                    disabled={getValues("isNow")}
                  />
                  <TextForm
                    label="P2"
                    name="p2.playerName"
                    placeholder="PlayerName"
                    autocomplete="playerName"
                    disabled={getValues("isNow")}
                  />
                </div>
              </div>
              <div>
                <h4 className="mt-[20px] mb-[5px]">次の試合のステータス</h4>
                <div>
                  <div className="flex gap-[10px]">
                    <SelectForm
                      label="ラウンド"
                      name="round"
                      options={[
                        { text: "Pools", value: "Pools" },
                        {
                          text: "Losers Quarter-Final",
                          value: "Losers Quarter-Final",
                        },
                        {
                          text: "Losers Semi-Final",
                          value: "Losers Semi-Final",
                        },
                        { text: "Losers Final", value: "Losers Final" },
                        {
                          text: "Winners Quarter-Final",
                          value: "Winners Quarter-Final",
                        },
                        {
                          text: "Winners Semi-Final",
                          value: "Winners Semi-Final",
                        },
                        { text: "Winners Final", value: "Winners Final" },
                        { text: "Grand Final", value: "Grand Final" },
                      ]}
                      disabled={getValues("isNow")}
                    />
                    <SelectForm
                      label="試合形式"
                      name="matchType"
                      options={[
                        { text: "Best of 3", value: "Best of 3" },
                        { text: "Best of 5", value: "Best of 5" },
                      ]}
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
          <PrimaryButton type="submit" className="w-[194px] mt-[30px]" full>
            適用する
          </PrimaryButton>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
