import { ComponentMeta, ComponentStory } from "@storybook/react"

import { Bracket } from "../components/obs/bracket/Bracket"
import { defaultValue as defaultSetting } from "../hooks/useSetting"

import { bracketDefault } from "./helper/BracketDefault"
import deepCopy from "./helper/deepCopy"

export default {
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
} as ComponentMeta<typeof Bracket>

const Template: ComponentStory<typeof Bracket> = (args) => <Bracket {...args} />

export const Default = Template.bind({})
Default.args = {
  setting: deepCopy(defaultSetting),
  bracket: deepCopy(bracketDefault),
}
