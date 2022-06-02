import React, { FC, ReactNode } from "react"
import styles from "./SmallButton.module.scss"

export const SmallButton: FC<{
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  className?: string
  light?: boolean
}> = ({ children, onClick, type, className, light }) => {
  return (
    <div className={className}>
      <button
        className={`${styles.button} ${light ? styles.light : ""}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </div>
  )
}
