import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"

import { useOrigin } from "../../hooks/useOrigin"
import {
  LoadBracket,
  MatchIntervalInfo,
  MC as MCType,
  Score,
  Setting,
  Telop as TelopType,
} from "../../libs/const"

import MC from "./tabs/MC"
import Next from "./tabs/Next"
import ScoreAndCamera from "./tabs/ScoreAndCamera"
import Telop from "./tabs/Telop"
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
  telop: TelopType
  setTelop: (telop: TelopType) => void
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
  telop,
  setTelop,
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
    <div className="flex h-[100vh] flex-col overflow-y-hidden py-[1.5rem] px-[2rem]">
      <div className="mb-[2rem] flex h-fit gap-[1rem]">
        {["Score", "Interval", "MC", "Bracket", "Telop"].map((name) => {
          return (
            <div
              key={name}
              className="ease my-[0.5rem] cursor-pointer border-b-2 border-[color:var(--white)] px-2 text-[1.4rem] text-black transition delay-75 hover:border-[color:var(--bb-beige-hover)]"
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
      <div className="scrollbar-hidden h-full overflow-y-scroll">
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
            display: selectedTab === "Telop" ? "block" : "none",
          }}
        >
          <Telop {...{ telop, setTelop }} />
        </div>
      </div>
    </div>
  )
}
