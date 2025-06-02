import { Page } from "@playwright/test"

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.setupImageRequestHandling()
  }

  private setupImageRequestHandling() {
    // サンプル画像リクエストをブロックしてエラーログを防ぐ
    this.page.route("**/image/create/samples/**", async (route) => {
      const url = route.request().url()

      // 存在しない可能性のある画像パスをブロック
      if (
        url.includes("undefined") ||
        url.includes("MC_simple_") ||
        url.includes("upnext_simple_dark_color") ||
        url.includes("solid_white") ||
        url.includes("MC_dark_color.png")
      ) {
        // 1x1の透明画像を返す
        const transparentPng = Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          "base64"
        )
        await route.fulfill({
          contentType: "image/png",
          body: transparentPng,
        })
      } else {
        await route.continue()
      }
    })
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async getTitle() {
    return await this.page.title()
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `e2e/screenshots/${name}.png`,
      fullPage: true,
    })
  }

  async click(selector: string) {
    await this.page.locator(selector).click()
  }

  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value)
  }

  async selectOption(selector: string, value: string) {
    await this.page.locator(selector).selectOption(value)
  }

  async isVisible(selector: string) {
    return await this.page.locator(selector).isVisible()
  }

  async getText(selector: string) {
    return await this.page.locator(selector).textContent()
  }

  async getValue(selector: string) {
    return await this.page.locator(selector).inputValue()
  }
}
