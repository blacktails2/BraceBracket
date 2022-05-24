import { FC, useEffect } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { useOrigin } from "../../../hooks/useOrigin"
import { useRouter } from "next/router"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useMatchIntervalInfo } from "../../../hooks/useMatchIntervalInfo"
import { MatchIntervalInfo as FormType } from "../../../libs/const"
import { TextForm } from "../../parts/TextForm"
import { SelectForm } from "../../parts/SelectForm"

export const MatchIntervalInfo: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [matchIntervalInfo, setMatchIntervalInfo, loading] =
    useMatchIntervalInfo(id)
  const form = useForm<FormType>()
  const { reset, handleSubmit } = form
  const onSubmit: SubmitHandler<FormType> = (data) => {
    setMatchIntervalInfo(data)
  }
  useEffect(() => {
    if (loading || !matchIntervalInfo) return

    reset(matchIntervalInfo)
  }, [loading, matchIntervalInfo, reset])

  return (
    <ControlPanel
      title="試合間情報"
      url={`${origin}/obs/matchIntervalInfo?id=${id}`}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <Button type="submit" className="w-full">
            start.ggから配信台の情報を取得
          </Button>
          <CheckBoxForm
            label="現在の試合状況を表示する"
            name="autoUpdate"
            className="mt-[10px]"
          />
          <div className="flex gap-[30px]">
            <div>
              <h4 className="mt-[20px] mb-[5px]">次の試合のプレイヤー名</h4>
              <div className="flex flex-col gap-[10px]">
                <TextForm
                  label="P1"
                  name="nextPlayer1"
                  placeholder="PlayerName"
                />
                <TextForm
                  label="P2"
                  name="nextPlayer2"
                  placeholder="PlayerName"
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
                    options={[{ text: "Pools", value: "Pools" }]}
                  />
                  <SelectForm
                    label="試合形式"
                    name="matchType"
                    options={[{ text: "Best of 5", value: "Best of 5" }]}
                  />
                </div>
                <CheckBoxForm
                  label="すべて大文字にする"
                  name="uppercase"
                  className="mt-[10px]"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-[194px] mt-[30px]" full>
            適用する
          </Button>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
