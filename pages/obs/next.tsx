import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { MatchInterval } from "../../components/obs/next/MatchIntervalInfo"
import { useMatchIntervalInfo } from "../../hooks/useMatchIntervalInfo"
import { useScore } from "../../hooks/useScore"
import { useSetting } from "../../hooks/useSetting"
import { MatchIntervalInfo } from "../../libs/const"

const Next: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting] = useSetting(id)
  const [matchIntervalInfo] = useMatchIntervalInfo(id)
  const [score] = useScore(id)
  const [info, setInfo] = useState<MatchIntervalInfo | undefined>(
    matchIntervalInfo
  )

  useEffect(() => {
    if (!matchIntervalInfo) return

    if (!matchIntervalInfo.isNow) {
      setInfo(matchIntervalInfo)
      return
    }
    if (!score) return
    setInfo({
      ...matchIntervalInfo,
      p1: score.p1,
      p2: score.p2,
      round: score.round,
      matchType: score.matchType,
      uppercase: score.uppercase,
    })
  }, [matchIntervalInfo, score])

  if (!setting || !matchIntervalInfo || !info) {
    return null
  }
  return (
    <>
      <Head>
        <title>BraceBracket | Next Layout</title>
      </Head>
      <MatchInterval setting={setting} matchIntervalInfo={info} />
    </>
  )
}

export default Next
