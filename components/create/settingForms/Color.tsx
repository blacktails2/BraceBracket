import { FC } from "react"
import { DesignRadioButton } from "../parts/DesignRadioButton"
import { Controller, useFormContext } from "react-hook-form"
import { ScoreboardColorsMap } from "../../../libs/const"
import styles from "./Color.module.scss"
import { capitalize } from "../../../libs/utils"
import Image from "next/image"

const color2Label = (color: string) => {
  return color.split("_").map(capitalize).join(" / ")
}

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
                {(ScoreboardColorsMap[selectedLayout] ?? []).map((color) => {
                  return (
                    <DesignRadioButton
                      key={color}
                      field={field}
                      label={color2Label(color)}
                      value={color}
                      imageSrc={
                        <Image
                          src={`/image/create/${selectedLayout}/${selectedLayout}_${color}.png`}
                          width={200}
                          height={80}
                          alt={`${selectedLayout}_${color}.png`}
                        />
                      }
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
