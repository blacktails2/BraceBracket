import { useRouter } from "next/router"
import { useEffect } from "react"
import { MC } from "../components/control/panels/MC"
import { Next } from "../components/control/panels/Next"
import { ScoreAndCamera } from "../components/control/panels/ScoreAndCamera"
import { Top8Bracket } from "../components/control/panels/Top8Bracket"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import { TextboxWithCopy } from "../components/parts/TextboxWithCopy"
import { useLoadBracket } from "../hooks/useLoadBracket"
import { useMatchIntervalInfo } from "../hooks/useMatchIntervalInfo"
import { useMC } from "../hooks/useMC"
import { useOrigin } from "../hooks/useOrigin"
import { useScore } from "../hooks/useScore"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout } from "../libs/const"
import styles from "./control.module.scss"

const Control: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  const [score, setScore, scoreLoading] = useScore(id)
  const [matchIntervalInfo, setMatchIntervalInfo, matchIntervalInfoLoading] =
    useMatchIntervalInfo(id)
  const [mc, setMC, mcLoading] = useMC(id)
  const [loadBracket, requestLoad, loadBracketLoading] = useLoadBracket(id)
  const [setting, , loadingSetting] = useSetting(id)
  useEffect(() => {
    if (
      !scoreLoading &&
      !matchIntervalInfoLoading &&
      !mcLoading &&
      !loadBracketLoading &&
      !loadingSetting
    ) {
      if (
        process.env.NODE_ENV === "production" ||
        process.env.LOAD_FONT === "ON"
      ) {
        console.log("font loaded")
        window.FONTPLUS?.reload()
      }
    }
  }, [
    scoreLoading,
    matchIntervalInfoLoading,
    mcLoading,
    loadBracketLoading,
    loadingSetting,
    setting,
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.right}>
          <h2>スコアを編集</h2>
        </div>
        <div className={styles.left}>
          <div>
            <div>共有URL:</div>
            <div>
              <TextboxWithCopy text={`${origin}${router.asPath}`} />
            </div>
            <div>歯車</div>
          </div>
          <p>
            URLを共有することで複数人で編集することができます。URLの流失にはご注意ください。
          </p>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <ScoreAndCamera id={id} score={score} setScore={setScore} />
        <Next
          id={id}
          matchIntervalInfo={matchIntervalInfo}
          setMatchIntervalInfo={setMatchIntervalInfo}
          loading={matchIntervalInfoLoading}
        />
        <MC id={id} mc={mc} setMC={setMC} loading={mcLoading} />
        <Top8Bracket
          id={id}
          loadBracket={loadBracket}
          requestLoad={requestLoad}
          loading={loadBracketLoading}
        />
      </div>
    </div>
  )
}
Control.getLayout = (page) => {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Control
