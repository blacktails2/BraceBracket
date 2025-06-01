import { ReactNode } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import styles from "./DesignRadioButton.module.scss"

export function DesignRadioButton<T extends string>({
  imageSrc,
  label,
  value,
  field,
}: {
  imageSrc: ReactNode
  label: string
  value: string
  field: ControllerRenderProps<FieldValues, T>
}) {
  return (
    <label
      htmlFor={value}
      className={styles.label}
      data-testid={`radio-${value}`}
    >
      <input
        type="radio"
        {...field}
        value={value}
        checked={field.value === value}
        id={value}
        className={styles.radioButton}
        data-testid={`radio-input-${value}`}
      />
      <div className={styles.container}>
        <div className={styles.imageContainer}>{imageSrc}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </label>
  )
}
