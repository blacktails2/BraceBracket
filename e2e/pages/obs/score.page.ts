import { Page } from "@playwright/test"

import { BasePage } from "../base.page"

export class ScorePage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/obs/score?id=${roomId}`)
    await this.waitForLoadState()
  }

  async getPlayer1Name() {
    return await this.getText(".player1-name")
  }

  async getPlayer2Name() {
    return await this.getText(".player2-name")
  }

  async getPlayer1Score() {
    const scoreText = await this.getText(".player1-score")
    return parseInt(scoreText || "0")
  }

  async getPlayer2Score() {
    const scoreText = await this.getText(".player2-score")
    return parseInt(scoreText || "0")
  }

  async getRoundText() {
    return await this.getText(".round-text")
  }

  async getMatchType() {
    return await this.getText(".match-type")
  }

  async isLogoVisible() {
    return await this.isVisible(".tournament-logo")
  }

  async getLayoutClass() {
    return await this.page.evaluate(() => {
      const scoreboardElement = document.querySelector(".scoreboard")
      return scoreboardElement?.className || ""
    })
  }

  async waitForScoreUpdate(expectedP1Score: number, expectedP2Score: number) {
    await this.page.waitForFunction(
      ({ p1, p2 }) => {
        const p1Element = document.querySelector(".player1-score")
        const p2Element = document.querySelector(".player2-score")
        return (
          p1Element?.textContent === p1.toString() &&
          p2Element?.textContent === p2.toString()
        )
      },
      { p1: expectedP1Score, p2: expectedP2Score },
      { timeout: 5000 }
    )
  }

  async waitForNameUpdate(expectedP1Name: string, expectedP2Name: string) {
    await this.page.waitForFunction(
      ({ p1, p2 }) => {
        const p1Element = document.querySelector(".player1-name")
        const p2Element = document.querySelector(".player2-name")
        return p1Element?.textContent === p1 && p2Element?.textContent === p2
      },
      { p1: expectedP1Name, p2: expectedP2Name },
      { timeout: 5000 }
    )
  }

  async getBackgroundStyle() {
    return await this.page.evaluate(() => {
      const element = document.querySelector(".scoreboard")
      return element ? window.getComputedStyle(element).background : ""
    })
  }

  async hasDropShadow() {
    const boxShadow = await this.page.evaluate(() => {
      const element = document.querySelector(".scoreboard")
      return element ? window.getComputedStyle(element).boxShadow : "none"
    })
    return boxShadow !== "none"
  }
}
