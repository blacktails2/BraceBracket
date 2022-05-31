import { FC } from "react"
import { useFormContext } from "react-hook-form"
import styles from "./BigCheckBox.module.scss"

export const BigCheckBox: FC<{
  name: string
  className?: string
}> = ({ name, className }) => {
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
      </div>
    </div>
  )
}
