import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "405px", left: "1510px" }],
  grandFinal: [{ top: "405px", left: "1510px" }],
  winnersFinal: [{ top: "405px", left: "776px" }],
  winnersSemiFinal: [
    { top: "328px", left: "62px" },
    { top: "481px", left: "62px" },
  ],
  losersFinal: [{ top: "766px", left: "1122px" }],
  losersSemiFinal: [{ top: "781px", left: "776px" }],
  losersQuarterFinal: [
    { top: "705px", left: "408px" },
    { top: "860px", left: "408px" },
  ],
  losersRound: [
    { top: "727px", left: "62px" },
    { top: "883px", left: "62px" },
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
