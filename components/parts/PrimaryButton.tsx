import React, { FC, ReactNode } from "react"
import { CSSTransition } from "react-transition-group"

import styles from "./PrimaryButton.module.scss"

export const PrimaryButton: FC<{
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  className?: string
  full?: boolean
  light?: boolean
  tooltipText?: string
  showTooltip?: boolean
}> = ({
  children,
  onClick,
  type,
  className,
  full,
  light,
  tooltipText,
  showTooltip,
}) => {
  return (
    <div className={className}>
      <div className={styles.container}>
        <button
          className={`${styles.button} ${light ? styles.light : ""}`}
          onClick={onClick}
          type={type}
          style={full ? { width: "100%" } : undefined}
        >
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
