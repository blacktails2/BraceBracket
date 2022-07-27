import { FC } from "react"
import { useFormContext } from "react-hook-form"

import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./TweetMatch.module.scss"

export const TweetMatch: FC = () => {
  const { register, getValues, watch } = useFormContext()
  const key = "tweetMatch.enabled"
  const textKey = "tweetMatch.template"
  watch(key)

  return (
    <div className={styles.container}>
      <BigCheckBox name={key} className="mr-[15px]" />
      <div className={styles.text}>
        <label htmlFor={key}>
          <h4>対戦カードをツイートする</h4>
          <p>
            ツイートテンプレートを作成し、スコアに設定した対戦カードをツイートできるようになります。
            <br />
            下記にテンプレートを入力してください。
          </p>
        </label>
        <textarea
          rows={7}
          cols={40}
          {...register(textKey, {})}
          disabled={!getValues(key)}
          defaultValue={`{{round}}
{{p1.team}} {{p1.playerName}} vs {{p2.team}} {{p2.playerName}}
（配信プラットフォームのURLなど）`}
          style={
            !getValues(key)
              ? {
                  opacity: 0.5,
                }
              : {}
          }
        />
        <p>
          変数タグ一覧（その時入力している情報が反映されます）
          <br />
          ラウンド → {"{{round}}"}
          <br />
          1Pチーム → {"{{p1.team}}"}
          <br />
          1Pプレイヤー名 → {"{{p1.playerName}}"}
          <br />
          1PTwitterID → {"{{p1.twitterID}}"}
          <br />
          2Pチーム → {"{{p2.team}}"}
          <br />
          2Pプレイヤー名 → {"{{p2.playerName}}"}
          <br />
          2PTwitterID → {"{{p2.twitterID}}"}
        </p>
      </div>
    </div>
  )
}
