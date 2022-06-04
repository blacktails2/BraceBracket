import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { ScoreAndCameraForm } from "../components/control/parts/ScoreAndCameraForm"
import { Scoreboard } from "../components/obs/score/Scoreboard"
import { SmallButton } from "../components/parts/SmallButton"
import { defaultValue as scoreDefaultValue } from "../hooks/useScore"
import { defaultValue as settingDefaultValue } from "../hooks/useSetting"
import { Score, Setting } from "../libs/const"

import type { NextPage } from "next"

declare global {
  interface Window {
    set(jsx: string, style: string): void
  }
}

const Layout: NextPage = () => {
  const [isMoving, setIsMoving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const [startPosition, setStartPosition] = useState<{
    top: number
    left: number
  }>({
    top: 0,
    left: 0,
  })
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [setting, setSetting] = useState<Setting>(
    JSON.parse(JSON.stringify(settingDefaultValue))
  )
  const [score, setScore] = useState<Score>(
    JSON.parse(JSON.stringify(scoreDefaultValue))
  )

  const [showTooltip, setShowTooltip] = useState(false)
  const testForm = useForm<Score>({ defaultValues: score })
  const onScoreSubmit: SubmitHandler<Score> = (data, event) => {
    console.log(event)
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
    setScore(data)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
    testForm.reset(data)
  }

  useEffect(() => {
    setting.scoreboard.design.useJSX = true
    console.log(setting)
  }, [setting])

  useEffect(() => {
    if (window) {
      window.set = (jsx: string, style: string) => {
        setSetting({
          ...setting,
          scoreboard: {
            ...setting.scoreboard,
            design: {
              ...setting.scoreboard.design,
              jsx,
              style,
            },
          },
        })
      }
    }
  }, [setting, score])

  if (!setting || !score) return null
  return (
    <>
      <Head>
        <title>BraceBracket | Score Layout Test</title>
      </Head>
      <Scoreboard setting={setting} score={score} />
      <div
        className="fixed bg-[rgb(255,255,255,90%)] border-[1px] border-solid border-black rounded-[5px] p-[1rem]"
        style={position}
        onMouseMove={(e) => {
          if (isMoving) {
            setPosition({
              top: e.clientY - startPosition.top,
              left: e.clientX - startPosition.left,
            })
          }
        }}
        onMouseUp={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsMoving(false)
        }}
        ref={ref}
      >
        <div className="flex gap-[1rem]">
          <div
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsMoving(true)
              if (ref && ref.current) {
                setStartPosition({
                  top: e.clientY - ref.current.offsetTop,
                  left: e.clientX - ref.current.offsetLeft,
                })
              }
              console.log(e)
            }}
            className="cursor-pointer"
          >
            ここを持って移動
          </div>
          {isFullScreen ? (
            <SmallButton
              type="button"
              onClick={() => {
                document.exitFullscreen().then(() => {
                  setIsFullScreen(false)
                })
              }}
            >
              全画面を解除
            </SmallButton>
          ) : (
            <SmallButton
              type="button"
              onClick={() => {
                document
                  .querySelector("html")
                  ?.requestFullscreen()
                  .then(() => {
                    setIsFullScreen(true)
                  })
              }}
            >
              全画面
            </SmallButton>
          )}
        </div>
        <ScoreAndCameraForm
          form={testForm}
          onScoreSubmit={onScoreSubmit}
          score={score}
          setting={setting}
          showTooltip={showTooltip}
        />
      </div>
    </>
  )
}

export default Layout
