import { LoadBracket } from "../libs/const"
import { genUseDatabaseValue } from "./useDatabaseValue"
import { useCallback } from "react"

const defaultValue: LoadBracket = {
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
      if (!id) return
      const next: LoadBracket = {
        phaseGroupId,
        loaded: true,
        lastRequestedAt: new Date().valueOf(),
      }
      _setLoadBracket(next)
    },
    [id, _setLoadBracket]
  )

  return [loadBracket, requestLoad, loading]
}
