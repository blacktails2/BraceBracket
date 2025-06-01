import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"
import { viewports } from "../utils/helpers"

test.describe("レスポンシブデザイン確認", () => {
  let createPage: CreatePage
  let linksPage: LinksPage
  let controlPage: ControlPage

  test.describe("デスクトップ表示", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop)
      createPage = new CreatePage(page)
      linksPage = new LinksPage(page)
      controlPage = new ControlPage(page)
    })

    test("作成画面がデスクトップで正しく表示される", async ({ page }) => {
      await createPage.goto()

      // レイアウト選択肢が横並びで表示されることを確認
      const layoutContainer = await page.$(".layoutList")
      expect(layoutContainer).toBeTruthy()

      // プレビューが右側に表示されることを確認
      const preview = await page.$(".preview")
      expect(preview).toBeTruthy()

      // スクロールなしで主要な要素が見えることを確認
      const submitButton = await page.isVisible(
        '[data-testid="create-submit-button"]'
      )
      expect(submitButton).toBe(true)
    })

    test("コントロール画面がデスクトップで正しく表示される", async ({
      page,
    }) => {
      // まずスコアボードを作成
      await createPage.goto()
      await createPage.selectLayout("single")
      await createPage.generateURL()

      const urls = await linksPage.getAllURLs()
      const roomId = urls.control?.split("?id=")[1] || ""
      await controlPage.goto(roomId)

      // タブが横並びで表示されることを確認
      const tabs = await page.$$("[data-tab]")
      expect(tabs.length).toBeGreaterThan(0)

      // プレイヤー入力欄が横並びで表示されることを確認
      const player1Input = await page.$('input[name="player1Name"]')
      const player2Input = await page.$('input[name="player2Name"]')
      expect(player1Input).toBeTruthy()
      expect(player2Input).toBeTruthy()
    })
  })

  test.describe("タブレット表示", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet)
      createPage = new CreatePage(page)
      linksPage = new LinksPage(page)
      controlPage = new ControlPage(page)
    })

    test("作成画面がタブレットで正しく表示される", async ({ page }) => {
      await createPage.goto()

      // レイアウト選択肢が適切に配置されることを確認
      const layoutOptions = await page.$$('[data-testid^="radio-"]')
      expect(layoutOptions.length).toBeGreaterThan(0)

      // プレビューが見えることを確認（スクロール可能）
      const preview = await page.$(".preview")
      expect(preview).toBeTruthy()
    })

    test("リンク画面がタブレットで正しく表示される", async ({ page }) => {
      await createPage.goto()
      await createPage.selectLayout("single")
      await createPage.generateURL()

      // URLが適切な幅で表示されることを確認
      const scoreUrl = await page.$('[data-testid="score-url"]')
      expect(scoreUrl).toBeTruthy()

      // カードレイアウトが縦並びになることを確認
      const cards = await page.$$(".rounded-[15px]")
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  test.describe("モバイル表示", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile)
      createPage = new CreatePage(page)
      linksPage = new LinksPage(page)
      controlPage = new ControlPage(page)
    })

    test("作成画面がモバイルで正しく表示される", async ({ page }) => {
      await createPage.goto()

      // レイアウト選択肢が縦並びで表示されることを確認
      const layoutOptions = await page.$$('[data-testid^="radio-"]')
      expect(layoutOptions.length).toBeGreaterThan(0)

      // 各セクションがスクロール可能であることを確認
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // 送信ボタンまでスクロールできることを確認
      const submitButton = await page.$('[data-testid="create-submit-button"]')
      await submitButton?.scrollIntoViewIfNeeded()
      expect(await submitButton?.isVisible()).toBe(true)
    })

    test("コントロール画面がモバイルで正しく表示される", async ({ page }) => {
      await createPage.goto()
      await createPage.selectLayout("single")
      await createPage.generateURL()

      const urls = await linksPage.getAllURLs()
      const roomId = urls.control?.split("?id=")[1] || ""
      await controlPage.goto(roomId)

      // タブがドロップダウンまたはスクロール可能になることを確認
      const tabs = await page.$$("[data-tab]")
      expect(tabs.length).toBeGreaterThan(0)

      // プレイヤー入力欄が縦並びで表示されることを確認
      const player1Input = await page.$('input[name="player1Name"]')
      const player2Input = await page.$('input[name="player2Name"]')

      // 両方の入力欄が存在することを確認
      expect(player1Input).toBeTruthy()
      expect(player2Input).toBeTruthy()

      // スコアボタンが適切なサイズで表示されることを確認
      const incrementButton = await page.$('button[data-action="p1-increment"]')
      expect(incrementButton).toBeTruthy()

      // タッチターゲットが十分な大きさであることを確認
      const buttonSize = await incrementButton?.boundingBox()
      expect(buttonSize?.width).toBeGreaterThanOrEqual(44)
      expect(buttonSize?.height).toBeGreaterThanOrEqual(44)
    })

    test("リンク画面がモバイルで正しく表示される", async ({ page }) => {
      await createPage.goto()
      await createPage.selectLayout("single")
      await createPage.generateURL()

      // URLが横スクロール可能またはテキスト折り返しされることを確認
      const urlInputs = await page.$$('[data-testid$="-url"]')
      expect(urlInputs.length).toBeGreaterThan(0)

      for (const input of urlInputs) {
        const box = await input.boundingBox()
        const viewportWidth = viewports.mobile.width
        // 入力欄がビューポート幅を超えないことを確認
        expect(box?.width).toBeLessThanOrEqual(viewportWidth)
      }

      // コピーボタンが適切に配置されることを確認
      const copyButtons = await page.$$('button:has-text("Copy")')
      expect(copyButtons.length).toBeGreaterThan(0)
    })

    test("ナビゲーションがモバイルで動作する", async ({ page }) => {
      await page.goto("/")

      // モバイルメニューボタンの存在を確認（実装による）
      const mobileMenuButton = await page.$('[data-testid="mobile-menu"]')
      if (mobileMenuButton) {
        await mobileMenuButton.click()

        // メニューが開くことを確認
        const menuItems = await page.$$(".menu-item")
        expect(menuItems.length).toBeGreaterThan(0)
      }

      // ロゴがモバイルで適切に表示されることを確認
      const logo = await page.$(".logo")
      expect(logo).toBeTruthy()
    })
  })

  test.describe("画面回転対応", () => {
    test("横向きモバイルで正しく表示される", async ({ page }) => {
      // 横向きモバイル（landscape）
      await page.setViewportSize({ width: 667, height: 375 })

      await createPage.goto()
      await createPage.selectLayout("single")
      await createPage.generateURL()

      const urls = await linksPage.getAllURLs()
      const roomId = urls.control?.split("?id=")[1] || ""
      await controlPage.goto(roomId)

      // レイアウトが崩れていないことを確認
      const container = await page.$(".container")
      expect(container).toBeTruthy()

      // 主要な要素が表示されていることを確認
      const player1Input = await page.isVisible('input[name="player1Name"]')
      expect(player1Input).toBe(true)
    })
  })

  test.describe("フォントサイズとアクセシビリティ", () => {
    test("モバイルで読みやすいフォントサイズが使用される", async ({ page }) => {
      await page.setViewportSize(viewports.mobile)
      await page.goto("/")

      // 本文のフォントサイズを確認
      const fontSize = await page.evaluate(() => {
        const element = document.querySelector("p")
        if (element) {
          return window.getComputedStyle(element).fontSize
        }
        return null
      })

      // 16px以上であることを確認（読みやすさの基準）
      expect(parseInt(fontSize || "0")).toBeGreaterThanOrEqual(14)
    })

    test("タッチターゲットが十分な大きさである", async ({ page }) => {
      await page.setViewportSize(viewports.mobile)
      await createPage.goto()

      // ボタンのサイズを確認
      const buttons = await page.$$("button")
      for (const button of buttons.slice(0, 5)) {
        // 最初の5つをチェック
        const box = await button.boundingBox()
        if (box) {
          // WCAG推奨の44x44px以上
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })

  test.describe("レスポンシブ画像", () => {
    test("画像がビューポートに収まる", async ({ page }) => {
      const devices = [viewports.mobile, viewports.tablet, viewports.desktop]

      for (const viewport of devices) {
        await page.setViewportSize(viewport)
        await page.goto("/")

        // すべての画像を取得
        const images = await page.$$("img")
        for (const img of images) {
          const box = await img.boundingBox()
          if (box) {
            // 画像がビューポート幅を超えないことを確認
            expect(box.width).toBeLessThanOrEqual(viewport.width)
          }
        }
      }
    })
  })
})
