import { javascript } from "@codemirror/lang-javascript"
import CodeMirror from "@uiw/react-codemirror"
import { FC, useState } from "react"
import { useFormContext } from "react-hook-form"

import { SmallButton } from "../../parts/SmallButton"
import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./UseJSX.module.scss"

declare global {
  interface Window {
    setJSX(value: string): void
  }
}

export const UseJSX: FC = () => {
  const { setValue, getValues } = useFormContext()
  const [popupWindow, setPopupWindow] = useState<Window | null>()
  const key = "scoreboard.design.useJSX"
  return (
    <div className={styles.form}>
      <h4>JSX</h4>
      <div className="flex flex-wrap gap-[1.5rem]">
        <BigCheckBox name={key} />
        <div className={styles.text}>
          <label htmlFor={key}>
            <h4>JSXでカスタマイズする</h4>
            <p>
              JSXを書いてスコア画面を構成できます。
              <br />
              Tailwind CSSのクラスが利用できます。
            </p>
          </label>
        </div>
      </div>
      <CodeMirror
        className={styles.code}
        value={getValues("scoreboard.design.jsx")}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        onChange={(code) => {
          setValue("scoreboard.design.jsx", code)
        }}
      />
      <div className="flex mt-[1rem] gap-[1rem]">
        <SmallButton
          onClick={(e) => {
            e.preventDefault()
            const w = window.open(
              "/test",
              "",
              "menubar=0,toolbar=0,location=0,status=0,scrollbars=0"
            )
            setPopupWindow(w)
            if (w) {
              w.onload = () => {
                w.setJSX(getValues("scoreboard.design.jsx"))
              }
            }
          }}
          type="button"
        >
          テスト
        </SmallButton>
        <SmallButton
          onClick={(e) => {
            e.preventDefault()
            if (popupWindow && popupWindow.setJSX) {
              popupWindow.setJSX(getValues("scoreboard.design.jsx"))
            }
          }}
          type="button"
        >
          更新
        </SmallButton>
      </div>
    </div>
  )
}
