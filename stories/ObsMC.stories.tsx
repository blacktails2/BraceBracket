import { ComponentMeta, ComponentStory } from "@storybook/react"

import { MC } from "../components/obs/mc/MC"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import deepCopy from "./helper/deepCopy"
import { mcDefault } from "./helper/MCDefault"

export default {
  title: "OBS/MC",
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
} as ComponentMeta<typeof MC>

const Template: ComponentStory<typeof MC> = (args) => <MC {...args} />

export const SimpleWhite1 = Template.bind({})
SimpleWhite1.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 1)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
}

export const SimpleWhite2 = Template.bind({})
SimpleWhite2.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 2)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
}

export const SimpleWhite3 = Template.bind({})
SimpleWhite3.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 3)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
}

export const SimpleWhite4 = Template.bind({})
SimpleWhite4.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 4)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
}

export const SimpleBlack1 = Template.bind({})
SimpleBlack1.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 1)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
}

export const SimpleBlack2 = Template.bind({})
SimpleBlack2.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 2)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
}

export const SimpleBlack3 = Template.bind({})
SimpleBlack3.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 3)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
}

export const SimpleBlack4 = Template.bind({})
SimpleBlack4.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 4)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "black"
    return setting
  })(),
}

export const OtherDark1 = Template.bind({})
OtherDark1.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 1)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "dark"
    return setting
  })(),
}

export const OtherDark2 = Template.bind({})
OtherDark2.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 2)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "dark"
    return setting
  })(),
}

export const OtherDark3 = Template.bind({})
OtherDark3.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 3)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "dark"
    return setting
  })(),
}

export const OtherDark4 = Template.bind({})
OtherDark4.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 4)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "dark"
    return setting
  })(),
}

export const OtherLight1 = Template.bind({})
OtherLight1.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 1)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "light"
    return setting
  })(),
}

export const OtherLight2 = Template.bind({})
OtherLight2.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 2)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "light"
    return setting
  })(),
}

export const OtherLight3 = Template.bind({})
OtherLight3.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 3)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "light"
    return setting
  })(),
}

export const OtherLight4 = Template.bind({})
OtherLight4.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 4)
    return mc
  })(),
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "other"
    setting.scoreboard.design.color = "light"
    return setting
  })(),
}
