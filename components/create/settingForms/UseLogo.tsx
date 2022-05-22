import { FC } from "react"
import styles from "./UseLogo.module.scss"
import { BigCheckBox } from "../parts/BigCheckBox"

export const UseLogo: FC = () => {
  const key = "scoreboard.cameraAndLogo.useLogo"
  return (
    <div className={styles.container}>
      <BigCheckBox id={key} name={key} />
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
