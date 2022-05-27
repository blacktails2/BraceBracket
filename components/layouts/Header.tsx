import { FC } from "react"
import styles from "./Header.module.scss"
import Link from "next/link"
import Image from "next/image"

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div>
        <nav className={styles.navbar}>
          <div className={styles.navbarRight}>
            <Image
              src="/image/logotype.svg"
              width={292}
              height={30}
              alt="ロゴ"
            />
          </div>
          <div className={styles.navbarLeft}>
            <div className={styles.headerLinkContainer}>
              <Link href="/" passHref>
                <a className={styles.headerLink}>Top</a>
              </Link>
            </div>
            <Link href="/how-to-use" passHref>
              <a className={styles.headerLink}>How to Use</a>
            </Link>
            <a
              href="https://github.com/blacktails2/BraceBracket"
              target="_blank"
              rel="noreferrer"
              className={styles.headerLink}
            >
              GitHub
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              className={styles.headerLink}
            >
              Community
            </a>
            <Link href="/create">
              <a className={styles.createLink}>スコアボードを作成</a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
