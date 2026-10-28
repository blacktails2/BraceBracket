import { seedTournament } from "../support/data"
import { dbUpdate } from "../support/db"
import { expect, test } from "../support/fixtures"
import { expectImageLoaded, imageBySrc, OBS_VIEWPORT } from "../support/obs"
import { BRACKET_URL } from "../support/startgg"
import { watchDatabaseSync } from "../support/sync"

import type { Page } from "@playwright/test"

/**
 * 配信画面: Top8 トーナメント表（/obs/bracket）
 * トーナメント表の中身は start.gg（モック）から取得する。
 */

test.use({ viewport: OBS_VIEWPORT })

// 実運用では大会作成後に一度は更新要求が出ている状態を想定する
const PAST_REQUEST = 1

const seedIntegrated = (layout = "dual", color = "dark_color") =>
  seedTournament({
    setting: {
      integrateStartGG: { enabled: true, url: BRACKET_URL },
      scoreboard: { design: { layout, color } },
    },
    loadBracket: { lastRequestedAt: PAST_REQUEST },
  })

const requestLoad = (id: string, autoUpdate = false) =>
  dbUpdate(`tournaments/${id}/loadBracket`, {
    lastRequestedAt: Date.now(),
    autoUpdate,
  })

/**
 * 配信画面を開き、DB の設定と更新要求を受け取り終えるまで待つ。
 * 受け取る前に更新要求を出したり時計を進めたりすると、取得処理やタイマーの登録と競合するため。
 */
const openBracket = async (page: Page, id: string) => {
  const synced = watchDatabaseSync(page, id, ["setting", "loadBracket"])
  await page.goto(`/obs/bracket/?id=${id}`)
  await synced()
  await expectImageLoaded(imageBySrc(page, "/image/bracket/brackets.png"))
}

/** トーナメント表の枠（プレイヤー名を含むボックス）の位置 */
const boxPosition = (page: Page, name: string) =>
  page
    .getByText(name, { exact: true })
    .first()
    .locator("xpath=ancestor::div[contains(@style, 'top')][1]")

test.describe("配信画面 Top8", () => {
  for (const [layout, color, file] of [
    ["dual", "dark_color", "brackets.png"],
    ["single", "light_mono", "brackets.png"],
    ["simple", "white", "brackets_simple.png"],
  ]) {
    test(`${layout}/${color} のときは ${file} を背景に使う`, async ({
      page,
    }) => {
      const id = await seedIntegrated(layout, color)
      await page.goto(`/obs/bracket/?id=${id}`)
      await expect(page).toHaveTitle("BraceBracket | Bracket Layout")
      await expectImageLoaded(imageBySrc(page, `/image/bracket/${file}`))
    })
  }

  test("ページを開いただけでは start.gg から取得しない", async ({
    page,
    startgg,
  }) => {
    const id = await seedIntegrated()
    await openBracket(page, id)
    // 取得処理が走る猶予を置いても呼ばれない
    await page.waitForTimeout(1_000)
    expect(startgg.callCount("PhaseGroupSets")).toBe(0)
    await expect(page.getByText("Alice")).toHaveCount(0)
  })

  test("更新要求を受けると start.gg から取得してTop8を表示する", async ({
    page,
    startgg,
  }) => {
    const id = await seedIntegrated()
    await openBracket(page, id)

    await requestLoad(id)

    await expect(page.getByText("Alice", { exact: true }).first()).toBeVisible()
    expect(startgg.callCount("PhaseGroupSets")).toBe(1)

    // 各ラウンドの試合数ぶんの枠が表示される（Losers Round 1 は最大の Losers Round ではないので出ない）
    await expect(page.getByText("Ivan", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Judy", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Grace", { exact: true })).toBeVisible()
    await expect(page.getByText("Heidi", { exact: true })).toBeVisible()
    // チームタグは名前と分けて表示される
    await expect(page.getByText("RED", { exact: true }).first()).toBeVisible()

    // Grand Final・Losers Round の枠は決められた位置に置かれる
    await expect(boxPosition(page, "Grace")).toHaveCSS("left", "117px")
    await expect(boxPosition(page, "Grace")).toHaveCSS("top", "524px")
    await expect(boxPosition(page, "Heidi")).toHaveCSS("top", "678px")
  })

  test("連携していない大会では更新要求があっても取得しない", async ({
    page,
    startgg,
  }) => {
    const id = await seedTournament({
      loadBracket: { lastRequestedAt: PAST_REQUEST },
    })
    await openBracket(page, id)

    await requestLoad(id)
    await page.waitForTimeout(1_000)
    expect(startgg.callCount("PhaseGroupSets")).toBe(0)
  })

  test("自動更新がオンのときは10秒ごとに取得し直す", async ({
    page,
    startgg,
  }) => {
    const id = await seedTournament({
      setting: { integrateStartGG: { enabled: true, url: BRACKET_URL } },
      loadBracket: { lastRequestedAt: PAST_REQUEST, autoUpdate: true },
    })
    await page.clock.install()
    await openBracket(page, id)

    await page.clock.runFor(10_500)
    await expect.poll(() => startgg.callCount("PhaseGroupSets")).toBe(1)
    await expect(page.getByText("Grace", { exact: true })).toBeVisible()

    startgg.bracket = startgg.bracket.map((s) =>
      s.p2.name === "Grace" ? { ...s, p2: { ...s.p2, name: "Grace2" } } : s
    )
    await page.clock.runFor(10_500)
    await expect.poll(() => startgg.callCount("PhaseGroupSets")).toBe(2)
    await expect(page.getByText("Grace2", { exact: true })).toBeVisible()
  })
})
