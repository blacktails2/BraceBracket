import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { MC } from "../components/control/panels/MC"
import { Next } from "../components/control/panels/Next"
import { ScoreAndCamera } from "../components/control/panels/ScoreAndCamera"
import { Top8Bracket } from "../components/control/panels/Top8Bracket"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import { TextboxWithCopy } from "../components/parts/TextboxWithCopy"
import { useOrigin } from "../hooks/useOrigin"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout } from "../libs/const"
import { Attendee, getAttendee } from "../libs/getAttendee"

import styles from "./control.module.scss"

const Control: NextPageWithLayout = () => {
  const router = useRouter()
  const origin = useOrigin()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [attendee, setAttendee] = useState<Attendee>([])
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  useEffect(() => {
    if (setting?.integrateStartGG?.enabled) {
      getAttendee(setting?.integrateStartGG?.url).then(setAttendee)
    }
  }, [setting])

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
        <ScoreAndCamera />
        <Next />
        <MC />
        {setting?.integrateStartGG.enabled && <Top8Bracket />}
      </div>
      <datalist id="playerName">
        {Array.from(new Set(attendee.map((a) => a.playerName))).map(
          (playerName) => (
            <option key={playerName} value={playerName} />
          )
        )}
      </datalist>
      <datalist id="team">
        {Array.from(new Set(attendee.map((a) => a.team))).map((team) => (
          <option key={team} value={team} />
        ))}
      </datalist>
    </div>
  )
}
Control.getLayout = (page) => {
  return (
    <>
      <Head>
        <title>BraceBracket | Control</title>
      </Head>
      <DefaultLayout>{page}</DefaultLayout>
    </>
  )
}

export default Control
