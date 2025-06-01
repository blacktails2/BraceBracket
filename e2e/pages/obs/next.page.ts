import { Page } from "@playwright/test"

import { BasePage } from "../base.page"

export class NextPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/obs/next?id=${roomId}`)
    await this.waitForLoadState()
  }

  async getNextMatchPlayers() {
    return {
      player1: await this.getText(".next-player1-name"),
      player2: await this.getText(".next-player2-name"),
    }
  }

  async getNextMatchRound() {
    return await this.getText(".next-round-text")
  }

  async getUpcomingMatches() {
    const matches = await this.page.$$(".upcoming-match")
    const upcomingList = []

    for (const match of matches) {
      const player1 = await match.$eval(
        ".upcoming-player1",
        (el) => el.textContent || ""
      )
      const player2 = await match.$eval(
        ".upcoming-player2",
        (el) => el.textContent || ""
      )
      const round = await match.$eval(
        ".upcoming-round",
        (el) => el.textContent || ""
      )

      upcomingList.push({ player1, player2, round })
    }

    return upcomingList
  }

  async hasIntermissionMessage() {
    return await this.isVisible(".intermission-message")
  }

  async getIntermissionText() {
    return await this.getText(".intermission-message")
  }

  async getLayoutClass() {
    return await this.page.evaluate(() => {
      const element = document.querySelector(".next-match-container")
      return element?.className || ""
    })
  }

  async waitForNextMatchUpdate(
    expectedPlayer1: string,
    expectedPlayer2: string
  ) {
    await this.page.waitForFunction(
      ({ p1, p2 }) => {
        const p1Element = document.querySelector(".next-player1-name")
        const p2Element = document.querySelector(".next-player2-name")
        return p1Element?.textContent === p1 && p2Element?.textContent === p2
      },
      { p1: expectedPlayer1, p2: expectedPlayer2 },
      { timeout: 5000 }
    )
  }

  async getCountdownTimer() {
    const timerElement = await this.page.$(".countdown-timer")
    if (timerElement) {
      return await timerElement.textContent()
    }
    return null
  }

  async waitForCountdownToStart() {
    await this.waitForSelector(".countdown-timer", { timeout: 5000 })
  }
}
