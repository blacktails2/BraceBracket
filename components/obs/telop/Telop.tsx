import { FC } from "react"

import {
  Telop as TelopType,
  Setting,
  getTelopFilename,
} from "../../../libs/const"
import { Transition } from "../../parts/Transition"

import styles from "./Telop.module.scss"

export const Telop: FC<{ setting: Setting; telop: TelopType }> = ({
  setting,
  telop,
}) => {
  if (telop.isHide) {
    return null
  }

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
      })()} h-[100vh] w-[100vw]`}
    >
      <div className="h-full w-full">
        <img
          src={`/image/telop/${getTelopFilename(
            setting.scoreboard.design.layout,
            setting.scoreboard.design.color,
            telop.isBottom
          )}`}
          className={styles.board}
          alt="背景画像"
        />
        <Transition keyName={`${telop.text1}-${telop.text2}`}>
          <p
            className={`${styles.text} ${
              telop.isBottom ? styles.bottom : styles.top
            } ${telop.text2 && telop.text2 !== "" ? styles.twoLine : ""}`}
          >
            {telop.text1}
            {telop.text2 && telop.text2 !== "" && (
              <>
                <br /> {telop.text2}
              </>
            )}
          </p>
        </Transition>
      </div>
    </div>
  )
}
