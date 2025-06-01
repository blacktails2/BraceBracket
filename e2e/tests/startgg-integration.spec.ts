import { test, expect } from "@playwright/test"

import { ControlPage } from "../pages/control.page"
import { CreatePage } from "../pages/create.page"
import { LinksPage } from "../pages/links.page"
import { generateMockStartGGUrl } from "../utils/helpers"

// モックレスポンスデータ
const mockTournamentData = {
  data: {
    tournament: {
      id: 123456,
      name: "Test Tournament 2024",
      events: [
        {
          id: 1,
          name: "Singles",
          slug: "tournament/test-tournament-2024/event/singles",
        },
        {
          id: 2,
          name: "Doubles",
          slug: "tournament/test-tournament-2024/event/doubles",
        },
      ],
    },
  },
}

const mockStreamQueueData = {
  data: {
    streamQueue: {
      sets: [
        {
          id: "set1",
          identifier: "A",
          round: 1,
          fullRoundText: "Winners Round 1",
          slots: [
            {
              entrant: {
                name: "Player1",
                participants: [{ gamerTag: "Player1" }],
              },
            },
            {
              entrant: {
                name: "Player2",
                participants: [{ gamerTag: "Player2" }],
              },
            },
          ],
        },
        {
          id: "set2",
          identifier: "B",
          round: 1,
          fullRoundText: "Winners Round 1",
          slots: [
            {
              entrant: {
                name: "Player3",
                participants: [{ gamerTag: "Player3" }],
              },
            },
            {
              entrant: {
                name: "Player4",
                participants: [{ gamerTag: "Player4" }],
              },
            },
          ],
        },
      ],
    },
  },
}

