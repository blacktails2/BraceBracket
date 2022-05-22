import { FC } from "react"
import { Score, Setting } from "../../libs/const"
import styles from "../../styles/Dual.module.scss"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import Image from "next/image"

export const Dual: FC<{ setting: Setting; score: Score }> = ({
  setting,
  score,
}) => {
  return (
    <div className={setting.scoreboard_style}>
      {/*スコアボードのデザインの画像*/}
      <Image
        className={styles.board}
        src={`/image/scoreboards/${setting.scoreboard_style}`}
        alt=""
      />
      <div className={styles.dual_logobox}>
        {/* 大会ロゴ なしの場合はクラスにdisableを追加*/}
        <Image
          src="/image/logo.png"
          alt=""
          className={`${styles.dual_logo} ${styles.disable}`}
        />
      </div>
      {/*1Pスコア*/}
      <div className={styles.dual_numberleft}>{score.p1_score}</div>
      {/*2Pスコア*/}
      <div className={styles.dual_numberright}>{score.p2_score}</div>
      <div className={`${styles.dual_player} ${styles.dual_playerleft}`}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={`${score.p1_team}-${score.p1_player_name}`}
            addEndListener={(node: HTMLElement, done: () => void) => {
              node.addEventListener("transitionend", done, false)
            }}
            classNames="fade"
          >
            <div>
              <span className={styles.dual_teamleft}>{score.p1_team}</span>
              <span className={styles.dual_nameleft}>
                {score.p1_player_name}
              </span>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className={`${styles.dual_player} ${styles.dual_playerright}`}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={`${score.p1_team}-${score.p1_player_name}`}
            addEndListener={(node: HTMLElement, done: () => void) => {
              node.addEventListener("transitionend", done, false)
            }}
            classNames="fade"
          >
            <div>
              <span className={styles.dual_teamright}>{score.p2_team}</span>
              <span className={styles.dual_nameright}>
                {score.p2_player_name}
              </span>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className={styles.dual_prtextleft}>{score.round}</div>
      <div className={styles.dual_prtextright}>{score.match_type}</div>
      <div className={styles.dual_optionbox}>
        <div className={styles.dual_option}>{score.tournament_name}</div>
      </div>
    </div>
  )
}
