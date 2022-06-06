import { useRouter } from "next/router"
import { FC, memo, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { useOrigin } from "../../../hooks/useOrigin"
import {
  MatchIntervalInfo,
  MatchIntervalInfo as FormType,
  Setting,
} from "../../../libs/const"
import { Button } from "../../parts/Button"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { MatchTypeSelector } from "../../parts/MatchTypeSelector"
import { RoundSelector } from "../../parts/RoundSelector"
import { TextForm } from "../../parts/TextForm"
import { ControlPanel } from "../parts/ControlPanel"
import { StreamQueueTable } from "../parts/StreamQueueTable"

const Next: FC<{
  setting: Setting
  matchIntervalInfo: MatchIntervalInfo
  setMatchIntervalInfo: (matchIntervalInfo: MatchIntervalInfo) => void
}> = ({ setting, matchIntervalInfo, setMatchIntervalInfo }) => {
  const router = useRouter()
  const id = router.query.id as string
  const origin = useOrigin()
  const [showTooltip, setShowTooltip] = useState(false)
  const form = useForm<FormType>()
  const { reset, handleSubmit, watch, getValues } = form
  useEffect(() => {
    reset(matchIntervalInfo)
  }, [reset, matchIntervalInfo])

  const onSubmit: SubmitHandler<FormType> = (data) => {
    setMatchIntervalInfo(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
  }

  watch("isNow")
  watch("round")
  watch("matchType")

  return (
    <ControlPanel title="試合間情報" url={`${origin}/obs/next/?id=${id}`}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <div className="overflow-x-auto">
            <StreamQueueTable
              setting={setting}
              onChange={(queue) => {
                form.setValue("p1.playerName", queue.p1?.playerName ?? "")
                form.setValue("p2.playerName", queue.p2?.playerName ?? "")

                form.setValue("round", queue.roundText)
              }}
              trackNext={true}
              id="nextStreamQueueTable"
            />
          </div>
          <CheckBoxForm
            label="現在の試合状況を表示する"
            name="isNow"
            className="mt-[1rem]"
            cleanValue={matchIntervalInfo?.isNow}
          />
          <div
            style={{
              opacity: getValues("isNow") ? 0.3 : 1,
            }}
          >
            <div className="flex flex-wrap gap-[3rem]">
              <div>
                <h4 className="mt-[2rem] mb-[0.5rem]">
                  次の試合のプレイヤー名
                </h4>
                <div className="flex flex-wrap gap-[1rem]">
                  <div>
                    <div className="flex flex-wrap gap-[1rem]">
                      <TextForm
                        className="w-[8rem]"
                        label="1P チーム名"
                        name="p1.team"
                        placeholder="Team"
                        autocomplete="team"
                        cleanValue={matchIntervalInfo?.p1.team}
                      />
                      <TextForm
                        className="w-[18rem]"
                        label="1P プレイヤー名"
                        name="p1.playerName"
                        placeholder="Player"
                        autocomplete="playerName"
                        cleanValue={matchIntervalInfo?.p1.playerName}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex flex-wrap gap-[1rem]">
                      <TextForm
                        className="w-[8rem]"
                        label="2P チーム名"
                        name="p2.team"
                        placeholder="Team"
                        autocomplete="team"
                        cleanValue={matchIntervalInfo?.p2.team}
                      />
                      <TextForm
                        className="w-[18rem]"
                        label="2P プレイヤー名"
                        name="p2.playerName"
                        placeholder="Player"
                        autocomplete="playerName"
                        cleanValue={matchIntervalInfo?.p2.playerName}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mt-[2rem] mb-[0.5rem]">次の試合のステータス</h4>
                <div>
                  <div className="flex flex-wrap gap-[1rem]">
                    <RoundSelector
                      round={getValues("round")}
                      setRound={(round) => {
                        form.setValue("round", round)
                      }}
                      disabled={getValues("isNow")}
                      cleanValue={matchIntervalInfo?.round}
                    />
                    <MatchTypeSelector
                      matchType={getValues("matchType")}
                      setMatchType={(matchType) => {
                        form.setValue("matchType", matchType)
                      }}
                      disabled={getValues("isNow")}
                      cleanValue={matchIntervalInfo?.matchType}
                    />
                  </div>
                  <CheckBoxForm
                    label="すべて大文字にする"
                    name="uppercase"
                    id="next.uppercase"
                    className="mt-[10px]"
                    disabled={getValues("isNow")}
                    cleanValue={matchIntervalInfo?.uppercase}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[2rem]">
            <Button
              type="submit"
              mode="primary"
              className="w-[194px] mt-[30px]"
              full
              tooltipText="適用されました"
              showTooltip={showTooltip}
            >
              適用する
            </Button>
            <Button
              type="button"
              mode="primary"
              className="w-[19rem] mt-[3rem]"
              full
              light
              onClick={() => {
                form.reset()
              }}
            >
              変更をリセット
            </Button>
          </div>
        </form>
      </FormProvider>
    </ControlPanel>
  )
}

export default memo(Next)
