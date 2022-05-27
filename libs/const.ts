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

export const ScoreboardLayouts = ["dual", "single", "solid", "simple"]

export type ScoreboardLayout = typeof ScoreboardLayouts[number]

export const ScoreboardColorsMap: {
  [string: ScoreboardLayout]: string[]
} = {
  dual: ["dark_color", "dark_mono", "light_color", "light_mono", "gradient"],
  single: ["dark_color", "dark_mono", "light_color", "light_mono", "beige"],
  solid: ["dark_color", "dark_mono", "light_color", "light_mono", "beige"],
  simple: ["white", "black"],
}
export type ScoreboardColor =
  typeof ScoreboardColorsMap[ScoreboardLayout][number]

export const getCameraFilename: (
  layout: ScoreboardLayout,
  color: ScoreboardColor
) => string = (layout, color) => {
  if (!layout || !color) {
    return "camera_black.png"
  }
  if (layout === "simple") {
    return `simple_camera_${color}.png`
  }
  return `camera_black.png`
}

export const getMCFilename: (
  layout?: ScoreboardLayout,
  color?: ScoreboardColor,
  count?: number
) => string = (layout, color, count = 2) => {
  if (!layout || !color) {
    return "MC_dark_color.png"
  }
  if (layout === "simple") {
    return `MC_simple_${count}_${color}.png`
  }
  return `MC_${count}_${color.startsWith("light") ? "light" : "dark"}.png`
}

export const getNextFilename: (
  layout?: ScoreboardLayout,
  color?: ScoreboardColor
) => string = (layout, color) => {
  if (!layout || !color) {
    return "upnext_dark.png"
  }
  if (layout === "simple") {
    return `upnext_simple_${color}.png`
  }
  return `upnext_${color.startsWith("light") ? "light" : "dark"}.png`
}

export const getBracketFilename: (
  layout: ScoreboardLayout,
  color: ScoreboardColor
) => string = (layout, color, count = 2) => {
  if (layout === "simple") {
    return `brackets_simple.png`
  }
  return `brackets.png`
}

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
      logoURLs: string[]
    }
  }
  integrateStartGG: {
    enabled: boolean
    url: string
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
