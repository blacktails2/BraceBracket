import { ComponentMeta, ComponentStory } from "@storybook/react"

import { Scoreboard } from "../components/obs/score/Scoreboard"
import { defaultValue as defaultScore } from "../hooks/useScore"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import deepCopy from "./helper/deepCopy"

export default {
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
} as ComponentMeta<typeof Scoreboard>

const Template: ComponentStory<typeof Scoreboard> = (args) => (
  <Scoreboard {...args} />
)

export const DualDarkColor = Template.bind({})
DualDarkColor.args = {
  score: deepCopy(defaultScore),
  setting: deepCopy(defaultSetting),
}

export const DualDarkMono = Template.bind({})
DualDarkMono.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.color = "dark_mono"
    return setting
  })(),
}

export const DualLightColor = Template.bind({})
DualLightColor.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.color = "light_color"
    return setting
  })(),
}

export const DualLightMono = Template.bind({})
DualLightMono.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.color = "light_mono"
    return setting
  })(),
}

export const DualGradient = Template.bind({})
DualGradient.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.color = "gradient"
    return setting
  })(),
}

export const SingleDarkColor = Template.bind({})
SingleDarkColor.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "dark_color"
    return setting
  })(),
}

export const SingleDarkMono = Template.bind({})
SingleDarkMono.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "dark_mono"
    return setting
  })(),
}

export const SingleLightColor = Template.bind({})
SingleLightColor.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "light_color"
    return setting
  })(),
}

export const SingleLightMono = Template.bind({})
SingleLightMono.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "light_mono"
    return setting
  })(),
}

export const SingleBeige = Template.bind({})
SingleBeige.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "single"
    setting.scoreboard.design.color = "beige"
    return setting
  })(),
}

export const SolidDarkColor = Template.bind({})
SolidDarkColor.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "dark_color"
    return setting
  })(),
}

export const SolidDarkMono = Template.bind({})
SolidDarkMono.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "dark_mono"
    return setting
  })(),
}

export const SolidLightColor = Template.bind({})
SolidLightColor.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "light_color"
    return setting
  })(),
}

export const SolidLightMono = Template.bind({})
SolidLightMono.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "light_mono"
    return setting
  })(),
}

export const SolidBeige = Template.bind({})
SolidBeige.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "solid"
    setting.scoreboard.design.color = "beige"
    return setting
  })(),
}

export const SimpleWhite = Template.bind({})
SimpleWhite.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
}

export const SimpleBlack = Template.bind({})
SimpleBlack.args = {
  score: deepCopy(defaultScore),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
}
