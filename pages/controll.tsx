import type { NextPage } from "next"
import { useSetting } from "../hooks/settingHook"
import { useEffect } from "react"
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { Score, Setting } from "../libs/const"
import { useScore } from "../hooks/scoreHook"
import { TypeSelector } from "../components/controll/TypeSelector"
import { StyleSelector } from "../components/controll/StyleSelector"
import { useRouter } from "next/router"
import Link from "next/link"
import { useSceneChanger } from "../hooks/sceneChangerHook"

const Controll: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string

  const [setting, setSetting] = useSetting(id)
  const settingForm = useForm<Setting>()
  settingForm.watch("scoreboard_type")
  const onSettingSubmit: SubmitHandler<Setting> = (data) => {
    setSetting(data)
  }

  useEffect(() => {
    settingForm.setValue("scoreboard_type", setting.scoreboard_type)
    settingForm.setValue("scoreboard_style", setting.scoreboard_style)
  }, [setting, settingForm])

  const [score, setScore] = useScore(id)
  const scoreForm = useForm<Score>()
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
  }
  useEffect(() => {
    scoreForm.setValue("p1_team", score.p1_team)
    scoreForm.setValue("p1_player_name", score.p1_player_name)
    scoreForm.setValue("p1_score", score.p1_score)
    scoreForm.setValue("p2_team", score.p2_team)
    scoreForm.setValue("p2_player_name", score.p2_player_name)
    scoreForm.setValue("p2_score", score.p2_score)
    scoreForm.setValue("round", score.round)
    scoreForm.setValue("match_type", score.match_type)
    scoreForm.setValue("tournament_name", score.tournament_name)
  }, [scoreForm, score])

  const [currentScene, setCurrentScene, sceneList] = useSceneChanger(id, false)
  const sceneForm = useForm<{ currentScene: string }>()
  const onSceneSubmit: SubmitHandler<{ currentScene: string }> = ({
    currentScene,
  }) => {
    setCurrentScene(currentScene)
  }
  useEffect(() => {
    sceneForm.setValue("currentScene", currentScene)
  }, [sceneForm, currentScene])

  return (
    <div>
      <FormProvider {...settingForm}>
        <form onSubmit={settingForm.handleSubmit(onSettingSubmit)}>
          <div>
            <TypeSelector />
            <StyleSelector
              selectedType={settingForm.getValues("scoreboard_type")}
            />
            <button type="submit">設定</button>
          </div>
        </form>
      </FormProvider>
      <div>
        <Link
          href={{
            pathname: "/layout",
            query: {
              id: id,
            },
          }}
          passHref
        >
          <a target="_blank">OBS用ページ</a>
        </Link>
      </div>
      <form onSubmit={scoreForm.handleSubmit(onScoreSubmit)}>
        <div>
          <div style={{ display: "flex" }}>
            <div>
              <div>1Pチーム名</div>
              <input type="text" {...scoreForm.register("p1_team")} />
            </div>
            <div>
              <div>1Pプレイヤー名</div>
              <input type="text" {...scoreForm.register("p1_player_name")} />
            </div>
            <div>
              <div>1Pスコア</div>
              <input type="number" {...scoreForm.register("p1_score")} />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <div>2Pチーム名</div>
              <input type="text" {...scoreForm.register("p2_team")} />
            </div>
            <div>
              <div>2Pプレイヤー名</div>
              <input type="text" {...scoreForm.register("p2_player_name")} />
            </div>
            <div>
              <div>2Pスコア</div>
              <input type="number" {...scoreForm.register("p2_score")} />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div>
              <div>ラウンド</div>
              <input type="text" {...scoreForm.register("round")} />
            </div>
            <div>
              <div>試合形式</div>
              <input type="text" {...scoreForm.register("match_type")} />
            </div>
            <div>
              <div>大会名</div>
              <input type="text" {...scoreForm.register("tournament_name")} />
            </div>
          </div>
          <button type="submit">反映</button>
        </div>
      </form>
      <form onSubmit={sceneForm.handleSubmit(onSceneSubmit)}>
        <Controller
          control={sceneForm.control}
          name="currentScene"
          render={({ field }) => (
            <>
              {sceneList.map((scene) => {
                return (
                  <div key={scene}>
                    <label>
                      <input
                        type="radio"
                        {...field}
                        value={scene}
                        checked={field.value === scene}
                      />
                      {scene}
                    </label>
                  </div>
                )
              })}
            </>
          )}
        />
        <button type="submit">反映</button>
      </form>
    </div>
  )
}

export default Controll
