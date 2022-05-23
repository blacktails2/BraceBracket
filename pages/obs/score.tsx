import type { NextPage } from "next"
import { useScore } from "../../hooks/useScore"
import { useSetting } from "../../hooks/useSetting"
import { Dual } from "../../components/obs/score/Dual"
import { Single } from "../../components/obs/score/Single"
import { Solid } from "../../components/obs/score/Solid"
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
      case "Dual":
        return <Dual setting={setting} score={score} />
      case "Single":
        return <Single setting={setting} score={score} />
      case "Solid":
        return <Solid setting={setting} score={score} />
      default:
        return <Dual setting={setting} score={score} />
    }
  }

  return getScoreBoard(setting?.scoreboard.design.layout)
}

export default Layout
