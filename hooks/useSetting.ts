import { serverTimestamp } from "firebase/database"

import { ScoreboardColorsMap, Setting } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

export const defaultValue: Setting = {
  createdAt: serverTimestamp(),
  scoreboard: {
    design: {
      layout: "dual",
      color: ScoreboardColorsMap["dual"][0],
    },
    cameraAndLogo: {
      displayCameraAndTwitterID: false,
      useLogo: false,
      dropShadow: "none",
      logoURLs: [],
    },
  },
  integrateStartGG: {
    enabled: false,
    url: "",
  },
}

export const useSetting = genUseDatabaseValue<Setting>(
  (id) => `tournaments/${id}/setting`,
  defaultValue
)
