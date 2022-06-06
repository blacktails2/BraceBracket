import React, { FC, ReactNode } from "react"
import { CSSTransition } from "react-transition-group"

import styles from "./Button.module.scss"

export const Button: FC<{
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  className?: string
  tooltipText?: string
  showTooltip?: boolean
}> = ({ children, onClick, type, className, tooltipText, showTooltip }) => {
  return (
    <div className={className}>
      <div className={styles.container}>
        <button className={styles.button} onClick={onClick} type={type}>
          {children}
        </button>
        <CSSTransition
          in={showTooltip}
          timeout={{
            enter: 0,
            exit: 500,
          }}
          classNames={{
            enter: styles.tooltipEnter,
            exit: styles.tooltipExit,
          }}
          unmountOnExit
        >
          {() => {
            return <div className={styles.tooltip}>{tooltipText}</div>
          }}
        </CSSTransition>
      </div>
    </div>
  )
}
