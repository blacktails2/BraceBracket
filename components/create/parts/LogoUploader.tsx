import ImgurClient from "imgur"
import { ChangeEvent, FC } from "react"
import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form"

import styles from "./LogoUploader.module.scss"

const client = new ImgurClient({ clientId: "1b1913bc016b518" })

export const LogoUploader: FC<{
  idx: number
  append: UseFieldArrayAppend<FieldValues, "scoreboard.cameraAndLogo.logoURLs">
  remove: UseFieldArrayRemove
  imageURL?: string
  disabled?: boolean
}> = ({ idx, append, remove, imageURL, disabled }) => {
  const key = "scoreboard.cameraAndLogo.logoURLs"
  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e?.currentTarget?.files ?? [])[0]
    if (!file) return
    const res = await client.upload({
      image: file as never,
      type: "stream",
    })

    append(res.data.link)
  }

  return (
    <div className={styles.container}>
      {imageURL ? (
        <>
          <img src={imageURL} alt="logo" className={styles.image} />
          <button
            onClick={() => {
              remove(idx)
            }}
            type="button"
            className={styles.deleteButton}
          >
            削除
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            id={key}
            className={styles.input}
            onChange={onFileSelected}
          />
          <div className={styles.cross}>
            <label htmlFor={key} className={styles.label}></label>
          </div>
        </>
      )}
    </div>
  )
}
