import type { NextPage } from "next"
import { useScore } from "../../hooks/useScore"
import { useSetting } from "../../hooks/useSetting"
import { Scoreboard } from "../../components/obs/score/Scoreboard"
import { useEffect } from "react"
import { useSceneChanger } from "../../hooks/sceneChangerHook"
import { useRouter } from "next/router"
import { ScoreboardLayout } from "../../libs/const"

const Layout: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const obs = router.query.obs as string
  const [setting] = useSetting(id)
  const [score] = useScore(id)
  const [currentScene, _, sceneList] = useSceneChanger(id, obs === "on")

  useEffect(() => {
    console.log(setting, score)
  }, [setting, score])

  useEffect(() => {
    console.log(currentScene, sceneList)
  }, [currentScene, sceneList])

  const getScoreBoard = (type: ScoreboardLayout | undefined) => {
    if (!setting || !score || !type) return null
    switch (type) {
      default:
        return <Scoreboard setting={setting} score={score} />
    }
  }

  return getScoreBoard(setting?.scoreboard.design.layout)
}

export default Layout
