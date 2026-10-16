import { dbSet, newTournamentId } from "./db"

import type {
  LoadBracket,
  MatchIntervalInfo,
  MC,
  Score,
  Setting,
} from "../../libs/const"

/**
 * テストデータのビルダー
 * アプリのデフォルト値（hooks/use*.ts）と同じ内容を基本とし、必要な部分だけ上書きして使う。
 */

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? U[]
    : T[K] extends object
    ? DeepPartial<T[K]>
    : T[K]
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

export const deepMerge = <T>(base: T, override?: DeepPartial<T>): T => {
  if (!override) return structuredClone(base)
  const result = structuredClone(base) as Record<string, unknown>
  for (const [key, value] of Object.entries(override)) {
    const current = result[key]
    result[key] =
      isPlainObject(current) && isPlainObject(value)
        ? deepMerge(current, value as DeepPartial<typeof current>)
        : value
  }
  return result as T
}

// ある程度固定の時刻を使う（serverTimestamp の代わり）
const CREATED_AT = 1_700_000_000_000

export const DEFAULT_TWEET_TEMPLATE = `{{round}}
{{p1.team}} {{p1.playerName}} {{p1.twitterID}} vs {{p2.team}} {{p2.playerName}} {{p2.twitterID}}
（配信プラットフォームのURLなど）`

export const buildSetting = (override?: DeepPartial<Setting>): Setting =>
  deepMerge<Setting>(
    {
      createdAt: CREATED_AT,
      name: "E2E Cup",
      scoreboard: {
        design: { layout: "dual", color: "dark_color" },
        cameraAndLogo: {
          displayCameraAndTwitterID: false,
          useLogo: false,
          dropShadow: "none",
          logoURLs: [],
        },
      },
      integrateStartGG: { enabled: false, url: "" },
      tweetMatch: { enabled: false, template: DEFAULT_TWEET_TEMPLATE },
    },
    override
  )

export const buildScore = (override?: DeepPartial<Score>): Score =>
  deepMerge<Score>(
    {
      createdAt: CREATED_AT,
      matchType: "Best of 3",
      p1: { playerName: "P1 Name", score: 0, team: "P1 Team", twitterID: "" },
      p2: { playerName: "P2 Name", score: 0, team: "P2 Team", twitterID: "" },
      round: "Pools",
      uppercase: false,
    },
    override
  )

export const buildMatchIntervalInfo = (
  override?: DeepPartial<MatchIntervalInfo>
): MatchIntervalInfo =>
  deepMerge<MatchIntervalInfo>(
    {
      createdAt: CREATED_AT,
      p1: { team: "Team", playerName: "Player1", score: 0, twitterID: "" },
      p2: { team: "Team", playerName: "Player2", score: 0, twitterID: "" },
      round: "Pools",
      matchType: "Best of 5",
      isNow: false,
      uppercase: false,
    },
    override
  )

const emptyMC = { team: "", playerName: "", twitterID: "", score: 0 }

export const buildMC = (mcList: Partial<MC["mcList"][number]>[] = []): MC => ({
  createdAt: CREATED_AT,
  mcList: [0, 1, 2, 3].map((i) => ({ ...emptyMC, ...(mcList[i] ?? {}) })),
})

export const buildLoadBracket = (
  override?: Partial<LoadBracket>
): LoadBracket => ({
  createdAt: CREATED_AT,
  autoUpdate: false,
  lastRequestedAt: 0,
  ...override,
})

export type TournamentSeed = {
  setting?: DeepPartial<Setting>
  score?: DeepPartial<Score>
  matchIntervalInfo?: DeepPartial<MatchIntervalInfo>
  mc?: Partial<MC["mcList"][number]>[]
  loadBracket?: Partial<LoadBracket>
}

/**
 * 大会データ一式をエミュレータに投入し、その大会IDを返す
 */
export const seedTournament = async (seed: TournamentSeed = {}) => {
  const id = newTournamentId()
  await dbSet(`tournaments/${id}`, {
    createdAt: CREATED_AT,
    setting: buildSetting(seed.setting),
    score: buildScore(seed.score),
    matchIntervalInfo: buildMatchIntervalInfo(seed.matchIntervalInfo),
    mc: buildMC(seed.mc),
    loadBracket: buildLoadBracket(seed.loadBracket),
  })
  return id
}
