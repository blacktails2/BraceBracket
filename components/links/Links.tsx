import { FC } from "react"

import { Button } from "../parts/Button"
import { TextboxWithCopy } from "../parts/TextboxWithCopy"

import styles from "./links.module.scss"

export const Links: FC<{ origin: string; id: string }> = ({ origin, id }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>URL一覧</h2>
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
                `${origin}/control2?id=${id}`,
                "BraceBracket Controller",
                "resizable=1,scrollbars=1,width=600,height=450"
              )
            }}
            className="flex justify-end flex-col ml-[1rem] mb-[0.5rem]"
          >
            開く
          </Button>
        </div>
        <div className={styles.url}>
          <h4>共有URL:</h4>
          <TextboxWithCopy
            text={`${origin}/control2?id=${id}`}
            className="max-w-[100%] w-[398px]"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-[2rem] mt-[2rem]">
        <div>
          <h3>Score</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/score/?id=${id}`}
              className="max-w-[100%] w-[398px]"
            />
          </div>
        </div>
        <div>
          <h3>Interval</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/next/?id=${id}`}
              className="max-w-[100%] w-[398px]"
            />
          </div>
        </div>
        <div>
          <h3>MC</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/mc/?id=${id}`}
              className="max-w-[100%] w-[398px]"
            />
          </div>
        </div>
        <div>
          <h3>Bracket</h3>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy
              text={`${origin}/obs/bracket/?id=${id}`}
              className="max-w-[100%] w-[398px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
