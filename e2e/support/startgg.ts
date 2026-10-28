import type { BrowserContext, Route } from "@playwright/test"

/**
 * start.gg (api.smash.gg) の GraphQL API のモック
 *
 * アプリは4種類のクエリを投げるので、クエリ文字列の内容で振り分ける。
 * - Events: 大会情報（作成画面のURL検証）
 * - getAttendee: 参加者一覧（操作画面の入力補完）
 * - StreamQueueOnTournament: 配信台・試合一覧（操作画面のテーブル）
 * - PhaseGroupSets: Top8 のトーナメント表（/obs/bracket）
 */

export const STARTGG_API = "https://api.smash.gg/gql/alpha"

export const TOURNAMENT_SLUG = "bb-e2e-cup"
export const EVENT_SLUG = `tournament/${TOURNAMENT_SLUG}/event/singles`
export const PHASE_ID = "1111"
export const PHASE_GROUP_ID = "2222"
export const BRACKET_URL = `https://www.start.gg/${EVENT_SLUG}/brackets/${PHASE_ID}/${PHASE_GROUP_ID}`
export const TOURNAMENT_NAME = "BraceBracket E2E Cup"
export const EVENT_NAME = "Singles"

type Player = { name: string; twitter?: string }

const slot = (p?: Player) =>
  p
    ? {
        entrant: {
          name: p.name,
          participants: [
            {
              user: {
                authorizations: p.twitter
                  ? [{ externalUsername: p.twitter }]
                  : [],
              },
            },
          ],
        },
      }
    : { entrant: null }

export type QueueSet = {
  id: number
  fullRoundText: string
  state: 1 | 2
  wPlacement?: number
  lPlacement?: number
  p1?: Player
  p2?: Player
}

const toSet = (s: QueueSet) => ({
  id: s.id,
  fullRoundText: s.fullRoundText,
  state: s.state,
  wPlacement: s.wPlacement ?? null,
  lPlacement: s.lPlacement ?? null,
  slots: [slot(s.p1), slot(s.p2)],
})

/** 配信台に割り当てられた試合 */
export const DEFAULT_STREAM_QUEUE: QueueSet[] = [
  {
    id: 9001,
    fullRoundText: "Winners Semi-Final",
    state: 2,
    p1: { name: "RED | Alice", twitter: "alice_tw" },
    p2: { name: "Bob", twitter: "bob_tw" },
  },
  {
    id: 9002,
    fullRoundText: "Losers Final",
    state: 1,
    p1: { name: "BLUE | Carol", twitter: "carol_tw" },
    p2: { name: "Dave" },
  },
]

/** 配信台に割り当てられていない試合 */
export const DEFAULT_EVENT_SETS: QueueSet[] = [
  {
    id: 9101,
    fullRoundText: "Winners Round 1",
    state: 1,
    wPlacement: 9,
    lPlacement: 17,
    p1: { name: "Eve" },
    p2: { name: "GREEN | Frank" },
  },
]

export type BracketSet = {
  fullRoundText: string
  p1: { name: string; score: number }
  p2: { name: string; score: number }
}

export const DEFAULT_BRACKET: BracketSet[] = [
  {
    fullRoundText: "Grand Final",
    p1: { name: "RED | Alice", score: 3 },
    p2: { name: "Bob", score: 1 },
  },
  {
    fullRoundText: "Winners Final",
    p1: { name: "RED | Alice", score: 3 },
    p2: { name: "BLUE | Carol", score: 2 },
  },
  {
    fullRoundText: "Winners Semi-Final",
    p1: { name: "RED | Alice", score: 2 },
    p2: { name: "Dave", score: 0 },
  },
  {
    fullRoundText: "Winners Semi-Final",
    p1: { name: "BLUE | Carol", score: 2 },
    p2: { name: "Eve", score: 1 },
  },
  {
    fullRoundText: "Losers Final",
    p1: { name: "Bob", score: 3 },
    p2: { name: "BLUE | Carol", score: 0 },
  },
  {
    fullRoundText: "Losers Semi-Final",
    p1: { name: "Bob", score: 2 },
    p2: { name: "GREEN | Frank", score: 1 },
  },
  {
    fullRoundText: "Losers Quarter-Final",
    p1: { name: "Bob", score: 2 },
    p2: { name: "Dave", score: 0 },
  },
  {
    fullRoundText: "Losers Quarter-Final",
    p1: { name: "GREEN | Frank", score: 2 },
    p2: { name: "Eve", score: 1 },
  },
  {
    fullRoundText: "Losers Round 2",
    p1: { name: "Bob", score: 2 },
    p2: { name: "Grace", score: 0 },
  },
  {
    fullRoundText: "Losers Round 2",
    p1: { name: "GREEN | Frank", score: 2 },
    p2: { name: "Heidi", score: 1 },
  },
  // 最大の Losers Round 以外は表示対象外
  {
    fullRoundText: "Losers Round 1",
    p1: { name: "Ivan", score: 2 },
    p2: { name: "Judy", score: 0 },
  },
]

