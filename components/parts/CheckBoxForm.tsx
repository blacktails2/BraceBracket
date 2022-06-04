import { FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./CheckBoxForm.module.scss"

export const CheckBoxForm: FC<{
  label: string
  name: string
  id?: string
  className?: string
  disabled?: boolean
}> = ({ label, name, className, id, disabled }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <div className={styles.container}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            {...register(name)}
            id={id ?? name}
            className={styles.input}
            disabled={disabled}
          />
          <label
            htmlFor={id ?? name}
            className={styles.dummyLabel}
            style={{
              cursor: disabled ? "default" : "pointer",
            }}
          ></label>
        </div>
        <label htmlFor={id ?? name} className={styles.label}>
          {label}
        </label>
      </div>
    </div>
  )
}
