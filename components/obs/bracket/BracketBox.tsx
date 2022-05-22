import { FC } from "react"
import styles from "./BracketBox.module.scss"
import { BracketScore } from "../../../libs/const"

export const BracketBox: FC<{
  score: BracketScore
  pos: { top: string; left: string }
}> = ({ score: { player1, player2 }, pos }) => {
  return (
    <div className={styles.bracketBox} style={pos}>
      <div className={styles.name}>
        <p>
          {player1.team && (
            <span className={styles.playerTeam}>{player1.team}</span>
          )}
          <span className={styles.playerName}>{player1.name}</span>
        </p>
        <p>
          {player2.team && (
            <span className={styles.playerTeam}>{player2.team}</span>
          )}
          <span className={styles.playerName}>{player2.name}</span>
        </p>
      </div>
      <div className={styles.score}>
        <p>
          <span>{player1.score}</span>
        </p>
        <p>
          <span>{player2.score}</span>
        </p>
      </div>
    </div>
  )
}
