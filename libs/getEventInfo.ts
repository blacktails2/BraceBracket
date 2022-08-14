import {
  getEventSlug,
  getPhaseGroupId,
  getPhaseId,
  getTournarySlug,
} from "./utils"

export type EventInfo = {
  tournamentName: string
  eventName: string
}

interface QueryResponse {
  data?: Data
  errors?: string[]
}

interface Data {
  tournament?: Tournament
}

interface Tournament {
  id?: number
  name?: string
  events?: Event[]
}

interface Event {
  id?: number
  name?: string
  slug?: string
  phases?: Phase[]
}

interface Phase {
  id?: number
  phaseGroups?: PhaseGroups
}

interface PhaseGroups {
  nodes?: Node[]
}

interface Node {
  id?: number
  sets?: Sets
}

interface Sets {
  pageInfo?: PageInfo
  nodes?: Node2[]
}

interface PageInfo {
  totalPages?: number
}

interface Node2 {
  wPlacement?: number
  lPlacement?: number
}

const query = `
query Events($tourneySlug: String!, $phaseId: ID!, $phaseGroupId: ID!, $setsPage: Int) {
  tournament(slug: $tourneySlug) {
    id
    name
    events {
      id
      name
      slug
      phases (phaseId: $phaseId) {
        id
        phaseGroups (query: {filter: {id: [$phaseGroupId]}}){
          nodes {
            id
            sets(page: $setsPage, sortType: ROUND, perPage: 50) {
              pageInfo {
                totalPages
              }
              nodes {
                wPlacement
                lPlacement
              }
            }
          }
        }
      }
    }
  }
}`

const fetchEventsInfo = async (variables: {
  tourneySlug: string
  phaseId: string
  phaseGroupId: string
  setsPage: number
}): Promise<QueryResponse> => {
  return await fetch(`https://api.smash.gg/gql/alpha`, {
    method: "POST",
    headers: {
      Authorization: "Bearer 4c55422a25fb010184f6eb3612292f01",
      "Content-Type": "application/json",
      Accept: "application/json",
      encoding: "utf-8",
    },
    body: JSON.stringify({
      query: query,
      variables,
    }),
  }).then((res) => res.json())
}

export const getEventInfo = async (
  url?: string
): Promise<EventInfo | string> => {
  if (!url) {
    return "トーナメントのURLを入力してください。"
  }
  const tournarySlug = getTournarySlug(url)
  const eventSlug = getEventSlug(url)
  const phaseId = getPhaseId(url)
  const phaseGroupId = getPhaseGroupId(url)
  if (
    tournarySlug === "" ||
    eventSlug === "" ||
    phaseId === "" ||
    phaseGroupId === ""
  ) {
    return "URLの形式が正しくありません。"
  }
  const variables = {
    tourneySlug: tournarySlug,
    phaseId: phaseId,
    phaseGroupId: phaseGroupId,
    setsPage: 1,
  }
  let res = await fetchEventsInfo(variables)

  if (res.errors) {
    console.error(res.errors)
    return "大会情報の取得中にエラーが発生しました。"
  }

  const totalPages =
    res?.data?.tournament?.events
      ?.find((e) => e.slug === eventSlug)
      ?.phases?.find((p) => p.id?.toString() === phaseId)
      ?.phaseGroups?.nodes?.find((p) => p.id?.toString() === phaseGroupId)?.sets
      ?.pageInfo?.totalPages ?? 1

  if (totalPages !== 1) {
    variables.setsPage = totalPages
    res = await fetchEventsInfo(variables)
    if (res.errors) {
      console.error(res.errors)
      return "大会情報の取得中にエラーが発生しました。"
    }
  }

  console.log(res)
  try {
    const tournamentName = res?.data?.tournament?.name
    const eventName = res?.data?.tournament?.events?.find(
      (e) => e.slug === eventSlug
    )?.name
    const isTop8Bracket = res?.data?.tournament?.events
      ?.find((e) => e.slug === eventSlug)
      ?.phases?.find((p) => p.id?.toString() === phaseId)
      ?.phaseGroups?.nodes?.find((p) => p.id?.toString() === phaseGroupId)
      ?.sets?.nodes?.find((s) => s.wPlacement === 1)

    if (!tournamentName || !eventName) {
      return "大会名・イベント名の取得に失敗しました。"
    }

    console.log(isTop8Bracket)
    if (!isTop8Bracket) {
      return "Grand Finalが含まれたBracketのURLを入力してください。"
    }
    return {
      tournamentName,
      eventName,
    }
  } catch {
    return "大会情報の取得中にエラーが発生しました。"
  }
}
