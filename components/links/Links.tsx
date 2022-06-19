import { useRouter } from "next/router"
import { FC } from "react"

import { Setting } from "../../libs/const"
import { Button } from "../parts/Button"
import {
  PreviewBracket,
  PreviewInterval,
  PreviewMC,
  PreviewScore,
} from "../parts/Preview"
import { TextboxWithCopy } from "../parts/TextboxWithCopy"

import styles from "./links.module.scss"

export const Links: FC<{ origin: string; id: string; setting?: Setting }> = ({
  origin,
  id,
  setting,
}) => {
  const router = useRouter()
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ダッシュボード</h2>
      </div>
      <div className="flex flex-col gap-[3rem] sm:flex-row">
        <div className="w-full rounded-[15px] border-[1px] border-[color:var(--bb-beige)] p-[2rem]">
          <div className="mb-[1.8rem] text-[2.4rem]">
            {setting?.name}を編集する
          </div>
          <div className={styles.url}>
            <h4>編集画面共有URL:</h4>
            <TextboxWithCopy
              text={`${origin}/create/?id=${id}`}
              className="min-w-[50px] max-w-[400px]"
            />
          </div>
          <div className="mb-[3rem]">
            URLを共有することで複数人で編集することができます。URLの流出にはご注意ください。
          </div>
          <Button
            type="button"
            mode="primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.open(
                `${origin}/control/?id=${id}`,
                "BraceBracket Controller",
                "resizable=1,scrollbars=1,width=600,height=450"
              )
            }}
          >
            編集画面を開く
          </Button>
        </div>
        <div className="flex w-full min-w-[200px] flex-col justify-between rounded-[15px] border-[0px] bg-[color:var(--bb-beige-light)] p-[2rem] sm:w-[400px]">
          <div>
            <div className="mb-[1.8rem] text-[2.4rem]">設定を変更</div>
            <div>
              レイアウトのデザイン、カラー、大会ロゴ、start.gg連携などの設定を変更できます。
            </div>
          </div>
          <Button
            type="button"
            mode="primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(`/create/?id=${id}`)
            }}
          >
            設定を変更
          </Button>
        </div>
      </div>
      <hr className="my-[5rem] h-[1px] bg-[#c4c4c4]" />
      <div>
        <h3 className="mb-[2rem]">配信用ブラウザソースURL</h3>
        <div className="flex flex-wrap gap-[1rem] md:flex-nowrap md:gap-[3rem]">
          <div className="flex gap-[1rem] md:flex-nowrap md:gap-[3rem]">
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[1rem]">Score Layout</h4>
              <PreviewScore
                displayCameraAndTwitterID={
                  setting?.scoreboard.cameraAndLogo.displayCameraAndTwitterID
                }
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/score/?id=${id}`}
                className="w-full min-w-[50px] max-w-[100%]"
              />
            </div>
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[1rem]">Interval Layout</h4>
              <PreviewInterval
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/next/?id=${id}`}
                className="w-full min-w-[50px] max-w-[100%]"
              />
            </div>
          </div>
          <div className="flex gap-[1rem] md:flex-nowrap md:gap-[3rem]">
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[1rem]">MC Layout</h4>
              <PreviewMC
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/mc/?id=${id}`}
                className="w-full min-w-[50px] max-w-[100%]"
              />
            </div>
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[1rem]">Top8 Layout</h4>
              <PreviewBracket
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/bracket/?id=${id}`}
                className="w-full min-w-[50px] max-w-[100%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>ダッシュボード</h2>
      </div>
      <div className="flex gap-[2rem]">
        <div>
          <div className="flex">
            <h3>設定修正</h3>
            <Button
              type="button"
              mode="normal"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                router.push(`/create/?id=${id}`)
              }}
              className="mb-[0.5rem] ml-[1rem] flex flex-col justify-end"
            >
              開く
            </Button>
          </div>
          <div className={styles.url}>
            <h4>共有URL:</h4>
            <TextboxWithCopy
              text={`${origin}/create/?id=${id}`}
              className="w-[398px] max-w-[100%]"
            />
          </div>
        </div>
        <div>
          <div className="flex">
            <h3>操作</h3>
            <Button
              type="button"
              mode="normal"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(
                  `${origin}/control2/?id=${id}`,
                  "BraceBracket Controller",
                  "resizable=1,scrollbars=1,width=600,height=450"
                )
              }}
              className="mb-[0.5rem] ml-[1rem] flex flex-col justify-end"
            >
              開く
            </Button>
          </div>
          <div className={styles.url}>
            <h4>共有URL:</h4>
            <TextboxWithCopy
              text={`${origin}/control2?id=${id}`}
              className="w-[398px] max-w-[100%]"
            />
          </div>
        </div>
      </div>
      <div className="mt-[2rem] flex flex-wrap gap-[2rem]">
        <div>
          <h3>Score</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/score/?id=${id}`}
              className="w-[398px] max-w-[100%]"
            />
          </div>
        </div>
        <div>
          <h3>Interval</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/next/?id=${id}`}
              className="w-[398px] max-w-[100%]"
            />
          </div>
        </div>
        <div>
          <h3>MC</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/mc/?id=${id}`}
              className="w-[398px] max-w-[100%]"
            />
          </div>
        </div>
        <div>
          <h3>Bracket</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/bracket/?id=${id}`}
              className="w-[398px] max-w-[100%]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
