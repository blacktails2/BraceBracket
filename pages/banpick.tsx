import { useRouter } from "next/router"

import { BanPick } from "../components/banpick/BanPick"
import { useBanPick } from "../hooks/useBanPick"
import { useScore } from "../hooks/useScore"
import { useSetting } from "../hooks/useSetting"
import { NextPageWithLayout } from "../libs/const"

const BanPickPage: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, , loadingSetting] = useSetting(id, true)
  const [score, setScore, loadingScore] = useScore(id, true)
  const [banPick, setBanPick, loadingBanPick] = useBanPick(id, true)

  if (
    !setting ||
    loadingSetting ||
    !score ||
    loadingScore ||
    !banPick ||
    loadingBanPick
  )
    return null

  return (
    <BanPick
      {...{
        setting,
        score,
        setScore,
        banPick,
        setBanPick,
      }}
    />
  )
}

export default BanPickPage
