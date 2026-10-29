import { ComponentMeta, ComponentStory } from "@storybook/react"

import { Scoreboard } from "../components/obs/score/Scoreboard"

import deepCopy from "./helper/deepCopy"
import { scoreDefault } from "./helper/ScoreDefault"
import { settingDefault } from "./helper/SettingDefault"

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

export const Default = Template.bind({})
Default.args = {
  score: deepCopy(scoreDefault),
  setting: deepCopy(settingDefault),
}

export const WithoutCamera = Template.bind({})
WithoutCamera.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.cameraAndLogo.displayCameraAndTwitterID = false
    return setting
  })(),
}

export const WithLogo = Template.bind({})
WithLogo.args = {
  score: deepCopy(scoreDefault),
  setting: (() => {
    const setting = deepCopy(settingDefault)
    setting.scoreboard.cameraAndLogo.useLogo = true
    setting.scoreboard.cameraAndLogo.logoURLs = ["/image/symbol.svg"]
    return setting
  })(),
}
