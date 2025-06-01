import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"
import { MCPage } from "../pages/obs/mc.page"
import { NextPage } from "../pages/obs/next.page"
import { ScorePage } from "../pages/obs/score.page"
import { waitForRealtimeUpdate } from "../utils/helpers"

test.describe("コントロール画面からOBS画面への同期テスト", () => {
  let roomId: string

  test.beforeEach(async ({ page }) => {
    // Create a new scoreboard and get the room ID
    const createPage = new CreatePage(page)
    await createPage.goto()
    await createPage.selectLayout("single")
    await createPage.generateURL()

    const linksPage = new LinksPage(page)
    const controlUrl = await linksPage.getControlURL()
    if (!controlUrl) {
      throw new Error("Failed to get control URL")
    }
    roomId = controlUrl.split("?id=")[1]
  })

  test("スコア変更がコントロールからOBSスコア画面に同期される", async ({
    browser,
  }) => {
    // Open control page in first tab
    const context1 = await browser.newContext()
    const controlPageTab = await context1.newPage()
    const controlPage = new ControlPage(controlPageTab)
    await controlPage.goto(roomId)

    // Open OBS score page in second tab
    const context2 = await browser.newContext()
    const obsPageTab = await context2.newPage()
    const scorePage = new ScorePage(obsPageTab)
    await scorePage.goto(roomId)

    // Test 1: Update player names
    await controlPage.setPlayer1Name("TestPlayer1")
    await controlPage.setPlayer2Name("TestPlayer2")
    // Submit the form to apply changes
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(obsPageTab)
    const p1NameElement = await scorePage.getPlayer1Name()
    expect(p1NameElement).toBe("TestPlayer1")
    const p2NameElement = await scorePage.getPlayer2Name()
    expect(p2NameElement).toBe("TestPlayer2")

    // Test 2: Update scores
    await controlPage.incrementPlayer1Score()
    await controlPage.incrementPlayer2Score()
    await controlPage.incrementPlayer2Score()
    // Submit the form to apply changes
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(obsPageTab)
    const p1Score = await scorePage.getPlayer1Score()
    expect(p1Score).toBe(1)
    const p2Score = await scorePage.getPlayer2Score()
    expect(p2Score).toBe(2)

    // Test 3: Reset scores
    await controlPage.resetScores()
    // Submit the form to apply changes
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(obsPageTab)
    const p1ScoreReset = await scorePage.getPlayer1Score()
    const p2ScoreReset = await scorePage.getPlayer2Score()
    expect(p1ScoreReset).toBe(0)
    expect(p2ScoreReset).toBe(0)

    // Test 4: Swap players
    await controlPage.swapPlayers()
    // Submit the form to apply changes
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(obsPageTab)
    const p1NameSwapped = await scorePage.getPlayer1Name()
    const p2NameSwapped = await scorePage.getPlayer2Name()
    expect(p1NameSwapped).toBe("TestPlayer2")
    expect(p2NameSwapped).toBe("TestPlayer1")

    // Clean up
    await context1.close()
    await context2.close()
  })

  test("MC情報がコントロールからOBS MC画面に同期される", async ({
    browser,
  }) => {
    // Open control page in first tab
    const context1 = await browser.newContext()
    const controlPageTab = await context1.newPage()
    const controlPage = new ControlPage(controlPageTab)
    await controlPage.goto(roomId)
    await controlPage.selectTab("MC")

    // Open OBS MC page in second tab
    const context2 = await browser.newContext()
    const obsPageTab = await context2.newPage()
    const mcPage = new MCPage(obsPageTab)
    await mcPage.goto(roomId)

    // Test MC player information updates
    const testPlayers = [
      { team: "TeamA", playerName: "Player1", twitterID: "@player1" },
      { team: "TeamB", playerName: "Player2", twitterID: "@player2" },
      { team: "TeamC", playerName: "Player3", twitterID: "@player3" },
    ]

    // Fill all MC fields first
    for (let i = 0; i < testPlayers.length; i++) {
      const player = testPlayers[i]
      await controlPageTab.fill(
        `[data-testid="textform-mcList.${i}.team"]`,
        player.team
      )
      await controlPageTab.fill(
        `[data-testid="textform-mcList.${i}.playerName"]`,
        player.playerName
      )
      await controlPageTab.fill(
        `[data-testid="textform-mcList.${i}.twitterID"]`,
        player.twitterID
      )
    }

    // Submit the form to apply all changes
    await controlPageTab.getByRole("button", { name: "適用する" }).click()
    await waitForRealtimeUpdate(obsPageTab)

    // Verify all MC entries
    for (let i = 0; i < testPlayers.length; i++) {
      const player = testPlayers[i]
      const mcText = await mcPage.getMCText(i + 1)
      expect(mcText).toContain(player.playerName)
    }

    // Clean up
    await context1.close()
    await context2.close()
  })

  test.skip("ブラケット情報がコントロールからOBSブラケット画面に同期される", async ({
    browser,
  }) => {
    // Skip this test as bracket functionality is primarily Start.gg integration
    // The bracket page doesn't have manual input fields, only auto-update from Start.gg
    test.skip()
  })

  test("次の試合情報がコントロールからOBS Next画面に同期される", async ({
    browser,
  }) => {
    // Open control page in first tab
    const context1 = await browser.newContext()
    const controlPageTab = await context1.newPage()
    const controlPage = new ControlPage(controlPageTab)
    await controlPage.goto(roomId)
    await controlPage.selectTab("Next")

    // Open OBS next page in second tab
    const context2 = await browser.newContext()
    const obsPageTab = await context2.newPage()
    const nextPage = new NextPage(obsPageTab)
    await nextPage.goto(roomId)

    // Test next match player updates using TextForm naming convention
    await controlPageTab.fill(
      '[data-testid="textform-p1.playerName"]',
      "NextPlayer1"
    )
    await controlPageTab.fill('[data-testid="textform-p1.team"]', "TeamNext1")
    await controlPageTab.fill(
      '[data-testid="textform-p2.playerName"]',
      "NextPlayer2"
    )
    await controlPageTab.fill('[data-testid="textform-p2.team"]', "TeamNext2")

    // Submit the form to apply changes
    await controlPageTab.getByRole("button", { name: "適用する" }).click()
    await waitForRealtimeUpdate(obsPageTab)

    // Check if the next match players are displayed correctly
    const nextPlayers = await nextPage.getNextMatchPlayers()
    expect(nextPlayers.player1).toContain("NextPlayer1")
    expect(nextPlayers.player2).toContain("NextPlayer2")

    // Test "Show current match" checkbox
    // Click the label with text instead of the checkbox directly (as checkbox might be visually hidden)
    await controlPageTab.getByText("現在の試合状況を表示する").click()
    // Submit the form to apply checkbox change
    await controlPageTab.getByRole("button", { name: "適用する" }).click()
    await waitForRealtimeUpdate(obsPageTab)

    // Clean up
    await context1.close()
    await context2.close()
  })

  test("複数のOBSページが同時に同期される", async ({ browser }) => {
    // Open control page
    const controlContext = await browser.newContext()
    const controlPageTab = await controlContext.newPage()
    const controlPage = new ControlPage(controlPageTab)
    await controlPage.goto(roomId)

    // Open all OBS pages
    const obsContexts = []
    const obsPages = []

    // Score page
    const scoreContext = await browser.newContext()
    const scorePageTab = await scoreContext.newPage()
    const scorePage = new ScorePage(scorePageTab)
    await scorePage.goto(roomId)
    obsContexts.push(scoreContext)
    obsPages.push(scorePageTab)

    // MC page
    const mcContext = await browser.newContext()
    const mcPageTab = await mcContext.newPage()
    const mcPage = new MCPage(mcPageTab)
    await mcPage.goto(roomId)
    obsContexts.push(mcContext)
    obsPages.push(mcPageTab)

    // Update player names and verify on score page
    await controlPage.setPlayer1Name("MultiTestPlayer1")
    await controlPage.setPlayer2Name("MultiTestPlayer2")
    // Submit the form to apply changes
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(scorePageTab)
    const p1NameMulti = await scorePage.getPlayer1Name()
    const p2NameMulti = await scorePage.getPlayer2Name()
    expect(p1NameMulti).toBe("MultiTestPlayer1")
    expect(p2NameMulti).toBe("MultiTestPlayer2")

    // Switch to MC tab and update MC text
    await controlPage.selectTab("MC")
    await controlPageTab.fill(
      '[data-testid="textform-mcList.0.playerName"]',
      "Simultaneous update test"
    )
    // Submit the form to apply changes
    await controlPageTab.getByRole("button", { name: "適用する" }).click()
    await waitForRealtimeUpdate(mcPageTab)
    const mcText = await mcPage.getMCText(1)
    expect(mcText).toContain("Simultaneous update test")

    // Verify score page is still showing correct data
    const p1NameCheck = await scorePage.getPlayer1Name()
    expect(p1NameCheck).toBe("MultiTestPlayer1")

    // Clean up
    await controlContext.close()
    for (const context of obsContexts) {
      await context.close()
    }
  })

  test("OBSページが高速な更新を正しく処理できる", async ({ browser }) => {
    // Open control and OBS score pages
    const context1 = await browser.newContext()
    const controlPageTab = await context1.newPage()
    const controlPage = new ControlPage(controlPageTab)
    await controlPage.goto(roomId)

    const context2 = await browser.newContext()
    const obsPageTab = await context2.newPage()
    const scorePage = new ScorePage(obsPageTab)
    await scorePage.goto(roomId)

    // Rapid score updates
    for (let i = 0; i < 5; i++) {
      await controlPage.incrementPlayer1Score()
    }
    // Submit the form to apply score changes
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(obsPageTab)
    const rapidScore = await scorePage.getPlayer1Score()
    expect(rapidScore).toBe(5)

    // Rapid name changes
    const names = ["Alice", "Bob", "Charlie", "David", "Eve"]
    for (const name of names) {
      await controlPage.setPlayer1Name(name)
    }
    // Submit the form to apply final name change
    await controlPageTab.getByTestId("score-submit").click()
    await waitForRealtimeUpdate(obsPageTab)
    const finalName = await scorePage.getPlayer1Name()
    expect(finalName).toBe("Eve")

    // Clean up
    await context1.close()
    await context2.close()
  })
})
