import Image from "next/image"
import { FC, useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { ScoreboardColorsMap } from "../../../libs/const"
import { capitalize } from "../../../libs/utils"
import { DesignRadioButton } from "../parts/DesignRadioButton"

import styles from "./Color.module.scss"

const color2Label = (color: string) => {
  return color.split("_").map(capitalize).join(" / ")
}

export const Color: FC<{ selectedLayout: string }> = ({ selectedLayout }) => {
  const key = "scoreboard.design.color"
  const { control, setValue, getValues } = useFormContext()
  useEffect(() => {
    if (!getValues(key)) return
    setValue(
      key,
      ScoreboardColorsMap[selectedLayout]
        ? ScoreboardColorsMap[selectedLayout][0]
        : getValues(key)
    )
  }, [selectedLayout, setValue, getValues])
  return (
    <div className={styles.form}>
      <h4>カラー</h4>
      <div className={styles.colorList}>
        <Controller
          control={control}
          name={key}
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
          rules={{
            required: true,
            validate: (value) => {
              if (!ScoreboardColorsMap[selectedLayout]?.includes(value)) {
                return "正しいカラーを選択してください"
              }
              return true
            },
          }}
        />
      </div>
    </div>
  )
}
