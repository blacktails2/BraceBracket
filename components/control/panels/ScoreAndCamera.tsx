import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import { useScore } from "../../../hooks/useScore"
import { useSetting } from "../../../hooks/useSetting"
import { Score } from "../../../libs/const"
import { ControlPanel } from "../parts/ControlPanel"
import { ScoreAndCameraForm } from "../parts/ScoreAndCameraForm"
import { StreamQueueTable } from "../parts/StreamQueueTable"

export const ScoreAndCamera: FC = () => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [score, setScore] = useScore(id)
  const [setting] = useSetting(id)
  const [showTooltip, setShowTooltip] = useState(false)
  const scoreForm = useForm<Score>()
  const { reset } = scoreForm
  const onScoreSubmit: SubmitHandler<Score> = (data) => {
    setScore(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }
  useEffect(() => {
    reset(score)
  }, [reset, score])
  return (
    <ControlPanel title="スコア&カメラ" url={`${origin}/obs/score/?id=${id}`}>
      <hr />
      <StreamQueueTable
        onChange={(queue) => {
          scoreForm.setValue("p1.team", queue.p1?.team ?? "")
          scoreForm.setValue("p1.playerName", queue.p1?.playerName ?? "")
          scoreForm.setValue("p1.score", queue.p1?.score ?? 0)
          scoreForm.setValue("p1.twitterID", queue.p1?.twitterID ?? "")

          scoreForm.setValue("p2.team", queue.p2?.team ?? "")
          scoreForm.setValue("p2.playerName", queue.p2?.playerName ?? "")
          scoreForm.setValue("p2.score", queue.p2?.score ?? 0)
          scoreForm.setValue("p2.twitterID", queue.p2?.twitterID ?? "")
          scoreForm.setValue("round", queue.roundText)
        }}
        id="scoreAndCameraStreamQueueTable"
      />
      <ScoreAndCameraForm
        form={scoreForm}
        onScoreSubmit={onScoreSubmit}
        score={score}
        setting={setting}
        showTooltip={showTooltip}
      />
    </ControlPanel>
  )
}
