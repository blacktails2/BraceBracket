import type { Meta, StoryObj } from "@storybook/react"

import { MatchInterval } from "../components/obs/next/MatchIntervalInfo"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import deepCopy from "./helper/deepCopy"
import { matchIntervalInfoDefault } from "./helper/MatchIntervalInfoDefault"

const meta: Meta<typeof MatchInterval> = {
  title: "OBS/Next",
  component: MatchInterval,
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
  decorators: [
    (Story) => (
      <div style={{ width: "1920px", height: "1080px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>
export const OtherDarkNext: Story = {
  args: {
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
  },
}

export const OtherDarkNow: Story = {
  args: {
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
  },
}

export const OtherLightNext: Story = {
  args: {
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
  },
}

export const OtherLightNow: Story = {
  args: {
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
  },
}

export const SimpleWhiteNext: Story = {
  args: {
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
  },
}

export const SimpleWhiteNow: Story = {
  args: {
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
  },
}

export const SimpleBlackNext: Story = {
  args: {
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
  },
}

export const SimpleBlackNow: Story = {
  args: {
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
  },
}
