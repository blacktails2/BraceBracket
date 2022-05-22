import styles from "./index.module.css"
import { NextPageWithLayout } from "../libs/const"
import Link from "next/link"
import { DefaultLayout } from "../components/layouts/DefaultLayout"

const Home: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <h1>
        <Link href="/create">使ってみる</Link>
      </h1>
    </div>
  )
}

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>

export default Home
