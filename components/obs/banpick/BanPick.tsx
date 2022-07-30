import { FC } from "react"

import { BanPick as BanPickType } from "../../../libs/const"

export const BanPick: FC<{ banpick: BanPickType }> = ({ banpick }) => {
  return (
    <div className="relative h-[100vh] w-[100vw]">
      <div className="absolute bottom-[5vh] flex flex-row-reverse gap-[1rem]">
        {(banpick.selections ?? []).map((selection, idx) => {
          const stage = selection.stage

          return (
            <div key={stage} className="relative">
              <img
                src={`https://placehold.jp/320x180.png?text=${stage}`}
                alt="Stage画像"
              />
              <div
                className={`absolute top-[0] h-full w-full ${(() => {
                  if (!selection) return ""
                  if (selection.type === "BAN") {
                    return "bg-[rgba(255,0,0,0.2)]"
                  } else {
                    return "bg-[rgba(0,255,0,0.2)]"
                  }
                })()}`}
              ></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
