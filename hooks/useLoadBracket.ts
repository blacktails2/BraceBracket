import { LoadBracket } from "../libs/const"
import { genUseDatabaseValue } from "./useDatabaseValue"
import { useCallback } from "react"
import { serverTimestamp } from "firebase/database"

const defaultValue: LoadBracket = {
  createdAt: serverTimestamp(),
  autoUpdate: false,
  lastRequestedAt: 0,
}

const _useLoadBracket = genUseDatabaseValue(
  (id) => `tournaments/${id}/loadBracket`,
  defaultValue
)

export const useLoadBracket = (
  id?: string | null
): [LoadBracket | undefined, (autoUpdate: boolean) => void, boolean] => {
  const [loadBracket, _setLoadBracket, loading] = _useLoadBracket(id)

  const requestLoad = useCallback(
    (autoUpdate: boolean) => {
      if (!id || !loadBracket || loading) return
      const next: LoadBracket = {
        ...loadBracket,
        autoUpdate,
        lastRequestedAt: new Date().valueOf(),
      }
      _setLoadBracket(next)
    },
    [id, loadBracket, loading, _setLoadBracket]
  )

  return [loadBracket, requestLoad, loading]
}
