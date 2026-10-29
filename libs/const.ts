import { serverTimestamp } from "firebase/database"
import { NextPage } from "next"
import { AppProps } from "next/app"
import { ReactElement, ReactNode } from "react"

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// custom-template ではレイアウト・カラーは固定
// Firebaseに他のレイアウトの値が保存されていても、表示は常にcustomになる
export const ScoreboardLayouts = ["custom"]

export type ScoreboardLayout = typeof ScoreboardLayouts[number]

export const ScoreboardColorsMap: {
  [string: ScoreboardLayout]: string[]
} = {
  custom: ["default"],
}
export type ScoreboardColor =
  typeof ScoreboardColorsMap[ScoreboardLayout][number]

export type Setting = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  name: string
  scoreboard: {
    design: {
      layout: ScoreboardLayout
      color: ScoreboardColor
    }
    cameraAndLogo: {
      displayCameraAndTwitterID: boolean
      useLogo: boolean
      dropShadow: "none" | "light" | "dark"
      logoURLs: string[]
    }
  }
  integrateStartGG: {
    enabled: boolean
    url: string
  }
  tweetMatch: {
    enabled: boolean
    template: string
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
  uppercase: boolean
}

export type Scenes = {
  sceneList: string[]
  currentScene: string
}

export type LoadBracket = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  autoUpdate: boolean
  lastRequestedAt: number
}

export type BracketScore = {
  player1: {
    team: string
    name: string
    score?: number
  }
  player2: {
    team: string
    name: string
    score?: number
  }
}

export type MatchIntervalInfo = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  p1: PlayerScore
  p2: PlayerScore
  round: string
  matchType: string
  isNow: boolean
  uppercase: boolean
}

export type MC = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  mcList: PlayerScore[]
}

export type Tournament = {
  createdAt: number | ReturnType<typeof serverTimestamp>
  setting: Setting
  score: Score
  loadBracket: LoadBracket
  matchIntervalInfo: MatchIntervalInfo
}

export type Bracket = {
  grandFinalReset: BracketScore[]
  grandFinal: BracketScore[]
  winnersFinal: BracketScore[]
  winnersSemiFinal: BracketScore[]
  losersFinal: BracketScore[]
  losersSemiFinal: BracketScore[]
  losersQuarterFinal: BracketScore[]
  losersRound: BracketScore[]
}
