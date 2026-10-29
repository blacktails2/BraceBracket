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

export const MC1 = Template.bind({})
MC1.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 1)
    return mc
  })(),
  setting: deepCopy(defaultSetting),
}

export const MC2 = Template.bind({})
MC2.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 2)
    return mc
  })(),
  setting: deepCopy(defaultSetting),
}

export const MC3 = Template.bind({})
MC3.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 3)
    return mc
  })(),
  setting: deepCopy(defaultSetting),
}

export const MC4 = Template.bind({})
MC4.args = {
  mc: (() => {
    const mc = deepCopy(mcDefault)
    mc.mcList = mc.mcList.slice(0, 4)
    return mc
  })(),
  setting: deepCopy(defaultSetting),
}
