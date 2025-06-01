import React, { FC, ReactNode, useRef } from "react"
import { CSSTransition } from "react-transition-group"

import styles from "./Button.module.scss"

interface ButtonProps {
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  mode?: "normal" | "small" | "primary"
  className?: string
  light?: boolean
  tooltipText?: string
  showTooltip?: boolean
  full?: boolean
  "data-testid"?: string
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type,
  mode = "normal",
  className,
  light,
  tooltipText,
  showTooltip,
  full,
  ...rest
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
          {...rest}
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
