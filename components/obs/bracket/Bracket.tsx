import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "400px", left: "1498px" }],
  grandFinal: [{ top: "520px", left: "1498px" }],
  winnersFinal: [{ top: "279px", left: "807px" }],
  winnersSemiFinal: [
    { top: "182px", left: "117px" },
    { top: "376px", left: "117px" },
  ],
  losersFinal: [{ top: "761px", left: "1152px" }],
  losersSemiFinal: [{ top: "761px", left: "807px" }],
  losersQuarterFinal: [
    { top: "664px", left: "462px" },
    { top: "858px", left: "462px" },
  ],
  losersRound: [
    { top: "664px", left: "117px" },
    { top: "858px", left: "117px" },
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
