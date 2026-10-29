import { FC, useEffect, useState } from "react"

import { customImage } from "../../../custom/config"
import { MC as MCInfo, PlayerScore, Setting } from "../../../libs/const"
import { Transition } from "../../parts/Transition"

import styles from "./MC.module.scss"

const mcLayoutArray = [
  styles.mc1_layout,
  styles.mc2_layout,
  styles.mc3_layout,
  styles.mc4_layout,
]

const mcStyleArray = [styles.mc1, styles.mc2, styles.mc3, styles.mc4]

const idStyleArray = [styles.id1, styles.id2, styles.id3, styles.id4]

export const MC: FC<{ setting: Setting; mc: MCInfo }> = ({ mc }) => {
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
    <div className={styles.custom}>
      {filteredMCList.length > 0 && (
        <div className={mcLayoutArray[filteredMCList.length - 1]}>
          <img
            src={customImage.mc(filteredMCList.length)}
            className={styles.board}
            alt="背景画像"
          />
          {filteredMCList.map((mc, idx) => {
            return (
              <>
                <Transition keyName={`${mc.team}-${mc.playerName}-${idx}`}>
                  <p className={mcStyleArray[idx]}>
                    {mc.team && (
                      <span className={styles.mc_team}>{mc.team}</span>
                    )}
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
      )}
    </div>
  )
}
