import { FC } from "react"

import { TextForm } from "./TextForm"

export const MatchTypeSelector: FC<{
  name?: string
  placeholder?: string
  matchType: string
  setMatchType: (matchType: string) => void
  disabled?: boolean
  cleanValue?: string
}> = ({
  name = "matchType",
  placeholder = "Best of 3",
  matchType,
  setMatchType,
  disabled = false,
  cleanValue,
}) => {
  return (
    <div>
      <label className="block">試合形式</label>
      <div className="flex flex-wrap gap-[0.4rem] max-w-[300px]">
        {(() => {
          const values = ["Best of 3", "Best of 5"]
          return values.map((name) => {
            return (
              <div
                key={name}
                className={`border-solid border-[1px] border-[#c4c4c4] rounded-[5px] pr-[0.5rem] pl-[0.5rem] transition ease delay-50 hover:border-[#202025] hover:shadow-md ${
                  matchType?.endsWith(name)
                    ? "bg-[#202025] text-white border-[#202025]"
                    : "bg-white text-[#202025]"
                } ${disabled ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => {
                  if (disabled) {
                    return
                  }
                  if (matchType === name) {
                    setMatchType("")
                  } else {
                    setMatchType(name)
                  }
                }}
              >
                {name.replace("Top", "")}
              </div>
            )
          })
        })()}
      </div>
      <TextForm
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        cleanValue={cleanValue}
        className="mt-[0.5rem]"
      />
    </div>
  )
}
