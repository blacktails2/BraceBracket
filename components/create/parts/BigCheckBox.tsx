import { FC } from "react"
import { RegisterOptions, useFormContext } from "react-hook-form"

import styles from "./BigCheckBox.module.scss"

export const BigCheckBox: FC<{
  name: string
  className?: string
  options?: RegisterOptions
}> = ({ name, className, options }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <div className={styles.container}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            {...register(name, options)}
            id={name}
            className={styles.input}
          />
          <label htmlFor={name} className={styles.dummyLabel}></label>
        </div>
      </div>
    </div>
  )
}
