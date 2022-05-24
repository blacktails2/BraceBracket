import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import { AppProps } from "next/app"
import { serverTimestamp } from "firebase/database"

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export const ScoreboardLayouts = ["Dual", "Single", "Solid", "Simple"]
export type ScoreboardLayout = typeof ScoreboardLayouts[number]

export const ScoreboardColorsMap: {
  [string: ScoreboardLayout]: { label: string; filename: string }[]
} = {
  Dual: [
    {
      label: "Dark / Color",
      filename: "01-dual_white_black_color.png",
    },
    {
      label: "Dark / Mono",
      filename: "02-dual_white_black_mono.png",
    },
    {
      label: "Light / Color",
      filename: "03-dual_black_white_color.png",
    },
    {
      label: "Light / Mono",
      filename: "04-dual_white__black_mono.png",
    },
    {
      label: "Gradient",
      filename: "05-dual_white_white_mono.png",
    },
  ],
  Single: [
    {
      label: "Dark / Color",
      filename: "06-single_white_black_color.png",
    },
    {
      label: "Dark / Mono",
      filename: "07-single_white_black_mono.png",
    },
    {
      label: "Light / Color",
      filename: "08-single_black_white_color.png",
    },
    {
      label: "Light / Mono",
      filename: "09-single_black_white_mono.png",
    },
    {
      label: "Beige",
      filename: "12-single_black_white_beige.png",
    },
  ],
  Solid: [
    {
      label: "Dark / Color",
      filename: "13-solid_white_black_color.png",
    },
    {
      label: "Dark / Mono",
      filename: "14-solid_white_white_mono.png",
    },
    {
      label: "Light / Color",
      filename: "15-solid_black_white_color.png",
    },
    {
      label: "Light / Mono",
      filename: "16-solid_black_black_mono.png",
    },
    {
      label: "Beige",
      filename: "17-solid_black_white_beige.png",
    },
  ],
}
export type ScoreboardColor =
  typeof ScoreboardColorsMap[ScoreboardLayout][number]["label"]

export type Setting = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  scoreboard: {
    design: {
      layout: ScoreboardLayout
      color: ScoreboardColor
    }
    cameraAndLogo: {
      displayCameraAndTwitterID: boolean
      useLogo: boolean
      dropShadow: "none" | "light" | "dark"
    }
  }
}

export type PlayerScore = {
  team: string
  playerName: string
  score: number
  twitterID: string
}

export type Score = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  p1: PlayerScore
  p2: PlayerScore
  round: string
  matchType: string
  tournamentName: string
  uppercase: boolean
}

export type Scenes = {
  sceneList: string[]
  currentScene: string
}

export type LoadBracket = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  phaseGroupId: number
  loaded: boolean
  lastRequestedAt: number
}

export type BracketScore = {
  player1: {
    team: string
    name: string
    score: number
  }
  player2: {
    team: string
    name: string
    score: number
  }
}

export type MatchIntervalInfo = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  p1: PlayerScore
  p2: PlayerScore
  round: string
  matchType: string
}

export type Tournament = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  setting: Setting
  score: Score
  loadBracket: LoadBracket
  matchIntervalInfo: MatchIntervalInfo
}
