import { Page } from "@playwright/test"

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async waitForLoadState() {
    await this.page.waitForLoadState("networkidle")
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

  async waitForSelector(selector: string, options?: { timeout?: number }) {
    await this.page.waitForSelector(selector, options)
  }

  async click(selector: string) {
    await this.page.click(selector)
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value)
  }

  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value)
  }

  async isVisible(selector: string) {
    return await this.page.isVisible(selector)
  }

  async getText(selector: string) {
    return await this.page.textContent(selector)
  }

  async getValue(selector: string) {
    return await this.page.inputValue(selector)
  }

  async waitForURL(url: string | RegExp) {
    await this.page.waitForURL(url)
  }
}
