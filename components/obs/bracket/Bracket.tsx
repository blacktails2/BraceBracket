import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "390px", left: "1498px" }],
  grandFinal: [{ top: "393px", left: "1498px" }],
  winnersFinal: [{ top: "192px", left: "807px" }],
  winnersSemiFinal: [
    { top: "115px", left: "117px" },
    { top: "269px", left: "117px" },
  ],
  losersFinal: [{ top: "594px", left: "1152px" }],
  losersSemiFinal: [{ top: "594px", left: "807px" }],
  losersQuarterFinal: [
    { top: "517px", left: "462px" },
    { top: "671px", left: "462px" },
  ],
  losersRound: [
    { top: "517px", left: "117px" },
    { top: "671px", left: "117px" },
  ],
}

export const Bracket: FC<{ setting?: Setting; bracket?: BracketType }> = ({
  setting,
  bracket,
}) => {
  return (
    <>
      <img
        className="board"
        src={`/image/bracket/${getBracketFilename(
          setting?.scoreboard.design.layout,
          setting?.scoreboard.design.color
        )}`}
        alt=""
      />
      {bracket &&
        Object.entries(bracket).map(([round, scores]) => {
          return scores.map((score, idx) => {
            return (
              <BracketBox
                key={`${round}-${idx}`}
                score={score}
                pos={keys2Pos[round][idx]}
                layout={setting?.scoreboard.design.layout ?? ""}
                round={round}
              />
            )
          })
        })}
    </>
  )
}
