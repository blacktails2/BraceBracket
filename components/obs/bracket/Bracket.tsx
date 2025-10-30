import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "404px", left: "1498px" }],
  grandFinal: [{ top: "404px", left: "1496px" }],
  winnersFinal: [{ top: "404px", left: "775px" }],
  winnersSemiFinal: [
    { top: "326px", left: "61px" },
    { top: "480px", left: "61px" },
  ],
  losersFinal: [{ top: "779px", left: "1122px" }],
  losersSemiFinal: [{ top: "779px", left: "775px" }],
  losersQuarterFinal: [
    { top: "704px", left: "406px" },
    { top: "854px", left: "406px" },
  ],
  losersRound: [
    { top: "725px", left: "61px" },
    { top: "880px", left: "61px" },
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
