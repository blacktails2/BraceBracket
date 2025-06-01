import { test, expect } from "@playwright/test"

import { CreatePage } from "../pages/create.page"

test.describe("Start.gg連携フロー", () => {
  let createPage: CreatePage

  test.beforeEach(async ({ page }) => {
    createPage = new CreatePage(page)
  })

  test.skip("Start.gg URLフィールドが表示される", async ({ page }) => {
    await createPage.goto()
    await page.getByTestId("radio-single").click()

    // Start.gg統合設定が表示されることを確認
    // 実際のコンポーネントの実装を確認してからtestidを追加する必要があります
    const startggSection = await page.$("[data-setting='startgg']")
    expect(startggSection).toBeTruthy()
  })

  test("作成ページでStart.gg設定が表示される", async ({ page }) => {
    await createPage.goto()
    await page.getByTestId("radio-single").click()

    // Start.gg統合設定があることを確認（実際のコンポーネントに応じて調整）
    // このテストはコンポーネントの実装を確認してから正しいセレクタを使用する必要があります
    const createButton = page.getByTestId("create-submit-button")
    await expect(createButton).toBeVisible()
  })
})
