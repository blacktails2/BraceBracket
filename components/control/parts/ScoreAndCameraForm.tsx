import { FC } from "react"
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form"

import { Score, Setting } from "../../../libs/const"
import { CheckBoxForm } from "../../parts/CheckBoxForm"
import { MatchTypeSelector } from "../../parts/MatchTypeSelector"
import { NumberForm } from "../../parts/NumberForm"
import { PrimaryButton } from "../../parts/PrimaryButton"
import { RoundSelector } from "../../parts/RoundSelector"
import { SmallButton } from "../../parts/SmallButton"
import { TextForm } from "../../parts/TextForm"

export const ScoreAndCameraForm: FC<{
  form: UseFormReturn<Score>
  onScoreSubmit: SubmitHandler<Score>
  score?: Score
  setting?: Setting
  showTooltip: boolean
}> = ({ form, onScoreSubmit, score, setting, showTooltip }) => {
  form.watch("round")
  form.watch("matchType")
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onScoreSubmit)}>
        <div>
          <div className="flex flex-wrap gap-[3rem] mt-[2rem]">
            <div>
              <h4>1Pデータ</h4>
              <div className="flex flex-wrap gap-[1rem]">
                <TextForm
                  className="w-[8rem]"
                  label="チーム名"
                  name="p1.team"
                  placeholder="Team"
                  autocomplete="team"
                  cleanValue={score?.p1.team}
                />
                <TextForm
                  className="w-[18rem]"
                  label="プレイヤー名"
                  name="p1.playerName"
                  placeholder="Player"
                  autocomplete="playerName"
                  cleanValue={score?.p1.playerName}
                />
                <div>
                  <label>スコア</label>
                  <div className="flex gap-[0.5rem]">
                    <SmallButton
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "p1.score",
                          (form.getValues("p1.score") ?? 0) - 1
                        )
                      }
                    >
                      -1
                    </SmallButton>
                    <NumberForm
                      className="w-[5rem]"
                      name={"p1.score"}
                      cleanValue={score?.p1.score}
                    />
                    <SmallButton
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "p1.score",
                          (form.getValues("p1.score") ?? 0) + 1
                        )
                      }
                    >
                      +1
                    </SmallButton>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4>2Pデータ</h4>
              <div className="flex flex flex-wrap gap-[1rem]">
                <TextForm
                  className="w-[8rem]"
                  label="チーム名"
                  name="p2.team"
                  placeholder="Team"
                  autocomplete="team"
                  cleanValue={score?.p2.team}
                />
                <TextForm
                  className="w-[18rem]"
                  label="プレイヤー名"
                  name="p2.playerName"
                  placeholder="Player"
                  autocomplete="playerName"
                  cleanValue={score?.p2.playerName}
                />
                <div>
                  <label>スコア</label>
                  <div className="flex gap-[0.5rem]">
                    <SmallButton
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "p2.score",
                          (form.getValues("p2.score") ?? 0) - 1
                        )
                      }
                    >
                      -1
                    </SmallButton>
                    <NumberForm
                      className="w-[5rem]"
                      name={"p2.score"}
                      cleanValue={score?.p2.score}
                    />
                    <SmallButton
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "p2.score",
                          (form.getValues("p2.score") ?? 0) + 1
                        )
                      }
                    >
                      +1
                    </SmallButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {setting?.scoreboard.cameraAndLogo.displayCameraAndTwitterID && (
            <div className="mt-[2rem]">
              <h4 className="mt-0 mb-[0.5rem]">Twitter ID</h4>
              <div className="flex flex-wrap gap-[1rem]">
                <TextForm
                  className="w-[19rem]"
                  label="1P"
                  name="p1.twitterID"
                  placeholder="@user_name"
                  cleanValue={score?.p1.twitterID}
                />
                <TextForm
                  className="w-[19rem]"
                  label="2P"
                  name="p2.twitterID"
                  placeholder="@user_name"
                  cleanValue={score?.p2.twitterID}
                />
              </div>
            </div>
          )}
          <div className="mt-[2rem]">
            <h4>データのリセット・入れ替え</h4>
            <div className="flex flex-wrap gap-[1rem]">
              <SmallButton
                type="button"
                onClick={() => {
                  const [p1, p2] = form.getValues(["p1", "p2"])
                  form.setValue("p1", p2)
                  form.setValue("p2", p1)
                }}
              >
                1Pと2Pを入れ替える
              </SmallButton>
              <SmallButton
                light
                type="button"
                onClick={() => {
                  const [p1, p2] = form.getValues(["p1", "p2"])
                  form.setValue("p1", {
                    ...p1,
                    score: 0,
                  })
                  form.setValue("p2", {
                    ...p2,
                    score: 0,
                  })
                }}
              >
                スコアをリセット
              </SmallButton>
              <SmallButton
                light
                type="button"
                onClick={() => {
                  form.setValue("p1", {
                    team: "",
                    playerName: "",
                    score: 0,
                    twitterID: "",
                  })
                  form.setValue("p2", {
                    team: "",
                    playerName: "",
                    score: 0,
                    twitterID: "",
                  })
                }}
              >
                全てリセット
              </SmallButton>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <h4 className="mt-0 mb-[0.5rem]">ステータス</h4>
          <div className="flex flex-wrap gap-[1rem]">
            <RoundSelector
              round={form.getValues("round")}
              setRound={(round) => form.setValue("round", round)}
              cleanValue={score?.round}
            />
            <MatchTypeSelector
              matchType={form.getValues("matchType")}
              setMatchType={(matchType) =>
                form.setValue("matchType", matchType)
              }
              cleanValue={score?.matchType}
            />
            {!setting?.scoreboard.cameraAndLogo.useLogo && (
              <div>
                <label className="block">大会名</label>
                <textarea
                  className={`border-[1px] border-[solid] border-[color:var(--light-primary)] rounded-[0.5rem] px-[1rem] py-[0.5rem] focus:outline-none focus:border-[color:var(--bb-beige)] resize-none`}
                  cols={10}
                  rows={3}
                  {...form.register("tournamentName")}
                  style={
                    score?.tournamentName !== form.getValues("tournamentName")
                      ? { backgroundColor: "var(--bb-dirty)" }
                      : {}
                  }
                ></textarea>
              </div>
            )}
          </div>
          <CheckBoxForm
            className="mt-[1rem]"
            label="すべて大文字にする"
            name="uppercase"
            cleanValue={score?.uppercase}
          />
        </div>
        <div className="relative flex gap-[2rem]">
          <PrimaryButton
            type="submit"
            className="w-[19rem] mt-[3rem]"
            full
            tooltipText="適用されました"
            showTooltip={showTooltip}
          >
            適用する
          </PrimaryButton>
          <PrimaryButton
            type="button"
            className="w-[19rem] mt-[3rem]"
            full
            light
            onClick={() => {
              form.reset()
            }}
          >
            変更をリセット
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  )
}
