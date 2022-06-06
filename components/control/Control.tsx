import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"

import { useOrigin } from "../../hooks/useOrigin"
import {
  LoadBracket,
  MatchIntervalInfo,
  Score,
  Setting,
  MC as MCType,
} from "../../libs/const"
import styles from "../../pages/control.module.scss"
import { TextboxWithCopy } from "../parts/TextboxWithCopy"

import MC from "./panels/MC"
import Next from "./panels/Next"
import ScoreAndCamera from "./panels/ScoreAndCamera"
import Top8Bracket from "./panels/Top8Bracket"

export const Control: FC<{
  setting: Setting
  setSetting: (setting: Setting) => void
  score: Score
  setScore: (score: Score) => void
  matchIntervalInfo: MatchIntervalInfo
  setMatchIntervalInfo: (matchIntervalInfo: MatchIntervalInfo) => void
  mc: MCType
  setMC: (mc: MCType) => void
  loadBracket: LoadBracket
  requestLoad: (autoUpdate: boolean) => void
}> = ({
  setting,
  setSetting,
  score,
  setScore,
  matchIntervalInfo,
  setMatchIntervalInfo,
  mc,
  setMC,
  loadBracket,
  requestLoad,
}) => {
  console.log("Control")
  const router = useRouter()
  const origin = useOrigin()
  const id = router.query.id as string
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.right}>
          <h2>スコアを編集</h2>
        </div>
        <div className={styles.left}>
          <div>
            <h4 className={"mt-[3px] mr-[5px]"}>共有URL:</h4>
            <div>
              <TextboxWithCopy text={`${origin}${router.asPath}`} />
            </div>
            <Link
              href={{
                pathname: "/create",
                query: {
                  id: id,
                },
              }}
              passHref
            >
              <a
                className={"ml-[5px] transition ease delay-50 hover:opacity-70"}
              >
                <Image
                  src="/image/setting.svg"
                  width={26}
                  height={30}
                  alt="設定"
                />
              </a>
            </Link>
          </div>
          <p>
            URLを共有することで複数人で編集することができます。URLの流出にはご注意ください。
          </p>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <ScoreAndCamera
          {...{
            setting,
            score,
            setScore,
          }}
        />
        <Next
          {...{
            setting,
            matchIntervalInfo,
            setMatchIntervalInfo,
          }}
        />
        <MC {...{ mc, setMC }} />
        {setting?.integrateStartGG.enabled && (
          <Top8Bracket {...{ loadBracket, requestLoad }} />
        )}
      </div>
    </div>
  )
}
