import { Score } from "../libs/const"
import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: Score = {
  matchType: "BO5",
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
  round: "WINNERS FINAL",
  tournamentName: "大会名\n#25",
  uppercase: false,
}

export const useScore = genUseDatabaseValue<Score>(
  (id) => `tournaments/${id}/score`,
  defaultValue
)
