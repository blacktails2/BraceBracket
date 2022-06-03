import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { ReactNode } from "react"
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
    <label htmlFor={value} className={styles.label}>
      <input
        type="radio"
        {...field}
        value={value}
        checked={field.value === value}
        id={value}
        className={styles.radioButton}
      />
      <div className={styles.container}>
        <div className={styles.imageContainer}>{imageSrc}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </label>
  )
}
