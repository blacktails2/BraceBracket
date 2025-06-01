import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"
import { BracketPage } from "../pages/obs/bracket.page"
import { MCPage } from "../pages/obs/mc.page"
import { NextPage } from "../pages/obs/next.page"
import { ScorePage } from "../pages/obs/score.page"
import { testPlayers, viewports, waitForRealtimeUpdate } from "../utils/helpers"

test.describe("OBS表示確認", () => {
  let createPage: CreatePage
  let linksPage: LinksPage
  let controlPage: ControlPage
  let roomId: string

  test.beforeEach(async ({ page }) => {
    // OBS用のビューポートサイズを設定
    await page.setViewportSize(viewports.obs)

    // スコアボードを作成
    createPage = new CreatePage(page)
    linksPage = new LinksPage(page)
    controlPage = new ControlPage(page)

    await createPage.goto()
    await createPage.selectLayout("single")
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    roomId = urls.control?.split("?id=")[1] || ""
  })

  test("スコアボード表示が正しく動作する", async ({ page }) => {
    const scorePage = new ScorePage(page)
    await scorePage.goto(roomId)

    // 初期状態の確認
    expect(await scorePage.getPlayer1Name()).toBeFalsy()
    expect(await scorePage.getPlayer2Name()).toBeFalsy()
    expect(await scorePage.getPlayer1Score()).toBe(0)
    expect(await scorePage.getPlayer2Score()).toBe(0)

    // 別タブでコントロールページを開いて更新
    const controlTab = await page.context().newPage()
    const controlInTab = new ControlPage(controlTab)
    await controlInTab.goto(roomId)

    await controlInTab.setPlayer1Name(testPlayers.player1)
    await controlInTab.setPlayer2Name(testPlayers.player2)
    await controlInTab.setPlayer1Score(2)
    await controlInTab.setPlayer2Score(1)

    // スコアボードページでの更新を確認
    await scorePage.waitForNameUpdate(testPlayers.player1, testPlayers.player2)
    await scorePage.waitForScoreUpdate(2, 1)

    expect(await scorePage.getPlayer1Name()).toBe(testPlayers.player1)
    expect(await scorePage.getPlayer2Name()).toBe(testPlayers.player2)
    expect(await scorePage.getPlayer1Score()).toBe(2)
    expect(await scorePage.getPlayer2Score()).toBe(1)

    await controlTab.close()
  })

  test("MCレイアウトが正しく表示される", async ({ page }) => {
    const mcPage = new MCPage(page)
    await mcPage.goto(roomId)

    // 初期状態の確認
    const initialText = await mcPage.getAllMCText()
    expect(initialText).toHaveLength(0)

    // コントロールページでMCテキストを設定
    const controlTab = await page.context().newPage()
    const controlInTab = new ControlPage(controlTab)
    await controlInTab.goto(roomId)
    await controlInTab.switchToTab("mc")

    // MCテキストを設定
    await controlInTab.setMCText(1, "Welcome to the tournament!")
    await controlInTab.setMCText(2, "Next match starting soon")
    await controlInTab.setMCText(3, "Follow us on Twitter")
    await controlInTab.setMCText(4, "@tournament2024")

    // MCページでの更新を確認
    await waitForRealtimeUpdate(page)
    await mcPage.waitForTextUpdate(1, "Welcome to the tournament!")

    const mcText = await mcPage.getAllMCText()
    expect(mcText).toHaveLength(4)
    expect(mcText[0]).toBe("Welcome to the tournament!")
    expect(mcText[1]).toBe("Next match starting soon")
    expect(mcText[2]).toBe("Follow us on Twitter")
    expect(mcText[3]).toBe("@tournament2024")

    await controlTab.close()
  })

  test("ブラケット表示が正しく動作する", async ({ page }) => {
    const bracketPage = new BracketPage(page)
    await bracketPage.goto(roomId)

    // コントロールページでブラケット情報を設定
    const controlTab = await page.context().newPage()
    const controlInTab = new ControlPage(controlTab)
    await controlInTab.goto(roomId)
    await controlInTab.switchToTab("bracket")

    // Winners Finalの設定
    await controlInTab.updateBracketPlayer("wf-1", testPlayers.player1)
    await controlInTab.updateBracketPlayer("wf-2", testPlayers.player2)
    await controlInTab.updateBracketScore("wf", 1, 3)
    await controlInTab.updateBracketScore("wf", 2, 1)

    // Losers Finalの設定
    await controlInTab.updateBracketPlayer("lf-1", testPlayers.player3)
    await controlInTab.updateBracketPlayer("lf-2", testPlayers.player4)
    await controlInTab.updateBracketScore("lf", 1, 2)
    await controlInTab.updateBracketScore("lf", 2, 3)

    // ブラケットページでの更新を確認
    await waitForRealtimeUpdate(page)

    // Winners Final確認
    await bracketPage.waitForPlayerUpdate("wf-1", testPlayers.player1)
    const wfNames = await bracketPage.getWinnersFinalistNames()
    expect(wfNames.player1).toBe(testPlayers.player1)
    expect(wfNames.player2).toBe(testPlayers.player2)

    // Losers Final確認
    const lfNames = await bracketPage.getLosersFinalistNames()
    expect(lfNames.player1).toBe(testPlayers.player3)
    expect(lfNames.player2).toBe(testPlayers.player4)

    await controlTab.close()
  })

  test("Next Match表示が正しく動作する", async ({ page }) => {
    const nextPage = new NextPage(page)
    await nextPage.goto(roomId)

    // 初期状態の確認
    const initialPlayers = await nextPage.getNextMatchPlayers()
    expect(initialPlayers.player1).toBeFalsy()
    expect(initialPlayers.player2).toBeFalsy()

    // コントロールページで次の試合を設定
    const controlTab = await page.context().newPage()
    const controlInTab = new ControlPage(controlTab)
    await controlInTab.goto(roomId)
    await controlInTab.switchToTab("next")

    // 次の試合情報を設定（実際の実装に依存）
    await controlInTab.setNextMatch(0)

    // Nextページでの更新を確認
    await waitForRealtimeUpdate(page)

    const nextMatchPlayers = await nextPage.getNextMatchPlayers()
    expect(nextMatchPlayers.player1).toBeTruthy()
    expect(nextMatchPlayers.player2).toBeTruthy()

    const round = await nextPage.getNextMatchRound()
    expect(round).toBeTruthy()

    await controlTab.close()
  })

  test("各レイアウトでスタイルが正しく適用される", async ({ page }) => {
    // Dualレイアウトでテスト
    await createPage.goto()
    await createPage.selectLayout("dual")
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    const dualRoomId = urls.score?.split("?id=")[1] || ""

    const scorePage = new ScorePage(page)
    await scorePage.goto(dualRoomId)

    const layoutClass = await scorePage.getLayoutClass()
    expect(layoutClass).toContain("dual")

    // Simpleレイアウトでテスト
    await createPage.goto()
    await createPage.selectLayout("simple")
    await createPage.generateURL()

    const simpleUrls = await linksPage.getAllURLs()
    const simpleRoomId = simpleUrls.score?.split("?id=")[1] || ""

    await scorePage.goto(simpleRoomId)

    const simpleLayoutClass = await scorePage.getLayoutClass()
    expect(simpleLayoutClass).toContain("simple")
  })

  test("カスタムカラーがOBSページに反映される", async ({ page }) => {
    // カスタムカラーを設定
    await createPage.goto()
    await createPage.selectLayout("single")
    await createPage.selectColorTheme("Custom")
    await createPage.setCustomColors("#FF0000", "#00FF00")
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    const customRoomId = urls.score?.split("?id=")[1] || ""

    // 各OBSページでカラーを確認
    const scorePage = new ScorePage(page)
    await scorePage.goto(customRoomId)

    const backgroundStyle = await scorePage.getBackgroundStyle()
    expect(backgroundStyle).toBeTruthy()

    // MCページでも確認
    const mcPage = new MCPage(page)
    await mcPage.goto(customRoomId)

    const hasBackground = await mcPage.hasBackground()
    expect(hasBackground).toBe(true)
  })

  test("透過背景が正しく設定される", async ({ page }) => {
    // Simpleレイアウト（透過背景）でテスト
    await createPage.goto()
    await createPage.selectLayout("simple")
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    const transparentRoomId = urls.score?.split("?id=")[1] || ""

    const scorePage = new ScorePage(page)
    await scorePage.goto(transparentRoomId)

    // 背景が透過であることを確認
    const backgroundStyle = await scorePage.getBackgroundStyle()
    expect(backgroundStyle).toContain("transparent")
  })

  test("リアルタイム更新が全OBSページで動作する", async ({ page, context }) => {
    // 複数のOBSページを開く
    const scoreTab = await context.newPage()
    const mcTab = await context.newPage()
    const bracketTab = await context.newPage()
    const nextTab = await context.newPage()

    const scorePage = new ScorePage(scoreTab)
    const mcPage = new MCPage(mcTab)
    const bracketPage = new BracketPage(bracketTab)
    const nextPage = new NextPage(nextTab)

    await scorePage.goto(roomId)
    await mcPage.goto(roomId)
    await bracketPage.goto(roomId)
    await nextPage.goto(roomId)

    // コントロールページで更新
    await controlPage.goto(roomId)
    await controlPage.setPlayer1Name(testPlayers.player1)

    // 全ページで更新を確認
    await waitForRealtimeUpdate(scoreTab)
    await waitForRealtimeUpdate(mcTab)
    await waitForRealtimeUpdate(bracketTab)
    await waitForRealtimeUpdate(nextTab)

    // スコアページで確認
    const player1Name = await scorePage.getPlayer1Name()
    expect(player1Name).toBe(testPlayers.player1)

    // 他のタブを閉じる
    await scoreTab.close()
    await mcTab.close()
    await bracketTab.close()
    await nextTab.close()
  })
})
