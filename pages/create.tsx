import Head from "next/head"
import { useRouter } from "next/router"

import { Create } from "../components/create/Create"
import { DefaultLayout } from "../components/layouts/DefaultLayout"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout } from "../libs/const"

const CreatePage: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, , loadingSetting] = useSetting(id)
  if (!setting || loadingSetting) return null
  return <Create setting={setting} />
}

CreatePage.getLayout = (page) => {
  return (
    <>
      <Head>
        <title>BraceBracket | Setting</title>
        <meta property="og:url" content="https://bracebracket.app/create/" />
        <meta property="og:type" content="article" />
        <meta
          property="og:description"
          content="BraceBracketは、Webベースの対戦ゲーム用スコアボードツールです。OSを問わず、ブラウザ上でスコアボードを作成・編集できます。"
        />
        <meta property="og:site_name" content="BraceBracket" />
        <meta
          property="og:image"
          content="https://bracebracket.app/image/ogp.jpg"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wolphtype" />
      </Head>
      <DefaultLayout>{page}</DefaultLayout>
    </>
  )
}

export default CreatePage
