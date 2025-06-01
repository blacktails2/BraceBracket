import { Page, expect } from "@playwright/test"

import { BasePage } from "./base.page"

export class ControlPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId?: string) {
    const path = roomId ? `/control?id=${roomId}` : "/control"
    await super.goto(path)
  }

  // タブ切り替え
  async switchToTab(tab: "score" | "mc" | "interval" | "bracket") {
    await this.page.getByTestId(`tab-${tab}`).click()
  }

  async selectTab(
    tab: "score" | "mc" | "interval" | "bracket" | "MC" | "Next" | "Top8Bracket"
  ) {
    // Map the tab names to the actual testids
    const tabMap: Record<string, string> = {
      score: "score",
      mc: "mc",
      MC: "mc",
      interval: "interval",
      Next: "interval",
      bracket: "bracket",
      Top8Bracket: "bracket",
    }
    const actualTab = tabMap[tab] || tab.toLowerCase()
    await this.page.getByTestId(`tab-${actualTab}`).click()
  }

  // スコアボード操作
  async setPlayer1Name(name: string) {
    await this.page.getByTestId("p1-name").fill(name)
  }

  async setPlayer2Name(name: string) {
    await this.page.getByTestId("p2-name").fill(name)
  }

  async setPlayer1Score(score: number) {
    await this.page.getByTestId("p1-score").fill(score.toString())
  }

  async setPlayer2Score(score: number) {
    await this.page.getByTestId("p2-score").fill(score.toString())
  }

  async incrementPlayer1Score() {
    await this.page.getByTestId("p1-score-increment").click()
  }

  async decrementPlayer1Score() {
    await this.page.getByTestId("p1-score-decrement").click()
  }

  async incrementPlayer2Score() {
    await this.page.getByTestId("p2-score-increment").click()
  }

  async decrementPlayer2Score() {
    await this.page.getByTestId("p2-score-decrement").click()
  }

  async swapPlayers() {
    await this.page.getByTestId("swap-players").click()
  }

  async resetScores() {
    await this.page.getByTestId("reset-scores").click()
  }

  async submitScoreChanges() {
    await this.page.getByTestId("score-submit").click()
    // tooltip "Changed!" が表示されるのを待つ
    await this.page.getByText("Changed!").waitFor({ timeout: 3000 })
  }

  // ラウンド選択
  async selectRound(round: string) {
    await this.selectOption('select[name="round"]', round)
  }

  // マッチタイプ選択
  async selectMatchType(type: "ft2" | "ft3" | "ft5" | "ft10") {
    await this.click(`button[data-match-type="${type}"]`)
  }

  // MC機能
  async setMCText(line: number, text: string) {
    await this.fill(`input[name="mcLine${line}"]`, text)
  }

  async clearMCText() {
    await this.click('button[data-action="clear-mc"]')
  }

  // Next Match機能
  async setNextMatch(matchIndex: number) {
    await this.click(`button[data-next-match="${matchIndex}"]`)
  }

  // Start.gg Stream Queue
  async refreshStreamQueue() {
    await this.click('button[data-action="refresh-queue"]')
  }

  async selectStreamQueueMatch(index: number) {
    await this.click(`tr[data-queue-index="${index}"]`)
  }

  async getStreamQueueCount() {
    const rows = await this.page.$$("tr[data-queue-index]")
    return rows.length
  }

  // Top8ブラケット
  async updateBracketPlayer(position: string, name: string) {
    await this.fill(`input[name="bracket-${position}"]`, name)
  }

  async updateBracketScore(matchId: string, player: 1 | 2, score: number) {
    await this.fill(
      `input[name="bracket-${matchId}-p${player}"]`,
      score.toString()
    )
  }

  // 現在の値を取得
  async getCurrentScores() {
    const p1Score = await this.page.getByTestId("p1-score").inputValue()
    const p2Score = await this.page.getByTestId("p2-score").inputValue()
    return {
      player1: parseInt(p1Score || "0"),
      player2: parseInt(p2Score || "0"),
    }
  }

  async getCurrentPlayerNames() {
    const p1Name = await this.page.getByTestId("p1-name").inputValue()
    const p2Name = await this.page.getByTestId("p2-name").inputValue()
    return {
      player1: p1Name || "",
      player2: p2Name || "",
    }
  }

  // Auto-waitingを活用したアサーション
  async expectCurrentScores(player1Score: number, player2Score: number) {
    await expect(this.page.getByTestId("p1-score")).toHaveValue(
      player1Score.toString()
    )
    await expect(this.page.getByTestId("p2-score")).toHaveValue(
      player2Score.toString()
    )
  }

  async expectCurrentPlayerNames(player1Name: string, player2Name: string) {
    await expect(this.page.getByTestId("p1-name")).toHaveValue(player1Name)
    await expect(this.page.getByTestId("p2-name")).toHaveValue(player2Name)
  }

  async getCurrentRound() {
    return await this.page.evaluate(() => {
      const select = document.querySelector(
        'select[name="round"]'
      ) as HTMLSelectElement
      return select?.value || ""
    })
  }

  // エラーメッセージ
  async getErrorMessage() {
    const errorElement = await this.page.$(".error-message")
    if (errorElement) {
      return await errorElement.textContent()
    }
    return null
  }

  // 成功メッセージ
  async getSuccessMessage() {
    const successElement = await this.page.$(".success-message")
    if (successElement) {
      return await successElement.textContent()
    }
    return null
  }
}
