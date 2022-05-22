import { Score, Setting } from "../../libs/const"
import { FC } from "react"
import styles from "../../styles/Solid.module.scss"

export const Solid: FC<{ setting: Setting; score: Score }> = ({
  setting,
  score,
}) => {
  return (
    <div className={setting.scoreboard_style}>
      {/* スコアボードのデザインの画像 */}
      <img
        className={styles.board}
        src={`/image/scoreboards/${setting.scoreboard_style}`}
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
      <p className={styles.solid_numberleft}>{score.p1_score}</p>
      {/* 2Pスコア */}
      <p className={styles.solid_numberright}>{score.p2_score}</p>
      <p className={[styles.solid_player, styles.solid_playerleft].join(" ")}>
        <span className={styles.solid_teamleft}>{score.p1_team}</span>
        <span className={styles.solid_nameleft}>{score.p1_player_name}</span>
      </p>
      <p className={[styles.solid_player, styles.solid_playerright].join(" ")}>
        <span className={styles.solid_teamright}>{score.p2_team}</span>
        <span className={styles.solid_nameright}>{score.p2_player_name}</span>
      </p>
      <div className={styles.solid_prbox}>
        <p className={styles.solid_prtextleft}>{score.round}</p>
        <p className={styles.solid_prtextright}>{score.match_type}</p>
      </div>
    </div>
  )
}
