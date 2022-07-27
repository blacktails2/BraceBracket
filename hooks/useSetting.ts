import { serverTimestamp } from "firebase/database"

import { ScoreboardColorsMap, Setting } from "../libs/const"

import { genUseDatabaseValue } from "./useDatabaseValue"

export const defaultValue: Setting = {
  createdAt: serverTimestamp(),
  name: "",
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
  tweetMatch: {
    enabled: false,
    template: `{{round}}
{{p1.team}} {{p1.playerName}} {{p1.twitterID}} vs {{p2.team}} {{p2.playerName}} {{p2.twitterID}}
（配信プラットフォームのURLなど）`,
  },
}

export const useSetting = genUseDatabaseValue<Setting>(
  (id) => `tournaments/${id}/setting`,
  defaultValue
)
