import { FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./NumberForm.module.scss"

export const NumberForm: FC<{
  label?: string
  name: string
  className?: string
  cleanValue?: number
  "data-testid"?: string
}> = ({ label, name, className, cleanValue, "data-testid": dataTestId }) => {
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
        data-testid={dataTestId || `numberform-${name}`}
        style={
          cleanValue !== undefined && getValues(name) !== cleanValue
            ? { backgroundColor: "var(--bb-dirty)" }
            : {}
        }
      />
    </div>
  )
}
