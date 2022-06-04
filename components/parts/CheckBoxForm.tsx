import { FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./CheckBoxForm.module.scss"

export const CheckBoxForm: FC<{
  label: string
  name: string
  id?: string
  className?: string
  disabled?: boolean
  cleanValue?: boolean
}> = ({ label, name, className, id, disabled, cleanValue }) => {
  const { register, watch, getValues } = useFormContext()
  if (cleanValue !== undefined) {
    watch(name)
  }
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
              boxShadow:
                cleanValue !== undefined && cleanValue !== getValues(name)
                  ? "0 0 0 3px var(--bb-dirty)"
                  : "",
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
