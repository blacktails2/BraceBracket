import { Page } from "@playwright/test"

import { BasePage } from "./base.page"

export class ControlPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId?: string) {
    const path = roomId ? `/control?id=${roomId}` : "/control"
    await super.goto(path)
    await this.waitForLoadState()
  }

  // タブ切り替え
  async switchToTab(tab: "score" | "mc" | "next" | "bracket") {
    await this.click(`button[data-tab="${tab}"]`)
  }

  // スコアボード操作
  async setPlayer1Name(name: string) {
    await this.fill('input[name="player1Name"]', name)
  }

  async setPlayer2Name(name: string) {
    await this.fill('input[name="player2Name"]', name)
  }

  async setPlayer1Score(score: number) {
    await this.fill('input[name="player1Score"]', score.toString())
  }

  async setPlayer2Score(score: number) {
    await this.fill('input[name="player2Score"]', score.toString())
  }

  async incrementPlayer1Score() {
    await this.click('button[data-action="p1-increment"]')
  }

  async decrementPlayer1Score() {
    await this.click('button[data-action="p1-decrement"]')
  }

  async incrementPlayer2Score() {
    await this.click('button[data-action="p2-increment"]')
  }

  async decrementPlayer2Score() {
    await this.click('button[data-action="p2-decrement"]')
  }

  async swapPlayers() {
    await this.click('button[data-action="swap"]')
  }

  async resetScores() {
    await this.click('button[data-action="reset"]')
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
    const p1Score = await this.getValue('input[name="player1Score"]')
    const p2Score = await this.getValue('input[name="player2Score"]')
    return {
      player1: parseInt(p1Score || "0"),
      player2: parseInt(p2Score || "0"),
    }
  }

  async getCurrentPlayerNames() {
    const p1Name = await this.getValue('input[name="player1Name"]')
    const p2Name = await this.getValue('input[name="player2Name"]')
    return {
      player1: p1Name,
      player2: p2Name,
    }
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
