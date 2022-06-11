import { getNameAndTeamtag, getTournarySlug } from "./utils"

export type Attendee = {
  team: string
  playerName: string
}[]

const query = `
query AttendeeCount($tourneySlug: String!, $page: Int) {
  tournament(slug: $tourneySlug) {
    id
    name
    participants(query: {page: $page, perPage: 500}) {
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

export const getAttendee = async (url?: string): Promise<Attendee> => {
  console.log(url)
  if (!url) {
    return []
  }
  const slug = getTournarySlug(url)
  if (slug === "") {
    return []
  }
  let totalPages = 1
  let totalAttendee: Attendee = []
  for (let i = 1; i <= totalPages; i++) {
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
        query: query,
        variables,
      }),
    }).then((res) => res.json())

    if (res.errors) {
      console.error(res.errors)
      return []
    }
    console.log(res)
    totalPages = res?.data?.tournament?.participants?.pageInfo?.totalPages
    const attendee = res?.data?.tournament?.participants?.nodes?.map(
      (participant: any) => {
        const {team, name} = getNameAndTeamtag(
          participant.entrants && participant.entrants[0]
            ? participant.entrants[0]?.name ?? participant.gamerTag
            : participant.gamerTag ?? ""
        )
        return {
          team,
          playerName: name,
        }
      }
    )
    totalAttendee = [...totalAttendee, ...attendee]
  }
  if (!totalAttendee) {
    return []
  }
  console.log(totalAttendee)
  return totalAttendee
}
