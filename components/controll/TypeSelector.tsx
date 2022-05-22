import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { ScoreboardTypes } from "../../libs/const"
import Image from "next/image"

export const TypeSelector: FC = () => {
  const { control } = useFormContext()
  return (
    <div>
      <div>スコアボードタイプ</div>
      <Controller
        control={control}
        name="scoreboard_type"
        render={({ field }) => {
          return (
            <>
              {ScoreboardTypes.map((type, idx) => {
                return (
                  <div style={{ display: "flex" }} key={type}>
                    <input
                      type="radio"
                      {...field}
                      value={type}
                      checked={field.value === type}
                    />
                    <Image
                      src={`/image/${type}main.png`}
                      style={{
                        width: "700px",
                        height: "80px",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                      alt=""
                    />
                  </div>
                )
              })}
            </>
          )
        }}
      ></Controller>
    </div>
  )
}
