import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"
import { ScorePage } from "../pages/obs/score.page"
import {
  testPlayers,
  testRounds,
  waitForRealtimeUpdate,
  withNewPage,
} from "../utils/helpers"

test.describe("スコアボード操作フロー", () => {
  let createPage: CreatePage
  let linksPage: LinksPage
  let controlPage: ControlPage
  let roomId: string

  test.beforeEach(async ({ page }) => {
    // まずスコアボードを作成
    createPage = new CreatePage(page)
    linksPage = new LinksPage(page)
    controlPage = new ControlPage(page)

    await createPage.goto()
    await createPage.selectLayout("single")
    await createPage.generateURL()

    // 生成されたURLからroomIdを取得
    const urls = await linksPage.getAllURLs()
    roomId = urls.control?.split("?id=")[1] || ""

    // コントロールページへ移動
    await controlPage.goto(roomId)
  })

  test("プレイヤー名を変更できる", async ({ page }) => {
    // プレイヤー名を設定
    await controlPage.setPlayer1Name(testPlayers.player1)
    await controlPage.setPlayer2Name(testPlayers.player2)

    // 変更が反映されていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    expect(names.player1).toBe(testPlayers.player1)
    expect(names.player2).toBe(testPlayers.player2)

    // OBSページでも反映されていることを確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForNameUpdate(
        testPlayers.player1,
        testPlayers.player2
      )

      expect(await scorePage.getPlayer1Name()).toBe(testPlayers.player1)
      expect(await scorePage.getPlayer2Name()).toBe(testPlayers.player2)
    })
  })

  test("スコアを更新できる", async ({ page }) => {
    // スコアを直接入力
    await controlPage.setPlayer1Score(2)
    await controlPage.setPlayer2Score(1)

    // 現在のスコアを確認
    const scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(2)
    expect(scores.player2).toBe(1)

    // OBSページでも反映されていることを確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForScoreUpdate(2, 1)

      expect(await scorePage.getPlayer1Score()).toBe(2)
      expect(await scorePage.getPlayer2Score()).toBe(1)
    })
  })

  test("スコアをインクリメント/デクリメントできる", async ({ page }) => {
    // プレイヤー1のスコアをインクリメント
    await controlPage.incrementPlayer1Score()
    await controlPage.incrementPlayer1Score()

    // プレイヤー2のスコアをインクリメント
    await controlPage.incrementPlayer2Score()

    // スコアを確認
    let scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(2)
    expect(scores.player2).toBe(1)

    // プレイヤー1のスコアをデクリメント
    await controlPage.decrementPlayer1Score()

    scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(1)
    expect(scores.player2).toBe(1)

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForScoreUpdate(1, 1)

      expect(await scorePage.getPlayer1Score()).toBe(1)
      expect(await scorePage.getPlayer2Score()).toBe(1)
    })
  })

  test("プレイヤーを入れ替えできる", async ({ page }) => {
    // プレイヤー名を設定
    await controlPage.setPlayer1Name(testPlayers.player1)
    await controlPage.setPlayer2Name(testPlayers.player2)
    await controlPage.setPlayer1Score(2)
    await controlPage.setPlayer2Score(1)

    // プレイヤーを入れ替え
    await controlPage.swapPlayers()

    // 入れ替わっていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    const scores = await controlPage.getCurrentScores()

    expect(names.player1).toBe(testPlayers.player2)
    expect(names.player2).toBe(testPlayers.player1)
    expect(scores.player1).toBe(1)
    expect(scores.player2).toBe(2)

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForNameUpdate(
        testPlayers.player2,
        testPlayers.player1
      )

      expect(await scorePage.getPlayer1Name()).toBe(testPlayers.player2)
      expect(await scorePage.getPlayer2Name()).toBe(testPlayers.player1)
      expect(await scorePage.getPlayer1Score()).toBe(1)
      expect(await scorePage.getPlayer2Score()).toBe(2)
    })
  })

  test("スコアをリセットできる", async ({ page }) => {
    // スコアを設定
    await controlPage.setPlayer1Score(3)
    await controlPage.setPlayer2Score(2)

    // リセット
    await controlPage.resetScores()

    // スコアが0になっていることを確認
    const scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(0)
    expect(scores.player2).toBe(0)

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForScoreUpdate(0, 0)

      expect(await scorePage.getPlayer1Score()).toBe(0)
      expect(await scorePage.getPlayer2Score()).toBe(0)
    })
  })

  test("ラウンドを選択できる", async ({ page }) => {
    // 各ラウンドを選択
    await controlPage.selectRound(testRounds.winnersQuarter)

    const currentRound = await controlPage.getCurrentRound()
    expect(currentRound).toBe(testRounds.winnersQuarter)

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await waitForRealtimeUpdate(newPage)

      const roundText = await scorePage.getRoundText()
      expect(roundText).toContain(testRounds.winnersQuarter)
    })
  })

  test("マッチタイプを選択できる", async ({ page }) => {
    // FT3を選択
    await controlPage.selectMatchType("ft3")

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await waitForRealtimeUpdate(newPage)

      const matchType = await scorePage.getMatchType()
      expect(matchType).toContain("3")
    })
  })

  test("長いプレイヤー名を処理できる", async ({ page }) => {
    // 長い名前を設定
    await controlPage.setPlayer1Name(testPlayers.longName)
    await controlPage.setPlayer2Name(testPlayers.withTeamTag)

    // 名前が正しく設定されていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    expect(names.player1).toBe(testPlayers.longName)
    expect(names.player2).toBe(testPlayers.withTeamTag)

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForNameUpdate(
        testPlayers.longName,
        testPlayers.withTeamTag
      )

      expect(await scorePage.getPlayer1Name()).toBe(testPlayers.longName)
      expect(await scorePage.getPlayer2Name()).toBe(testPlayers.withTeamTag)
    })
  })

  test("日本語のプレイヤー名を処理できる", async ({ page }) => {
    // 日本語名を設定
    await controlPage.setPlayer1Name(testPlayers.japanese)
    await controlPage.setPlayer2Name(testPlayers.japanese)

    // 名前が正しく設定されていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    expect(names.player1).toBe(testPlayers.japanese)
    expect(names.player2).toBe(testPlayers.japanese)

    // OBSページでの確認
    await withNewPage(page, async (newPage) => {
      const scorePage = new ScorePage(newPage)
      await scorePage.goto(roomId)

      await scorePage.waitForNameUpdate(
        testPlayers.japanese,
        testPlayers.japanese
      )

      expect(await scorePage.getPlayer1Name()).toBe(testPlayers.japanese)
      expect(await scorePage.getPlayer2Name()).toBe(testPlayers.japanese)
    })
  })

  test("複数のタブでリアルタイム同期される", async ({ context }) => {
    // 2つ目のコントロールページを開く
    const secondPage = await context.newPage()
    const secondControlPage = new ControlPage(secondPage)
    await secondControlPage.goto(roomId)

    // 1つ目のページで変更
    await controlPage.setPlayer1Name(testPlayers.player1)
    await controlPage.setPlayer1Score(2)

    // 2つ目のページで変更が反映されるのを待つ
    await waitForRealtimeUpdate(secondPage)

    // 2つ目のページで確認
    const names = await secondControlPage.getCurrentPlayerNames()
    const scores = await secondControlPage.getCurrentScores()

    expect(names.player1).toBe(testPlayers.player1)
    expect(scores.player1).toBe(2)

    await secondPage.close()
  })
})
