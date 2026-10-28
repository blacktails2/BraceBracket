import { expect, Locator, Page } from "@playwright/test"

import { watchDatabaseSync } from "./sync"

/**
 * 操作画面（/control）のページオブジェクト
 *
 * 各タブの中身は display: none で切り替えているだけで、非表示のタブにも同じ placeholder の入力欄がある。
 * そのため入力欄は必ず「表示中のタブ（panel）」の中から探す。
 */
export type ControlTab = "Score" | "Interval" | "MC" | "Bracket"

/** 適用前の変更がある入力欄に付くインラインスタイル */
export const DIRTY_STYLE = /var\(--bb-dirty\)/

export class ControlPage {
  constructor(readonly page: Page) {}

  async goto(id: string) {
    const synced = watchDatabaseSync(this.page, id)
    await this.page.goto(`/control/?id=${id}`)
    await synced()
    await expect(this.tab("Score")).toBeVisible()
    await expect(this.applyButton).toBeVisible()
  }

  tab(name: ControlTab) {
    return this.page.getByText(name, { exact: true }).first()
  }

  async openTab(name: ControlTab) {
    await this.tab(name).click()
    // 選択中のタブだけ下線がプライマリカラーになる
    await expect(this.tab(name)).toHaveAttribute("style", /--primary/)
  }

  /** 表示中のタブの中身 */
  get panel(): Locator {
    return this.page.locator("form").filter({ visible: true })
  }

  get applyButton() {
    return this.panel.getByRole("button", { name: "適用する" })
  }

  get resetButton() {
    return this.panel.getByRole("button", { name: "変更をリセット" })
  }

  get appliedTooltip() {
    return this.panel.getByText("Changed!")
  }

  async apply() {
    await this.applyButton.click()
    await expect(this.appliedTooltip).toBeVisible()
  }

  input(placeholder: string) {
    return this.panel.getByPlaceholder(placeholder, { exact: true })
  }

  /** スコアの数値入力欄（1P / 2P） */
  scoreInput(player: "p1" | "p2") {
    return this.panel.locator(`input[type="number"][id="${player}.score"]`)
  }

  /** 背景画像で区別しているアイコンボタン */
  iconButton(icon: string, nth = 0) {
    return this.panel.locator(`[style*="/icons/${icon}.svg"]`).nth(nth)
  }

  plusButton(player: "p1" | "p2") {
    return this.iconButton("exposure_plus_1", player === "p1" ? 0 : 1)
  }

  minusButton(player: "p1" | "p2") {
    return this.iconButton("exposure_neg_1", player === "p1" ? 0 : 1)
  }

  get allResetButton() {
    return this.iconButton("backspace")
  }

  get swapButton() {
    return this.iconButton("swap_horiz")
  }

  get scoreResetButton() {
    return this.iconButton("exposure")
  }

  get refreshQueueButton() {
    return this.iconButton("refresh")
  }

  /** ラウンド・セット情報のクイック選択ボタン */
  chip(text: string) {
    return this.panel.getByText(text, { exact: true })
  }

  /** CheckBoxForm はinputが非表示なので、ラベルをクリックして切り替える */
  checkboxLabel(label: string) {
    return this.panel.locator("label", { hasText: label })
  }

  checkbox(label: string) {
    return this.panel.getByLabel(label, { exact: true })
  }

  get queueRows() {
    return this.panel.locator("tbody tr")
  }
}
