import { Dispatch, FC, SetStateAction } from "react"
import { useAsync } from "react-use"

import { BanPick as BanPickType, Score, Setting } from "../../libs/const"
import ScoreAndCamera from "../control2/tabs/ScoreAndCamera"
import { Button } from "../parts/Button"

export const BanPick: FC<{
  setting: Setting
  score: Score
  setScore: Dispatch<SetStateAction<Score | undefined>>
  banPick: BanPickType
  setBanPick: Dispatch<SetStateAction<BanPickType | undefined>>
}> = ({ setting, score, setScore, banPick, setBanPick }) => {
  const StarterStages = [
    "小戦場",
    "戦場",
    "ホロウバスティオン",
    "村と街",
    "ポケモンスタジアム2",
  ]
  const CounterStages = [
    "小戦場",
    "戦場",
    "ホロウバスティオン",
    "村と街",
    "ポケモンスタジアム2",
    "終点",
    "北の大空洞",
    "すま村",
  ]

  useAsync(async () => {
    if (banPick.state === "SELECT_MATCH") {
      setBanPick({
        ...banPick,
        selections: [],
      })
    }
  }, [banPick])

  return (
    <div className="flex justify-center">
      {(() => {
        switch (banPick.state) {
          case "SELECT_MATCH":
            return (
              <div>
                <h1>対戦カードを選択してください</h1>
                <ScoreAndCamera
                  {...{
                    setting,
                    score,
                    setScore,
                  }}
                />
                <Button
                  onClick={(e) => {
                    setBanPick({
                      ...banPick,
                      state: "SELECT_STARTER",
                    })
                  }}
                >
                  次へ
                </Button>
              </div>
            )

          case "SELECT_STARTER":
            return (
              <div>
                <h1>スターターを選択してください</h1>
                <div className="flex gap-[1rem]">
                  {StarterStages.map((stage, idx) => {
                    return (
                      <div
                        key={stage}
                        className="relative"
                        onClick={() => {
                          if ((banPick.selections ?? []).length < 3) {
                            setBanPick({
                              ...banPick,
                              selections: (banPick?.selections ?? []).concat([
                                { stage, type: "BAN" },
                              ]),
                            })
                          } else {
                            setBanPick({
                              ...banPick,
                              selections: (banPick?.selections ?? []).concat([
                                { stage, type: "PICK" },
                              ]),
                            })
                            setTimeout(() => {
                              setBanPick((banPick) => {
                                if (!banPick) return banPick
                                return {
                                  ...banPick,
                                  state: "WAITING_RESULT",
                                }
                              })
                            }, 3000)
                          }
                        }}
                      >
                        <img
                          src={`https://placehold.jp/160x90.png?text=${stage}`}
                          alt="Stage画像"
                        />
                        <div
                          className={`absolute top-[0] h-full w-full ${(() => {
                            const selection = banPick?.selections?.find(
                              (s) => s.stage === stage
                            )
                            if (!selection) return ""
                            if (selection.type === "BAN") {
                              return "bg-[rgba(255,0,0,0.2)]"
                            } else {
                              return "bg-[rgba(0,255,0,0.2)]"
                            }
                          })()}`}
                        ></div>
                      </div>
                    )
                  })}
                </div>
                <Button
                  onClick={(e) => {
                    setBanPick({
                      ...banPick,
                      state: "WAITING_RESULT",
                    })
                  }}
                >
                  次へ
                </Button>
              </div>
            )

          case "WAITING_RESULT":
            return (
              <div>
                <h1>結果を待っています</h1>
                <div className="flex justify-around gap-[2rem]">
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      setScore({
                        ...score,
                        p1: {
                          ...score.p1,
                          score: score.p1.score + 1,
                        },
                      })
                      setBanPick({
                        ...banPick,
                        state: "SELECT_COUNTER",
                        selections: [],
                      })
                    }}
                  >
                    <img
                      src="https://placehold.jp/100x100.png?text=P1の勝利"
                      alt="P1の勝利"
                    />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      setScore({
                        ...score,
                        p2: {
                          ...score.p2,
                          score: score.p2.score + 1,
                        },
                      })
                      setBanPick({
                        ...banPick,
                        state: "SELECT_COUNTER",
                        selections: [],
                      })
                    }}
                  >
                    <img
                      src="https://placehold.jp/100x100.png?text=P2の勝利"
                      alt="P2の勝利"
                    />
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    setBanPick({
                      ...banPick,
                      state: "SELECT_COUNTER",
                      selections: [],
                    })
                  }}
                >
                  次へ
                </Button>
              </div>
            )

          case "SELECT_COUNTER":
            return (
              <div>
                <h1>カウンターを選択してください</h1>
                <div className="flex gap-[1rem]">
                  {CounterStages.map((stage, idx) => {
                    return (
                      <div
                        key={stage}
                        className="relative"
                        onClick={() => {
                          if ((banPick.selections ?? []).length < 3) {
                            setBanPick({
                              ...banPick,
                              selections: (banPick?.selections ?? []).concat([
                                { stage, type: "BAN" },
                              ]),
                            })
                          } else {
                            setBanPick({
                              ...banPick,
                              selections: (banPick?.selections ?? []).concat([
                                { stage, type: "PICK" },
                              ]),
                            })
                            setTimeout(() => {
                              setBanPick((banPick) => {
                                if (!banPick) return banPick
                                return {
                                  ...banPick,
                                  state: "WAITING_RESULT",
                                }
                              })
                            }, 3000)
                          }
                        }}
                      >
                        <img
                          src={`https://placehold.jp/160x90.png?text=${stage}`}
                          alt="Stage画像"
                        />
                        <div
                          className={`absolute top-[0] h-full w-full ${(() => {
                            const selection = banPick?.selections?.find(
                              (s) => s.stage === stage
                            )
                            if (!selection) return ""
                            if (selection.type === "BAN") {
                              return "bg-[rgba(255,0,0,0.2)]"
                            } else {
                              return "bg-[rgba(0,255,0,0.2)]"
                            }
                          })()}`}
                        ></div>
                      </div>
                    )
                  })}
                </div>
                <Button
                  onClick={(e) => {
                    setBanPick({
                      ...banPick,
                      state: "WAITING_RESULT",
                    })
                  }}
                >
                  次へ
                </Button>
                <Button
                  onClick={(e) => {
                    setBanPick({
                      ...banPick,
                      state: "SELECT_MATCH",
                    })
                  }}
                >
                  対戦を終了
                </Button>
              </div>
            )
        }
      })()}
    </div>
  )
}
