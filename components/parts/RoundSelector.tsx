import { FC } from "react"

import { TextForm } from "./TextForm"

export const RoundSelector: FC<{
  name?: string
  placeholder?: string
  round: string
  setRound: (round: string) => void
  disabled?: boolean
}> = ({
  name = "round",
  placeholder = "Grand Final",
  round,
  setRound,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block">ラウンド</label>
      <TextForm name={name} placeholder={placeholder} disabled={disabled} />
      <div className="flex flex-wrap mt-[1rem] gap-[0.4rem] w-fit">
        {(() => {
          const values = ["Winners", "Losers", "Pools", "Grand", "Friendlies"]
          return values.map((name) => {
            return (
              <div
                key={name}
                className={`border-solid border-[1px] border-[#c4c4c4] rounded-[5px] pr-[0.5rem] pl-[0.5rem] transition ease delay-50 hover:border-[#202025] hover:shadow-md ${
                  round?.startsWith(name)
                    ? "bg-[#202025] text-white border-[#202025]"
                    : "bg-white text-[#202025]"
                }  ${disabled ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => {
                  if (disabled) {
                    return
                  }
                  let newRound = round ?? ""
                  let replaced = false
                  for (const r of values) {
                    if (newRound.startsWith(r)) {
                      newRound = newRound.replace(r, name)
                      replaced = true
                      break
                    }
                  }
                  if (!replaced) {
                    newRound = `${name} ${newRound}`
                  }

                  setRound(newRound)
                }}
              >
                {name}
              </div>
            )
          })
        })()}
      </div>
      <div className="flex flex-wrap gap-[0.4rem] mt-[1rem] mb-[1rem] max-w-[300px]">
        {(() => {
          const values = [
            "Top256",
            "Top192",
            "Top128",
            "Top96",
            "Top64",
            "Top48",
            "Top32",
            "Top16",
            "Top12",
            "Top8",
            "Quarters",
            "Semis",
            "Finals",
            "Finals Reset",
          ]
          return values.map((name) => {
            return (
              <div
                key={name}
                className={`border-solid border-[1px] border-[#c4c4c4] rounded-[5px] pr-[0.5rem] pl-[0.5rem] transition ease delay-50 hover:border-[#202025] hover:shadow-md ${
                  round?.endsWith(name)
                    ? "bg-[#202025] text-white border-[#202025]"
                    : "bg-white text-[#202025]"
                } ${disabled ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => {
                  if (disabled) {
                    return
                  }
                  let newRound = round ?? ""
                  let replaced = false
                  for (const r of values) {
                    if (newRound.endsWith(r)) {
                      newRound = newRound.replace(r, name)
                      replaced = true
                      break
                    }
                  }
                  if (!replaced) {
                    newRound = `${newRound} ${name}`
                  }

                  setRound(newRound)
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
