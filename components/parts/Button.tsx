import React, { FC, ReactNode } from "react"
import styles from "./Button.module.scss"

export const Button: FC<{
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  className?: string
  full?: boolean
}> = ({ children, onClick, type, className, full }) => {
  return (
    <div className={className}>
      <button
        className={styles.button}
        onClick={onClick}
        type={type}
        style={full ? { width: "100%" } : undefined}
      >
        {children}
      </button>
    </div>
  )
}
