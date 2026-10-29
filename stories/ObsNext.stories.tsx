import { ComponentMeta, ComponentStory } from "@storybook/react"

import { MC } from "../components/obs/mc/MC"
import { MatchInterval } from "../components/obs/next/MatchIntervalInfo"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import deepCopy from "./helper/deepCopy"
import { matchIntervalInfoDefault } from "./helper/MatchIntervalInfoDefault"

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

const Template: ComponentStory<typeof MatchInterval> = (args) => (
  <MatchInterval {...args} />
)

export const Next = Template.bind({})
Next.args = {
  matchIntervalInfo: deepCopy(matchIntervalInfoDefault),
  setting: deepCopy(defaultSetting),
  time: "24:34",
}

export const Now = Template.bind({})
Now.args = {
  matchIntervalInfo: (() => {
    const mii = deepCopy(matchIntervalInfoDefault)
    mii.isNow = true
    return mii
  })(),
  setting: deepCopy(defaultSetting),
  time: "24:34",
}
