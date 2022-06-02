import Image from "next/image"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { ScoreboardLayouts } from "../../../libs/const"
import { capitalize } from "../../../libs/utils"
import { DesignRadioButton } from "../parts/DesignRadioButton"

import styles from "./Layout.module.scss"

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
                      imageSrc={
                        <Image
                          src={`/image/create/${layout}/${layout}_image.png`}
                          width={274}
                          height={80}
                          alt={`${layout}_image.png`}
                        />
                      }
                      label={`${capitalize(layout)} Layout`}
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
