import { FC, ReactNode, useState } from "react"
import { CSSTransition } from "react-transition-group"

import { TextboxWithCopy } from "../../parts/TextboxWithCopy"

import styles from "./ControlPanel.module.scss"

export const ControlPanel: FC<{
  title: string
  url: string
  children?: ReactNode
}> = ({ title, url, children }) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={styles.container}>
      <summary
        className={`${styles.summary} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={() => setIsOpen(!isOpen)}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.url}>
          <h4>OBS配置用URL:</h4>
          <TextboxWithCopy text={url} className="max-w-[100%] w-[398px]" />
        </div>
      </summary>
      <CSSTransition
        in={isOpen}
        timeout={{
          enter: 0,
          exit: 500,
        }}
        classNames={{
          enter: styles.enter,
          enterDone: styles.content,
          exit: styles.exit,
        }}
        unmountOnExit
      >
        <div>{children}</div>
      </CSSTransition>
    </div>
  )
}
