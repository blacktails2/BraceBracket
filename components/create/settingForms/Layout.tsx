import { FC } from "react"
import styles from "./Layout.module.scss"
import { DesignRadioButton } from "../parts/DesignRadioButton"
import { MockImg } from "../../parts/MockImg"
import { Controller, useFormContext } from "react-hook-form"
import { ScoreboardLayouts } from "../../../libs/const"

export const Layout: FC = () => {
  const { control } = useFormContext()
  return (
    <div className={styles.form}>
      <h4>レイアウト</h4>
      <div className={styles.layoutList}>
        <Controller
          control={control}
          name="scoreboard.design.layout"
          render={({ field }) => {
            return (
              <>
                {ScoreboardLayouts.map((layout) => {
                  return (
                    <DesignRadioButton
                      key={layout}
                      imageSrc={<MockImg width={274} height={80} />}
                      label={`${layout} Layout`}
                      value={layout}
                      field={field}
                    />
                  )
                })}
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
