import { MC, ScoreboardColorsMap, Setting } from "../libs/const"
import { genUseDatabaseValue } from "./useDatabaseValue"
import { serverTimestamp } from "firebase/database"

const defaultValue: MC = {
  createdAt: serverTimestamp(),
  mcList: [
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
    {
      team: "",
      playerName: "",
      twitterID: "",
      score: 0,
    },
  ],
}

export const useMC = genUseDatabaseValue<MC>(
  (id) => `tournaments/${id}/mc`,
  defaultValue
)
