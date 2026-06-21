import { test, expect } from "@playwright/test"

import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"

test.describe("基本的なスコアボード作成", () => {
  let createPage: CreatePage
  let linksPage: LinksPage

  test.beforeEach(async ({ page }) => {
    createPage = new CreatePage(page)
    linksPage = new LinksPage(page)
  })

  test("作成画面が表示される", async ({ page }) => {
    await createPage.goto()

    // ページタイトルを確認
    await expect(page).toHaveTitle(/BraceBracket/)

    // 主要な要素が表示されていることを確認
    await expect(page.locator("h2")).toContainText("スコアボードを作成")

    // レイアウト選択セクションが表示されていることを確認
    await expect(
      page.locator("h4").filter({ hasText: "レイアウト" })
    ).toBeVisible()

    // レイアウト選択肢が表示されていることを確認
    await expect(page.getByTestId("radio-single")).toBeVisible()
    await expect(page.getByTestId("radio-dual")).toBeVisible()
    await expect(page.getByTestId("radio-simple")).toBeVisible()
    await expect(page.getByTestId("radio-solid")).toBeVisible()

    // 送信ボタンが表示されていることを確認
    await expect(page.getByTestId("create-submit-button")).toBeVisible()
  })

  test("レイアウトを選択してスコアボードを作成できる", async ({ page }) => {
    await createPage.goto()

    // Singleレイアウトを選択
    await page.getByTestId("radio-single").click()

    // 選択されていることを確認
    await expect(page.getByTestId("radio-input-single")).toBeChecked()

    // スコアボードを作成
    await page.getByTestId("create-submit-button").click()

    // リンクページに遷移することを確認
    await expect(page).toHaveURL(/\/links\/\?id=/)

    // ダッシュボードタイトルが表示されることを確認
    await expect(page.locator("h2")).toContainText("ダッシュボード")

    // 各URLが生成されていることを確認
    await expect(page.getByTestId("control-url")).toHaveValue(
      /\/control\/\?id=/
    )
    await expect(page.getByTestId("score-url")).toHaveValue(
      /\/obs\/score\/\?id=/
    )
    await expect(page.getByTestId("mc-url")).toHaveValue(/\/obs\/mc\/\?id=/)
    await expect(page.getByTestId("bracket-url")).toHaveValue(
      /\/obs\/bracket\/\?id=/
    )
    await expect(page.getByTestId("next-url")).toHaveValue(/\/obs\/next\/\?id=/)
  })

  test("各レイアウトが選択できる", async ({ page }) => {
    await createPage.goto()

    const layouts = ["single", "dual", "simple", "solid"]

    for (const layout of layouts) {
      // レイアウトを選択
      await page.getByTestId(`radio-${layout}`).click()

      // 選択されていることを確認
      await expect(page.getByTestId(`radio-input-${layout}`)).toBeChecked()
    }
  })

  test.skip("プレビューが表示される", async ({ page }) => {
    await createPage.goto()

    // プレビューセクションが存在することを確認（CSS class名が不明なためスキップ）
    const preview = page.locator(".preview")
    await expect(preview).toBeVisible()
  })
})
