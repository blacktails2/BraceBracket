import { FC, useEffect, useState } from "react"

import { BracketScore } from "../../../libs/const"
import { Transition } from "../../parts/Transition"

import styles from "./BracketBox.module.scss"

export const BracketBox: FC<{
  score: BracketScore
  pos: { top: string; left: string }
  delay?: number
}> = ({ score: { player1: _player1, player2: _player2 }, pos, delay }) => {
  const [player1, setPlayer1] = useState<{
    team: string
    name: string
    score?: number
  }>({ team: "", name: "" })
  useEffect(() => {
    setPlayer1(_player1)
  }, [_player1])
  const [player2, setPlayer2] = useState<{
    team: string
    name: string
    score?: number
  }>({ team: "", name: "" })
  useEffect(() => {
    setPlayer2(_player2)
  }, [_player2])
  return (
    <div className={styles.bracketBox} style={pos}>
      <div className={styles.name}>
        <Transition keyName={`${player1.team}-${player1.name}`}>
          <p>
            {player1.team && (
              <span className={styles.playerTeam}>{player1.team}</span>
            )}
            <span className={styles.playerName}>{player1.name}</span>
          </p>
        </Transition>
        <Transition keyName={`${player2.team}-${player2.name}`}>
          <p>
            {player2.team && (
              <span className={styles.playerTeam}>{player2.team}</span>
            )}
            <span className={styles.playerName}>{player2.name}</span>
          </p>
        </Transition>
      </div>
      <div className={styles.score}>
        <Transition keyName={`${player1.team}-${player1.score}`}>
          <p>
            <span>{player1.score}</span>
          </p>
        </Transition>
        <Transition keyName={`${player1.team}-${player1.score}`}>
          <p>
            <span>{player2.score}</span>
          </p>
        </Transition>
      </div>
    </div>
  )
}
