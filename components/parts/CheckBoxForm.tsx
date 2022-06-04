import { ChangeEvent, FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./CheckBoxForm.module.scss"

export const CheckBoxForm: FC<{
  label: string
  name?: string
  id?: string
  className?: string
  disabled?: boolean
  cleanValue?: boolean
  checked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}> = ({
  label,
  name,
  className,
  id,
  disabled,
  cleanValue,
  checked,
  onChange,
}) => {
  const { register, watch, getValues } = useFormContext() ?? {}
  if (cleanValue !== undefined && name) {
    watch(name)
  }
  return (
    <div className={className}>
      <div className={styles.container}>
        <div className={styles.checkbox}>
          {name ? (
            <input
              type="checkbox"
              {...register(name)}
              id={id ?? name}
              className={styles.input}
              disabled={disabled}
            />
          ) : (
            <input
              type="checkbox"
              id={id ?? name}
              className={styles.input}
              disabled={disabled}
              checked={checked}
              onChange={onChange}
            />
          )}
          <label
            htmlFor={id ?? name}
            className={styles.dummyLabel}
            style={{
              cursor: disabled ? "default" : "pointer",
              boxShadow:
                cleanValue !== undefined &&
                name &&
                cleanValue !== getValues(name)
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
