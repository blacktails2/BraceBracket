import { serverTimestamp } from "firebase/database"

import { Score } from "../../libs/const"

export const scoreDefault: Score = {
  createdAt: serverTimestamp(),
  matchType: "Best of 3",
  p1: {
    playerName: "P1 Name",
    score: 1,
    team: "P1 Team",
    twitterID: "twitter_id1",
  },
  p2: {
    playerName: "P2 Name",
    score: 2,
    team: "P2 Team",
    twitterID: "twitter_id2",
  },
  round: "Pools",
  tournamentName: "大会名\n#25",
  uppercase: false,
}
