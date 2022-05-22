import type { NextPage } from "next"
import { useSearchParam } from "react-use"
import { useScore } from "../hooks/scoreHook"
import { useSetting } from "../hooks/settingHook"
import { Dual } from "../components/layout/Dual"
import { Single } from "../components/layout/Single"
import { Solid } from "../components/layout/Solid"
import { useEffect } from "react"
import { useSceneChanger } from "../hooks/sceneChangerHook"

const Layout: NextPage = () => {
  const id = useSearchParam("id")
  const obs = useSearchParam("obs")
  const [setting] = useSetting(id)
  const [score] = useScore(id)
  const [currentScene, _, sceneList] = useSceneChanger(id, obs === "on")

  useEffect(() => {
    console.log(setting, score)
  }, [setting, score])

  useEffect(() => {
    console.log(currentScene, sceneList)
  }, [currentScene, sceneList])

  const getScoreBoard = (type: string) => {
    switch (type) {
      case "dual":
        return <Dual setting={setting} score={score} />
      case "single":
        return <Single setting={setting} score={score} />
      case "solid":
        return <Solid setting={setting} score={score} />
      default:
        return <Dual setting={setting} score={score} />
    }
  }

  return getScoreBoard(setting.scoreboard_type)
}

export default Layout
