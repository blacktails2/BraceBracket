import { FC, memo, useEffect, useState } from "react"

import { Setting } from "../../libs/const"
import { Attendee, getAttendee } from "../../libs/getAttendee"

const SuggestList: FC<{ setting: Setting }> = ({ setting }) => {
  const [attendee, setAttendee] = useState<Attendee>([])
  useEffect(() => {
    if (setting?.integrateStartGG?.enabled) {
      getAttendee(setting.integrateStartGG?.url).then(setAttendee)
    }
  }, [setting])

  return (
    <>
      <datalist id="playerName">
        {Array.from(new Set(attendee.map((a) => a.playerName))).map(
          (playerName) => (
            <option key={playerName} value={playerName} />
          )
        )}
      </datalist>
      <datalist id="team">
        {Array.from(new Set(attendee.map((a) => a.team))).map((team) => (
          <option key={team} value={team} />
        ))}
      </datalist>
    </>
  )
}

export default memo(SuggestList)
