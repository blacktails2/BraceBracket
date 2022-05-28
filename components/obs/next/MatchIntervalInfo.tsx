import { FC, useEffect, useState } from "react"
import { useInterval } from "react-use"
import {
  Setting,
  MatchIntervalInfo,
  getNextFilename,
} from "../../../libs/const"
import styles from "./MatchIntervalInfo.module.scss"

export const MatchInterval: FC<{
  setting: Setting
  matchIntervalInfo: MatchIntervalInfo
}> = ({ setting, matchIntervalInfo }) => {
  const { layout, color } = setting.scoreboard.design
  const [time, setTime] = useState("")
  useInterval(() => {
    const localTime = new Date()
    let hour = localTime.getHours() // 時
    let min = localTime.getMinutes() // 分
    setTime((hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min)
  }, 1000)
  useEffect(() => {
    console.log({ matchIntervalInfo })
  }, [matchIntervalInfo])

  return (
    <div
      className={`${
        layout === "simple" ? styles.simple : styles.other
      } ${(() => {
        if (layout === "simple") {
          return color === "white" ? styles.white : styles.black
        } else {
          return color.startsWith("light") ? styles.light : styles.dark
        }
      })()}`}
    >
      <img
        className={styles.board}
        src={`/image/next/${getNextFilename(layout, color)}`}
        alt=""
      />
      <p className={styles.nextnow}>
        {matchIntervalInfo.isNow ? "NOW" : "NEXT"}
      </p>
      <div
        className={styles.statusBox}
        style={{
          textTransform: matchIntervalInfo.uppercase ? "uppercase" : "none",
        }}
      >
        <p className={styles.round}>{matchIntervalInfo.round}</p>
        <p className={styles.bo}>{matchIntervalInfo.matchType}</p>
      </div>
      <p className={styles.playerLeft}>{matchIntervalInfo.p1.playerName}</p>
      <p className={styles.scoreLeft}>{matchIntervalInfo.p1.score}</p>
      <p className={styles.scoreRight}>{matchIntervalInfo.p2.score}</p>
      <p className={styles.playerRight}>{matchIntervalInfo.p2.playerName}</p>
      <p className={styles.localsetting}>
        Local Time
        <br />
        JST
      </p>
      <p className={styles.localtime}>{time}</p>
    </div>
  )
}
