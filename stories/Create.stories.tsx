import { Create as Component } from "../components/create/Create"

import deepCopy from "./helper/deepCopy"
import { settingDefault } from "./helper/SettingDefault"

import type { Meta, StoryFn } from "@storybook/nextjs"

export default {
  title: "Create",
  component: Component,
  chromatic: {
    delay: 1000,
    viewports: [1200, 480],
  },
} as Meta<typeof Component>

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />

export const Create = Template.bind({})
Create.args = {
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.cameraAndLogo.useLogo = true
    setting.integrateStartGG.enabled = true
    return setting
  })(),
}
