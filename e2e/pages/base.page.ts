import { Page } from "@playwright/test"

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
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
