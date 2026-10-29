import { FC } from "react"

import { customConfig, customImage } from "../../../custom/config"
import { Bracket as BracketType, Setting } from "../../../libs/const"

import { BracketBox } from "./BracketBox"

export const Bracket: FC<{ setting?: Setting; bracket?: BracketType }> = ({
  bracket,
}) => {
  return (
    <>
      <img className="board" src={customImage.bracket} alt="" />
      {bracket &&
        Object.entries(bracket).map(([round, scores]) => {
          return scores.map((score, idx) => {
            return (
              <BracketBox
                key={`${round}-${idx}`}
                score={score}
                pos={customConfig.bracketPositions[round][idx]}
                round={round}
              />
            )
          })
        })}
    </>
  )
}
