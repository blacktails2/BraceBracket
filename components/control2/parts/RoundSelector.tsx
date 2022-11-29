import { FC } from "react"

import { TextForm } from "./TextForm"

export const RoundSelector: FC<{
  name?: string
  placeholder?: string
  round: string
  setRound: (round: string) => void
  disabled?: boolean
  cleanValue?: string
  onChange?: () => void
}> = ({
  name = "round",
  placeholder = "Grand Final",
  round,
  setRound,
  disabled = false,
  cleanValue,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <h6>ROUND</h6>
      <TextForm
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        cleanValue={cleanValue}
        className="mt-[0.2rem]"
        onChange={onChange}
      />
      <div className="mt-[1rem] flex w-fit flex-wrap gap-[0.4rem]">
        {(() => {
          const values = ["Winners", "Losers", "Pools", "Grand", "Friendlies"]
          return values.map((name) => {
            return (
              <div
                key={name}
                className={`ease delay-50 rounded-[5px] border-[1px] border-solid border-[#c4c4c4] px-[0.5rem] transition hover:border-[#202025] hover:shadow-md${
                  round?.startsWith(name)
                    ? "border-[#202025] bg-[#202025] text-white"
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
      <div className="mt-[1rem] flex flex-wrap gap-[0.4rem]">
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
                className={`ease delay-50 h-fit rounded-[5px] border-[1px] border-solid border-[#c4c4c4] px-[0.5rem] transition hover:border-[#202025] hover:shadow-md ${
                  round?.endsWith(name)
                    ? "border-[#202025] bg-[#202025] text-white"
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
    </div>
  )
}
