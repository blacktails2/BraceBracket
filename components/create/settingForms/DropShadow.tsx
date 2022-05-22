import styles from "./DropShadow.module.scss"
import { DesignRadioButton } from "../parts/DesignRadioButton"
import { Controller, useFormContext } from "react-hook-form"
import { MockImg } from "../../parts/MockImg"

export const DropShadow = () => {
  const { control } = useFormContext()
  return (
    <div className={styles.container}>
      <h4>ロゴにドロップシャドウを追加する</h4>
      <p>ドロップ車道をつけてロゴの視認性を向上できます。</p>
      <div className={styles.options}>
        <Controller
          name="scoreboard.cameraAndLogo.dropShadow"
          control={control}
          render={({ field }) => {
            return (
              <>
                <DesignRadioButton
                  field={field}
                  label="シャドウなし"
                  value="none"
                  imageSrc={<MockImg width={193} height={103} />}
                />
                <DesignRadioButton
                  field={field}
                  label="シャドウ（白）"
                  value="light"
                  imageSrc={<MockImg width={193} height={103} />}
                />
                <DesignRadioButton
                  field={field}
                  label="シャドウ（黒）"
                  value="dark"
                  imageSrc={<MockImg width={193} height={103} />}
                />
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
