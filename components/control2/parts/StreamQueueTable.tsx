import { FC, useEffect, useMemo, useState } from "react"
import { useInterval } from "react-use"

import { PlayerScore, Setting } from "../../../libs/const"
import { getStreamQueue, StreamQueue } from "../../../libs/getStreamQueue"
import { CheckBoxForm } from "../../parts/CheckBoxForm"

import { IconButton } from "./IconButton"
import styles from "./StreamQueueTable.module.scss"
import { TextBox } from "./TextForm"

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
  const [isAutoUpdate, setIsAutoUpdate] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("")
  const [filteredStreamQueue, setFilteredStreamQueue] = useState<StreamQueue>(
    []
  )

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
        const queueIdx = streamQueue.findIndex(
          (q) => !(q.state === "In Progress")
        )
        if (queueIdx >= 0) {
          onChange(streamQueue[queueIdx])
          setSelected(streamQueue[queueIdx].id)
        }
      }
    }
  }, 30000)

  useEffect(() => {
    setFilteredStreamQueue(
      streamQueue.filter((queue) => {
        return (
          queue.roundText +
          queue.streamName +
          queue.p1?.playerName +
          queue.p1?.team +
          queue.p2?.playerName +
          queue.p2?.team +
          queue.state
        )
          .toLowerCase()
          .includes(filter.toLowerCase())
      })
    )
  }, [streamQueue, filter])
  const usedStream = useMemo(() => {
    return streamQueue.reduce((acc, queue) => {
      return acc || queue.streamName !== ""
    }, false)
  }, [streamQueue])

  return (
    <>
      {setting?.integrateStartGG?.enabled && (
        <div>
          <div className="flex flex-wrap gap-[1rem]">
            <TextBox
              name="matchFilter"
              placeholder="検索"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            />
            <div className="pt-[0.4rem] mb-[0.4rem]">
              <CheckBoxForm
                label="自動で更新"
                id={inputID}
                onChange={() => setIsAutoUpdate(!isAutoUpdate)}
                checked={isAutoUpdate}
              />
            </div>
            <div className="pt-[0.4rem] mb-[0.4rem]">
              <CheckBoxForm
                label={
                  !trackNext ? "先頭データを常に反映" : "次の試合を常に反映"
                }
                id={inputID}
                onChange={() => setIsTrack(!isTrack)}
                checked={isTrack}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr className="w-full">
                  <th className="!p-0 w-[4%] min-w-[22px]">
                    <div className="flex overflow-hidden justify-center w-full h-full">
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
                  <th className="w-[21%] font-bold">Round</th>
                  <th className="w-[25%] font-bold">1P Player</th>
                  <th className="w-[25%] font-bold">2P Player</th>
                  {usedStream && (
                    <th className="w-[12%] font-bold">Stream Name</th>
                  )}
                  <th className="w-[13%] font-bold">State</th>
                </tr>
              </thead>
              <tbody>
                {filteredStreamQueue.map((queue, index) => (
                  <tr
                    key={queue.id}
                    onClick={() => {
                      setSelected(queue.id)
                      onChange(queue)
                    }}
                  >
                    <td className="w-[5%]">
                      <div className="flex overflow-hidden justify-center items-center w-full h-[4rem]">
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
                      </div>
                    </td>
                    <td className="w-[24%]">{queue.roundText}</td>
                    <td className="w-[23%]">{`${
                      queue.p1?.team ? `${queue.p1?.team} | ` : ""
                    }${queue.p1?.playerName}`}</td>
                    <td className="w-[23%]">{`${
                      queue.p2?.team ? `${queue.p2?.team} | ` : ""
                    }${queue.p2?.playerName}`}</td>
                    {usedStream && (
                      <td className="w-[12%]">{queue.streamName}</td>
                    )}
                    <td className="w-[13%]">{queue.state}</td>
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
