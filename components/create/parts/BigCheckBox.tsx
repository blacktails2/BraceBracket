import { useFormContext } from "react-hook-form"
import styles from "./BigCheckBox.module.scss"

export function BigCheckBox<T extends string>({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const { register } = useFormContext()
  return (
    <>
      <div className={styles.bigCheckBox}>
        <input type="checkbox" {...register(name)} id={id} />
        <label htmlFor={id}>
          <div></div>
        </label>
      </div>
    </>
  )
}
