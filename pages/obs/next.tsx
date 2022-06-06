import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useInterval } from "react-use"

import { MatchInterval } from "../../components/obs/next/MatchIntervalInfo"
import { useMatchIntervalInfo } from "../../hooks/useMatchIntervalInfo"
import { useScore } from "../../hooks/useScore"
import { useSetting } from "../../hooks/useSetting"
import { MatchIntervalInfo } from "../../libs/const"

const Next: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, , loadingSetting] = useSetting(id)
  const [matchIntervalInfo, , loadingMachIntervalInfo] =
    useMatchIntervalInfo(id)
  const [score, , loadingScore] = useScore(id)
  const [info, setInfo] = useState<MatchIntervalInfo | undefined>(
    matchIntervalInfo
  )

  const [time, setTime] = useState("")
  useInterval(() => {
    const localTime = new Date()
    const hour = localTime.getHours() // 時
    const min = localTime.getMinutes() // 分
    setTime((hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min)
  }, 1000)

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

  if (
    !setting ||
    loadingSetting ||
    !matchIntervalInfo ||
    loadingMachIntervalInfo ||
    !info
  ) {
    return null
  }
  return (
    <>
      <Head>
        <title>BraceBracket | Next Layout</title>
      </Head>
      <div className="relative">
        <MatchInterval setting={setting} matchIntervalInfo={info} time={time} />
      </div>
    </>
  )
}

export default Next
