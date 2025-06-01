import type { Meta, StoryObj } from "@storybook/react"

import { MC } from "../components/obs/mc/MC"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import deepCopy from "./helper/deepCopy"
import { mcDefault } from "./helper/MCDefault"

const meta: Meta<typeof MC> = {
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

export const SimpleWhite1: Story = {
  args: {
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
  },
}

export const SimpleWhite2: Story = {
  args: {
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
  },
}

export const SimpleWhite3: Story = {
  args: {
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
  },
}

export const SimpleWhite4: Story = {
  args: {
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
  },
}

export const SimpleBlack1: Story = {
  args: {
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
  },
}

export const SimpleBlack2: Story = {
  args: {
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
  },
}

export const SimpleBlack3: Story = {
  args: {
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
  },
}

export const SimpleBlack4: Story = {
  args: {
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
  },
}

export const OtherDark1: Story = {
  args: {
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
  },
}

export const OtherDark2: Story = {
  args: {
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
  },
}

export const OtherDark3: Story = {
  args: {
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
  },
}

export const OtherDark4: Story = {
  args: {
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
  },
}

export const OtherLight1: Story = {
  args: {
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
  },
}

export const OtherLight2: Story = {
  args: {
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
  },
}

export const OtherLight3: Story = {
  args: {
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
  },
}

export const OtherLight4: Story = {
  args: {
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
  },
}
