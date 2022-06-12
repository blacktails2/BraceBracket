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
            <CheckBoxForm
              label={!trackNext ? "最新に追従" : "次の試合に追従"}
              id={inputID}
              onChange={() => setIsTrack(!isTrack)}
              checked={isTrack}
              className="pl-[1rem] pb-[0.75rem]"
            />
            <TextBox
              name="matchFilter"
              placeholder="filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr className="w-full">
                  <th className="w-[4%] w-min-[22px] !p-0">
                    <div className="flex justify-center w-full h-full overflow-hidden">
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
                  <th className="w-[21%]">Round</th>
                  <th className="w-[25%]">1P Player</th>
                  <th className="w-[25%]">2P Player</th>
                  {usedStream && <th className="w-[12%]">Stream Name</th>}
                  <th className="w-[13%]">State</th>
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
                      <div className="flex justify-center w-full h-[4rem] overflow-hidden items-center">
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
