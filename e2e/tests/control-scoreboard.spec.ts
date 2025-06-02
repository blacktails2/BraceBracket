import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"

test.describe("スコアボード操作フロー", () => {
  let createPage: CreatePage
  let controlPage: ControlPage
  let roomId: string

  test.beforeEach(async ({ page }) => {
    // まずスコアボードを作成
    createPage = new CreatePage(page)
    controlPage = new ControlPage(page)

    await createPage.goto()
    await page.getByTestId("radio-single").click()
    await page.getByTestId("create-submit-button").click()

    // 生成されたURLからroomIdを取得
    await page.waitForSelector('[data-testid="control-url"]')
    const controlURL = await page
      .getByTestId("control-url")
      .getAttribute("value")
    roomId = controlURL?.split("?id=")[1] || ""

    // Firestoreの初期化を待つ
    await page.waitForTimeout(1000)

    // コントロールページへ移動
    await controlPage.goto(roomId)
    await page.waitForLoadState("networkidle")

    // Scoreタブを選択
    await controlPage.switchToTab("score")
    await page.waitForTimeout(500)
  })

  test("プレイヤー名を変更できる", async () => {
    // プレイヤー名を設定
    await controlPage.setPlayer1Name("Player1")
    await controlPage.setPlayer2Name("Player2")

    // 変更を適用
    await controlPage.submitScoreChanges()

    // 変更が反映されていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    expect(names.player1).toBe("Player1")
    expect(names.player2).toBe("Player2")
  })

  test("スコアを更新できる", async () => {
    // スコアを直接入力
    await controlPage.setPlayer1Score(2)
    await controlPage.setPlayer2Score(1)

    // 変更を適用
    await controlPage.submitScoreChanges()

    // 現在のスコアを確認
    const scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(2)
    expect(scores.player2).toBe(1)
  })

  test("スコアをインクリメント/デクリメントできる", async () => {
    // プレイヤー1のスコアをインクリメント
    await controlPage.incrementPlayer1Score()
    await controlPage.incrementPlayer1Score()

    // プレイヤー2のスコアをインクリメント
    await controlPage.incrementPlayer2Score()

    // 変更を適用
    await controlPage.submitScoreChanges()

    // スコアを確認（現在の値を確認）
    const scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(2)
    expect(scores.player2).toBe(1)

    // プレイヤー1のスコアをデクリメント
    await controlPage.decrementPlayer1Score()

    // 変更を適用
    await controlPage.submitScoreChanges()

    // スコアを確認
    const scores2 = await controlPage.getCurrentScores()
    expect(scores2.player1).toBe(1)
    expect(scores2.player2).toBe(1)
  })

  test("プレイヤーを入れ替えできる", async () => {
    // プレイヤー名とスコアを設定
    await controlPage.setPlayer1Name("Player1")
    await controlPage.setPlayer2Name("Player2")
    await controlPage.setPlayer1Score(2)
    await controlPage.setPlayer2Score(1)

    // 変更を適用してから入れ替え
    await controlPage.submitScoreChanges()

    // プレイヤーを入れ替え
    await controlPage.swapPlayers()

    // 変更を再度適用
    await controlPage.submitScoreChanges()

    // 入れ替わっていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    expect(names.player1).toBe("Player2")
    expect(names.player2).toBe("Player1")
    const scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(1)
    expect(scores.player2).toBe(2)
  })

  test("スコアをリセットできる", async () => {
    // スコアを設定
    await controlPage.setPlayer1Score(3)
    await controlPage.setPlayer2Score(2)

    // 変更を適用してからリセット
    await controlPage.submitScoreChanges()

    // リセット
    await controlPage.resetScores()

    // 変更を再度適用
    await controlPage.submitScoreChanges()

    // スコアが0になっていることを確認
    const scores = await controlPage.getCurrentScores()
    expect(scores.player1).toBe(0)
    expect(scores.player2).toBe(0)
  })
})
