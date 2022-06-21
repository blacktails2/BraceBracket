import Head from "next/head"
import { useRouter } from "next/router"

import { DefaultLayout } from "../components/layouts/DefaultLayout"
import { Links } from "../components/links/Links"
import { useOrigin } from "../hooks/useOrigin"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout } from "../libs/const"

const LinksPage: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [setting] = useSetting(id)

  return (
    <>
      <Links origin={origin} id={id} setting={setting} />
    </>
  )
}

LinksPage.getLayout = (page) => {
  return (
    <>
      <Head>
        <title>BraceBracket | Control</title>
      </Head>
      <DefaultLayout>{page}</DefaultLayout>
    </>
  )
}

export default LinksPage
