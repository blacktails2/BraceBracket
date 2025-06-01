import { Page } from "@playwright/test"

import { BasePage } from "./base.page"

export class LinksPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/links?id=${roomId}`)
  }

  // URLを取得
  async getControlURL() {
    return await this.page.getByTestId("control-url").getAttribute("value")
  }

  async getScoreURL() {
    return await this.page.getByTestId("score-url").getAttribute("value")
  }

  async getMCURL() {
    return await this.page.getByTestId("mc-url").getAttribute("value")
  }

  async getBracketURL() {
    return await this.page.getByTestId("bracket-url").getAttribute("value")
  }

  async getNextURL() {
    return await this.page.getByTestId("next-url").getAttribute("value")
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
  }
}
