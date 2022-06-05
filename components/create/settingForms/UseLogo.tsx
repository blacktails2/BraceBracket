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
            if (getValues("scoreboard.cameraAndLogo.logoURLs").length === 0) {
              return "ロゴが登録されていません。"
            }
            return true
          },
        }}
      />
      <label htmlFor={key}>
        <h4>大会及びスポンサーのロゴを設定する</h4>
        <p>
          複数個登録した場合、5秒ごとに移り変わります。ロゴはJPG, PNG,
          GIF形式に対応しています（背景が透明なPNG形式を推奨しています）。
          <br />
          ロゴの画像は
          <a
            href="https://imgur.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Imgur
          </a>
          にアップロードされます。
          <br />
          画像サイズは20MB以下に制限されており、1MB以上のファイルは圧縮されます。
        </p>
      </label>
    </div>
  )
}
