import type { Meta, StoryObj } from "@storybook/react"

import { Control as Component } from "../components/control2/Control"
import { MatchIntervalInfo, MC, Score, Setting } from "../libs/const"

import deepCopy from "./helper/deepCopy"
import { matchIntervalInfoDefault } from "./helper/MatchIntervalInfoDefault"
import { mcDefault } from "./helper/MCDefault"
import { scoreDefault } from "./helper/ScoreDefault"
import { settingDefault } from "./helper/SettingDefault"

const meta: Meta<typeof Component> = {
  title: "Control",
  component: Component,
}

export default meta
type Story = StoryObj<typeof meta>

export const Control: Story = {
  args: {
    setting: (() => {
      const setting = deepCopy(settingDefault)
      setting.integrateStartGG.enabled = true
      return setting
    })(),
    setSetting: (_v: Setting) => {
      return
    },
    score: deepCopy(scoreDefault),
    setScore: (_v: Score) => {
      return
    },
    matchIntervalInfo: deepCopy(matchIntervalInfoDefault),
    setMatchIntervalInfo: (_v: MatchIntervalInfo) => {
      return
    },
    mc: deepCopy(mcDefault),
    setMC: (_v: MC) => {
      return
    },
    loadBracket: deepCopy({
      createdAt: 0,
      lastRequestedAt: 0,
      autoUpdate: false,
    }),
    requestLoad: (_v: boolean) => {
      return
    },
  },
}
