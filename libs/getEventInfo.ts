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

const query = `
query Events($tourneySlug: String!, $phaseId: ID!, $phaseGroupId: ID!) {
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
            sets {
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
  }

  const res = await fetch(`https://api.smash.gg/gql/alpha`, {
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

  if (res.errors) {
    console.error(res.errors)
    return "大会情報の取得中にエラーが発生しました。"
  }
  console.log(res)
  try {
    const tournamentName = res?.data?.tournament?.name
    const eventName = res?.data?.tournament?.events?.find(
      (e: { name: string; slug: string }) => e.slug === eventSlug
    )?.name
    const isTop8Bracket = res?.data?.tournament?.events
      ?.find((e: { name: string; slug: string }) => e.slug === eventSlug)
      ?.phases?.find(
        (p: {
          id: string
          phaseGroups?: {
            nodes?: [
              { id: string; sets?: { nodes?: [{ wPlacement: number }] } }
            ]
          }
        }) => p.id.toString() === phaseId
      )
      ?.phaseGroups?.nodes?.find(
        (p: { id: string; sets?: { nodes?: [{ wPlacement: number }] } }) =>
          p.id.toString() === phaseGroupId
      )
      ?.sets?.nodes?.find((s: { wPlacement: number }) => s.wPlacement === 1)

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
