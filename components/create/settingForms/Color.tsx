import { MockImg } from "../../parts/MockImg"
import { FC } from "react"
import { DesignRadioButton } from "../parts/DesignRadioButton"
import { Controller, useFormContext } from "react-hook-form"
import { ScoreboardColorsMap } from "../../../libs/const"
import styles from "./Color.module.scss"

export const Color: FC<{ selectedLayout: string }> = ({ selectedLayout }) => {
  const { control } = useFormContext()
  return (
    <div className={styles.form}>
      <h4>カラー</h4>
      <div className={styles.colorList}>
        <Controller
          control={control}
          name="scoreboard.design.color"
          render={({ field }) => {
            return (
              <>
                {(ScoreboardColorsMap[selectedLayout] ?? []).map(
                  ({ label, filename }) => {
                    return (
                      <DesignRadioButton
                        key={filename}
                        field={field}
                        label={label}
                        value={filename}
                        imageSrc={<MockImg width={200} height={80} />}
                      />
                    )
                  }
                )}
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
