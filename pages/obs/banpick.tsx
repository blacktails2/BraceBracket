import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"

import { BanPick } from "../../components/obs/banpick/BanPick"
import { useBanPick } from "../../hooks/useBanPick"

const Page: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [banpick, , loadingBanpick] = useBanPick(id)

  if (!banpick || loadingBanpick) {
    return null
  }

  return (
    <>
      <Head>
        <title>BraceBracket | BanPick Layout</title>
      </Head>
      <div className="relative">
        <BanPick banpick={banpick} />
      </div>
    </>
  )
}

export default Page
