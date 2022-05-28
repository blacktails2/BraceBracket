import { FC } from "react"
import { useFormContext } from "react-hook-form"
import styles from "./TextForm.module.scss"

export const TextForm: FC<{
  label: string
  name: string
  placeholder: string
  className?: string
  autocomplete?: string
  disabled?: boolean
}> = ({ label, name, placeholder, className, autocomplete, disabled }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        {...register(name)}
        placeholder={placeholder}
        className={styles.input}
        id={name}
        autoComplete={autocomplete ? "on" : "off"}
        list={autocomplete}
        disabled={disabled}
      />
    </div>
  )
}
