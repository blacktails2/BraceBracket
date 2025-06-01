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
          <h5 className="mb-[1.8rem]">{setting?.name}を編集する</h5>
          <div className={styles.url}>
            <h4>編集画面共有URL:</h4>
            <TextboxWithCopy
              text={`${origin}/control/?id=${id}`}
              className="mb-[10px] min-w-[50px] max-w-[400px]"
              data-testid="control-url"
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
                "resizable=1,scrollbars=1,width=600,height=600"
              )
            }}
          >
            編集画面を開く
          </Button>
        </div>
        <div className="flex w-full min-w-[200px] flex-col justify-between rounded-[15px] border-[0px] bg-[color:var(--bb-beige-light)] p-[2rem] sm:w-[400px]">
          <div>
            <h5 className="mb-[1.8rem]">設定を変更</h5>
            <div>
              レイアウトのデザイン、カラー、大会ロゴ、start.gg連携などの設定を変更できます。
            </div>
          </div>
          <Button
            type="button"
            mode="primary"
            light
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
              <h4 className="mb-[0.8rem]">Score Layout</h4>
              <PreviewScore
                displayCameraAndTwitterID={
                  setting?.scoreboard.cameraAndLogo.displayCameraAndTwitterID
                }
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/score/?id=${id}`}
                className="mt-[0.5rem] w-full min-w-[50px] max-w-[100%]"
                data-testid="score-url"
              />
            </div>
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[0.8rem]">Interval Layout</h4>
              <PreviewInterval
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/next/?id=${id}`}
                className="mt-[0.5rem] w-full min-w-[50px] max-w-[100%]"
                data-testid="next-url"
              />
            </div>
          </div>
          <div className="flex gap-[1rem] md:flex-nowrap md:gap-[3rem]">
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[0.8rem]">MC Layout</h4>
              <PreviewMC
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/mc/?id=${id}`}
                className="mt-[0.5rem] w-full min-w-[50px] max-w-[100%]"
                data-testid="mc-url"
              />
            </div>
            <div className="w-full max-w-[345px]">
              <h4 className="mb-[0.8rem]">Top8 Layout</h4>
              <PreviewBracket
                layout={setting?.scoreboard.design.layout}
                color={setting?.scoreboard.design.color}
              />
              <TextboxWithCopy
                text={`${origin}/obs/bracket/?id=${id}`}
                className="mt-[0.5rem] w-full min-w-[50px] max-w-[100%]"
                data-testid="bracket-url"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
