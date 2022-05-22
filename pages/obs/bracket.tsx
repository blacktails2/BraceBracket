import { FC, useState } from "react"
import { useAsync } from "react-use"
import { BracketScore } from "../../libs/const"
import { BracketBox } from "../../components/obs/bracket/BracketBox"
import { useLoadBracket } from "../../hooks/bracketHook"
import { useRouter } from "next/router"

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
  actionRecords: any[]
  data: {
    phaseGroup: {
      displayIdentifier: string
      id: number
      sets: {
        nodes: {
          fullRoundText: string
          slots: {
            entrant: {
              name: string
            }
            standing: {
              placement: number
              stats: {
                score: {
                  value: number
                }
              }
            }
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

export const Bracket: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [loadBracket] = useLoadBracket(id)
  const [lastLoadedAt] = useState(0)
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
    if (!loadBracket) return
    if (loadBracket.lastRequestedAt < lastLoadedAt) return

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
        variables: { phaseGroupId: loadBracket.phaseGroupId },
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
        const [team, name] = s.entrant.name.split(" | ")
        return {
          team: name ? team : "",
          name: name ? name : team,
          score: s.standing.stats.score.value,
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
    setBracket(bracket)
  }, [loadBracket, lastLoadedAt])

  return (
    <>
      <img className="board" src="/image/brackets_simple.png" alt="" />
      {Object.entries(bracket).map(([round, scores]) => {
        return scores.map((score, idx) => {
          return (
            <BracketBox
              key={`${round}-${idx}`}
              score={score}
              pos={keys2Pos[round][idx]}
            />
          )
        })
      })}
    </>
  )
}

export default Bracket
