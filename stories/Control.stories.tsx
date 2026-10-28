import { Control as Component } from "../components/control2/Control"
import { MatchIntervalInfo, MC, Score, Setting } from "../libs/const"

import deepCopy from "./helper/deepCopy"
import { matchIntervalInfoDefault } from "./helper/MatchIntervalInfoDefault"
import { mcDefault } from "./helper/MCDefault"
import { scoreDefault } from "./helper/ScoreDefault"
import { settingDefault } from "./helper/SettingDefault"

import type { Meta, StoryFn } from "@storybook/nextjs"

export default {
  title: "Control",
  component: Component,
  chromatic: {
    delay: 1000,
    viewports: [1200, 480],
  },
} as Meta<typeof Component>

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />

export const Control = Template.bind({})
Control.args = {
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.integrateStartGG.enabled = true
    return setting
  })(),
  setSetting: (v: Setting) => {
    return
  },
  score: deepCopy(scoreDefault),
  setScore: (v: Score) => {
    return
  },
  matchIntervalInfo: deepCopy(matchIntervalInfoDefault),
  setMatchIntervalInfo: (v: MatchIntervalInfo) => {
    return
  },
  mc: deepCopy(mcDefault),
  setMC: (v: MC) => {
    return
  },
  loadBracket: deepCopy({
    createdAt: 0,
    lastRequestedAt: 0,
    autoUpdate: false,
  }),
  requestLoad: (v: boolean) => {
    return
  },
}
