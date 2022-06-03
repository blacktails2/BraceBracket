import { FC } from "react"
import { useFormContext } from "react-hook-form"

import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./IntegrateStartGG.module.scss"

export const IntegrateStartGG: FC = () => {
  const { register } = useFormContext()
  const key = "integrateStartGG.enabled"
  const textKey = "integrateStartGG.url"
  return (
    <div className={styles.container}>
      <BigCheckBox name={key} className="mr-[15px]" />
      <div className={styles.text}>
        <label htmlFor={key}>
          <h4>start.ggと連携する</h4>
          <p>
            start.ggと連携することで配信代の情報やTop8の情報をstart.ggから取得できます。
            <br />
            Grand
            Finalsが含まれているトーナメント表のページのURLを入力してください。
          </p>
        </label>
        <input
          type="text"
          {...register(textKey)}
          placeholder="https://www.start.gg/tournament/competition/event/singles/brackets/000000/000000"
        />
      </div>
    </div>
  )
}
