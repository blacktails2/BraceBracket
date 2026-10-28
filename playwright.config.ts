import { defineConfig, devices } from "@playwright/test"

import { DATABASE_EMULATOR_HOST, E2E_PORT } from "./e2e/support/env"

/**
 * E2Eテストの設定
 *
 * - Firebase Realtime Database は本番ではなくローカルのエミュレータ（firebase.json で設定）を使う
 * - Next.js は本番相当のビルド（next build && next start）に対してテストする
 *   E2E_SKIP_BUILD=1 を指定すると既存のビルド成果物を使って起動のみ行う
 *   E2E_DEV=1 を指定すると開発サーバー（next dev）に対してテストする
 * - start.gg / Imgur / Webフォントなどの外部通信はすべてテスト側でモックする（e2e/support/fixtures.ts）
 *
 * プロジェクト:
 * - chromium: 機能テスト一式（OBSのブラウザソースは Chromium ベースのため主対象）
 * - firefox / webkit: 操作画面など人が触る画面のクロスブラウザ確認（@cross-browser タグのみ）
 * - visual: 見た目の回帰テスト（@visual タグのみ。スクリーンショットはOSごとに保存される）
 */
const baseURL = `http://localhost:${E2E_PORT}`

const nextCommand = process.env.E2E_DEV
  ? `next dev -p ${E2E_PORT}`
  : process.env.E2E_SKIP_BUILD
  ? `next start -p ${E2E_PORT}`
  : `next build && next start -p ${E2E_PORT}`

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // フォントのアンチエイリアス程度の差は許容する
      maxDiffPixelRatio: 0.002,
    },
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "ja-JP",
    timezoneId: "Asia/Tokyo",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@visual/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      grep: /@cross-browser/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      grep: /@cross-browser/,
    },
    {
      name: "visual",
      use: { ...devices["Desktop Chrome"], deviceScaleFactor: 1 },
      grep: /@visual/,
    },
  ],
  webServer: [
    {
      command: `firebase emulators:start --only database --project bracebracket-24d9f`,
      url: `http://${DATABASE_EMULATOR_HOST}/.json`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: "pipe",
    },
    {
      command: nextCommand,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      stdout: "pipe",
      env: {
        NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST: DATABASE_EMULATOR_HOST,
      },
    },
  ],
})
