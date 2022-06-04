import { FC } from "react"
import { useFormContext } from "react-hook-form"

import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./UseLogo.module.scss"

export const UseLogo: FC = () => {
  const key = "scoreboard.cameraAndLogo.useLogo"
  const { getValues } = useFormContext()
  return (
    <div className={styles.container}>
      <BigCheckBox
        name={key}
        className="mr-[15px]"
        options={{
          validate: (value) => {
            if (!value) return true
            const logoUrls = getValues("scoreboard.cameraAndLogo.logoUrls")
            if (!logoUrls || logoUrls.length < 1)
              return "ロゴが選択されていません。"
          },
        }}
      />
      <label htmlFor={key}>
        <h4>大会及びスポンサーのロゴを設定する</h4>
        <p>
          複数個登録した場合、5秒ごとに移り変わります。ロゴはJPG, PNG, GIF,
          SVG形式に対応しています（背景が透明なPNG形式を推奨しています）。
        </p>
      </label>
    </div>
  )
}
