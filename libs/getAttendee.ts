import { getEventSlug, getNameAndTeamtag } from "./utils"

export type Attendee = {
  team: string
  playerName: string
}[]

const query = `
query getAttendee($eventSlug: String!, $page: Int) {
  event(slug: $eventSlug) {
  	id
    entrants (query: {page: $page, perPage: 400}) {
      pageInfo {
        totalPages
        total
      }
      nodes {
        name
      }
    }
  }
}`

export const getAttendee = async (url?: string): Promise<Attendee> => {
  if (!url) {
    return []
  }
  const slug = getEventSlug(url)
  if (slug === "") {
    return []
  }
  let totalPages = 1
  let totalAttendee: Attendee = []
  for (let i = 1; i <= totalPages; i++) {
    const variables = {
      eventSlug: slug,
      page: i,
    }

    const res = await fetch(`https://api.smash.gg/gql/alpha`, {
      method: "POST",
      headers: {
        Authorization: "Bearer b27e9778c425efba77751add00796217",
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

    totalPages = res?.data?.event?.entrants?.pageInfo?.totalPages
    const attendee = res?.data?.event?.entrants?.nodes?.map(
      (entrant: { name?: string }) => {
        const { team, name } = getNameAndTeamtag(entrant?.name ?? "")
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
  return totalAttendee
}
