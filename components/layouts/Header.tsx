import Link from "next/link"
import { FC } from "react"

import styles from "./Header.module.scss"

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <div>
        <nav className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <Link href="/">
              <a className={styles.topLink}></a>
            </Link>
          </div>
          <div className={styles.navbarRight}>
            <div className={styles.headerLinkContainer}>
              <Link href="/usage" passHref>
                <a className={styles.headerLink}>How to Use</a>
              </Link>
              <Link href="/help" passHref>
                <a className={styles.headerLink}>Help</a>
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
                href="https://discord.gg/TgMFQEqxY9"
                target="_blank"
                rel="noreferrer"
                className={styles.headerLink}
              >
                Discord
              </a>
            </div>
            <Link href={`/create`}>
              <a className={styles.createLink}>スコアボードを作成</a>
            </Link>
            <div className={styles.hamburgerMenu}>
              <input
                type="checkbox"
                className={styles.dummyButton}
                id="hamburgerMenu"
              />
              <label htmlFor="hamburgerMenu" className={styles.menuButton}>
                <span></span>
              </label>
              <div className={styles.menuContent}>
                <ul>
                  <li>
                    <Link href="/usage" passHref>
                      <a>How to Use</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" passHref>
                      <a>Help</a>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/blacktails2/BraceBracket"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://discord.gg/TgMFQEqxY9"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
