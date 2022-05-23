import { FC } from "react"
import styles from "./TextboxWithCopy.module.scss"

export const TextboxWithCopy: FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.container}>
      <input type="text" value={text} readOnly className={styles.text} />
      <button
        className={styles.button}
        onClick={() => window.navigator.clipboard.writeText(text)}
      >
        Copy
      </button>
    </div>
  )
}
