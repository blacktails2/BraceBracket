import Link from "next/link"
import { FC } from "react"

import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./DisplayCameraAndTwitterID.module.scss"

export const DisplayCameraAndTwitterID: FC = () => {
  const key = "scoreboard.cameraAndLogo.displayCameraAndTwitterID"
  return (
    <div className={styles.container}>
      <BigCheckBox name={key} className="mr-[15px]" />
      <label htmlFor={key}>
        <h4>カメラ及び選手のTwitter IDを表示する</h4>
        <p>
          プレイヤーカメラ自体はOBSなどで配置する必要があります。配置に関しての設定は
          <Link href="/public" passHref>
            <a>こちら</a>
          </Link>
        </p>
      </label>
    </div>
  )
}
