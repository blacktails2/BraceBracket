import { ChangeEventHandler, FC } from "react"
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
  onChange?: () => void
  "data-testid"?: string
}> = ({
  label,
  name,
  placeholder,
  className,
  autocomplete,
  disabled,
  cleanValue,
  onChange,
  "data-testid": dataTestId,
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
        {...register(name, { onChange: onChange })}
        placeholder={placeholder}
        className={styles.input}
        id={name}
        autoComplete={autocomplete ? "on" : "off"}
        list={autocomplete}
        disabled={disabled}
        data-testid={dataTestId || `textform-${name}`}
        style={
          cleanValue !== undefined && getValues(name) !== cleanValue
            ? { backgroundColor: "var(--bb-dirty)" }
            : {}
        }
      />
    </div>
  )
}

export const TextBox: FC<{
  label?: string
  name: string
  placeholder: string
  className?: string
  autocomplete?: string
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  value?: string
}> = ({
  label,
  name,
  placeholder,
  className,
  autocomplete,
  disabled,
  onChange,
  value,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        onChange={onChange}
        value={value}
        id={name}
        autoComplete={autocomplete ? "on" : "off"}
        list={autocomplete}
        disabled={disabled}
      />
    </div>
  )
}
