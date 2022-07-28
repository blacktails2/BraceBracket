import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"

import { Telop } from "../../components/obs/telop/Telop"
import { useSetting } from "../../hooks/useSetting"
import { useTelop } from "../../hooks/useTelop"

const Page: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, , loadingSetting] = useSetting(id)
  const [telop, , loadingTelop] = useTelop(id)

  if (!setting || loadingSetting || !telop || loadingTelop) {
    return null
  }

  return (
    <>
      <Head>
        <title>BraceBracket | Telop Layout</title>
      </Head>
      <div className="relative">
        <Telop setting={setting} telop={telop} />
      </div>
    </>
  )
}

export default Page
