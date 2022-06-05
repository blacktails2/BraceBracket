import { FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./SelectForm.module.scss"

export const SelectForm: FC<{
  label: string
  name: string
  options: { text: string; value: string }[]
  className?: string
  disabled?: boolean
}> = ({ label, name, options, className, disabled }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <label>{label}</label>
      <div className={styles.selectContainer}>
        <input
          type="text"
          {...register(name)}
          list={name}
          className={styles.input}
          disabled={disabled}
        />
        <datalist id={name}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  )
}
