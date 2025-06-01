import { test, expect } from "@playwright/test"

import { CreatePage } from "../pages/create.page"

test.describe("レスポンシブデザイン確認", () => {
  let createPage: CreatePage

  test.describe("デスクトップ表示", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      createPage = new CreatePage(page)
    })

    test("作成画面がデスクトップで正しく表示される", async ({ page }) => {
      await createPage.goto()

      // 主要な要素が表示されることを確認
      const submitButton = page.getByTestId("create-submit-button")
      await expect(submitButton).toBeVisible()

      // レイアウトオプションが表示されることを確認
      const singleOption = page.getByTestId("radio-single")
      await expect(singleOption).toBeVisible()
    })
  })

  test.describe("タブレット表示", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      createPage = new CreatePage(page)
    })

    test("作成画面がタブレットで正しく表示される", async ({ page }) => {
      await createPage.goto()

      // レイアウト選択肢が表示されることを確認
      const layoutOptions = page.getByTestId(/^radio-/)
      await expect(layoutOptions.first()).toBeVisible()

      // 作成ボタンが表示されることを確認
      const submitButton = page.getByTestId("create-submit-button")
      await expect(submitButton).toBeVisible()
    })
  })

  test.describe("モバイル表示", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      createPage = new CreatePage(page)
    })

    test("作成画面がモバイルで正しく表示される", async ({ page }) => {
      await createPage.goto()

      // レイアウト選択肢が表示されることを確認
      const layoutOptions = page.getByTestId(/^radio-/)
      await expect(layoutOptions.first()).toBeVisible()

      // 各セクションがスクロール可能であることを確認
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // 送信ボタンまでスクロールできることを確認
      const submitButton = page.getByTestId("create-submit-button")
      await submitButton.scrollIntoViewIfNeeded()
      await expect(submitButton).toBeVisible()
    })

    test("リンク画面がモバイルで正しく表示される", async ({ page }) => {
      await createPage.goto()
      await page.getByTestId("radio-single").click()
      await page.getByTestId("create-submit-button").click()

      // リンク画面に遷移するまで待機
      await expect(page).toHaveURL(/\/links/)

      // データの読み込みが完了するまで待機
      await page.waitForTimeout(2000)

      // URLが表示されることを確認
      const urlInputs = page.locator('[data-testid$="-url"]')
      await expect(urlInputs.first()).toBeVisible({ timeout: 10000 })

      const count = await urlInputs.count()
      expect(count).toBeGreaterThan(0)

      // 各URL入力欄が表示されることを確認
      for (let i = 0; i < count; i++) {
        const input = urlInputs.nth(i)
        await expect(input).toBeVisible()
      }
    })
  })

  test.describe("基本的なレスポンシブ機能", () => {
    test("異なるビューポートでページが正しく読み込まれる", async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 }, // デスクトップ
        { width: 768, height: 1024 }, // タブレット
        { width: 375, height: 667 }, // モバイル
      ]

      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto("/create")

        // ページが正しく読み込まれることを確認
        await expect(page).toHaveURL(/\/create/)

        // 基本的な要素が存在することを確認
        const html = page.locator("html")
        await expect(html).toBeVisible()
      }
    })
  })
})
