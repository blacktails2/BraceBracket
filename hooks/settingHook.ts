import { ScoreboardStylesMap, Setting } from "../libs/const"
import { useCallback, useEffect, useState } from "react"
import { db } from "../libs/firebase"
import { get, onValue, set } from "@firebase/database"
import { ref } from "firebase/database"

const initialState = {
  scoreboard_type: "dual",
  scoreboard_style: ScoreboardStylesMap["dual"][0],
}

export const useSetting = (
  id?: string | null
): [Setting, (setting: Setting) => void] => {
  const [setting, _setSetting] = useState<Setting>(initialState)

  const setSetting = useCallback(
    (setting: Setting) => {
      if (!id) return
      _setSetting(setting)
      const settingRef = ref(db, `tournaments/${id}/setting`)
      set(settingRef, setting)
    },
    [id]
  )

  useEffect(() => {
    if (!id) return
    const settingRef = ref(db, `tournaments/${id}/setting`)
    const unsubscribe = onValue(settingRef, (snapshot) => {
      const setting = snapshot.val()
      if (!setting) return
      _setSetting(setting)
    })
    get(settingRef).then((snapshot) => {
      if (snapshot.exists()) return
      set(settingRef, initialState)
    })
    return () => unsubscribe()
  }, [id])

  return [setting, setSetting]
}
