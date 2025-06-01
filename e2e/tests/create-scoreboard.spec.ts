import { test, expect } from "@playwright/test"

import { CreatePage } from "../pages/create.page"

test.describe("スコアボード作成フロー", () => {
  let createPage: CreatePage

  test.beforeEach(async ({ page }) => {
    createPage = new CreatePage(page)
    await createPage.goto()
  })

  test("基本的なスコアボードを作成できる", async ({ page }) => {
    // レイアウトを選択
    await page.getByTestId("radio-single").click()

    // URL生成（Linksページへリダイレクト）
    await page.getByTestId("create-submit-button").click()

    // URLが生成されることを確認
    await expect(page.getByTestId("score-url")).toHaveValue(
      /\/obs\/score\/\?id=/
    )
    await expect(page.getByTestId("control-url")).toHaveValue(
      /\/control\/\?id=/
    )
    await expect(page.getByTestId("mc-url")).toHaveValue(/\/obs\/mc\/\?id=/)
    await expect(page.getByTestId("bracket-url")).toHaveValue(
      /\/obs\/bracket\/\?id=/
    )
    await expect(page.getByTestId("next-url")).toHaveValue(/\/obs\/next\/\?id=/)
  })

  test.skip("カスタムカラーを設定できる", async ({ page }) => {
    // カスタムカラー設定のテストは複雑なため、一旦スキップ
    await page.getByTestId("radio-single").click()
    await page.getByTestId("create-submit-button").click()
  })

  test("各レイアウトタイプを選択できる", async ({ page }) => {
    const layouts = ["single", "dual", "simple", "solid"]

    for (const layout of layouts) {
      await createPage.goto()
      await page.getByTestId(`radio-${layout}`).click()
      await expect(page.getByTestId(`radio-input-${layout}`)).toBeChecked()
    }
  })

  test.skip("複雑な設定テスト - 今後実装予定", async ({ page }) => {
    // より複雑なテストは実装の詳細を確認してから追加
    await page.getByTestId("radio-single").click()
    await page.getByTestId("create-submit-button").click()
  })
})
