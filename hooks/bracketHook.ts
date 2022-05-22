import { LoadBracket } from "../libs/const"
import { useCallback, useEffect, useState } from "react"
import { db } from "../libs/firebase"
import { get, onValue, set } from "@firebase/database"
import { ref } from "firebase/database"

const initialState: LoadBracket = {
  phaseGroupId: 0,
  loaded: true,
  lastRequestedAt: 0,
}

export const useLoadBracket = (
  id?: string | null
): [LoadBracket, (phaseGroupId: number) => void] => {
  const [loadBracket, _setLoadBracket] = useState<LoadBracket>(initialState)

  const requestLoad = useCallback(
    (phaseGroupId: number) => {
      if (!id) return
      const next: LoadBracket = {
        phaseGroupId,
        loaded: true,
        lastRequestedAt: new Date().valueOf(),
      }
      _setLoadBracket(next)
      const loadBracketRef = ref(db, `tournaments/${id}/loadBracket`)
      set(loadBracketRef, next)
    },
    [id]
  )

  useEffect(() => {
    if (!id) return
    const loadBracketRef = ref(db, `tournaments/${id}/loadBracket`)
    const unsubscribe = onValue(loadBracketRef, (snapshot) => {
      const loadBracket = snapshot.val()
      if (!loadBracket) return
      _setLoadBracket(loadBracket)
    })
    get(loadBracketRef).then((snapshot) => {
      if (snapshot.exists()) return
      set(loadBracketRef, initialState)
    })
    return () => unsubscribe()
  }, [id])

  return [loadBracket, requestLoad]
}
