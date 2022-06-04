import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { MC } from "../components/control/panels/MC"
import { Next } from "../components/control/panels/Next"
import { ScoreAndCamera } from "../components/control/panels/ScoreAndCamera"
import { Top8Bracket } from "../components/control/panels/Top8Bracket"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import { TextboxWithCopy } from "../components/parts/TextboxWithCopy"
import { useOrigin } from "../hooks/useOrigin"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout } from "../libs/const"

import styles from "./control.module.scss"

const Control: NextPageWithLayout = () => {
  const router = useRouter()
  const origin = useOrigin()
  const id = router.query.id as string
  const [setting] = useSetting(id)
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
            <div>共有URL:</div>
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
              <a>
                <Image
                  src="/image/setting.svg"
                  width={26}
                  height={26}
                  alt="設定"
                />
              </a>
            </Link>
          </div>
          <p>
            URLを共有することで複数人で編集することができます。URLの流失にはご注意ください。
          </p>
        </div>
      </div>
      <div className={styles.controlsContainer}>
        <ScoreAndCamera />
        <Next />
        <MC />
        {setting?.integrateStartGG.enabled && <Top8Bracket />}
      </div>
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
