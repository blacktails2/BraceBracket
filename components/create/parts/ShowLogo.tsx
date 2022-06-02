import { FC } from "react"

import styles from "./LogoUploader.module.scss"

export const LogoUploader: FC = () => {
  return (
    <div className={styles.container}>
      <div></div>
      <button>画像を選択</button>
    </div>
  )
}
