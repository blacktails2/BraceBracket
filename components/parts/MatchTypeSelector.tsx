import { FC } from "react"

import { TextForm } from "./TextForm"

export const MatchTypeSelector: FC<{
  name?: string
  placeholder?: string
  matchType: string
  setMatchType: (matchType: string) => void
  disabled?: boolean
}> = ({
  name = "matchType",
  placeholder = "Best of 3",
  matchType,
  setMatchType,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block">試合形式</label>
      <div className="flex flex-wrap gap-[0.4rem] mb-[1rem] max-w-[300px]">
        {(() => {
          const values = ["Best of 3", "Best of 5"]
          return values.map((name) => {
            return (
              <div
                key={name}
                className={`border-solid border-[1px] border-black rounded-[5px] pr-[0.5rem] pl-[0.5rem] ${
                  matchType?.endsWith(name)
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } ${disabled ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => {
                  if (disabled) {
                    return
                  }
                  let newMatchType = matchType ?? ""
                  let replaced = false
                  for (const r of values) {
                    if (newMatchType.endsWith(r)) {
                      newMatchType = newMatchType.replace(r, name)
                      replaced = true
                      break
                    }
                  }
                  if (!replaced) {
                    newMatchType = newMatchType + name
                  }

                  setMatchType(newMatchType)
                }}
              >
                {name.replace("Top", "")}
              </div>
            )
          })
        })()}
      </div>
      <TextForm name={name} placeholder={placeholder} disabled={disabled} />
    </div>
  )
}
