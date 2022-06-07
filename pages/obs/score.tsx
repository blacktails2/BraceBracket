import Head from "next/head"
import { useRouter } from "next/router"

import { Scoreboard } from "../../components/obs/score/Scoreboard"
import { useScore } from "../../hooks/useScore"
import { useSetting } from "../../hooks/useSetting"

import type { NextPage } from "next"

const Layout: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, , loadingSetting] = useSetting(id)
  const [score, , loadingScore] = useScore(id)
  // const obs = router.query.obs as string
  // const [currentScene, _, sceneList] = useSceneChanger(id, obs === "on")

  if (!setting || loadingSetting || !score || loadingScore) return null
  return (
    <>
      <Head>
        <title>BraceBracket | Score Layout</title>
      </Head>
      <div className="relative">
        <Scoreboard setting={setting} score={score} />
      </div>
    </>
  )
}

export default Layout
