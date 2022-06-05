import { serverTimestamp } from "firebase/database"

import { Score } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: Score = {
  createdAt: serverTimestamp(),
  matchType: "Best of 3",
  p1: {
    playerName: "P1 Name",
    score: 0,
    team: "P1 Team",
    twitterID: "",
  },
  p2: {
    playerName: "P2 Name",
    score: 0,
    team: "P2 Team",
    twitterID: "",
  },
  round: "Pools",
  tournamentName: "大会名\n#25",
  uppercase: false,
}

export const useScore = genUseDatabaseValue<Score>(
  (id) => `tournaments/${id}/score`,
  defaultValue
)
