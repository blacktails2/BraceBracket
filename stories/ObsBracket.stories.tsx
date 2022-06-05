import { ComponentMeta, ComponentStory } from "@storybook/react"

import { Bracket } from "../components/obs/bracket/Bracket"
import { defaultValue as defaultSetting } from "../hooks/useSetting"
import { Bracket as BracketType } from "../libs/const"

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
    viewports: [1920, 1080],
  },
} as ComponentMeta<typeof Bracket>

const bracketDefault: BracketType = {
  grandFinal: [
    {
      player1: {
        team: "",
        name: "あcola",
        score: 3,
      },
      player2: {
        team: "SPG",
        name: "あしも",
        score: 0,
      },
    },
  ],
  grandFinalReset: [],
  losersFinal: [
    {
      player1: {
        team: "SPG",
        name: "あしも",
        score: 3,
      },
      player2: {
        team: "",
        name: "Gackt",
        score: 2,
      },
    },
  ],
  losersQuarterFinal: [
    {
      player1: {
        team: "",
        name: "Huto",
        score: 0,
      },
      player2: {
        team: "",
        name: "DIO",
        score: 3,
      },
    },
    {
      player1: {
        team: "",
        name: "Gackt",
        score: 3,
      },
      player2: {
        team: "SST",
        name: "Shuton",
        score: 0,
      },
    },
  ],
  losersRound: [
    {
      player1: {
        team: "TV",
        name: "Lea",
        score: 1,
      },
      player2: {
        team: "",
        name: "DIO",
        score: 3,
      },
    },
    {
      player1: {
        team: "SST",
        name: "Shuton",
        score: 3,
      },
      player2: {
        team: "Revo",
        name: "Kome",
        score: 1,
      },
    },
  ],
  losersSemiFinal: [
    {
      player1: {
        team: "",
        name: "DIO",
        score: 1,
      },
      player2: {
        team: "",
        name: "Gackt",
        score: 3,
      },
    },
  ],
  winnersFinal: [
    {
      player1: {
        team: "",
        name: "あcola",
        score: 3,
      },
      player2: {
        team: "SPG",
        name: "あしも",
        score: 0,
      },
    },
  ],
  winnersSemiFinal: [
    {
      player1: {
        team: "",
        name: "あcola",
        score: 3,
      },
      player2: {
        team: "",
        name: "Gackt",
        score: 2,
      },
    },
    {
      player1: {
        team: "SPG",
        name: "あしも",
        score: 3,
      },
      player2: {
        team: "",
        name: "Huto",
        score: 1,
      },
    },
  ],
}

const Template: ComponentStory<typeof Bracket> = (args) => <Bracket {...args} />

export const Simple = Template.bind({})
Simple.args = {
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "simple"
    setting.scoreboard.design.color = "white"
    return setting
  })(),
  bracket: deepCopy(bracketDefault),
}

export const Other = Template.bind({})
Other.args = {
  setting: (() => {
    const setting = deepCopy(defaultSetting)
    setting.scoreboard.design.layout = "dual"
    setting.scoreboard.design.color = "dark_color"
    return setting
  })(),
  bracket: deepCopy(bracketDefault),
}
