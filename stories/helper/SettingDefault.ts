import { serverTimestamp } from "firebase/database"

import { ScoreboardColorsMap, Setting } from "../../libs/const"

export const settingDefault: Setting = {
  createdAt: serverTimestamp(),
  scoreboard: {
    design: {
      layout: "dual",
      color: ScoreboardColorsMap["dual"][0],
    },
    cameraAndLogo: {
      displayCameraAndTwitterID: true,
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
