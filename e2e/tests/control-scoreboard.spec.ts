import { test } from "@playwright/test"

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
    const controlURL = await page
      .getByTestId("control-url")
      .getAttribute("value")
    roomId = controlURL?.split("?id=")[1] || ""

    // コントロールページへ移動
    await controlPage.goto(roomId)
    // Scoreタブを確実に選択
    await controlPage.switchToTab("score")
  })

  test("プレイヤー名を変更できる", async () => {
    // プレイヤー名を設定
    await controlPage.setPlayer1Name("Player1")
    await controlPage.setPlayer2Name("Player2")

    // 変更が反映されていることを確認
    await controlPage.expectCurrentPlayerNames("Player1", "Player2")
  })

  test("スコアを更新できる", async () => {
    // スコアを直接入力
    await controlPage.setPlayer1Score(2)
    await controlPage.setPlayer2Score(1)

    // 現在のスコアを確認
    await controlPage.expectCurrentScores(2, 1)
  })

  test("スコアをインクリメント/デクリメントできる", async () => {
    // プレイヤー1のスコアをインクリメント
    await controlPage.incrementPlayer1Score()
    await controlPage.incrementPlayer1Score()

    // プレイヤー2のスコアをインクリメント
    await controlPage.incrementPlayer2Score()

    // 変更を適用
    await controlPage.submitScoreChanges()

    // スコアを確認（Auto-waitingでUIの更新を待つ）
    await controlPage.expectCurrentScores(2, 1)

    // プレイヤー1のスコアをデクリメント
    await controlPage.decrementPlayer1Score()

    // 変更を適用
    await controlPage.submitScoreChanges()

    // スコアを確認（Auto-waitingでUIの更新を待つ）
    await controlPage.expectCurrentScores(1, 1)
  })

  test("プレイヤーを入れ替えできる", async () => {
    // プレイヤー名とスコアを設定
    await controlPage.setPlayer1Name("Player1")
    await controlPage.setPlayer2Name("Player2")
    await controlPage.setPlayer1Score(2)
    await controlPage.setPlayer2Score(1)

    // プレイヤーを入れ替え
    await controlPage.swapPlayers()

    // 変更を適用
    await controlPage.submitScoreChanges()

    // 入れ替わっていることを確認（Auto-waitingでUIの更新を待つ）
    await controlPage.expectCurrentPlayerNames("Player2", "Player1")
    await controlPage.expectCurrentScores(1, 2)
  })

  test("スコアをリセットできる", async () => {
    // スコアを設定
    await controlPage.setPlayer1Score(3)
    await controlPage.setPlayer2Score(2)

    // リセット
    await controlPage.resetScores()

    // 変更を適用
    await controlPage.submitScoreChanges()

    // スコアが0になっていることを確認（Auto-waitingでUIの更新を待つ）
    await controlPage.expectCurrentScores(0, 0)
  })
})
