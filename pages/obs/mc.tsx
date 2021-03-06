import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"

import { MC } from "../../components/obs/mc/MC"
import { useMC } from "../../hooks/useMC"
import { useSetting } from "../../hooks/useSetting"

const Page: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, , loadingSetting] = useSetting(id)
  const [mc, , loadingMC] = useMC(id)

  if (!setting || loadingSetting || !mc || loadingMC) {
    return null
  }

  return (
    <>
      <Head>
        <title>BraceBracket | Title Layout</title>
      </Head>
      <div className="relative">
        <MC setting={setting} mc={mc} />
      </div>
    </>
  )
}

export default Page
