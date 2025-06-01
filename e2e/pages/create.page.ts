import { Page } from "@playwright/test"

import { BasePage } from "./base.page"

export class CreatePage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto("/create")
  }

  // レイアウト選択
  async selectLayout(layout: "single" | "dual" | "simple" | "solid") {
    // React 19の互換性問題で一時的にlabelセレクターを使用
    await this.page.locator(`label[for="${layout}"]`).click()
  }

  // カラー選択
  async selectColorTheme(theme: "Light" | "Dark" | "Image" | "Custom") {
    await this.click(`input[value="${theme}"]`)
  }

  // カスタムカラー設定
  async setCustomColors(primary: string, secondary: string) {
    await this.fill('input[name="primaryColor"]', primary)
    await this.fill('input[name="secondaryColor"]', secondary)
  }

  // ロゴ設定
  async enableLogo() {
    const checkbox = this.page.locator('input[type="checkbox"][name="useLogo"]')
    await checkbox.check()
  }

  async disableLogo() {
    const checkbox = this.page.locator('input[type="checkbox"][name="useLogo"]')
    await checkbox.uncheck()
  }

  // ドロップシャドウ設定
  async setDropShadow(x: string, y: string, blur: string, opacity: string) {
    await this.fill('input[name="dropShadowX"]', x)
    await this.fill('input[name="dropShadowY"]', y)
    await this.fill('input[name="dropShadowBlur"]', blur)
    await this.fill('input[name="dropShadowOpacity"]', opacity)
  }

  // カメラ表示設定
  async selectCameraDisplay(option: "none" | "simple" | "detailed") {
    await this.selectOption('select[name="cameraDisplay"]', option)
  }

  // Twitter ID表示設定
  async enableTwitterDisplay() {
    const checkbox = this.page.locator(
      'input[type="checkbox"][name="displayTwitterId"]'
    )
    await checkbox.check()
  }

  // Start.gg連携設定
  async setStartGGTournament(url: string) {
    await this.fill('input[name="tournamentUrl"]', url)
  }

  async setStartGGEvent(eventSlug: string) {
    await this.selectOption('select[name="eventSlug"]', eventSlug)
  }

  // Tweet設定
  async enableTweetMatch() {
    const checkbox = this.page.locator(
      'input[type="checkbox"][name="tweetMatch"]'
    )
    await checkbox.check()
  }

  async setTweetTemplate(template: string) {
    await this.fill('textarea[name="tweetTemplate"]', template)
  }

  // URL生成
  async generateURL() {
    await this.page.getByTestId("create-submit-button").click()
  }

  // プレビュー確認
  async getPreviewFrame() {
    return this.page.frameLocator("iframe.preview-frame")
  }

  async waitForPreviewUpdate() {
    // プレビューの更新を待つための一時的な待機
    // 将来的には、DOMの変更を監視するなど、よりロバストな方法に置き換えることを推奨
    await this.page.waitForTimeout(300)
  }
}
