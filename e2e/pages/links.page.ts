import { Page } from "@playwright/test"

import { BasePage } from "./base.page"

export class LinksPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/links?id=${roomId}`)
    await this.waitForLoadState()
  }

  // URLを取得
  async getControlURL() {
    return await this.page.getAttribute('[data-testid="control-url"]', "value")
  }

  async getScoreURL() {
    return await this.page.getAttribute('[data-testid="score-url"]', "value")
  }

  async getMCURL() {
    return await this.page.getAttribute('[data-testid="mc-url"]', "value")
  }

  async getBracketURL() {
    return await this.page.getAttribute('[data-testid="bracket-url"]', "value")
  }

  async getNextURL() {
    return await this.page.getAttribute('[data-testid="next-url"]', "value")
  }

  // すべてのURLを取得
  async getAllURLs() {
    return {
      control: await this.getControlURL(),
      score: await this.getScoreURL(),
      mc: await this.getMCURL(),
      bracket: await this.getBracketURL(),
      next: await this.getNextURL(),
    }
  }

  // 編集画面を開くボタンをクリック
  async openControlWindow() {
    // 新しいウィンドウが開くのを待つ
    const [popup] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.click('button:has-text("編集画面を開く")'),
    ])

    return popup
  }

  // 設定変更ボタンをクリック
  async goToSettings() {
    await this.page.click('button:has-text("設定を変更")')
    await this.waitForURL(/\/create\?id=/)
  }
}
