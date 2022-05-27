import { NextPage } from "next"
import { useSetting } from "../../hooks/useSetting"
import { useMatchIntervalInfo } from "../../hooks/useMatchIntervalInfo"
import { useRouter } from "next/router"
import { MatchInterval } from "../../components/obs/next/MatchIntervalInfo"

const Next: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [matchIntervalInfo] = useMatchIntervalInfo(id)

  if (!setting || !matchIntervalInfo) {
    return null
  }

  return (
    <MatchInterval setting={setting} matchIntervalInfo={matchIntervalInfo} />
  )
}

export default Next
