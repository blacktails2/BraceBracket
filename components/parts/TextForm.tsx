import { FC } from "react"
import { useFormContext } from "react-hook-form"
import styles from "./TextForm.module.scss"

export const TextForm: FC<{
  label: string
  name: string
  placeholder: string
  className?: string
}> = ({ label, name, placeholder, className }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        {...register(name)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  )
}
