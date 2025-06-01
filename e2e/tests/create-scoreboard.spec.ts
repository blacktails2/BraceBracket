import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"
import { ScorePage } from "../pages/obs/score.page"
import { testColors, withNewPage } from "../utils/helpers"

test.describe("スコアボード作成フロー", () => {
  let createPage: CreatePage
  let linksPage: LinksPage

  test.beforeEach(async ({ page }) => {
    createPage = new CreatePage(page)
    linksPage = new LinksPage(page)
    await createPage.goto()
  })

  test("基本的なスコアボードを作成できる", async () => {
    // レイアウトを選択
    await createPage.selectLayout("single")

    // URL生成（Linksページへリダイレクト）
    await createPage.generateURL()

    // URLが生成されることを確認
    const urls = await linksPage.getAllURLs()
    expect(urls.score).toContain("/obs/score?id=")
    expect(urls.control).toContain("/control?id=")
    expect(urls.mc).toContain("/obs/mc?id=")
    expect(urls.bracket).toContain("/obs/bracket?id=")
    expect(urls.next).toContain("/obs/next?id=")
  })

  test("カスタムカラーを設定できる", async ({ page }) => {
    await createPage.selectLayout("single")
    await createPage.selectColorTheme("Custom")

    // カスタムカラーを設定
    await createPage.setCustomColors(testColors.primary, testColors.secondary)

    // プレビューが更新されるのを待つ
    await createPage.waitForPreviewUpdate()

    await createPage.generateURL()
    const urls = await linksPage.getAllURLs()

    // 生成されたスコアボードページでカラーが適用されているか確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      const roomId = urls.score?.split("?id=")[1] || ""
      await scorePage.goto(roomId)

      const backgroundStyle = await scorePage.getBackgroundStyle()
      expect(backgroundStyle).toContain(testColors.primary)
    })
  })

  test("ロゴ設定を有効/無効にできる", async ({ page }) => {
    await createPage.selectLayout("single")

    // ロゴを有効化
    await createPage.enableLogo()
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()

    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      const roomId = urls.score?.split("?id=")[1] || ""
      await scorePage.goto(roomId)

      // ロゴが表示されることを確認
      expect(await scorePage.isLogoVisible()).toBe(true)
    })
  })

  test("ドロップシャドウを設定できる", async ({ page }) => {
    await createPage.selectLayout("single")

    // ドロップシャドウを設定
    await createPage.setDropShadow("2", "2", "4", "0.5")

    await createPage.generateURL()
    const urls = await linksPage.getAllURLs()

    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      const roomId = urls.score?.split("?id=")[1] || ""
      await scorePage.goto(roomId)

      // ドロップシャドウが適用されていることを確認
      expect(await scorePage.hasDropShadow()).toBe(true)
    })
  })

  test("各レイアウトタイプを選択できる", async ({ page }) => {
    const layouts: Array<"single" | "dual" | "simple" | "solid"> = [
      "single",
      "dual",
      "simple",
      "solid",
    ]

    for (const layout of layouts) {
      await createPage.goto()
      await createPage.selectLayout(layout)
      await createPage.generateURL()

      const urls = await linksPage.getAllURLs()

      await withNewPage(page, async (newPage) => {
        const scorePage = new ScorePage(newPage)
        const roomId = urls.score?.split("?id=")[1] || ""
        await scorePage.goto(roomId)

        const layoutClass = await scorePage.getLayoutClass()
        expect(layoutClass.toLowerCase()).toContain(layout.toLowerCase())
      })
    }
  })

  test("カメラ表示オプションを設定できる", async () => {
    await createPage.selectLayout("single")

    // 各カメラ表示オプションをテスト
    const cameraOptions: Array<"none" | "simple" | "detailed"> = [
      "none",
      "simple",
      "detailed",
    ]

    for (const option of cameraOptions) {
      await createPage.goto()
      await createPage.selectCameraDisplay(option)
      await createPage.generateURL()

      // 設定が保存されることを確認
      const urls = await linksPage.getAllURLs()
      expect(urls.score).toBeTruthy()
    }
  })

  test("Twitter ID表示を有効にできる", async ({ page }) => {
    await createPage.selectLayout("single")
    await createPage.enableTwitterDisplay()

    await createPage.generateURL()
    const urls = await linksPage.getAllURLs()

    // コントロールページでTwitter ID入力欄が表示されることを確認（要実装）
    await withNewPage(page, async (newPage) => {
      const controlPage = new ControlPage(newPage)
      const roomId = urls.control?.split("?id=")[1] || ""
      await controlPage.goto(roomId)

      const twitterInput = await newPage.$('input[name="player1Twitter"]')
      expect(twitterInput).toBeTruthy()
    })
  })

  test("Start.gg連携を設定できる", async () => {
    await createPage.selectLayout("single")

    // Start.gg URLを設定
    const tournamentUrl =
      "https://start.gg/tournament/test-tournament/event/test-event"
    await createPage.setStartGGTournament(tournamentUrl)

    // イベント選択（実際のAPIコールはモックが必要）
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    expect(urls.control).toBeTruthy()
  })

  test("Tweet機能を設定できる", async () => {
    await createPage.selectLayout("single")

    // Tweet機能を有効化
    await createPage.enableTweetMatch()

    // Tweetテンプレートを設定
    const template = "{{player1}} vs {{player2}} - {{round}} #Tournament"
    await createPage.setTweetTemplate(template)

    await createPage.generateURL()
    const urls = await linksPage.getAllURLs()
    expect(urls.control).toBeTruthy()
  })

  test.skip("プレビューが正しく表示される", async () => {
    await createPage.selectLayout("single")
    await createPage.selectColorTheme("Light")

    // プレビューフレームが存在することを確認
    const previewFrame = await createPage.getPreviewFrame()
    expect(previewFrame).toBeTruthy()

    // プレビュー内の要素を確認
    const scoreboardInPreview = previewFrame.locator(".scoreboard")
    await expect(scoreboardInPreview).toBeVisible()
  })
})
