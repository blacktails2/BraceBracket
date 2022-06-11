import { CSSProperties, FC, MouseEventHandler } from "react"

import styles from "./IconButton.module.scss"

export const IconButton: FC<{
  onClick: MouseEventHandler
  style?: CSSProperties
  icon: string
  mode?: "primary" | "light"
  rotation?: boolean
}> = ({ onClick, style = {}, icon, mode = "light", rotation }) => {
  return (
    <div
      className={`${styles.button} ${
        mode === "primary" ? styles.primary : styles.light
      } ${rotation ? styles.rotation : ""}`}
      onClick={onClick}
      style={Object.assign(
        {
          backgroundImage: `url("${icon}")`,
          backgroundSize: "2.2rem",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          borderRadius: "5px",
          padding: "4px",
          width: "2.8rem",
          height: "2.8rem",
          cursor: "pointer",
        },
        style
      )}
    ></div>
  )
}
