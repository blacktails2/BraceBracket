import { Button } from "../../parts/Button"
import { getStreamQueue, StreamQueue } from "../../../libs/getStreamQueue"
import { Attendee, getAttendee } from "../../../libs/getAttendee"
import styles from "./StreamQueueTable.module.scss"
import { useSetting } from "../../../hooks/useSetting"
import { FC, useState } from "react"
import { useRouter } from "next/router"
import { PlayerScore } from "../../../libs/const"

export const StreamQueueTable: FC<{
  onChange: (queue: {
    id: number
    roundText: string
    streamName: string
    p1?: PlayerScore
    p2?: PlayerScore
  }) => void
}> = ({ onChange }) => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [streamQueue, setStreamQueue] = useState<StreamQueue>([])
  const [attendee, setAttendee] = useState<Attendee>([])
  return (
    <>
      {setting?.integrateStartGG?.enabled && (
        <>
          <Button
            onClick={() => {
              getStreamQueue(setting?.integrateStartGG?.url).then(
                setStreamQueue
              )
              getAttendee(setting?.integrateStartGG?.url).then(setAttendee)
            }}
            className="mb-[20px]"
          >
            start.ggから配信台の情報を取得
          </Button>
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
          {streamQueue.length > 0 && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Round</th>
                  <th>1P Player</th>
                  <th>2P Player</th>
                  <th>Stream Name</th>
                </tr>
              </thead>
              <tbody>
                {streamQueue.map((queue, index) => (
                  <tr key={queue.id}>
                    <td>
                      <input
                        type="radio"
                        name="stream"
                        onChange={() => onChange(queue)}
                      />
                    </td>
                    <td>{queue.roundText}</td>
                    <td>{queue.p1?.playerName}</td>
                    <td>{queue.p2?.playerName}</td>
                    <td>{queue.streamName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  )
}
