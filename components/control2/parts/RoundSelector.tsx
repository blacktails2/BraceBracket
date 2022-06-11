import { FC } from "react"

import { TextForm } from "./TextForm"

export const RoundSelector: FC<{
  name?: string
  placeholder?: string
  round: string
  setRound: (round: string) => void
  disabled?: boolean
  cleanValue?: string
}> = ({
  name = "round",
  placeholder = "Grand Final",
  round,
  setRound,
  disabled = false,
  cleanValue,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-[0.4rem] w-fit">
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
                  if (round?.startsWith(name)) {
                    setRound("")
                  } else {
                    setRound(name)
                  }
                }}
              >
                {name}
              </div>
            )
          })
        })()}
      </div>
      <div className="flex flex-wrap gap-[0.4rem] mt-[1rem] mb-[1rem] min-h-[2rem]">
        {(() => {
          const values: Record<string, string[]> = {
            Winners: [
              "Top256",
              "Top192",
              "Top128",
              "Top96",
              "Top64",
              "Top48",
              "Top32",
              "Top24",
              "Top16",
              "Top12",
              "Top8",
              "Quarters",
              "Semis",
              "Finals",
            ],
            Losers: [
              "Top256",
              "Top192",
              "Top128",
              "Top96",
              "Top64",
              "Top48",
              "Top32",
              "Top24",
              "Top16",
              "Top12",
              "Top8",
              "Quarters",
              "Semis",
              "Finals",
            ],
            Pools: ["Finals"],
            Grand: ["Finals", "Finals Reset"],
          }
          const first = round?.split(" ")[0]
          return (values[first] ?? []).map((name) => {
            return (
              <div
                key={name}
                className={`border-solid border-[1px] border-[#c4c4c4] rounded-[5px] px-[0.5rem] h-fit transition ease delay-50 hover:border-[#202025] hover:shadow-md ${
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
                  for (const r of values[first]) {
                    if (newRound.endsWith(r)) {
                      newRound = newRound.replace(r, name)
                      replaced = true
                      break
                    }
                  }
                  if (!replaced) {
                    newRound = `${newRound} ${name}`
                  }

                  if (round.endsWith(name)) {
                    newRound = newRound.replace(` ${name}`, "")
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
      <TextForm
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        cleanValue={cleanValue}
      />
    </div>
  )
}
