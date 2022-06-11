import { FC, useState } from "react"
import { useInterval } from "react-use"

import { PlayerScore, Setting } from "../../../libs/const"
import { getStreamQueue, StreamQueue } from "../../../libs/getStreamQueue"
import { CheckBoxForm } from "../../parts/CheckBoxForm"

import { IconButton } from "./IconButton"
import styles from "./StreamQueueTable.module.scss"

export const StreamQueueTable: FC<{
  setting: Setting
  onChange: (queue: {
    id: number
    roundText: string
    streamName: string
    p1?: PlayerScore
    p2?: PlayerScore
  }) => void
  trackNext?: boolean
  id: string
}> = ({ setting, onChange, trackNext, id: inputID }) => {
  const [streamQueue, setStreamQueue] = useState<StreamQueue>([])
  const [selected, setSelected] = useState<number>(-1)
  const [isTrack, setIsTrack] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [loading, setLoading] = useState(false)

  useInterval(async () => {
    if (isTrack) {
      setLoading(true)
      const streamQueue = await getStreamQueue(setting.integrateStartGG?.url)
      setLoading(false)
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
        <div>
          <div className="flex flex-wrap gap-[1rem]">
            <CheckBoxForm
              label={!trackNext ? "最新に追従" : "次の試合に追従"}
              id={inputID}
              onChange={() => setIsTrack(!isTrack)}
              checked={isTrack}
              className="pl-[1rem] pb-[0.75rem]"
            />
          </div>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <div className="w-full h-full overflow-hidden">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setLoading(true)
                          getStreamQueue(setting?.integrateStartGG?.url)
                            .then(setStreamQueue)
                            .then(() => {
                              setShowTooltip(true)
                              setTimeout(() => {
                                setShowTooltip(false)
                              }, 3000)
                              setLoading(false)
                            })
                        }}
                        style={{
                          backgroundColor: "transparent",
                          width: "2rem",
                          height: "2rem",
                        }}
                        rotation={loading}
                        mode="primary"
                        icon="/icons/refresh.svg"
                      />
                    </div>
                  </th>
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
          </div>
        </div>
      )}
    </>
  )
}
