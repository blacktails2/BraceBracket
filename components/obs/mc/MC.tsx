import { FC, useEffect, useState } from "react"
import {
  getMCFilename,
  MC as MCInfo,
  PlayerScore,
  Setting,
} from "../../../libs/const"
import styles from "./MC.module.scss"
import { Transition } from "../../parts/Transition"

const mcLayoutArray = [
  styles.mc1_layout,
  styles.mc2_layout,
  styles.mc3_layout,
  styles.mc4_layout,
]

const mcStyleArray = [styles.mc1, styles.mc2, styles.mc3, styles.mc4]

const idStyleArray = [styles.id1, styles.id2, styles.id3, styles.id4]

export const MC: FC<{ setting: Setting; mc: MCInfo }> = ({ setting, mc }) => {
  const [filteredMCList, setFilteredMCList] = useState<PlayerScore[]>([])
  useEffect(() => {
    console.log(mc)
    const filteredMC = mc.mcList.filter((m) => {
      return m.playerName || m.team || m.twitterID
    })
    console.log(filteredMC)
    setFilteredMCList(filteredMC)
  }, [mc])

  return (
    <div
      className={`${
        setting.scoreboard.design.layout === "simple"
          ? styles.simple
          : styles.normal
      } ${(() => {
        if (setting.scoreboard.design.layout === "simple") {
          return setting.scoreboard.design.color === "white"
            ? styles.white
            : styles.black
        } else {
          return setting.scoreboard.design.color.startsWith("light")
            ? styles.light
            : styles.dark
        }
      })()}`}
    >
      <div className={mcLayoutArray[filteredMCList.length - 1]}>
        <img
          src={`/image/mc/${getMCFilename(
            setting.scoreboard.design.layout,
            setting.scoreboard.design.color,
            filteredMCList.length
          )}`}
          className={styles.board}
          alt="背景画像"
        />
        {filteredMCList.map((mc, idx) => {
          return (
            <>
              <Transition keyName={`${mc.team}-${mc.playerName}-${idx}`}>
                <p className={mcStyleArray[idx]}>
                  <span className={styles.mc_team}>{mc.team}</span>
                  <span className={styles.mc_name}>{mc.playerName}</span>
                </p>
              </Transition>
              <Transition keyName={`${mc.twitterID}-${idx}`}>
                <p className={idStyleArray[idx]}>
                  {mc.twitterID && !mc.twitterID.startsWith("@")
                    ? `@${mc.twitterID}`
                    : mc.twitterID}
                </p>
              </Transition>
            </>
          )
        })}
      </div>
    </div>
  )
}
