import { useRouter } from "next/router"

import { Scoreboard } from "../../components/obs/score/Scoreboard"
import { useScore } from "../../hooks/useScore"
import { useSetting } from "../../hooks/useSetting"

import type { NextPage } from "next"

const Layout: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [score] = useScore(id)
  // const obs = router.query.obs as string
  // const [currentScene, _, sceneList] = useSceneChanger(id, obs === "on")

  if (!setting || !score) return null
  return <Scoreboard setting={setting} score={score} />
}

export default Layout
