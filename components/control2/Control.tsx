import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"

import { useOrigin } from "../../hooks/useOrigin"
import {
  LoadBracket,
  MatchIntervalInfo,
  MC as MCType,
  Score,
  Setting,
} from "../../libs/const"

import MC from "./tabs/MC"
import Next from "./tabs/Next"
import ScoreAndCamera from "./tabs/ScoreAndCamera"
import Top8Bracket from "./tabs/Top8Bracket"

export const Control: FC<{
  setting: Setting
  setSetting: (setting: Setting) => void
  score: Score
  setScore: (score: Score) => void
  matchIntervalInfo: MatchIntervalInfo
  setMatchIntervalInfo: (matchIntervalInfo: MatchIntervalInfo) => void
  mc: MCType
  setMC: (mc: MCType) => void
  loadBracket: LoadBracket
  requestLoad: (autoUpdate: boolean) => void
}> = ({
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
}) => {
  console.log("Control")
  const router = useRouter()
  const origin = useOrigin()
  const id = router.query.id as string
  const [selectedTab, setSelectedTab] = useState("Score")
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (!params.get("id")) {
      router.replace("/create")
    }
  }, [router])

  return (
    <div className="flex overflow-y-hidden flex-col py-[1.5rem] px-[2rem] h-[100vh]">
      <div className="flex gap-[2rem] mb-[2rem] h-fit">
        {["Score", "Interval", "MC", "Bracket"].map((name) => {
          return (
            <div
              key={name}
              className="my-[0.5rem] text-[1.4rem] text-black border-[color:var(--primary)] cursor-pointer"
              style={
                name === selectedTab
                  ? {
                      borderBottom: "2px solid var(--primary)",
                    }
                  : {}
              }
              onClick={() => {
                setSelectedTab(name)
              }}
            >
              {name}
            </div>
          )
        })}
      </div>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="overflow-y-scroll h-full scrollbar-hidden">
        <div
          style={{
            display: selectedTab === "Score" ? "block" : "none",
          }}
        >
          <ScoreAndCamera
            {...{
              setting,
              score,
              setScore,
              matchIntervalInfo,
            }}
          />
        </div>
        <div
          style={{
            display: selectedTab === "Interval" ? "block" : "none",
          }}
        >
          <Next
            {...{
              setting,
              matchIntervalInfo,
              setMatchIntervalInfo,
            }}
          />
        </div>
        <div
          style={{
            display: selectedTab === "MC" ? "block" : "none",
          }}
        >
          <MC {...{ mc, setMC }} />
        </div>

        <div
          style={{
            display: selectedTab === "Bracket" ? "block" : "none",
          }}
        >
          <Top8Bracket {...{ loadBracket, requestLoad }} />
        </div>
      </div>
    </div>
  )
}
