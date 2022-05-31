import { FC } from "react"
import { BigCheckBox } from "../parts/BigCheckBox"
import styles from "./UseLogo.module.scss"

export const UseLogo: FC = () => {
  const key = "scoreboard.cameraAndLogo.useLogo"
  return (
    <div className={styles.container}>
      <BigCheckBox name={key} className="mr-[15px]" />
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
