import { get, onValue, ref, set } from "firebase/database"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { db } from "../libs/firebase"

function isFunction<T>(value: SetStateAction<T>): value is (prev: T) => T {
  return typeof value === "function"
}

function isValue<T>(value: SetStateAction<T>): value is T {
  return typeof value !== "function"
}

export function genUseDatabaseValue<T>(
  getPath: (id: string | undefined | null) => string,
  defaultValue: T
) {
  return function useDatabaseValue(
    id: string | undefined | null,
    mustID = false
  ): [T | undefined, Dispatch<SetStateAction<T | undefined>>, boolean] {
    const [loading, setLoading] = useState(true)
    const [value, _setValue] = useState<T | undefined>()
    const valueRef = useRef(value)
    useEffect(() => {
      valueRef.current = value
    }, [value])
    const setValue = useCallback(
      (newValue: SetStateAction<T | undefined>) => {
        if (!id) return
        const dbRef = ref(db, getPath(id))
        if (isFunction(newValue)) {
          set(dbRef, newValue(valueRef.current))
          return
        }
        set(dbRef, newValue)
      },
      [id]
    )
    useEffect(() => {
      if (!id) {
        if (!mustID) {
          _setValue(defaultValue)
          setLoading(false)
        }
        return
      }
      const valueRef = ref(db, getPath(id))
      const unsubscribe = onValue(valueRef, (snapshot) => {
        const value = snapshot.val()
        if (!value) return
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
    }, [id, mustID])
    return [value, setValue, loading]
  }
}
