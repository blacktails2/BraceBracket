import { MatchIntervalInfo } from "../libs/const"
import { genUseDatabaseValue } from "./useDatabaseValue"
import { serverTimestamp } from "firebase/database"

const defaultValue: MatchIntervalInfo = {
  createdAt: serverTimestamp(),
  p1: {
    team: "Team",
    playerName: "Player1",
    score: 0,
    twitterID: "",
  },
  p2: {
    team: "Team",
    playerName: "Player1",
    score: 0,
    twitterID: "",
  },
  round: "Pools",
  matchType: "Best of 5",
  isNow: false,
  uppercase: false,
}

export const useMatchIntervalInfo = genUseDatabaseValue<MatchIntervalInfo>(
  (id) => `tournaments/${id}/matchIntervalInfo`,
  defaultValue
)
