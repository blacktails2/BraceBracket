import { serverTimestamp } from "firebase/database"

import { IntegrateOBS } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

const defaultValue: IntegrateOBS = {
  createdAt: serverTimestamp(),
  state: {
    connected: false,
    sceneList: [],
    currentScene: "",
  },
  operation: {
    queue: [],
  },
  link2BanPick: {
    enabled: false,
    state2SceneName: {},
  },
}

export const useIntegrateOBS = genUseDatabaseValue<IntegrateOBS>(
  (id) => `tournaments/${id}/integrateOBS`,
  defaultValue
)
