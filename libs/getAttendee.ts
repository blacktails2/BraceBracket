import { getNameAndTeamtag } from "./utils"

export type Attendee = {
  team: string
  playerName: string
}[]

const query = `
query AttendeeCount($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    id
    name
    participants(query: {page: 1, perPage: 500}) {
      pageInfo {
        totalPages
        total
      }
      nodes {
        id
        gamerTag
        entrants {
          team {
            id
          }
          name
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

export const getAttendee = async (url?: string): Promise<Attendee> => {
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
  // TODO: 500人以上参加のときはページングする
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
    return []
  }
  console.log(res)
  const attendee = res.data.tournament.participants.nodes.map(
    (participant: any) => {
      const { team, name } = getNameAndTeamtag(participant.entrants[0]?.name)
      return {
        team,
        playerName: name,
      }
    }
  )
  console.log(attendee)
  return attendee
}
