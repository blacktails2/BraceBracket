import { useRouter } from "next/router"
import { FC, useState } from "react"
import { useInterval } from "react-use"

import { useSetting } from "../../../hooks/useSetting"
import { PlayerScore } from "../../../libs/const"
import { Attendee, getAttendee } from "../../../libs/getAttendee"
import { getStreamQueue, StreamQueue } from "../../../libs/getStreamQueue"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"

import styles from "./StreamQueueTable.module.scss"

export const StreamQueueTable: FC<{
  onChange: (queue: {
    id: number
    roundText: string
    streamName: string
    p1?: PlayerScore
    p2?: PlayerScore
  }) => void
  trackNext?: boolean
  id: string
}> = ({ onChange, trackNext, id: inputID }) => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [streamQueue, setStreamQueue] = useState<StreamQueue>([])
  const [attendee, setAttendee] = useState<Attendee>([])
  const [selected, setSelected] = useState<number>(-1)
  const [isTrack, setIsTrack] = useState(false)

  useInterval(async () => {
    if (isTrack) {
      const streamQueue = await getStreamQueue(setting?.integrateStartGG?.url)
      setStreamQueue(streamQueue)
      if (!trackNext && streamQueue.length > 0) {
        onChange(streamQueue[0])
        setSelected(streamQueue[0].id)
      } else if (trackNext) {
        const queueIdx = streamQueue.findIndex((q) => !q.inProgress)
        if (queueIdx >= 0) {
          onChange(streamQueue[queueIdx])
          setSelected(streamQueue[queueIdx].id)
        }
      }
    }
  }, 10000)

  return (
    <>
      {setting?.integrateStartGG?.enabled && (
        <>
          <div className="flex flex-wrap gap-[1rem]">
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
            <CheckBoxForm
              label={!trackNext ? "最新に追従" : "次の試合に追従"}
              id={inputID}
              onChange={() => setIsTrack(!isTrack)}
              checked={isTrack}
              className="pt-[1.5rem]"
            />
          </div>
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
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {streamQueue.map((queue, index) => (
                  <tr
                    key={queue.id}
                    onClick={() => {
                      setSelected(queue.id)
                      onChange(queue)
                    }}
                  >
                    <td>
                      <input
                        type="radio"
                        name="stream"
                        id={`${queue.id}`}
                        checked={selected === queue.id}
                        onChange={() => {
                          setSelected(queue.id)
                          onChange(queue)
                        }}
                      />
                    </td>
                    <td>{queue.roundText}</td>
                    <td>{queue.p1?.playerName}</td>
                    <td>{queue.p2?.playerName}</td>
                    <td>{queue.streamName}</td>
                    <td>{queue.inProgress ? "In Progress" : "In Queue"}</td>
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
