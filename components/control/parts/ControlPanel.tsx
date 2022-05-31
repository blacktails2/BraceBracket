import { FC, ReactNode } from "react"
import { TextboxWithCopy } from "../../parts/TextboxWithCopy"
import styles from "./ControlPanel.module.scss"

export const ControlPanel: FC<{
  title: string
  url: string
  children?: ReactNode
}> = ({ title, url, children }) => {
  return (
    <div className={styles.container}>
      <details open>
        <summary>
          <div className={styles.title}>{title}</div>
          <div className={styles.url}>
            <h4>OBS配置用URL:</h4>
            <TextboxWithCopy text={url} className="w-[398px]" />
          </div>
        </summary>
        {children}
      </details>
    </div>
  )
}
