import { Page } from "@playwright/test"

import { BasePage } from "../base.page"

export class BracketPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/obs/bracket?id=${roomId}`)
    await this.waitForLoadState()
  }

  async getPlayerName(position: string) {
    return await this.getText(`[data-testid="bracket-player-${position}"]`)
  }

  async getScore(matchId: string, player: 1 | 2) {
    return await this.getText(
      `[data-testid="bracket-score-${matchId}-p${player}"]`
    )
  }

  async getWinnersFinalistNames() {
    return {
      player1: await this.getPlayerName("wf-1"),
      player2: await this.getPlayerName("wf-2"),
    }
  }

  async getLosersFinalistNames() {
    return {
      player1: await this.getPlayerName("lf-1"),
      player2: await this.getPlayerName("lf-2"),
    }
  }

  async getGrandFinalistNames() {
    return {
      player1: await this.getPlayerName("gf-1"),
      player2: await this.getPlayerName("gf-2"),
    }
  }

  async hasLogoVisible() {
    return await this.isVisible(".tournament-logo")
  }

  async getLayoutStyle() {
    return await this.page.evaluate(() => {
      const bracketElement = document.querySelector(".bracket-container")
      return bracketElement?.className || ""
    })
  }

  async waitForPlayerUpdate(position: string, expectedName: string) {
    await this.page.waitForFunction(
      ({ pos, name }) => {
        const element = document.querySelector(
          `[data-testid="bracket-player-${pos}"]`
        )
        return element?.textContent === name
      },
      { pos: position, name: expectedName },
      { timeout: 5000 }
    )
  }

  async waitForScoreUpdate(
    matchId: string,
    player: 1 | 2,
    expectedScore: number
  ) {
    await this.page.waitForFunction(
      ({ match, p, score }) => {
        const element = document.querySelector(
          `[data-testid="bracket-score-${match}-p${p}"]`
        )
        return element?.textContent === score.toString()
      },
      { match: matchId, p: player, score: expectedScore },
      { timeout: 5000 }
    )
  }
}
