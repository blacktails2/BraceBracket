import { FC, useState } from "react"
import { useInterval } from "react-use"

import { customImage } from "../../../custom/config"
import { Score, Setting } from "../../../libs/const"
import { Transition } from "../../parts/Transition"

import styles from "./Score.module.scss"

export const Scoreboard: FC<{ setting: Setting; score: Score }> = ({
  setting,
  score,
}) => {
  const [logoIdx, setLogoIdx] = useState(0)
  useInterval(() => {
    if (
      setting.scoreboard.cameraAndLogo.useLogo &&
      setting.scoreboard.cameraAndLogo.logoURLs.length > 0
    ) {
      setLogoIdx(
        (logoIdx + 1) % setting.scoreboard.cameraAndLogo.logoURLs.length
      )
    }
  }, 5000)

  return (
    <div className={`${styles.container} ${styles.custom}`}>
      {/*スコアボードのデザインの画像*/}
      <img className={styles.board} src={customImage.scoreboard} alt="" />
      {setting.scoreboard.cameraAndLogo.displayCameraAndTwitterID && (
        <div>
          <img className={styles.board} src={customImage.camera} alt="" />
          {score.p1.twitterID && (
            <Transition keyName={score.p1.twitterID}>
              <p className={styles.cameraLeft}>
                {score.p1.twitterID.startsWith("@") ? "" : "@"}
                {score.p1.twitterID}
              </p>
            </Transition>
          )}
          {score.p2.twitterID && (
            <Transition keyName={score.p2.twitterID}>
              <p className={styles.cameraRight}>
                {score.p2.twitterID.startsWith("@") ? "" : "@"}
                {score.p2.twitterID}
              </p>
            </Transition>
          )}
        </div>
      )}
      <div className={styles.logobox}>
        {/* 大会ロゴ なしの場合はクラスにdisableを追加*/}
        {setting.scoreboard.cameraAndLogo.useLogo &&
          setting.scoreboard.cameraAndLogo.logoURLs.length > 0 && (
            <Transition
              keyName={setting.scoreboard.cameraAndLogo.logoURLs[logoIdx]}
            >
              <img
                src={setting.scoreboard.cameraAndLogo.logoURLs[logoIdx]}
                alt=""
                className={styles.logo}
                style={{
                  display: setting.scoreboard.cameraAndLogo.useLogo
                    ? ""
                    : "none",
                  filter: {
                    none: "",
                    light: "drop-shadow(0 0 6px rgb(255 255 255 / 70%))",
                    dark: "drop-shadow(0 0 4px rgb(0 0 0 / 30%))",
                  }[setting.scoreboard.cameraAndLogo.dropShadow],
                }}
              />
            </Transition>
          )}
      </div>
      {/*1Pスコア*/}
      <Transition keyName={`${score.p1.playerName}-${score.p1.score}`}>
        <div className={`${styles.score} ${styles.p1}`}>{score.p1.score}</div>
      </Transition>
      {/*2Pスコア*/}
      <Transition keyName={`${score.p2.playerName}-${score.p2.score}`}>
        <div className={`${styles.score} ${styles.p2}`}>{score.p2.score}</div>
      </Transition>
      <div className={`${styles.player} ${styles.p1}`}>
        <Transition keyName={`${score.p1.team}-${score.p1.playerName}`}>
          <div>
            {score.p1.team && (
              <span className={styles.team}>{score.p1.team}</span>
            )}
            <span className={styles.name}>{score.p1.playerName}</span>
          </div>
        </Transition>
      </div>
      <div className={`${styles.player} ${styles.p2}`}>
        <Transition keyName={`${score.p2.team}-${score.p2.playerName}`}>
          <div>
            {score.p2.team && (
              <span className={styles.team}>{score.p2.team}</span>
            )}
            <span className={styles.name}>{score.p2.playerName}</span>
          </div>
        </Transition>
      </div>
      <Transition keyName={score.round}>
        <div
          className={styles.round}
          style={{
            textTransform: score.uppercase ? "uppercase" : "none",
          }}
        >
          {score.round}
        </div>
      </Transition>
      <Transition keyName={score.matchType}>
        <div
          className={styles.matchType}
          style={{
            textTransform: score.uppercase ? "uppercase" : "none",
          }}
        >
          {score.matchType}
        </div>
      </Transition>
      {!(
        setting.scoreboard.cameraAndLogo.useLogo &&
        setting.scoreboard.cameraAndLogo.logoURLs.length > 0
      ) && (
        <Transition keyName={setting.name}>
          <div className={styles.tournamentNameBox}>
            <div className={styles.tournamentName}>{setting.name}</div>
          </div>
        </Transition>
      )}
    </div>
  )
}
