import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import { useAsync } from "react-use"

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
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | undefined>(
    undefined
  )
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)
  const [setting] = useSetting(id)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  useAsync(async () => {
    const qrCodeDataURL = await QRCode.toDataURL(`${origin}/control?id=${id}`)
    setQRCodeDataURL(qrCodeDataURL)
  }, [id, origin])

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
            <div
              className="w-[30px] h-[30px] cursor-pointer"
              onClick={() => {
                setShowQRCodeModal(true)
              }}
            >
              <Image
                src="/image/qrcode.svg"
                width={30}
                height={30}
                alt="QRCode"
              />
              <div
                className="fixed w-[100vw] h-[100vh] inset-0 bg-[rgb(0,0,0,0.5)] z-[10000] flex justify-center items-center align-center cursor-default"
                style={{
                  display: showQRCodeModal ? "flex" : "none",
                  justifyContent: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowQRCodeModal(false)
                }}
              >
                <div className="bg-transparent">
                  <img
                    src={qrCodeDataURL}
                    alt="QRCode"
                    className="w-[80vw] h-[80vh] max-w-[600px] max-h-[600px] object-contain"
                  />
                </div>
              </div>
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
