import { FC } from "react"
import {
  getCameraFilename,
  Score,
  ScoreboardColor,
  ScoreboardLayout,
  Setting,
} from "../../../libs/const"
import styles from "./Score.module.scss"
import { CSSTransition, SwitchTransition } from "react-transition-group"

const getLayoutClass = (layout: ScoreboardLayout) => {
  switch (layout) {
    case "dual":
      return styles.dual
    case "single":
      return styles.single
    case "solid":
      return styles.solid
    case "simple":
      return styles.simple
    default:
      return styles.dual
  }
}

const getColorClass = (layout: ScoreboardColor) => {
  switch (layout) {
    case "dark_color":
      return styles.darkColor
    case "dark_mono":
      return styles.darkMono
    case "light_color":
      return styles.lightColor
    case "light_mono":
      return styles.lightMono
    case "beige":
      return styles.beige
    case "gradient":
      return styles.gradient
    case "black":
      return styles.black
    case "white":
      return styles.white
    default:
      return styles.darkColor
  }
}

export const Scoreboard: FC<{ setting: Setting; score: Score }> = ({
  setting,
  score,
}) => {
  const { layout, color } = setting.scoreboard.design

  return (
    <div
      className={`${styles.container} ${getLayoutClass(layout)} ${getColorClass(
        color
      )}`}
    >
      {/*スコアボードのデザインの画像*/}
      <img
        className={styles.board}
        src={`/image/scoreboards/${layout}/${layout}_${color}.png`}
        alt=""
      />
      {setting.scoreboard.cameraAndLogo.displayCameraAndTwitterID && (
        <div>
          <img
            className={styles.board}
            src={`/image/camera/${getCameraFilename(layout, color)}`}
            alt=""
          />
          <p className={styles.cameraLeft}>{score.p1.twitterID}</p>
          <p className={styles.cameraRight}>{score.p2.twitterID}</p>
        </div>
      )}
      <div className={styles.logobox}>
        {/* 大会ロゴ なしの場合はクラスにdisableを追加*/}
        <img
          src="/image/logo.png"
          alt=""
          className={styles.logo}
          style={{
            display: setting.scoreboard.cameraAndLogo.useLogo ? "" : "none",
          }}
        />
      </div>
      {/*1Pスコア*/}
      <div className={styles.p1Score}>{score.p1.score}</div>
      {/*2Pスコア*/}
      <div className={styles.p2Score}>{score.p2.score}</div>
      <div className={styles.player1Name}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={`${score.p1.team}-${score.p1.playerName}`}
            addEndListener={(node: HTMLElement, done: () => void) => {
              node.addEventListener("transitionend", done, false)
            }}
            classNames="fade"
          >
            <div>
              <span className={styles.p1Team}>{score.p1.team}</span>
              <span className={styles.p1PlayerName}>{score.p1.playerName}</span>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className={styles.player2Name}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={`${score.p2.team}-${score.p2.playerName}`}
            addEndListener={(node: HTMLElement, done: () => void) => {
              node.addEventListener("transitionend", done, false)
            }}
            classNames="fade"
          >
            <div>
              <span className={styles.p2Team}>{score.p2.team}</span>
              <span className={styles.p2PlayerName}>{score.p2.playerName}</span>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      {((layout: string) => {
        switch (layout) {
          case "dual":
            return (
              <>
                <div className={styles.round}>{score.round}</div>
                <div className={styles.matchType}>{score.matchType}</div>
                <div className={styles.tournamentNameBox}>
                  <div className={styles.tournamentName}>
                    {score.tournamentName}
                  </div>
                </div>
              </>
            )
          case "single":
          case "solid":
          case "simple":
            return (
              <div className={styles.box}>
                <p className={styles.round}>{score.round}</p>
                <p className={styles.matchType}>{score.matchType}</p>
              </div>
            )
        }
      })(layout)}
    </div>
  )
}
