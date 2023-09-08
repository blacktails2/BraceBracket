import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import { useInterval } from "react-use"

import { PlayerScore, Setting } from "../../../libs/const"
import { getStreamQueue, StreamQueue } from "../../../libs/getStreamQueue"
import { CheckBoxForm } from "../../parts/CheckBoxForm"

import { IconButton } from "./IconButton"
import styles from "./StreamQueueTable.module.scss"
import { TextBox } from "./TextForm"

const StreamQueueTableBase: ForwardRefRenderFunction<
  {
    disableTrack: () => void
  },
  {
    setting: Setting
    onChange: (queue: {
      id: number
      roundText: string
      streamName: string
      p1?: PlayerScore
      p2?: PlayerScore
      isLockRound: boolean
    }) => void
    trackNext?: boolean
    id: string
  }
> = ({ setting, onChange, trackNext, id: inputID }, ref) => {
  const [streamQueue, setStreamQueue] = useState<StreamQueue>([])
  const [selected, setSelected] = useState<number>(-1)
  const [isTrack, setIsTrack] = useState(false)
  const [isAutoUpdate, setIsAutoUpdate] = useState(false)
  const [isLockRound, setIsLockRound] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("")
  const [filteredStreamQueue, setFilteredStreamQueue] = useState<StreamQueue>(
    []
  )

  useInterval(async () => {
    if (isAutoUpdate) {
      setLoading(true)
      const streamQueue = await getStreamQueue(setting.integrateStartGG?.url)
      setLoading(false)
      setStreamQueue(streamQueue)
    }
  }, 10000)

  useEffect(() => {
    if (isTrack) {
      if (!trackNext && streamQueue.length > 0) {
        onChange({ isLockRound, ...streamQueue[0] })
        setSelected(streamQueue[0].id)
      } else if (trackNext) {
        const queueIdx = streamQueue.findIndex(
          (q) => !(q.state === "In Progress")
        )
        if (queueIdx >= 0) {
          onChange({ isLockRound, ...streamQueue[queueIdx] })
          setSelected(streamQueue[queueIdx].id)
        }
      }
    }
  }, [isTrack, trackNext, streamQueue, onChange, isLockRound])

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

  useImperativeHandle(ref, () => {
    return {
      disableTrack: () => {
        setIsTrack(false)
      },
    }
  })

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
            <div className="mb-[0.4rem] pt-[0.4rem]">
              <CheckBoxForm
                label="自動更新"
                id={`${inputID}-isAutoUpdate`}
                onChange={() => setIsAutoUpdate(!isAutoUpdate)}
                checked={isAutoUpdate}
                tooltipText="リストを10秒ごとに更新します。"
              />
            </div>
            <div className="mb-[0.4rem] pt-[0.4rem]">
              <CheckBoxForm
                label={"自動反映"}
                id={`${inputID}-isTrack`}
                onChange={() => setIsTrack(!isTrack)}
                checked={isTrack}
                tooltipText="リストの最初の試合を自動的に反映します。"
              />
            </div>
            <div className="mb-[0.4rem] pt-[0.4rem]">
              <CheckBoxForm
                label="ラウンド名固定"
                id={`${inputID}-isLockRound`}
                onChange={() => setIsLockRound(!isLockRound)}
                checked={isLockRound}
                tooltipText="反映時にラウンド名を変更しません。<br/>正しくラウンド名を取得できない場合に有効にしてください。"
              />
            </div>
          </div>
          <div className="mt-[5px] overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr className="w-full">
                  <th className="w-[5%] min-w-[22px] !p-0">
                    <div className="flex h-full w-full justify-center overflow-hidden">
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
                  <th className="w-[22%] font-bold tracking-wider">ROUND</th>
                  <th className="w-[22%] font-bold tracking-wider">
                    1P PLAYER
                  </th>
                  <th className="w-[22%] font-bold tracking-wider">
                    2P PLAYER
                  </th>
                  {usedStream && (
                    <th className="w-[17%] font-bold tracking-wider">STREAM</th>
                  )}
                  <th className="w-[12%] font-bold tracking-wider">STATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredStreamQueue.map((queue, index) => (
                  <tr
                    key={queue.id}
                    onClick={() => {
                      setSelected(queue.id)
                      setIsTrack(false)
                      onChange({ isLockRound, ...queue })
                    }}
                  >
                    <td className="w-[5%]">
                      <div className="flex h-[4rem] w-full items-center justify-center overflow-hidden">
                        <input
                          type="radio"
                          name="stream"
                          id={`${queue.id}`}
                          checked={selected === queue.id}
                          onChange={() => {
                            setSelected(queue.id)
                            setIsTrack(false)
                            onChange({ isLockRound, ...queue })
                          }}
                        />
                      </div>
                    </td>
                    <td className="w-[22%]">{queue.roundText}</td>
                    <td className="w-[22%]">{`${
                      queue.p1?.team ? `${queue.p1?.team} | ` : ""
                    }${queue.p1?.playerName}`}</td>
                    <td className="w-[22%]">{`${
                      queue.p2?.team ? `${queue.p2?.team} | ` : ""
                    }${queue.p2?.playerName}`}</td>
                    {usedStream && (
                      <td className="w-[17%]">{queue.streamName}</td>
                    )}
                    <td className="w-[12%]">{queue.state}</td>
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
export const StreamQueueTable = forwardRef(StreamQueueTableBase)