export const DEFAULT_ATTENDEES = [
  "RED | Alice",
  "Bob",
  "BLUE | Carol",
  "Dave",
  "Eve",
  "GREEN | Frank",
]

export class StartGGMock {
  streamQueue: QueueSet[] = structuredClone(DEFAULT_STREAM_QUEUE)
  eventSets: QueueSet[] = structuredClone(DEFAULT_EVENT_SETS)
  bracket: BracketSet[] = structuredClone(DEFAULT_BRACKET)
  attendees: string[] = [...DEFAULT_ATTENDEES]
  /** 大会情報に Grand Final（wPlacement=1）を含めるか */
  includesGrandFinal = true
  /** true にすると GraphQL のエラーを返す */
  fail = false
  /** 呼び出されたクエリ名の履歴 */
  readonly calls: string[] = []

  async install(context: BrowserContext) {
    await context.route(STARTGG_API, (route) => this.handle(route))
  }

  callCount(operation: string) {
    return this.calls.filter((c) => c === operation).length
  }

  private async handle(route: Route) {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: corsHeaders })
    }
    const body = route.request().postDataJSON() as {
      query: string
      variables: Record<string, unknown>
    }
    const operation = detectOperation(body.query)
    this.calls.push(operation)

    if (this.fail) {
      return json(route, { errors: [{ message: "mocked error" }] })
    }

    switch (operation) {
      case "Events":
        return json(route, this.eventsResponse(body.variables))
      case "getAttendee":
        return json(route, {
          data: {
            event: {
              id: 1,
              entrants: {
                pageInfo: { totalPages: 1, total: this.attendees.length },
                nodes: this.attendees.map((name) => ({ name })),
              },
            },
          },
        })
      case "StreamQueueOnTournament":
        return json(route, {
          data: {
            tournament: {
              id: 1,
              startAt: 0,
              streamQueue: [
                {
                  stream: { streamSource: "TWITCH", streamName: "bb_stream" },
                  sets: this.streamQueue.map(toSet),
                },
              ],
            },
            event: {
              sets: {
                pageInfo: { totalPages: 1, total: this.eventSets.length },
                nodes: this.eventSets.map(toSet),
              },
            },
          },
        })
      case "PhaseGroupSets":
        return json(route, {
          data: {
            phaseGroup: {
              id: Number(PHASE_GROUP_ID),
              displayIdentifier: "1",
              sets: {
                pageInfo: { total: this.bracket.length },
                nodes: this.bracket.map((s) => ({
                  fullRoundText: s.fullRoundText,
                  slots: [s.p1, s.p2].map((p) => ({
                    entrant: { name: p.name },
                    standing: {
                      placement: 1,
                      stats: { score: { value: p.score } },
                    },
                  })),
                })),
              },
            },
          },
        })
      default:
        return json(route, { errors: [{ message: "unknown query" }] })
    }
  }

  private eventsResponse(variables: Record<string, unknown>) {
    if (variables.tourneySlug !== `tournament/${TOURNAMENT_SLUG}`) {
      return { data: { tournament: null } }
    }
    return {
      data: {
        tournament: {
          id: 1,
          name: TOURNAMENT_NAME,
          events: [
            {
              id: 10,
              name: EVENT_NAME,
              slug: EVENT_SLUG,
              phases: [
                {
                  id: Number(PHASE_ID),
                  phaseGroups: {
                    nodes: [
                      {
                        id: Number(PHASE_GROUP_ID),
                        sets: {
                          pageInfo: { totalPages: 1 },
                          nodes: this.includesGrandFinal
                            ? [
                                { wPlacement: 1, lPlacement: 2 },
                                { wPlacement: 2, lPlacement: 3 },
                              ]
                            : [{ wPlacement: 5, lPlacement: 7 }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    }
  }
}

const detectOperation = (query: string) => {
  const match = query.match(/query\s+(\w+)/)
  return match?.[1] ?? "unknown"
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const json = (route: Route, body: unknown) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: corsHeaders,
    body: JSON.stringify(body),
  })
