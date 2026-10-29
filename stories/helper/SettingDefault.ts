import { serverTimestamp } from "firebase/database"

import { ScoreboardColorsMap, Setting } from "../../libs/const"

export const settingDefault: Setting = {
  createdAt: serverTimestamp(),
  name: "Tournament Name",
  scoreboard: {
    design: {
      layout: "custom",
      color: ScoreboardColorsMap["custom"][0],
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
  tweetMatch: {
    enabled: false,
    template: "",
  },
}
