import { FC } from "react"

import {
  Bracket as BracketType,
  getBracketFilename,
  Setting,
} from "../../../libs/const"

import { BracketBox } from "./BracketBox"

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "280px", left: "1438px" }],
  grandFinal: [{ top: "280px", left: "1438px" }],
  winnersFinal: [{ top: "279px", left: "596px" }],
  winnersSemiFinal: [
    { top: "206px", left: "176px" },
    { top: "354px", left: "176px" },
  ],
  losersFinal: [{ top: "644px", left: "1438px" }],
  losersSemiFinal: [{ top: "670px", left: "1018px" }],
  losersQuarterFinal: [
    { top: "568px", left: "596px" },
    { top: "718px", left: "596px" },
  ],
  losersRound: [
    { top: "598px", left: "176px" },
    { top: "748px", left: "176px" },
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
