import React, { FC, ReactNode, useRef } from "react"
import { CSSTransition } from "react-transition-group"

import styles from "./Button.module.scss"

export const Button: FC<{
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  mode?: "normal" | "small" | "primary"
  className?: string
  light?: boolean
  tooltipText?: string
  showTooltip?: boolean
  full?: boolean
}> = ({
  children,
  onClick,
  type,
  mode = "normal",
  className,
  light,
  tooltipText,
  showTooltip,
  full,
}) => {
  const tooltipNodeRef = useRef(null)
  const modes = {
    normal: styles.normal,
    small: styles.small,
    primary: styles.primary,
  }
  return (
    <div className={className}>
      <div className={styles.container}>
        <button
          className={`${styles.button} ${light ? styles.light : ""} ${
            modes[mode]
          }`}
          onClick={onClick}
          type={type}
          style={full ? { width: "100%" } : {}}
        >
          {children}
        </button>
        <CSSTransition
          nodeRef={tooltipNodeRef}
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
            return (
              <div className={styles.tooltip} ref={tooltipNodeRef}>
                {tooltipText}
              </div>
            )
          }}
        </CSSTransition>
      </div>
    </div>
  )
}
