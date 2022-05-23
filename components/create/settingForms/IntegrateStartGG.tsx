import { FC } from "react"
import styles from "./IntegrateStartGG.module.scss"
import { BigCheckBox } from "../parts/BigCheckBox"
import { useForm } from "react-hook-form"

export const IntegrateStartGG: FC = () => {
  const { register } = useForm()
  const key = "scoreboard.integrateStartGG.enabled"
  const textKey = "scoreboard.integrateStartGG.url"
  return (
    <div className={styles.container}>
      <BigCheckBox id={key} name={key} />
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
