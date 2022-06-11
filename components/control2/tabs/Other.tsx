import { FC, memo, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { MatchIntervalInfo, Score } from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { MatchTypeSelector } from "../../parts/MatchTypeSelector"

const Other: FC<{
  score: Score
  setScore: (score: Score) => void
  matchIntervalInfo: MatchIntervalInfo
  setMatchIntervalInfo: (matchIntervalInfo: MatchIntervalInfo) => void
}> = ({ score, setScore, matchIntervalInfo, setMatchIntervalInfo }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<{
    matchType: string
    tournamentName: string
    uppercase: boolean
  }>()

  useEffect(() => {
    form.reset({
      matchType: score.matchType,
      tournamentName: score.tournamentName,
      uppercase: score.uppercase,
    })
  }, [form, score])

  const onSubmit = (data: {
    matchType: string
    tournamentName: string
    uppercase: boolean
  }) => {
    setScore({
      ...score,
      matchType: data.matchType,
      tournamentName: data.tournamentName,
      uppercase: data.uppercase,
    })
    setMatchIntervalInfo({
      ...matchIntervalInfo,
      matchType: data.matchType,
      uppercase: data.uppercase,
    })
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <div className="flex flex-wrap w-full gap-[1rem]">
              <MatchTypeSelector
                matchType={form.getValues("matchType")}
                setMatchType={(matchType) =>
                  form.setValue("matchType", matchType)
                }
                cleanValue={score?.matchType}
              />
              <CheckBoxForm
                className="mt-[1rem] flex flex-col justify-end"
                label="試合形式・ラウンド名を大文字にする"
                name="uppercase"
                cleanValue={score?.uppercase}
              />
            </div>
            <div className="flex w-full">
              <div>
                <label className="block">大会名</label>
                <textarea
                  className={`border-[1px] border-[solid] border-[color:var(--light-primary)] rounded-[0.5rem] px-[1rem] py-[0.5rem] focus:outline-none focus:border-[color:var(--bb-beige)] resize-none`}
                  cols={10}
                  rows={3}
                  {...form.register("tournamentName")}
                  style={
                    score?.tournamentName !== form.getValues("tournamentName")
                      ? { backgroundColor: "var(--bb-dirty)" }
                      : {}
                  }
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default memo(Other)
