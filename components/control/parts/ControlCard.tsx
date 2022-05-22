import { FC, ReactNode } from "react"
import styles from "./ControlCard.module.scss"

export const ControlCard: FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className={styles.controlCard}>{children}</div>
}
