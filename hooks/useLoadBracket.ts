import { LoadBracket } from "../libs/const"
import { genUseDatabaseValue } from "./useDatabaseValue"
import { useCallback } from "react"
import { serverTimestamp } from "firebase/database"

const defaultValue: LoadBracket = {
  createdAt: serverTimestamp(),
  phaseGroupId: 0,
  loaded: true,
  lastRequestedAt: 0,
}

const _useLoadBracket = genUseDatabaseValue(
  (id) => `tournaments/${id}/loadBracket`,
  defaultValue
)

export const useLoadBracket = (
  id?: string | null
): [LoadBracket | undefined, (phaseGroupId: number) => void, boolean] => {
  const [loadBracket, _setLoadBracket, loading] = _useLoadBracket(id)

  const requestLoad = useCallback(
    (phaseGroupId: number) => {
      if (!id || !loadBracket || loading) return
      const next: LoadBracket = {
        ...loadBracket,
        phaseGroupId,
        lastRequestedAt: new Date().valueOf(),
      }
      _setLoadBracket(next)
    },
    [id, _setLoadBracket]
  )

  return [loadBracket, requestLoad, loading]
}
