import { FC, useEffect, useState } from "react"
import { useInterval } from "react-use"

import {
  Setting,
  MatchIntervalInfo,
  getNextFilename,
} from "../../../libs/const"
import { Transition } from "../../parts/Transition"

import styles from "./MatchIntervalInfo.module.scss"

export const MatchInterval: FC<{
  setting: Setting
  matchIntervalInfo: MatchIntervalInfo
}> = ({ setting, matchIntervalInfo }) => {
  const { layout, color } = setting.scoreboard.design
  const [time, setTime] = useState("")
  useInterval(() => {
    const localTime = new Date()
    const hour = localTime.getHours() // 時
    const min = localTime.getMinutes() // 分
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
      <Transition keyName={`${matchIntervalInfo.isNow}`}>
        <p className={styles.nextnow}>
          {matchIntervalInfo.isNow ? "NOW" : "NEXT"}
        </p>
      </Transition>
      <div
        className={styles.statusBox}
        style={{
          textTransform: matchIntervalInfo.uppercase ? "uppercase" : "none",
        }}
      >
        <Transition keyName={matchIntervalInfo.round}>
          <p className={styles.round}>{matchIntervalInfo.round}</p>
        </Transition>
        <Transition keyName={matchIntervalInfo.matchType}>
          <p className={styles.bo}>{matchIntervalInfo.matchType}</p>
        </Transition>
      </div>
      <Transition
        keyName={`${matchIntervalInfo.p1.team}-${matchIntervalInfo.p1.playerName}`}
      >
        <div className={styles.playerLeft}>
          <span className={styles.playerTeam}>{matchIntervalInfo.p1.team}</span>
          <span className={styles.playerName}>
            {matchIntervalInfo.p1.playerName}
          </span>
        </div>
      </Transition>
      <Transition
        keyName={`${matchIntervalInfo.p1.playerName}-${matchIntervalInfo.p1.score}`}
      >
        <p className={styles.scoreLeft}>{matchIntervalInfo.p1.score}</p>
      </Transition>
      <Transition
        keyName={`${matchIntervalInfo.p2.playerName}-${matchIntervalInfo.p2.score}`}
      >
        <p className={styles.scoreRight}>{matchIntervalInfo.p2.score}</p>
      </Transition>
      <Transition
        keyName={`${matchIntervalInfo.p2.team}-${matchIntervalInfo.p2.playerName}`}
      >
        <div className={styles.playerRight}>
          <span className={styles.playerTeam}>{matchIntervalInfo.p2.team}</span>
          <span className={styles.playerName}>
            {matchIntervalInfo.p2.playerName}
          </span>
        </div>
      </Transition>
      <p className={styles.localsetting}>
        Local Time
        <br />
        JST
      </p>
      <Transition keyName={time}>
        <p className={styles.localtime}>{time}</p>
      </Transition>
    </div>
  )
}
