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
import Other from "./tabs/Other"
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
    <div className="flex flex-col p-[0.4rem] pt-[0.8rem] h-[100vh] overflow-y-hidden">
      <div className="flex w-full max-w-[100rem] h-fit">
        {["Score", "Interval", "MC", "Bracket", "Other"].map((name) => {
          return (
            <div
              key={name}
              className="text-[1.4rem] text-black w-full px-[1rem] py-[0.5rem] border-[color:var(--primary)] border-[1px] border-b-[0px] cursor-pointer first:rounded-tl-[5px] last:rounded-tr-[5px]"
              style={
                name === selectedTab
                  ? {
                      backgroundColor: "var(--primary)",
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
      <div className="p-[1rem] border-[color:var(--primary)] border-[1px] rounded-b-[5px] h-full overflow-y-scroll scrollbar-hidden">
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

        <div
          style={{
            display: selectedTab === "Other" ? "block" : "none",
          }}
        >
          <Other
            {...{
              score,
              setScore,
              matchIntervalInfo,
              setMatchIntervalInfo,
            }}
          />
        </div>
      </div>
    </div>
  )
}
