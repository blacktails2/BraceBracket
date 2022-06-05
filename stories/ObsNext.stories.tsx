import { ComponentMeta, ComponentStory } from "@storybook/react"

import { MC } from "../components/obs/mc/MC"
import { MatchInterval } from "../components/obs/next/MatchIntervalInfo"
import { defaultValue as defaultSetting } from "../hooks/useSetting"
import { MatchIntervalInfo } from "../libs/const"

import deepCopy from "./helper/deepCopy"

export default {
  title: "OBS/Next",
  component: MC,
  parameters: {
    viewport: {
      viewports: {
        Screen: {
          name: "Screen",
          styles: {
            width: "1920px",
            height: "1080px",
          },
        },
      },
      defaultViewport: "Screen",
    },
  },
  chromatic: {
    delay: 1000,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "1920px", height: "1080px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof MatchInterval>

const matchIntervalInfoDefault: MatchIntervalInfo = {
  createdAt: 0,
  isNow: false,
  matchType: "Besf of 5",
  p1: {
    team: "Team2",
    playerName: "Player2",
    score: 1,
    twitterID: "twitter_id2",
  },
  p2: {
    team: "Team2",
    playerName: "Player2",
    score: 2,
    twitterID: "twitter_id2",
  },
  round: "Grand Final",
  uppercase: false,
}

const Template: ComponentStory<typeof MatchInterval> = (args) => (
  <MatchInterval {...args} />
)

export const SimpleWhiteNext = Template.bind({})
SimpleWhiteNext.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
  time: "24:34",
}

export const SimpleBlackNext = Template.bind({})
SimpleBlackNext.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
  time: "24:34",
}

export const OtherDarkNext = Template.bind({})
OtherDarkNext.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "dual"
    setting.scoreboard.design.color = "dark"
    return setting
  })(),
  time: "24:34",
}

export const OtherLightNext = Template.bind({})
OtherLightNext.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "dual"
    setting.scoreboard.design.color = "light"
    return setting
  })(),
  time: "24:34",
}

export const SimpleWhiteNow = Template.bind({})
SimpleWhiteNow.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    mii.isNow = true
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
  time: "24:34",
}

export const SimpleBlackNow = Template.bind({})
SimpleBlackNow.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    mii.isNow = true
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
  time: "24:34",
}

export const OtherDarkNow = Template.bind({})
OtherDarkNow.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    mii.isNow = true
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "dual"
    setting.scoreboard.design.color = "dark"
    return setting
  })(),
  time: "24:34",
}

export const OtherLightNow = Template.bind({})
OtherLightNow.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    mii.isNow = true
    return mii
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "dual"
    setting.scoreboard.design.color = "light"
    return setting
  })(),
  time: "24:34",
}
