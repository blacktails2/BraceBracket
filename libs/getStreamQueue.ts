import { PlayerScore } from "./const"
import { getNameAndTeamtag } from "./utils"

export type StreamQueue = {
  id: number
  fullRoundText: string
  streamName: string
  p1?: PlayerScore
  p2?: PlayerScore
}[]

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
        slots {
          id
          entrant {
            id
            team {
              id
            }
            name
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
  console.log(res)
  const streamQueue = res.data.tournament.streamQueue.flatMap((stream: any) => {
    return stream.sets.map((set: any) => {
      const players = set.slots.map((slot: any) => {
        if (!slot.entrant) {
          return {
            team: "",
            playerName: "",
            twitterID: "",
            score: 0,
          }
        }
        const { team, name } = getNameAndTeamtag(slot.entrant.name)
        return {
          team,
          playerName: name,
          twitterID: "",
          score: 0,
        }
      })
      return {
        id: set.id,
        fullRoundText: set.fullRoundText,
        streamName: stream.stream.streamName,
        p1: players[0],
        p2: players[1],
      }
    })
  })
  console.log(streamQueue)
  return streamQueue
}
