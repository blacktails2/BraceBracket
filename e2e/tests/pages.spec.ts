import { expect, test } from "../support/fixtures"
import { expectImageLoaded } from "../support/obs"

/**
 * トップページ・使い方・ヘルプなどの静的ページと、全ページ共通の確認
 */

test.describe("静的ページ", () => {
  test("@cross-browser トップページが表示され、作成画面に進める", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(page).toHaveTitle(
      "BraceBracket – Webベースの対戦ゲーム用スコアボードツール"
    )
    await expect(
      page.getByRole("heading", { level: 1, name: /対戦ゲーム用スコアボード/ })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "4つの画面を編集・表示" })
    ).toBeVisible()
    for (const layout of [
      "Score Layout",
      "Interval Layout",
      "MC Layout",
      "Top8 Layout",
    ]) {
      await expect(
        page.getByRole("heading", { name: layout, exact: true })
      ).toBeVisible()
    }

    await page
      .getByRole("main")
      .getByRole("link", { name: "スコアボードを作成" })
      .click()
    await expect(page).toHaveURL(/\/create\/$/)
    await expect(
      page.getByRole("heading", { name: "スコアボードを作成", level: 2 })
    ).toBeVisible()
  })

  test("ヘッダーから使い方・ヘルプ・トップに移動できる", async ({ page }) => {
    await page.goto("/")
    const header = page.getByRole("banner")

    await header.getByRole("link", { name: "How to Use" }).click()
    await expect(page).toHaveURL(/\/usage\/$/)
    await expect(page).toHaveTitle("BraceBracket | How to Use")
    await expect(
      page.getByRole("heading", { name: "How to Use BraceBracket" })
    ).toBeVisible()

    await header.getByRole("link", { name: "Help", exact: true }).click()
    await expect(page).toHaveURL(/\/help\/$/)
    await expect(page).toHaveTitle("BraceBracket | Help")
    await expect(
      page.getByRole("heading", { name: "Help", exact: true })
    ).toBeVisible()

    await header.getByRole("link", { name: "スコアボードを作成" }).click()
    await expect(page).toHaveURL(/\/create\/$/)

    await header.getByRole("link").first().click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("ヘッダーの外部リンクは GitHub と Discord を指す", async ({ page }) => {
    await page.goto("/")
    const header = page.getByRole("banner")
    await expect(header.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/blacktails2/BraceBracket"
    )
    await expect(header.getByRole("link", { name: "Discord" })).toHaveAttribute(
      "href",
      "https://discord.gg/TgMFQEqxY9"
    )
    await expect(
      page.getByRole("contentinfo").getByText("Copyright 2022 BraceBracket")
    ).toBeVisible()
  })

  test("フッターのロゴ（SVG）と各ページの画像が読み込まれる", async ({
    page,
  }) => {
    for (const path of ["/", "/usage/", "/help/", "/create/"]) {
      await page.goto(path)
      const logo = page.getByRole("contentinfo").getByAltText("ロゴ")
      await logo.scrollIntoViewIfNeeded()
      await expectImageLoaded(logo)
    }
    // next/image で最適化される画像
    await page.goto("/")
    const sample = page.getByAltText(
      "プレイヤーとスコア、カメラを表示するScoreレイアウト"
    )
    await sample.scrollIntoViewIfNeeded()
    await expectImageLoaded(sample)
  })

  test("使い方ページの目次からページ内の項目にスクロールできる", async ({
    page,
  }) => {
    await page.goto("/usage/")
    const target = page.locator("#edit__mc")
    // 目次の項目は href の無い a 要素（react-scroll）
    await page.locator("a", { hasText: "編集画面: MC" }).click()
    await expect(target).toBeInViewport()
  })

  test("使い方ページのリンクからヘルプのカメラ配置の項目に移動できる", async ({
    page,
  }) => {
    await page.goto("/usage/")
    await page
      .locator("p", {
        hasText: "プレイヤーカメラをガイドに対して正確に配置したい時は",
      })
      .getByRole("link", { name: "こちら" })
      .click()
    await expect(page).toHaveURL(/\/help\/?#help-camera$/)
    await expect(page.locator("#help-camera")).toBeVisible()
  })

  test("作成画面のカメラ設定の「こちら」から使い方の該当箇所に移動できる", async ({
    page,
  }) => {
    await page.goto("/create/")
    await page
      .locator("label", { hasText: "カメラ及び選手のTwitter IDを表示する" })
      .getByRole("link", { name: "こちら" })
      .click()
    await expect(page).toHaveURL(/\/usage\/?#create__camera$/)
  })

  test("ヘルプページが表示される", async ({ page }) => {
    await page.goto("/help/")
    await expect(
      page.getByRole("heading", {
        name: "BraceBracketを使用するにあたり、使用許可や支払いなどは必要ですか？",
      })
    ).toBeVisible()
    await expect(page.locator("#help-camera")).toBeAttached()
    // マスク画像のダウンロードリンク
    const mask = page.locator('a[href="/image/bb_mask.png"][download]')
    await expect(mask).toHaveCount(1)
    expect((await page.request.get("/image/bb_mask.png")).status()).toBe(200)
  })

  test("存在しないページは404になる", async ({
    page,
    allowConsoleError,
    allowFailedResponse,
  }) => {
    allowConsoleError(/status of 404/)
    allowFailedResponse(/^404 GET .*\/not-found-page\/$/)
    const response = await page.goto("/not-found-page/")
    expect(response?.status()).toBe(404)
    await expect(page.getByText("404")).toBeVisible()
  })

  test("スマートフォン幅ではハンバーガーメニューからページを移動できる", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    const header = page.getByRole("banner")
    const usageInMenu = header.getByRole("listitem").getByRole("link", {
      name: "How to Use",
    })
    await expect(usageInMenu).toBeHidden()

    await header.locator('label[for="hamburgerMenu"]').click()
    await expect(usageInMenu).toBeVisible()
    await usageInMenu.click()
    await expect(page).toHaveURL(/\/usage\/$/)
  })
})

test.describe("全ページ共通", () => {
  const routes = [
    { path: "/", text: "スコアボード" },
    { path: "/usage/", text: "How to Use BraceBracket" },
    { path: "/help/", text: "Help" },
    { path: "/create/", text: "スコアボードを作成" },
    { path: "/links/", text: "ダッシュボード" },
    { path: "/control/", text: "" },
    // 配信画面はデータ取得後に描画するので静的HTMLには中身が無い
    { path: "/obs/score/", text: "" },
    { path: "/obs/next/", text: "" },
    { path: "/obs/mc/", text: "" },
    { path: "/obs/bracket/", text: "" },
  ]

  for (const { path, text } of routes) {
    test(`${path} はサーバーから200で静的HTMLが返る`, async ({ request }) => {
      const response = await request.get(path)
      expect(response.status()).toBe(200)
      expect(response.headers()["content-type"]).toContain("text/html")
      const html = await response.text()
      expect(html).toContain('<div id="__next"')
      if (text)
        expect(html.includes(text), `HTMLに「${text}」が含まれる`).toBe(true)
    })
  }

  test("末尾にスラッシュが無いURLはスラッシュ付きにリダイレクトされる", async ({
    request,
  }) => {
    const response = await request.get("/create", { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers()["location"]).toBe("/create/")
  })

  test("ページのHTMLは日本語（lang=ja）として配信される", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "ja")
  })

  test("ファビコンが読み込める", async ({ request }) => {
    for (const path of ["/favicon.svg", "/favicon.png"]) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
    }
  })
})
