import { FC } from "react"
import { Score, Setting } from "../../libs/const"
import styles from "../../styles/Single.module.scss"

export const Single: FC<{ setting: Setting; score: Score }> = ({
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
      {/*大会ロゴ なしの場合はクラスにdisableを追加 */}
      <div className={styles.single_logobox}>
        <img
          src="/image/logo.png"
          alt=""
          className={[styles.single_logo, styles.disable].join(" ")}
        />
      </div>
      {/* 1Pスコア */}
      <p className={styles.single_numberleft}>{score.p1_score}</p>
      {/* 2Pスコア */}
      <p className={styles.single_numberright}>{score.p2_score}</p>
      <p className={[styles.single_player, styles.single_playerleft].join(" ")}>
        <span className={styles.single_teamleft}>{score.p1_team}</span>
        <span className={styles.single_nameleft}>{score.p1_player_name}</span>
      </p>
      <p
        className={[styles.single_player, styles.single_playerright].join(" ")}
      >
        <span className={styles.single_teamright}>{score.p2_team}</span>
        <span className={styles.single_nameright}>{score.p2_player_name}</span>
      </p>
      <div className={styles.single_prbox}>
        <p className={styles.single_prtextleft}>{score.round}</p>
        <p className={styles.single_prtextright}>{score.match_type}</p>
      </div>
    </div>
  )
}
