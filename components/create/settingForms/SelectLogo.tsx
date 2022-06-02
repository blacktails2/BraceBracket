import { FC } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { LogoUploader } from "../parts/LogoUploader"

import styles from "./SelectLogo.module.scss"

export const SelectLogo: FC = () => {
  const { control, getValues } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "scoreboard.cameraAndLogo.logoURLs",
  })
  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <LogoUploader
          key={field.id}
          idx={index}
          append={append}
          remove={remove}
          imageURL={getValues(`scoreboard.cameraAndLogo.logoURLs.${index}`)}
        />
      ))}
      <div>
        <LogoUploader
          key="new"
          idx={fields.length}
          append={append}
          remove={remove}
        />
      </div>
    </div>
  )
}
