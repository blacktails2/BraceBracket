import { getEventSlug, getTournarySlug } from "./utils"

export type EventInfo = {
  tournamentName: string
  eventName: string
}

const query = `
query Events($tourneySlug: String!) {
  tournament(slug: $tourneySlug) {
    id
    name
    events {
      id
      name
      slug
    }
  }
}`

export const getEventInfo = async (
  url?: string
): Promise<EventInfo | undefined> => {
  if (!url) {
    return
  }
  const tournarySlug = getTournarySlug(url)
  const eventSlug = getEventSlug(url)
  if (tournarySlug === "" || eventSlug === "") {
    return
  }
  const variables = {
    tourneySlug: tournarySlug,
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
    return
  }
  console.log(res)
  try {
    const tournamentName = res?.data?.tournament?.name
    const eventName = res?.data?.tournament?.events?.find(
      (e: { name: string; slug: string }) => e.slug === eventSlug
    )?.name
    if (!tournamentName || !eventName) {
      return
    }
    return {
      tournamentName,
      eventName,
    }
  } catch {
    return
  }
}
