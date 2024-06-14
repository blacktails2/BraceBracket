import { serverTimestamp } from "firebase/database"

import { Telop } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

export const defaultValue: Telop = {
  createdAt: serverTimestamp(),
  text1: "",
  text2: "",
  isBottom: false,
  isHide: false,
}

export const useTelop = genUseDatabaseValue<Telop>(
  (id) => `tournaments/${id}/telop`,
  defaultValue
)
