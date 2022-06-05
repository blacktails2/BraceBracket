import Head from "next/head"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { useAsync, useInterval } from "react-use"

import { BracketBox } from "../../components/obs/bracket/BracketBox"
import { useLoadBracket } from "../../hooks/useLoadBracket"
import { useSetting } from "../../hooks/useSetting"
import { BracketScore, getBracketFilename } from "../../libs/const"
import { getNameAndTeamtag } from "../../libs/utils"

const query = `
query PhaseGroupSets($phaseGroupId: ID!) {
  phaseGroup(id: $phaseGroupId) {
    id
    displayIdentifier
    sets(
      sortType: ROUND
    ){
      pageInfo{
        total
      }
      nodes{
        fullRoundText
        slots{
          entrant{
            name
          }
          standing {
            placement
            stats {
              score {
                value
              }
            }
          }
        }
      }
    }
  }
}
`
type Data = {
  data: {
    phaseGroup: {
      displayIdentifier: string
      id: number
      sets: {
        nodes: {
          fullRoundText: string
          slots: {
            entrant: {
              name: string | null
            } | null
            standing: {
              placement: number
              stats: {
                score: {
                  value: number
                } | null
              } | null
            } | null
          }[]
        }[]
      }
    }
  }
}
const getMaxLosersRound = (res: Data) => {
  const nodes = res.data.phaseGroup.sets.nodes
  return nodes
    .map((n) => n.fullRoundText)
    .filter((n) => n.includes("Losers Round"))
    .sort()
    .reverse()[0]
}

type Bracket = {
  grandFinalReset: BracketScore[]
  grandFinal: BracketScore[]
  winnersFinal: BracketScore[]
  winnersSemiFinal: BracketScore[]
  losersFinal: BracketScore[]
  losersSemiFinal: BracketScore[]
  losersQuarterFinal: BracketScore[]
  losersRound: BracketScore[]
}
const fullRoundText2Keys: { [key: string]: keyof Bracket } = {
  "Grand Final Reset": "grandFinalReset",
  "Grand Final": "grandFinal",
  "Winners Final": "winnersFinal",
  "Winners Semi-Final": "winnersSemiFinal",
  "Losers Final": "losersFinal",
  "Losers Semi-Final": "losersSemiFinal",
  "Losers Quarter-Final": "losersQuarterFinal",
}

const keys2Pos: { [key: string]: { top: string; left: string }[] } = {
  grandFinalReset: [{ top: "400px", left: "1498px" }],
  grandFinal: [{ top: "400px", left: "1498px" }],
  winnersFinal: [{ top: "199px", left: "807px" }],
  winnersSemiFinal: [
    { top: "122px", left: "117px" },
    { top: "276px", left: "117px" },
  ],
  losersFinal: [{ top: "601px", left: "1152px" }],
  losersSemiFinal: [{ top: "601px", left: "807px" }],
  losersQuarterFinal: [
    { top: "524px", left: "462px" },
    { top: "678px", left: "462px" },
  ],
  losersRound: [
    { top: "524px", left: "117px" },
    { top: "678px", left: "117px" },
  ],
}

const loadTop8Bracket = async (phaseGroupId: string) => {
  const res = (await fetch("https://api.smash.gg/gql/alpha", {
    method: "POST",
    headers: {
      Authorization: "Bearer 4c55422a25fb010184f6eb3612292f01",
      "content-Type": "application/json",
      Accept: "application/json",
      encoding: "utf-8",
    },
    body: JSON.stringify({
      query,
      variables: { phaseGroupId: phaseGroupId },
    }),
  }).then((res) => res.json())) as Data
  const maxLosersRound = getMaxLosersRound(res)
  const rounds = [
    // "Grand Final Reset",
    "Grand Final",
    "Winners Final",
    "Winners Semi-Final",
    "Losers Final",
    "Losers Semi-Final",
    "Losers Quarter-Final",
    maxLosersRound,
  ]
  const tmp: { [key: string]: string } = {}
  tmp[maxLosersRound] = "losersRound"
  const rounds2Key = Object.assign(tmp, fullRoundText2Keys)
  const bracket: Bracket = {
    grandFinal: [],
    grandFinalReset: [],
    losersFinal: [],
    losersQuarterFinal: [],
    losersRound: [],
    losersSemiFinal: [],
    winnersFinal: [],
    winnersSemiFinal: [],
  }
  res.data.phaseGroup.sets.nodes.forEach((n) => {
    if (!rounds.includes(n.fullRoundText)) return
    const key = rounds2Key[n.fullRoundText]
    const players = n.slots.map((s) => {
      const { team, name } = getNameAndTeamtag(s?.entrant?.name)
      return {
        team: team,
        name: name,
        score: s?.standing?.stats?.score?.value,
      }
    })
    const score: BracketScore = {
      player1: {
        team: players[0]?.team,
        name: players[0]?.name,
        score: players[0]?.score,
      },
      player2: {
        team: players[1]?.team,
        name: players[1]?.name,
        score: players[1]?.score,
      },
    }
    bracket[key].push(score)
  })
  return bracket
}

export const Bracket: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [loadBracket] = useLoadBracket(id)
  const [setting] = useSetting(id)
  const [lastLoadedAt, setLastLoadedAt] = useState(0)
  const [bracket, setBracket] = useState<Bracket>({
    grandFinalReset: [],
    grandFinal: [],
    winnersFinal: [],
    winnersSemiFinal: [],
    losersFinal: [],
    losersSemiFinal: [],
    losersQuarterFinal: [],
    losersRound: [],
  })
  useAsync(async () => {
    console.log({ setting, loadBracket })
    if (!setting?.integrateStartGG.enabled || !loadBracket) return
    if (loadBracket.lastRequestedAt <= lastLoadedAt) return

    if (lastLoadedAt === 0) {
      setLastLoadedAt(loadBracket.lastRequestedAt)
      return
    }
    const phaseGroupId = setting?.integrateStartGG.url.split("/").pop()
    if (!phaseGroupId) return
    const bracket = await loadTop8Bracket(phaseGroupId)

    setBracket(bracket)
    setLastLoadedAt(new Date().valueOf())
  }, [loadBracket, lastLoadedAt, setting])

  useInterval(
    async () => {
      const phaseGroupId = setting?.integrateStartGG.url.split("/").pop()
      if (!phaseGroupId) return
      const bracket = await loadTop8Bracket(phaseGroupId)
      setBracket(bracket)
      setLastLoadedAt(new Date().valueOf())
    },
    setting?.integrateStartGG.enabled && loadBracket?.autoUpdate ? 10000 : null
  )

  return (
    <>
      <Head>
        <title>BraceBracket | Bracket Layout</title>
      </Head>
      <img
        className="board"
        src={`/image/bracket/${getBracketFilename(
          setting?.scoreboard.design.layout,
          setting?.scoreboard.design.color
        )}`}
        alt=""
      />
      {Object.entries(bracket).map(([round, scores]) => {
        return scores.map((score, idx) => {
          return (
            <BracketBox
              key={`${round}-${idx}`}
              score={score}
              pos={keys2Pos[round][idx]}
              layout={setting?.scoreboard.design.layout ?? ""}
              round={round}
            />
          )
        })
      })}
    </>
  )
}

export default Bracket
