import { FC } from "react"
import { useFormContext } from "react-hook-form"
import styles from "./NumberForm.module.scss"

export const NumberForm: FC<{
  label: string
  name: string
  className?: string
}> = ({ label, name, className }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        type="number"
        {...register(name)}
        className={styles.input}
        id={name}
      />
    </div>
  )
}
