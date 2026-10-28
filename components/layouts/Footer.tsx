import Image from "next/image"
import { FC } from "react"

import { intrinsicImageStyle } from "../parts/imageStyle"

import styles from "./Footer.module.scss"

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <div className={styles.footerImage}>
          <Image
            src="/image/symbol.svg"
            width={63}
            height={30}
            alt="ロゴ"
            style={intrinsicImageStyle(63, 30)}
          />
        </div>
        <div className={styles.footerText}>Copyright 2022 BraceBracket</div>
      </div>
      <div className={styles.footerRight}>
        <a
          href="https://discord.gg/TgMFQEqxY9"
          target="_blank"
          rel="noreferrer"
          className={styles.footerText}
        >
          Developer Contact
        </a>
      </div>
    </footer>
  )
}
