import { Page } from "@playwright/test"

import { BasePage } from "../base.page"

export class MCPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(roomId: string) {
    await super.goto(`/obs/mc?id=${roomId}`)
  }

  async getMCText(line: number) {
    // MC component uses indexed classes from the CSS module
    // The actual class name pattern might be like "MC_mc1__[hash]"
    const mcElement = this.page.locator(`[class*="mc${line}"]`).first()
    const idElement = this.page.locator(`[class*="id${line}"]`).first()

    try {
      const mcText = (await mcElement.textContent()) || ""
      const idText = (await idElement.textContent()) || ""
      return `${mcText} ${idText}`.trim()
    } catch {
      return null
    }
  }

  async getAllMCText() {
    const lines = []
    for (let i = 1; i <= 4; i++) {
      const text = await this.getMCText(i)
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
