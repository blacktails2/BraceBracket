import { FC } from "react"

import { TextForm } from "../../parts/TextForm"

export const MatchTypeSelector: FC<{
  name?: string
  placeholder?: string
  matchType: string
  setMatchType: (matchType: string) => void
  disabled?: boolean
  cleanValue?: string
  onChange?: () => void
}> = ({
  name = "matchType",
  placeholder = "Best of 3",
  matchType,
  setMatchType,
  disabled = false,
  cleanValue,
  onChange,
}) => {
  return (
    <div>
      <h6>SET INFO</h6>
      <TextForm
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        cleanValue={cleanValue}
        className="mt-[0.2rem]"
        onChange={onChange}
      />
      <div className="mt-[1rem] flex max-w-[300px] flex-wrap gap-[0.4rem]">
        {(() => {
          const values = ["Best of 3", "Best of 5"]
          return values.map((name) => {
            return (
              <div
                key={name}
                className={`ease delay-50 rounded-[5px] border-[1px] border-solid border-[#c4c4c4] px-[0.5rem] transition hover:border-[#202025] hover:shadow-md${
                  matchType?.endsWith(name)
                    ? "border-[#202025] bg-[#202025] text-white"
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
    </div>
  )
}
