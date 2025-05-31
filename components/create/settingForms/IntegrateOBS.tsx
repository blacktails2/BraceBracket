import { FC } from "react"
import { useFormContext } from "react-hook-form"

import { BigCheckBox } from "../parts/BigCheckBox"

import styles from "./IntegrateOBS.module.scss"

export const IntegrateOBS: FC = () => {
  const { register, getValues, watch } = useFormContext()
  const key = "integrateOBS"
  watch(key)

  return (
    <div className={styles.container}>
      <BigCheckBox name={key} className="mr-[15px]" />
      <div className={styles.text}>
        <label htmlFor={key}>
          <h4>OBSと連携する</h4>
          <p>
            リモートでOBSのシーンを切り替えられるようになります。
            <br />
            OBS に WebSocket プラグインの導入が必要です。
            <a
              target="_blank"
              href="https://github.com/obsproject/obs-websocket/releases"
              rel="noreferrer"
            >
              GitHub Release
            </a>{" "}
            からダウンロードが可能です。
          </p>
        </label>
      </div>
    </div>
  )
}
