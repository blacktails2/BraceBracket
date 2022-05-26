import { FC } from "react"
import styles from "./Footer.module.scss"
import Link from "next/link"
import Image from "next/image"

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <div className={styles.footerImage}>
          <Image src="/image/symbol.svg" width={63} height={30} alt="ロゴ" />
        </div>
        <div className={styles.footerText}>Copyright 2022 BraceBracket</div>
        <Link href="/term-of-use" passHref>
          <a className={styles.footerText}>Term of Use</a>
        </Link>
      </div>
      <div className={styles.footerRight}>
        <Link href="/developer-contact" passHref>
          <a className={styles.footerText}>Developer Contact</a>
        </Link>
      </div>
    </footer>
  )
}
