import { FC, useEffect, useState } from "react"

import styles from "./TextboxWithCopy.module.scss"

export const TextboxWithCopy: FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showTooltip) {
        setShowTooltip(false)
      }
    }, 1000)
    return () => clearTimeout(timeout)
  }, [showTooltip])
  return (
    <div className={className}>
      <div className={styles.container}>
        <input type="text" value={text} readOnly className={styles.text} />
        <div className="flex relative">
          <button
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation()
              window.navigator.clipboard.writeText(text)
              setShowTooltip(true)
            }}
          >
            Copy
          </button>
          <div
            className={styles.copiedPopup}
            style={{ display: showTooltip ? "block" : "none" }}
          >
            Copied!
          </div>
        </div>
      </div>
    </div>
  )
}
