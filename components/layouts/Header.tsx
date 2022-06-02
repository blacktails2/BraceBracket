import { FC } from "react"
import styles from "./Header.module.scss"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"

export const Header: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  return (
    <header className={styles.header}>
      <div>
        <nav className={styles.navbar}>
          <div className={styles.navbarRight}>
            <Link href="/">
              <a>
                <Image
                  src="/image/logotype.svg"
                  width={292}
                  height={30}
                  alt="ロゴ"
                />
              </a>
            </Link>
          </div>
          <div className={styles.navbarLeft}>
            <div className={styles.headerLinkContainer}>
              <Link href="/" passHref>
                <a className={styles.headerLink}>Top</a>
              </Link>
            </div>
            <Link href="/" passHref>
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
              href="https://discord.gg/TgMFQEqxY9"
              target="_blank"
              rel="noreferrer"
              className={styles.headerLink}
            >
              Community
            </a>
            <Link href={`/create${id ? `?id=${id}` : ""}`}>
              <a className={styles.createLink}>
                {id ? "スコアボードを修正" : "スコアボードを作成"}
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
