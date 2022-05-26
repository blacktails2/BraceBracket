import { FC } from "react"
import { useFormContext } from "react-hook-form"
import styles from "./CheckBoxForm.module.scss"

export const CheckBoxForm: FC<{
  label: string
  name: string
  className?: string
}> = ({ label, name, className }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <div className={styles.container}>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            {...register(name)}
            id={name}
            className={styles.input}
          />
          <label htmlFor={name} className={styles.dummyLabel}></label>
        </div>
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      </div>
    </div>
  )
}
