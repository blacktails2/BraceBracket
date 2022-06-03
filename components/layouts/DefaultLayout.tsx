import { ReactElement } from "react"

import styles from "./DefaultLayout.module.scss"
import { Footer } from "./Footer"
import { Header } from "./Header"

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const DefaultLayout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      <Footer />
    </div>
  )
}
