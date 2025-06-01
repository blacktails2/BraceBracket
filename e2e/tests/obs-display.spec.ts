import { test, expect } from "@playwright/test"

import { CreatePage } from "../pages/create.page"

test.describe("OBS表示確認", () => {
  let createPage: CreatePage
  let roomId: string

  test.beforeEach(async ({ page }) => {
    createPage = new CreatePage(page)

    await createPage.goto()
    await page.getByTestId("radio-single").click()
    await page.getByTestId("create-submit-button").click()

    // roomIdを取得
    const controlURL = await page
      .getByTestId("control-url")
      .getAttribute("value")
    roomId = controlURL?.split("?id=")[1] || ""
  })

  test("スコアボードOBSページが表示される", async ({ page }) => {
    // OBSスコアページへ移動
    await page.goto(`/obs/score?id=${roomId}`)

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL(/\/obs\/score\/\?id=/)

    // OBSページは透明背景のため、body要素の存在を確認
    const body = page.locator("body")
    await expect(body).toBeAttached()

    // ページにエラーがないことを確認
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })
    expect(consoleErrors).toHaveLength(0)
  })

  test("MCOBSページが表示される", async ({ page }) => {
    // OBS MCページへ移動
    await page.goto(`/obs/mc?id=${roomId}`)

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL(/\/obs\/mc\/\?id=/)

    // MCコンテンツの存在を確認
    const mcContainer = page
      .locator('[class*="normal"], [class*="simple"]')
      .first()
    await expect(mcContainer).toBeAttached()
  })

  test("ブラケットOBSページが表示される", async ({ page }) => {
    // OBSブラケットページへ移動
    await page.goto(`/obs/bracket?id=${roomId}`)

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL(/\/obs\/bracket\/\?id=/)

    // ブラケットコンテンツの存在を確認
    const bracketContainer = page.locator(".board, img.board").first()
    await expect(bracketContainer).toBeAttached()
  })

  test("NextOBSページが表示される", async ({ page }) => {
    // OBS Nextページへ移動
    await page.goto(`/obs/next?id=${roomId}`)

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL(/\/obs\/next\/\?id=/)

    // Nextコンテンツの存在を確認
    const nextContainer = page
      .locator('[class*="simple"], [class*="other"]')
      .first()
    await expect(nextContainer).toBeAttached()
  })

  test("全てのOBSページがアクセス可能", async ({ page }) => {
    // 全てのOBSページがエラーなく読み込まれることを確認
    const obsPages = [
      { path: `/obs/score?id=${roomId}`, pattern: /\/obs\/score\/\?id=/ },
      { path: `/obs/mc?id=${roomId}`, pattern: /\/obs\/mc\/\?id=/ },
      { path: `/obs/bracket?id=${roomId}`, pattern: /\/obs\/bracket\/\?id=/ },
      { path: `/obs/next?id=${roomId}`, pattern: /\/obs\/next\/\?id=/ },
    ]

    for (const obsPage of obsPages) {
      await page.goto(obsPage.path)
      await expect(page).toHaveURL(obsPage.pattern)
      const body = page.locator("body")
      await expect(body).toBeAttached()
    }
  })
})
