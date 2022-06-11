import { FC } from "react"
import { useFormContext } from "react-hook-form"

import styles from "./TextForm.module.scss"

export const TextForm: FC<{
  label?: string
  name: string
  placeholder: string
  className?: string
  autocomplete?: string
  disabled?: boolean
  cleanValue?: string
}> = ({
  label,
  name,
  placeholder,
  className,
  autocomplete,
  disabled,
  cleanValue,
}) => {
  const { register, watch, getValues } = useFormContext()
  if (cleanValue !== undefined) {
    watch(name)
  }
  return (
    <div className={className}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type="text"
        {...register(name)}
        placeholder={placeholder}
        className={styles.input}
        id={name}
        autoComplete={autocomplete ? "on" : "off"}
        list={autocomplete}
        disabled={disabled}
        style={
          cleanValue !== undefined && getValues(name) !== cleanValue
            ? { backgroundColor: "var(--bb-dirty)" }
            : {}
        }
      />
    </div>
  )
}
