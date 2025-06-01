import { Page } from "@playwright/test"

import { BasePage } from "../base.page"

export class MCPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/obs/mc?id=${roomId}`)
    await this.waitForLoadState()
  }

  async getMCText(line: number) {
    return await this.getText(`.mc-line-${line}`)
  }

  async getAllMCText() {
    const lines = []
    for (let i = 1; i <= 4; i++) {
      const text = await this.getText(`.mc-line-${i}`)
      if (text) lines.push(text)
    }
    return lines
  }

  async getLayoutClass() {
    return await this.page.evaluate(() => {
      const mcElement = document.querySelector(".mc-container")
      return mcElement?.className || ""
    })
  }

  async waitForTextUpdate(lineNumber: number, expectedText: string) {
    await this.page.waitForFunction(
      ({ line, text }) => {
        const element = document.querySelector(`.mc-line-${line}`)
        return element?.textContent === text
      },
      { line: lineNumber, text: expectedText },
      { timeout: 5000 }
    )
  }

  async hasBackground() {
    return await this.page.evaluate(() => {
      const element = document.querySelector(".mc-container")
      if (!element) return false
      const style = window.getComputedStyle(element)
      return (
        style.backgroundImage !== "none" ||
        style.backgroundColor !== "transparent"
      )
    })
  }
}
