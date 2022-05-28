import React, { FC, ReactNode } from "react"
import styles from "./Button.module.scss"

export const Button: FC<{
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type?: "button" | "submit" | "reset"
  className?: string
}> = ({ children, onClick, type, className }) => {
  return (
    <div className={className}>
      <button className={styles.button} onClick={onClick} type={type}>
        {children}
      </button>
    </div>
  )
}