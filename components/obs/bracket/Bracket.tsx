import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "420px", left: "1498px" }],
  grandFinal: [{ top: "536px", left: "1500px" }],
  winnersFinal: [{ top: "327px", left: "809px" }],
  winnersSemiFinal: [
    { top: "240px", left: "119px" },
    { top: "411px", left: "119px" },
  ],
  losersFinal: [{ top: "723px", left: "1154px" }],
  losersSemiFinal: [{ top: "723px", left: "809px" }],
  losersQuarterFinal: [
    { top: "642px", left: "464px" },
    { top: "812px", left: "464px" },
  ],
  losersRound: [
    { top: "642px", left: "119px" },
    { top: "812px", left: "119px" },
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
