import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "400px", left: "1498px" }],
  grandFinal: [{ top: "535px", left: "1497px" }],
  winnersFinal: [{ top: "333px", left: "806px" }],
  winnersSemiFinal: [
    { top: "257px", left: "116px" },
    { top: "410px", left: "116px" },
  ],
  losersFinal: [{ top: "736px", left: "1151px" }],
  losersSemiFinal: [{ top: "736px", left: "806px" }],
  losersQuarterFinal: [
    { top: "658px", left: "461px" },
    { top: "812px", left: "461px" },
  ],
  losersRound: [
    { top: "658px", left: "116px" },
    { top: "812px", left: "116px" },
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
