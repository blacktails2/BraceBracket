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
    try {
      const res = await client.upload({
        image: file as never,
        type: "stream",
      })

      if (res.success) {
        append(res.data.link)
      } else {
        switch (res.status) {
          case 429:
            alert("API利用上限に達しています。開発者にお問い合わせください。")
            return

          case 400:
            if (
              (res.data as unknown as string) === "File is over the size limit"
            ) {
              alert(
                "ファイルサイズが大きすぎます。20MB以下のファイルをアップロードしてください。"
              )
              return
            }
            alert(res.data)
            return

          default:
            alert(res.data)
            return
        }
      }
    } catch (e) {
      alert(e)
    }
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
