import { PlayerScore } from "./const"
import { getNameAndTeamtag } from "./utils"

export type Match = {
  id: number
  roundText: string
  streamName: string
  p1?: PlayerScore
  p2?: PlayerScore
  state: string
}
export type StreamQueue = Match[]

const fullRoundText2Shorts: { [key: string]: string } = {
  "Grand Final Reset": "Grand Finals",
  "Grand Final": "Grand Finals",
  "Winners Final": "Winners Finals",
  "Winners Semi-Final": "Winners Semis",
  "Winners Quarter-Final": "Winners Quarters",
  "Losers Final": "Losers Finals",
  "Losers Semi-Final": "Losers Semis",
  "Losers Quarter-Final": "Losers Quarters",
}

const streamQueueQuery = `
query StreamQueueOnTournament($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    id
    startAt
    streamQueue {
      stream {
        streamSource
        streamName
      }
      sets {
        id
        fullRoundText
        state
        lPlacement
        wPlacement
        slots {
          entrant {
            name
            participants {
              user {
                authorizations (types: [TWITTER]) {
                  externalUsername
                }
              }
            }
          }
        }
      }
    }
    events {
      sets(perPage: 50, filters: {state: [1, 2], hideEmpty: true}) {
        pageInfo {
          totalPages
          total
        }
        nodes {
          id
          fullRoundText
          lPlacement
          state
          slots {
            entrant {
              name
              participants {
                user {
                  authorizations (types: [TWITTER]) {
                    externalUsername
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

const nextQuery = `
query StreamQueueOnTournament($tourneySlug: String!, $page: Int!) {
  tournament(slug: $tourneySlug) {
    events {
      sets(perPage: 50, page: $page, filters: {state: [1, 2], hideEmpty: true}) {
        pageInfo {
          totalPages
          total
        }
        nodes {
          id
          fullRoundText
          lPlacement
          state
          slots {
            entrant {
              name
              participants {
                user {
                  authorizations (types: [TWITTER]) {
                    externalUsername
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

const getTournarySlug = (url: string): string => {
  if (!url.startsWith("https://www.start.gg/tournament/")) {
    return ""
  }
  const urlParts = url.split("/")
  return `${urlParts[3]}/${urlParts[4]}`
}

const getRoundText = (set: any): string => {
  if (fullRoundText2Shorts[set?.fullRoundText]) {
    return fullRoundText2Shorts[set?.fullRoundText]
  }
  const fullRoundText = set?.fullRoundText
  if (!fullRoundText) {
    return ""
  }

  if (set?.lPlacement) {
    if (fullRoundText.startsWith("Winners")) {
      return `Winners Top${(set.lPlacement - 1) * 2}`
    } else if (fullRoundText.startsWith("Losers")) {
      return `Losers Top${set.lPlacement - 1}`
    }
  }

  return fullRoundText
}

export const getStreamQueue = async (url?: string): Promise<StreamQueue> => {
  console.log(url)
  if (!url) {
    return []
  }
  const slug = getTournarySlug(url)
  if (slug === "") {
    return []
  }
  const variables = {
    tourneySlug: slug,
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
      query: streamQueueQuery,
      variables,
    }),
  }).then((res) => res.json())

  if (res.errors) {
    console.error(res.errors)
    return []
  }
  const streamQueue =
    res?.data?.tournament?.streamQueue?.flatMap((stream: any) => {
      return stream.sets.map((set: any) => {
        const players = set.slots.map((slot: any) => {
          if (!slot?.entrant) {
            return {
              team: "",
              playerName: "",
              twitterID: "",
              score: 0,
            }
          }
          const { team, name } = getNameAndTeamtag(slot?.entrant?.name)
          return {
            team,
            playerName: name,
            twitterID:
              slot?.entrant?.participants?.at(0)?.user?.authorizations?.at(0)
                ?.externalUsername ?? "",
            score: 0,
          }
        })
        return {
          id: set.id,
          roundText: getRoundText(set),
          streamName: stream?.stream?.streamName,
          p1: players[0],
          p2: players[1],
          state: set?.state === 2 ? "In Progress" : "In Queue",
        }
      })
    }) || []

  streamQueue.push(
    ...(res?.data?.tournament?.events?.flatMap((event: any) => {
      return event?.sets?.nodes?.map((set: any) => {
        const players = set.slots.map((slot: any) => {
          if (!slot?.entrant) {
            return {
              team: "",
              playerName: "",
              twitterID: "",
              score: 0,
            }
          }
          const { team, name } = getNameAndTeamtag(slot?.entrant?.name)
          return {
            team,
            playerName: name,
            twitterID:
              slot?.entrant?.participants?.at(0)?.user?.authorizations?.at(0)
                ?.externalUsername ?? "",
            score: 0,
          }
        })
        return {
          id: set.id,
          roundText: getRoundText(set),
          streamName: "",
          p1: players[0],
          p2: players[1],
          state: set?.state === 2 ? "In Progress" : "Waiting",
        }
      })
    }) || [])
  )

  const totalPages = (res?.data?.tournament?.events || [])[0]?.sets?.pageInfo
    ?.totalPages
  if (totalPages && totalPages > 1) {
    for (let i = 2; i <= totalPages; i++) {
      const variables = {
        tourneySlug: slug,
        page: i,
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
          query: nextQuery,
          variables,
        }),
      }).then((res) => res.json())

      if (res.errors) {
        continue
      }

      streamQueue.push(
        ...(res?.data?.tournament?.events?.flatMap((event: any) => {
          return event?.sets?.nodes?.map((set: any) => {
            const players = set.slots.map((slot: any) => {
              if (!slot?.entrant) {
                return {
                  team: "",
                  playerName: "",
                  twitterID: "",
                  score: 0,
                }
              }
              const { team, name } = getNameAndTeamtag(slot?.entrant?.name)
              return {
                team,
                playerName: name,
                twitterID:
                  slot?.entrant?.participants
                    ?.at(0)
                    ?.user?.authorizations?.at(0)?.externalUsername ?? "",
                score: 0,
              }
            })
            return {
              id: set.id,
              roundText: getRoundText(set),
              streamName: "",
              p1: players[0],
              p2: players[1],
              state: set?.state === 2 ? "In Progress" : "Waiting",
            }
          })
        }) || [])
      )
    }
  }
  console.log(streamQueue)
  const idMap = new Map()

  return streamQueue.filter((queue: any) => {
    const id = queue.id
    if (idMap.has(id)) {
      return false
    }
    idMap.set(id, true)
    return true
  })
}
