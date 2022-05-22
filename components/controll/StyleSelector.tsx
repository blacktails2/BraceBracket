import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { ScoreboardStylesMap, ScoreboardType } from "../../libs/const"

export const StyleSelector: FC<{ selectedType: ScoreboardType }> = ({
  selectedType,
}) => {
  const { control } = useFormContext()
  return (
    <div>
      <div>スコアボードスタイル</div>
      <div id={`type_${selectedType}`}>
        <Controller
          control={control}
          name="scoreboard_style"
          render={({ field }) => {
            return (
              <>
                {(ScoreboardStylesMap[selectedType] ?? []).map((style, idx) => {
                  return (
                    <div style={{ display: "flex" }} key={style}>
                      <input
                        type="radio"
                        {...field}
                        value={style}
                        checked={
                          (ScoreboardStylesMap[selectedType] ?? []).includes(
                            field.value
                          )
                            ? field.value === style
                            : idx === 0
                        }
                      />
                      <img
                        src={`/image/scoreboards/${style}`}
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
        />
      </div>
    </div>
  )
}
