import { Page } from "@playwright/test"

import { BasePage } from "../base.page"

export class ScorePage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/obs/score?id=${roomId}`)
  }

  async getPlayer1Name() {
    // Look for player 1's name within the player container
    const nameElement = this.page.locator(
      '[class*="player"][class*="p1"] [class*="name"]'
    )
    return (await nameElement.textContent()) || ""
  }

  async getPlayer2Name() {
    // Look for player 2's name within the player container
    const nameElement = this.page.locator(
      '[class*="player"][class*="p2"] [class*="name"]'
    )
    return (await nameElement.textContent()) || ""
  }

  async getPlayer1Score() {
    // Look for player 1's score
    const scoreElement = this.page.locator('[class*="score"][class*="p1"]')
    const scoreText = (await scoreElement.textContent()) || "0"
    return parseInt(scoreText)
  }

  async getPlayer2Score() {
    // Look for player 2's score
    const scoreElement = this.page.locator('[class*="score"][class*="p2"]')
    const scoreText = (await scoreElement.textContent()) || "0"
    return parseInt(scoreText)
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
        const p1Element = document.querySelector(
          '[class*="score"][class*="p1"]'
        )
        const p2Element = document.querySelector(
          '[class*="score"][class*="p2"]'
        )
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
        const p1Element = document.querySelector(
          '[class*="player"][class*="p1"] [class*="name"]'
        )
        const p2Element = document.querySelector(
          '[class*="player"][class*="p2"] [class*="name"]'
        )
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