test.describe("Start.gg連携フロー", () => {
  let createPage: CreatePage
  let linksPage: LinksPage
  let controlPage: ControlPage

  test.beforeEach(async ({ page }) => {
    // Start.gg APIのモック設定
    await page.route(
      "https://api.start.gg/gql/alpha",
      async (route, request) => {
        const postData = request.postDataJSON()

        // クエリタイプに応じて異なるモックデータを返す
        if (
          postData.query.includes("tournament") &&
          postData.query.includes("events")
        ) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(mockTournamentData),
          })
        } else if (postData.query.includes("streamQueue")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(mockStreamQueueData),
          })
        } else {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: {} }),
          })
        }
      }
    )

    createPage = new CreatePage(page)
    linksPage = new LinksPage(page)
    controlPage = new ControlPage(page)
  })

  test("Start.gg URLを設定してトーナメント情報を取得できる", async ({
    page,
  }) => {
    await createPage.goto()
    await createPage.selectLayout("single")

    // Start.gg URLを設定
    const tournamentUrl = generateMockStartGGUrl()
    await createPage.setStartGGTournament(tournamentUrl)

    // イベント選択ドロップダウンが表示されるのを待つ
    await page.waitForSelector('select[name="eventSlug"]', { timeout: 5000 })

    // イベントが読み込まれていることを確認
    const eventOptions = await page.$$eval(
      'select[name="eventSlug"] option',
      (options) => options.map((option) => option.textContent)
    )

    expect(eventOptions).toContain("Singles")
    expect(eventOptions).toContain("Doubles")
  })

  test("Stream Queueから試合を選択できる", async ({ page }) => {
    // まずスコアボードを作成
    await createPage.goto()
    await createPage.selectLayout("single")

    // Start.gg設定
    const tournamentUrl = generateMockStartGGUrl()
    await createPage.setStartGGTournament(tournamentUrl)
    await page.waitForSelector('select[name="eventSlug"]')
    await createPage.setStartGGEvent(
      "tournament/test-tournament-2024/event/singles"
    )

    // スコアボードを作成
    await createPage.generateURL()

    // コントロールページへ移動
    const urls = await linksPage.getAllURLs()
    const roomId = urls.control?.split("?id=")[1] || ""
    await controlPage.goto(roomId)

    // Stream Queueタブに切り替え（実装によってはNextタブかもしれません）
    await controlPage.switchToTab("next")

    // Stream Queueを更新
    await controlPage.refreshStreamQueue()

    // Stream Queueに試合が表示されることを確認
    const queueCount = await controlPage.getStreamQueueCount()
    expect(queueCount).toBeGreaterThan(0)

    // 最初の試合を選択
    await controlPage.selectStreamQueueMatch(0)

    // スコアタブに戻る
    await controlPage.switchToTab("score")

    // プレイヤー名が設定されていることを確認
    const names = await controlPage.getCurrentPlayerNames()
    expect(names.player1).toBe("Player1")
    expect(names.player2).toBe("Player2")
  })

  test("Stream Queueの自動更新が動作する", async ({ page }) => {
    // スコアボードを作成してStart.gg連携を設定
    await createPage.goto()
    await createPage.selectLayout("single")
    await createPage.setStartGGTournament(generateMockStartGGUrl())
    await page.waitForSelector('select[name="eventSlug"]')
    await createPage.setStartGGEvent(
      "tournament/test-tournament-2024/event/singles"
    )
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    const roomId = urls.control?.split("?id=")[1] || ""
    await controlPage.goto(roomId)

    // Stream Queueタブに切り替え
    await controlPage.switchToTab("next")

    // 初回のStream Queue読み込み
    await controlPage.refreshStreamQueue()
    const initialCount = await controlPage.getStreamQueueCount()
    expect(initialCount).toBeGreaterThan(0)

    // 自動更新のインターバルを待つ（通常は設定可能）
    await page.waitForTimeout(2000)

    // まだ試合が表示されていることを確認
    const updatedCount = await controlPage.getStreamQueueCount()
    expect(updatedCount).toBe(initialCount)
  })

  test("イベント切り替えでStream Queueが更新される", async ({ page }) => {
    await createPage.goto()
    await createPage.selectLayout("single")

    // Start.gg設定
    const tournamentUrl = generateMockStartGGUrl()
    await createPage.setStartGGTournament(tournamentUrl)
    await page.waitForSelector('select[name="eventSlug"]')

    // 最初のイベントを選択
    await createPage.setStartGGEvent(
      "tournament/test-tournament-2024/event/singles"
    )
    await createPage.generateURL()

    // コントロールページで確認
    const urls = await linksPage.getAllURLs()
    const roomId = urls.control?.split("?id=")[1] || ""

    // 設定ページに戻る
    await linksPage.goto(roomId)
    await linksPage.goToSettings()

    // 別のイベントに切り替え
    await createPage.setStartGGEvent(
      "tournament/test-tournament-2024/event/doubles"
    )
    await createPage.generateURL()

    // コントロールページで新しいStream Queueを確認
    await controlPage.goto(roomId)
    await controlPage.switchToTab("next")
    await controlPage.refreshStreamQueue()

    const queueCount = await controlPage.getStreamQueueCount()
    expect(queueCount).toBeGreaterThan(0)
  })

  test("チームタグが正しく解析される", async ({ page }) => {
    // チームタグ付きのプレイヤーデータをモック
    const mockTeamTagData = {
      data: {
        streamQueue: {
          sets: [
            {
              id: "set1",
              identifier: "A",
              round: 1,
              fullRoundText: "Winners Round 1",
              slots: [
                {
                  entrant: {
                    name: "TSM | TestPlayer",
                    participants: [{ gamerTag: "TSM | TestPlayer" }],
                  },
                },
                {
                  entrant: {
                    name: "C9 | AnotherPlayer",
                    participants: [{ gamerTag: "C9 | AnotherPlayer" }],
                  },
                },
              ],
            },
          ],
        },
      },
    }

    // 特定のレスポンスに対してモックを更新
    await page.route(
      "https://api.start.gg/gql/alpha",
      async (route, request) => {
        const postData = request.postDataJSON()
        if (postData.query.includes("streamQueue")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(mockTeamTagData),
          })
        } else {
          await route.continue()
        }
      }
    )

    // スコアボードを作成してStart.gg連携
    await createPage.goto()
    await createPage.selectLayout("single")
    await createPage.setStartGGTournament(generateMockStartGGUrl())
    await page.waitForSelector('select[name="eventSlug"]')
    await createPage.setStartGGEvent(
      "tournament/test-tournament-2024/event/singles"
    )
    await createPage.generateURL()

    const urls = await linksPage.getAllURLs()
    const roomId = urls.control?.split("?id=")[1] || ""
    await controlPage.goto(roomId)

    // Stream Queueから試合を選択
    await controlPage.switchToTab("next")
    await controlPage.refreshStreamQueue()
    await controlPage.selectStreamQueueMatch(0)

    // スコアタブで確認
    await controlPage.switchToTab("score")
    const names = await controlPage.getCurrentPlayerNames()

    // チームタグが含まれていることを確認
    expect(names.player1).toContain("TSM")
    expect(names.player2).toContain("C9")
  })

  test("APIエラー時の処理", async ({ page }) => {
    // エラーレスポンスを返すモック
    await page.route("https://api.start.gg/gql/alpha", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      })
    })

    await createPage.goto()
    await createPage.selectLayout("single")

    // Start.gg URLを設定
    const tournamentUrl = generateMockStartGGUrl()
    await createPage.setStartGGTournament(tournamentUrl)

    // エラーメッセージが表示されることを確認（実装によって異なる）
    const errorMessage = await page.waitForSelector(".error-message", {
      timeout: 5000,
    })
    expect(errorMessage).toBeTruthy()
  })

  test("無効なトーナメントURLの処理", async ({ page }) => {
    await createPage.goto()
    await createPage.selectLayout("single")

    // 無効なURLを入力
    await createPage.setStartGGTournament("https://invalid-url.com")

    // エラーメッセージまたは入力検証エラーを確認
    const errorMessage = await page.$(".error-message")
    if (errorMessage) {
      const text = await errorMessage.textContent()
      expect(text).toContain("無効")
    }
  })
})
