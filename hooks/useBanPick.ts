import { serverTimestamp } from "firebase/database"

import { BanPick } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: BanPick = {
  createdAt: serverTimestamp(),
  state: "SELECT_MATCH",
  selections: [],
}

export const useBanPick = genUseDatabaseValue<BanPick>(
  (id) => `tournaments/${id}/banPick`,
  defaultValue
)
