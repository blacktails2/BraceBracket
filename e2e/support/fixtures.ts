import { test as base, expect, Page } from "@playwright/test"

import { E2E_PORT } from "./env"
import { StartGGMock } from "./startgg"

/**
 * 全テスト共通のフィクスチャ
 *
 * - 外部通信（Webフォント、start.gg、Twitter、Imgur）をモックし、テストを決定的にする
 * - ブラウザのコンソールログ・未捕捉の例外・同一オリジンの 4xx/5xx レスポンスを収集する
 *   - 未捕捉の例外と、画像・JS・CSS などの読み込み失敗があればテストを失敗させる
 *     （ライブラリ更新時のハイドレーションエラーや静的ファイルのパス変更などを検知するため）
 *   - テストが失敗したときはログをコンソールに出力する
 */

type Diagnostics = {
  logs: string[]
  pageErrors: string[]
  failedResponses: string[]
  consoleErrors: string[]
}

type Fixtures = {
  startgg: StartGGMock
  diagnostics: Diagnostics
  /** 想定内のコンソールエラー（正規表現）を登録する */
  allowConsoleError: (pattern: RegExp) => void
  /** 想定内の 4xx/5xx レスポンス（"404 GET http://..." 形式に対する正規表現）を登録する */
  allowFailedResponse: (pattern: RegExp) => void
}

const ORIGIN = `http://localhost:${E2E_PORT}`

/** 既知の、無害なコンソールエラー */
const DEFAULT_ALLOWED_CONSOLE_ERRORS: RegExp[] = []

export const IMGUR_UPLOADED_LOGO = `${ORIGIN}/image/logo.png`

const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
)

export const test = base.extend<Fixtures>({
  diagnostics: async ({}, use) => {
    await use({
      logs: [],
      pageErrors: [],
      failedResponses: [],
      consoleErrors: [],
    })
  },

  startgg: async ({}, use) => {
    await use(new StartGGMock())
  },

  allowConsoleError: async ({}, use) => {
    await use((pattern) => {
      allowedConsoleErrors.push(pattern)
    })
  },

  allowFailedResponse: async ({}, use) => {
    await use((pattern) => {
      allowedFailedResponses.push(pattern)
    })
  },

  context: async ({ context, startgg, diagnostics }, use, testInfo) => {
    // Webフォント（CSS・JS）は空のレスポンスにする
    await context.route(
      /^https:\/\/(api\.fontshare\.com|fonts\.googleapis\.com|webfont\.fontplus\.jp)\//,
      (route) =>
        route.fulfill({
          status: 200,
          contentType: route.request().url().includes("fontplus")
            ? "application/javascript"
            : "text/css",
          body: "",
        })
    )
    await context.route(/^https:\/\/fonts\.gstatic\.com\//, (route) =>
      route.fulfill({ status: 200, contentType: "font/woff2", body: "" })
    )
    // 外部の画像（Buy Me a Coffee のボタン）は 1x1 の透明PNGにする
    await context.route(/^https:\/\/cdn\.buymeacoffee\.com\//, (route) =>
      route.fulfill({
        status: 200,
        contentType: "image/png",
        body: TRANSPARENT_PNG,
      })
    )
    // ツイート画面（ポップアップ）
    await context.route(/^https:\/\/(twitter|x)\.com\//, (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>tweet</body></html>",
      })
    )
    // Imgur へのロゴアップロード
    await context.route(/^https:\/\/api\.imgur\.com\//, (route) => {
      if (route.request().method() === "OPTIONS") {
        return route.fulfill({
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
          },
        })
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          data: { link: IMGUR_UPLOADED_LOGO },
          success: true,
          status: 200,
        }),
      })
    })
    await startgg.install(context)

    const watch = (page: Page) => {
      const label = () => {
        try {
          return new URL(page.url()).pathname
        } catch {
          return page.url()
        }
      }
      page.on("console", (msg) => {
        // フォントをモックしているため必ず出る警告は記録しない
        if (
          /Failed to decode downloaded font|downloadable font:/.test(msg.text())
        )
          return
        const location = msg.location().url
        const text = location ? `${msg.text()} @ ${location}` : msg.text()
        diagnostics.logs.push(`[${msg.type()}] (${label()}) ${text}`)
        if (msg.type() === "error") diagnostics.consoleErrors.push(text)
      })
      page.on("pageerror", (error) => {
        const line = `${error.name}: ${error.message}\n${error.stack ?? ""}`
        diagnostics.logs.push(`[pageerror] (${label()}) ${line}`)
        diagnostics.pageErrors.push(line)
      })
      page.on("response", (res) => {
        if (!res.url().startsWith(ORIGIN)) return
        if (res.status() < 400) return
        const line = `${res.status()} ${res.request().method()} ${res.url()}`
        diagnostics.logs.push(`[response] ${line}`)
        diagnostics.failedResponses.push(line)
      })
      page.on("requestfailed", (req) => {
        diagnostics.logs.push(
          `[requestfailed] ${req.url()} ${req.failure()?.errorText ?? ""}`
        )
      })
    }
    context.pages().forEach(watch)
    context.on("page", watch)

    await use(context)

    if (testInfo.status !== testInfo.expectedStatus) {
      // 失敗時の手がかりとしてブラウザのログをコンソールに出す
      console.log(
        `\n----- browser logs: ${testInfo.titlePath.join(" > ")} -----\n` +
          diagnostics.logs.join("\n") +
          "\n----- end of browser logs -----\n"
      )
    }
    await testInfo.attach("browser-logs", {
      body: diagnostics.logs.join("\n"),
      contentType: "text/plain",
    })
  },
})

let allowedConsoleErrors: RegExp[] = [...DEFAULT_ALLOWED_CONSOLE_ERRORS]
let allowedFailedResponses: RegExp[] = []

test.beforeEach(() => {
  allowedConsoleErrors = [...DEFAULT_ALLOWED_CONSOLE_ERRORS]
  allowedFailedResponses = []
})

test.afterEach(async ({ diagnostics }) => {
  expect
    .soft(diagnostics.pageErrors, "ブラウザで未捕捉の例外が発生していないこと")
    .toEqual([])
  expect
    .soft(
      diagnostics.failedResponses.filter(
        (line) => !allowedFailedResponses.some((pattern) => pattern.test(line))
      ),
      "同一オリジンのリソースの読み込みに失敗していないこと"
    )
    .toEqual([])
  const unexpectedConsoleErrors = diagnostics.consoleErrors.filter(
    (text) => !allowedConsoleErrors.some((pattern) => pattern.test(text))
  )
  expect
    .soft(unexpectedConsoleErrors, "想定外のコンソールエラーが出ていないこと")
    .toEqual([])
})

export { expect }
