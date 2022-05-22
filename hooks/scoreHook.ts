import { Score } from "../libs/const"
import { useCallback, useEffect, useState } from "react"
import { ref } from "firebase/database"
import { db } from "../libs/firebase"
import { get, onValue, set } from "@firebase/database"

const initialState = {
  match_type: "BO5",
  p1_player_name: "P1 Name",
  p1_score: 0,
  p1_team: "P1 Team",
  p2_player_name: "P2 Name",
  p2_score: 0,
  p2_team: "P2 Team",
  round: "WINNERS FINAL",
  tournament_name: "大会名\n#25",
}

export const useScore = (
  id?: string | null
): [Score, (score: Score) => void] => {
  const [score, _setScore] = useState<Score>(initialState)
  const setScore = useCallback(
    (score: Score) => {
      if (!id) return
      const scoreRef = ref(db, `tournaments/${id}/score`)
      set(scoreRef, score)
    },
    [id]
  )

  useEffect(() => {
    if (!id) return
    const scoreRef = ref(db, `tournaments/${id}/score`)
    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val()
      if (!data) return
      _setScore(data)
    })
    get(scoreRef).then((snapshot) => {
      if (snapshot.exists()) return
      set(scoreRef, initialState)
    })
    return () => unsubscribe()
  }, [id])

  return [score, setScore]
}
