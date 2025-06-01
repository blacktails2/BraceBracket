import { Page } from "@playwright/test"

/**
 * ランダムなルームIDを生成
 */
export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * 指定時間待機
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Firebase Realtime Databaseの更新を待つ
 */
export async function waitForRealtimeUpdate(page: Page): Promise<void> {
  // Firebase Realtime Databaseの更新には少し時間がかかるため
  await wait(1000)
}

/**
 * 複数のタブ/ウィンドウでテストする際のヘルパー
 */
export async function withNewPage<T>(
  page: Page,
  callback: (newPage: Page) => Promise<T>
): Promise<T> {
  const context = page.context()
  const newPage = await context.newPage()
  try {
    return await callback(newPage)
  } finally {
    await newPage.close()
  }
}

/**
 * テスト用のStart.gg URLを生成
 */
export function generateMockStartGGUrl(): string {
  return "https://start.gg/tournament/test-tournament/event/test-event"
}

/**
 * プレイヤー名のテストデータ
 */
export const testPlayers = {
  player1: "TestPlayer1",
  player2: "TestPlayer2",
  player3: "TestPlayer3",
  player4: "TestPlayer4",
  longName: "VeryLongPlayerNameThatMightCauseLayoutIssues",
  withTeamTag: "TSM | TestPlayer",
  japanese: "テストプレイヤー",
  withSpecialChars: "Test@Player#123",
}

/**
 * ラウンド名のテストデータ
 */
export const testRounds = {
  poolsA1: "Pools A1",
  winnersQuarter: "Winners Quarter-Final",
  winnersSemi: "Winners Semi-Final",
  winnersFinal: "Winners Final",
  losersFinal: "Losers Final",
  grandFinal: "Grand Final",
  grandFinalReset: "Grand Final Reset",
}

/**
 * カラーテーマのテストデータ
 */
export const testColors = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  dark: "#2C3E50",
  light: "#ECF0F1",
}

/**
 * スクリーンショットの保存
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  await page.screenshot({
    path: `e2e/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  })
}

/**
 * ビューポートサイズの設定
 */
export const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  obs: { width: 1920, height: 1080 },
}

/**
 * タイムアウト設定
 */
export const timeouts = {
  short: 5000,
  medium: 10000,
  long: 30000,
}

/**
 * エラーハンドリング用のヘルパー
 */
export async function expectNoConsoleErrors(page: Page): Promise<void> {
  const consoleErrors: string[] = []

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text())
    }
  })

  page.on("pageerror", (error) => {
    consoleErrors.push(error.message)
  })

  // テスト終了時にエラーがないことを確認
  process.on("beforeExit", () => {
    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${consoleErrors.join(", ")}`)
    }
  })
}
