import { seedTournament } from "../support/data"
import { dbUpdate } from "../support/db"
import { expect, test } from "../support/fixtures"
import {
  expectImageLoaded,
  imageBySrc,
  leftOf,
  OBS_VIEWPORT,
} from "../support/obs"

/**
 * 配信画面: 試合間の情報（/obs/next）
 */

test.use({ viewport: OBS_VIEWPORT })

const nextMatch = {
  round: "Losers Semis",
  matchType: "Best of 3",
  p1: { team: "RED", playerName: "Carol", score: 0 },
  p2: { team: "BLUE", playerName: "Dave", score: 0 },
}

test.describe("配信画面 Interval", () => {
  test("次の試合の情報と NEXT 表示が出る", async ({ page }) => {
    const id = await seedTournament({ matchIntervalInfo: nextMatch })
    await page.goto(`/obs/next/?id=${id}`)

    await expect(page).toHaveTitle("BraceBracket | Next Layout")
    await expect(page.getByText("NEXT", { exact: true })).toBeVisible()
    await expect(page.getByText("Carol", { exact: true })).toBeVisible()
    await expect(page.getByText("RED", { exact: true })).toBeVisible()
    await expect(page.getByText("Dave", { exact: true })).toBeVisible()
    await expect(page.getByText("BLUE", { exact: true })).toBeVisible()
    await expect(page.getByText("Losers Semis")).toBeVisible()
    await expect(page.getByText("Best of 3")).toBeVisible()
    expect(await leftOf(page.getByText("Carol", { exact: true }))).toBeLessThan(
      await leftOf(page.getByText("Dave", { exact: true }))
    )
  })

  test("現在時刻（JST）を HH:MM 形式で表示する", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-17T09:05:00+09:00"))
    const id = await seedTournament()
    await page.goto(`/obs/next/?id=${id}`)

    await expect(page.getByText("Local Time")).toBeVisible()
    await expect(page.getByText("09:05", { exact: true })).toBeVisible()
  })

  test("「現在の試合状況を表示する」がオンのときは NOW 表示でスコアボードの内容を出す", async ({
    page,
  }) => {
    const id = await seedTournament({
      matchIntervalInfo: { ...nextMatch, isNow: true },
      score: {
        round: "Grand Finals",
        matchType: "Best of 5",
        uppercase: true,
        p1: { team: "", playerName: "Alice", score: 2 },
        p2: { team: "", playerName: "Bob", score: 1 },
      },
    })
    await page.goto(`/obs/next/?id=${id}`)

    await expect(page.getByText("NOW", { exact: true })).toBeVisible()
    await expect(page.getByText("Alice", { exact: true })).toBeVisible()
    await expect(page.getByText("Bob", { exact: true })).toBeVisible()
    await expect(page.getByText("2", { exact: true })).toBeVisible()
    await expect(page.getByText("1", { exact: true })).toBeVisible()
    await expect(page.getByText("Grand Finals")).toHaveCSS(
      "text-transform",
      "uppercase"
    )
    await expect(page.getByText("Carol")).toHaveCount(0)

    // NOW 表示中はスコアボードの更新に追従する
    await dbUpdate(`tournaments/${id}/score/p1`, { score: 3 })
    await expect(page.getByText("3", { exact: true })).toBeVisible()
  })

  test("NOW から NEXT に戻すと次の試合の情報に切り替わる", async ({ page }) => {
    const id = await seedTournament({
      matchIntervalInfo: { ...nextMatch, isNow: true },
      score: { p1: { playerName: "Alice" } },
    })
    await page.goto(`/obs/next/?id=${id}`)
    await expect(page.getByText("Alice", { exact: true })).toBeVisible()

    await dbUpdate(`tournaments/${id}/matchIntervalInfo`, { isNow: false })
    await expect(page.getByText("NEXT", { exact: true })).toBeVisible()
    await expect(page.getByText("Carol", { exact: true })).toBeVisible()
    await expect(page.getByText("Alice", { exact: true })).toHaveCount(0)
  })

  test("「全て大文字にする」がオフのときはそのまま表示される", async ({
    page,
  }) => {
    const id = await seedTournament({ matchIntervalInfo: nextMatch })
    await page.goto(`/obs/next/?id=${id}`)
    await expect(page.getByText("Losers Semis")).toHaveCSS(
      "text-transform",
      "none"
    )
  })

  for (const [layout, color, file] of [
    ["dual", "dark_color", "upnext_dark.png"],
    ["dual", "gradient", "upnext_dark.png"],
    ["single", "light_mono", "upnext_light.png"],
    ["solid", "beige", "upnext_dark.png"],
    ["simple", "white", "upnext_simple_white.png"],
    ["simple", "black", "upnext_simple_black.png"],
  ]) {
    test(`${layout}/${color} のときは ${file} を背景に使う`, async ({
      page,
    }) => {
      const id = await seedTournament({
        setting: { scoreboard: { design: { layout, color } } },
        matchIntervalInfo: nextMatch,
      })
      await page.goto(`/obs/next/?id=${id}`)
      await expectImageLoaded(imageBySrc(page, `/image/next/${file}`))
      await expect(page.getByText("Carol", { exact: true })).toBeVisible()
    })
  }
})
