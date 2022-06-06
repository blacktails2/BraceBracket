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
      </Head>
      <DefaultLayout>{page}</DefaultLayout>
    </>
  )
}

export default CreatePage
