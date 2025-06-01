import type { Meta, StoryObj } from "@storybook/react"

import { Create as Component } from "../components/create/Create"

import deepCopy from "./helper/deepCopy"
import { settingDefault } from "./helper/SettingDefault"

const meta: Meta<typeof Component> = {
  title: "Create",
  component: Component,
}

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = {
  args: {
    setting: (() => {
      const setting = deepCopy(settingDefault)
      setting.scoreboard.cameraAndLogo.useLogo = true
      setting.integrateStartGG.enabled = true
      return setting
    })(),
  },
}
