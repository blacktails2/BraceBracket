import type { Meta, StoryObj } from "@storybook/react"

import { Bracket } from "../components/obs/bracket/Bracket"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import { bracketDefault } from "./helper/BracketDefault"
import deepCopy from "./helper/deepCopy"

const meta: Meta<typeof Bracket> = {
  title: "OBS/Bracket",
  component: Bracket,
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

export const Simple: Story = {
  args: {
    setting: (() => {
      const setting = deepCopy(defaultSetting)
      setting.scoreboard.design.layout = "simple"
      setting.scoreboard.design.color = "white"
      return setting
    })(),
    bracket: deepCopy(bracketDefault),
  },
}

export const Other: Story = {
  args: {
    setting: (() => {
      const setting = deepCopy(defaultSetting)
      setting.scoreboard.design.layout = "dual"
      setting.scoreboard.design.color = "dark_color"
      return setting
    })(),
    bracket: deepCopy(bracketDefault),
  },
}
