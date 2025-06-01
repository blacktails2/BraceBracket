import type { Meta, StoryObj } from "@storybook/react"

import { Scoreboard } from "../components/obs/score/Scoreboard"

import deepCopy from "./helper/deepCopy"
import { scoreDefault } from "./helper/ScoreDefault"
import { settingDefault } from "./helper/SettingDefault"

const meta: Meta<typeof Scoreboard> = {
  title: "OBS/Score",
  component: Scoreboard,
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

export const DualDarkColor: Story = {
  args: {
    score: deepCopy(scoreDefault),
    setting: deepCopy(settingDefault),
  },
}

export const DualDarkMono = Template.bind({})
DualDarkMono.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.color = "dark_mono"
    return setting
  })(),
}

export const DualLightColor = Template.bind({})
DualLightColor.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.color = "light_color"
    return setting
  })(),
}

export const DualLightMono = Template.bind({})
DualLightMono.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.color = "light_mono"
    return setting
  })(),
}

export const DualGradient = Template.bind({})
DualGradient.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.color = "gradient"
    return setting
  })(),
}

export const SingleDarkColor = Template.bind({})
SingleDarkColor.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "dark_color"
    return setting
  })(),
}

export const SingleDarkMono = Template.bind({})
SingleDarkMono.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "dark_mono"
    return setting
  })(),
}

export const SingleLightColor = Template.bind({})
SingleLightColor.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "light_color"
    return setting
  })(),
}

export const SingleLightMono = Template.bind({})
SingleLightMono.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "light_mono"
    return setting
  })(),
}

export const SingleBeige = Template.bind({})
SingleBeige.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "beige"
    return setting
  })(),
}

export const SolidDarkColor = Template.bind({})
SolidDarkColor.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "dark_color"
    return setting
  })(),
}

export const SolidDarkMono = Template.bind({})
SolidDarkMono.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "dark_mono"
    return setting
  })(),
}

export const SolidLightColor = Template.bind({})
SolidLightColor.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "light_color"
    return setting
  })(),
}

export const SolidLightMono = Template.bind({})
SolidLightMono.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "light_mono"
    return setting
  })(),
}

export const SolidBeige = Template.bind({})
SolidBeige.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "beige"
    return setting
  })(),
}

export const SimpleWhite = Template.bind({})
SimpleWhite.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
}

export const SimpleBlack = Template.bind({})
SimpleBlack.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
}
