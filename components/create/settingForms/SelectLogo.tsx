import { FC } from "react"
import styles from "./SelectLogo.module.scss"
import { LogoUploader } from "../parts/LogoUploader"

export const SelectLogo: FC = () => {
  return (
    <div className={styles.container}>
      <LogoUploader />
      <LogoUploader />
      <LogoUploader />
      <LogoUploader />
      <LogoUploader />
    </div>
  )
}
