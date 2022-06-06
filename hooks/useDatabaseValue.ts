import { get, onValue, ref, set } from "firebase/database"
import { useCallback, useEffect, useState } from "react"

import { db } from "../libs/firebase"

export function genUseDatabaseValue<T>(
  getPath: (id: string | undefined | null) => string,
  defaultValue: T
) {
  return function useDatabaseValue(
    id: string | undefined | null
  ): [T | undefined, (value: T) => void, boolean] {
    const [loading, setLoading] = useState(true)
    const [value, _setValue] = useState<T | undefined>()
    const setValue = useCallback(
      (value: T) => {
        if (!id) return
        const valueRef = ref(db, getPath(id))
        set(valueRef, value)
      },
      [id]
    )
    useEffect(() => {
      if (!id) {
        _setValue(defaultValue)
        setLoading(false)
        return
      }
      const valueRef = ref(db, getPath(id))
      const unsubscribe = onValue(valueRef, (snapshot) => {
        const value = snapshot.val()
        if (!value) return
        console.log(`Update`, value)
        _setValue(value)
        setLoading(false)
      })
      get(valueRef).then((snapshot) => {
        if (snapshot.exists()) return
        set(valueRef, defaultValue)
      })
      return () => {
        unsubscribe()
      }
    }, [id])
    return [value, setValue, loading]
  }
}
