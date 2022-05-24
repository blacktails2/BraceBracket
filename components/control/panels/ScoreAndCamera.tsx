import { FC, useEffect } from "react"
import { ControlPanel } from "../parts/ControlPanel"
import { Button } from "../../parts/Button"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useScore } from "../../../hooks/useScore"
import { Score } from "../../../libs/const"
import { useRouter } from "next/router"
import { useOrigin } from "../../../hooks/useOrigin"
import { TextForm } from "../../parts/TextForm"
import { NumberForm } from "../../parts/NumberForm"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { SelectForm } from "../../parts/SelectForm"

export const ScoreAndCamera: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [score, setScore] = useScore(id)
  const scoreForm = useForm<Score>()
  const { handleSubmit, reset, register } = scoreForm
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
  }
  useEffect(() => {
    reset(score)
  }, [reset, score])
  return (
    <ControlPanel title="スコア&カメラ" url={`${origin}/obs/score?id=${id}`}>
      <FormProvider {...scoreForm}>
        <form onSubmit={handleSubmit(onScoreSubmit)}>
          <hr />
          <Button>start.ggから配信代の情報を取得</Button>
          <div>
            <div className="flex flex-wrap gap-[30px] mt-[20px]">
              <div>
                <h4>1Pデータ</h4>
                <div className="flex gap-[10px]">
                  <TextForm
                    className="w-[100px]"
                    label="チーム名"
                    name="p1.team"
                    placeholder="Team"
                  />
                  <TextForm
                    className="w-[218px]"
                    label="プレイヤー名"
                    name="p1.playerName"
                    placeholder="Player"
                  />
                  <NumberForm
                    className="w-[60px]"
                    label={"スコア"}
                    name={"p1.score"}
                  />
                </div>
              </div>
              <div>
                <h4>2Pデータ</h4>
                <div className="flex gap-[10px]">
                  <TextForm
                    className="w-[100px]"
                    label="チーム名"
                    name="p2.team"
                    placeholder="Team"
                  />
                  <TextForm
                    className="w-[218px]"
                    label="プレイヤー名"
                    name="p2.playerName"
                    placeholder="Player"
                  />
                  <NumberForm
                    className="w-[60px]"
                    label="スコア"
                    name="p2.score"
                  />
                </div>
              </div>
            </div>
            <div className="mt-[20px]">
              <h4 className="mt-0 mb-[5px]">Twitter ID</h4>
              <div className="flex flex-wrap gap-[10px]">
                <TextForm
                  className="w-[194px]"
                  label="1P"
                  name="p1.twitterID"
                  placeholder="@user_name"
                />
                <TextForm
                  className="w-[194px]"
                  label="2P"
                  name="p2.twitterID"
                  placeholder="@user_name"
                />
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h4 className="mt-0 mb-[5px]">ステータス</h4>
            <div className="flex flex-wrap gap-[10px]">
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
              className="mt-[10px]"
              label="すべて大文字にする"
              name="uppercase"
            />
          </div>
          <Button type="submit" className="w-[194px] mt-[30px]" full>
            適用する
          </Button>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}
