import { Score, Setting } from "../../../libs/const"
import { FC } from "react"
import styles from "./Solid.module.scss"

export const Solid: FC<{ setting: Setting; score: Score }> = ({
  setting,
  score,
}) => {
  return (
    <div className={setting.scoreboard.design.color}>
      {/* スコアボードのデザインの画像 */}
      <img
        className={styles.board}
        src={`/image/scoreboards/${setting.scoreboard.design.color}.png`}
        alt=""
      />
      {/* 大会ロゴ なしの場合はクラスにdisableを追加 */}
      <div className={styles.solid_logobox}>
        <img
          src="/image/logo.png"
          alt=""
          className={[styles.solid_logo, styles.disable].join(" ")}
        />
      </div>
      {/* 1Pスコア */}
      <p className={styles.solid_numberleft}>{score.p1.score}</p>
      {/* 2Pスコア */}
      <p className={styles.solid_numberright}>{score.p2.score}</p>
      <p className={[styles.solid_player, styles.solid_playerleft].join(" ")}>
        <span className={styles.solid_teamleft}>{score.p1.team}</span>
        <span className={styles.solid_nameleft}>{score.p1.playerName}</span>
      </p>
      <p className={[styles.solid_player, styles.solid_playerright].join(" ")}>
        <span className={styles.solid_teamright}>{score.p2.team}</span>
        <span className={styles.solid_nameright}>{score.p2.playerName}</span>
      </p>
      <div className={styles.solid_prbox}>
        <p className={styles.solid_prtextleft}>{score.round}</p>
        <p className={styles.solid_prtextright}>{score.matchType}</p>
      </div>
    </div>
  )
}
