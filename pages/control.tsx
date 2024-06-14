import { useRouter } from "next/router"

import { Control } from "../components/control2/Control"
import SuggestList from "../components/control2/SuggestList"
import { useLoadBracket } from "../hooks/useLoadBracket"
import { useMatchIntervalInfo } from "../hooks/useMatchIntervalInfo"
import { useMC } from "../hooks/useMC"
import { useScore } from "../hooks/useScore"
import { useSetting } from "../hooks/useSetting"
import { useTelop } from "../hooks/useTelop"
import { NextPageWithLayout } from "../libs/const"

const ControlPage: NextPageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [setting, setSetting, loadingSetting] = useSetting(id)
  const [score, setScore, loadingScore] = useScore(id)
  const [matchIntervalInfo, setMatchIntervalInfo, loadingMachIntervalInfo] =
    useMatchIntervalInfo(id)
  const [mc, setMC, loadingMC] = useMC(id)
  const [loadBracket, requestLoad, loadingLoadBracket] = useLoadBracket(id)
  const [telop, setTelop, loadingTelop] = useTelop(id)

  if (
    !setting ||
    !score ||
    !matchIntervalInfo ||
    !mc ||
    !loadBracket ||
    !telop
  ) {
    return null
  }

  if (
    loadingSetting ||
    loadingScore ||
    loadingMachIntervalInfo ||
    loadingMC ||
    loadingLoadBracket ||
    loadingTelop
  )
    return null

  return (
    <>
      <Control
        {...{
          setting,
          setSetting,
          score,
          setScore,
          matchIntervalInfo,
          setMatchIntervalInfo,
          mc,
          setMC,
          loadBracket,
          requestLoad,
          telop,
          setTelop,
        }}
      />
      <SuggestList setting={setting} />
    </>
  )
}

export default ControlPage
