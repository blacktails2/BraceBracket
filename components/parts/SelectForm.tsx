import { FC } from "react"
import { useFormContext } from "react-hook-form"
import styles from "./SelectForm.module.scss"

export const SelectForm: FC<{
  label: string
  name: string
  options: { text: string; value: string }[]
  className?: string
}> = ({ label, name, options, className }) => {
  const { register } = useFormContext()
  return (
    <div className={className}>
      <label>{label}</label>
      <div className={styles.selectContainer}>
        <select {...register(name)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
