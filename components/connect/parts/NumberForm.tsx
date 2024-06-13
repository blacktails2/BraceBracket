import { FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./NumberForm.module.scss"

export const NumberForm: FC<{
  label?: string
  name: string
  className?: string
  cleanValue?: number
}> = ({ label, name, className, cleanValue }) => {
  const { register, getValues, watch } = useFormContext()
  if (cleanValue !== undefined) {
    watch(name)
  }

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <input
        type="number"
        {...register(name, { valueAsNumber: true })}
        className={styles.input}
        id={name}
        style={
          cleanValue !== undefined && getValues(name) !== cleanValue
            ? { backgroundColor: "var(--bb-dirty)" }
            : {}
        }
      />
    </div>
  )
}
