import { FC } from "react"
import { Score, Setting } from "../../../libs/const"
import styles from "./Dual.module.scss"
import { CSSTransition, SwitchTransition } from "react-transition-group"

export const Dual: FC<{ setting: Setting; score: Score }> = ({
  setting,
  score,
}) => {
  const { layout, color } = setting.scoreboard.design
  return (
    <div className={color}>
      {/*スコアボードのデザインの画像*/}
      <img
        className={styles.board}
        src={`/image/scoreboards/${layout}/${layout}_${color}.png`}
        alt=""
      />
      <div className={styles.dual_logobox}>
        {/* 大会ロゴ なしの場合はクラスにdisableを追加*/}
        <img
          src="/image/logo.png"
          alt=""
          className={`${styles.dual_logo} ${styles.disable}`}
        />
      </div>
      {/*1Pスコア*/}
      <div className={styles.dual_numberleft}>{score.p1.score}</div>
      {/*2Pスコア*/}
      <div className={styles.dual_numberright}>{score.p2.score}</div>
      <div className={`${styles.dual_player} ${styles.dual_playerleft}`}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={`${score.p1.team}-${score.p1.playerName}`}
            addEndListener={(node: HTMLElement, done: () => void) => {
              node.addEventListener("transitionend", done, false)
            }}
            classNames="fade"
          >
            <div>
              <span className={styles.dual_teamleft}>{score.p1.team}</span>
              <span className={styles.dual_nameleft}>
                {score.p1.playerName}
              </span>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className={`${styles.dual_player} ${styles.dual_playerright}`}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={`${score.p2.team}-${score.p2.playerName}`}
            addEndListener={(node: HTMLElement, done: () => void) => {
              node.addEventListener("transitionend", done, false)
            }}
            classNames="fade"
          >
            <div>
              <span className={styles.dual_teamright}>{score.p2.team}</span>
              <span className={styles.dual_nameright}>
                {score.p2.playerName}
              </span>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className={styles.dual_prtextleft}>{score.round}</div>
      <div className={styles.dual_prtextright}>{score.matchType}</div>
      <div className={styles.dual_optionbox}>
        <div className={styles.dual_option}>{score.tournamentName}</div>
      </div>
    </div>
  )
}
