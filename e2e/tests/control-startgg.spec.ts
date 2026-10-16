import { ControlPage } from "../support/control"
import { seedTournament } from "../support/data"
import { dbGet } from "../support/db"
import { expect, test } from "../support/fixtures"
import { BRACKET_URL } from "../support/startgg"

import type { Score } from "../../libs/const"

/**
 * 操作画面: start.gg 連携（配信台の試合一覧・入力補完）
 * start.gg の API はモック（e2e/support/startgg.ts）に置き換えている。
 */

const seedIntegrated = () =>
  seedTournament({
    setting: {
      integrateStartGG: { enabled: true, url: BRACKET_URL },
      scoreboard: { cameraAndLogo: { displayCameraAndTwitterID: true } },
    },
  })

test.describe("操作画面 start.gg連携", () => {
  test("連携していない大会では試合一覧が表示されず、APIも呼ばれない", async ({
    page,
    startgg,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await expect(control.panel.getByPlaceholder("検索")).toHaveCount(0)
    await expect(control.panel.locator("table")).toHaveCount(0)
    expect(startgg.calls).toEqual([])
  })

  test("参加者一覧を取得して名前・チームの入力補完に使う", async ({
    page,
    startgg,
  }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)

    await expect
      .poll(() => startgg.callCount("getAttendee"))
      .toBeGreaterThanOrEqual(1)
    const names = page.locator("datalist#playerName option")
    await expect(names).toHaveCount(6)
    await expect(
      page.locator('datalist#playerName option[value="Alice"]')
    ).toHaveCount(1)
    // 重複したチーム名はまとめられる（チームなしの "" を含む）
    await expect(page.locator('datalist#team option[value="RED"]')).toHaveCount(
      1
    )
    await expect(control.input("1P Player")).toHaveAttribute(
      "list",
      "playerName"
    )
    await expect(control.input("1P Team")).toHaveAttribute("list", "team")
  })

  test("更新ボタンで配信台の試合一覧を取得して表示する", async ({
    page,
    startgg,
  }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)

    await expect(control.queueRows).toHaveCount(0)
    await control.refreshQueueButton.click()

    await expect(control.queueRows).toHaveCount(3)
    await expect(control.queueRows.nth(0)).toContainText("Winners Semis")
    await expect(control.queueRows.nth(0)).toContainText("RED | Alice")
    await expect(control.queueRows.nth(0)).toContainText("Bob")
    await expect(control.queueRows.nth(0)).toContainText("bb_stream")
    await expect(control.queueRows.nth(0)).toContainText("In Progress")
    await expect(control.queueRows.nth(1)).toContainText("Losers Finals")
    await expect(control.queueRows.nth(1)).toContainText("In Queue")
    // 配信台に割り当てられていない試合はラウンド名を順位から作る
    await expect(control.queueRows.nth(2)).toContainText("Winners Top32")
    await expect(control.queueRows.nth(2)).toContainText("GREEN | Frank")
    await expect(control.queueRows.nth(2)).toContainText("Waiting")
    await expect(
      control.panel.locator("th", { hasText: "STREAM" })
    ).toBeVisible()
    expect(startgg.callCount("StreamQueueOnTournament")).toBe(1)
  })

  test("試合を選ぶとプレイヤー・Twitter ID・ラウンドがフォームに反映される", async ({
    page,
  }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.refreshQueueButton.click()

    await control.queueRows.filter({ hasText: "Losers Finals" }).click()

    await expect(control.input("1P Team")).toHaveValue("BLUE")
    await expect(control.input("1P Player")).toHaveValue("Carol")
    await expect(control.input("@1PTwitterID")).toHaveValue("carol_tw")
    await expect(control.input("2P Team")).toHaveValue("")
    await expect(control.input("2P Player")).toHaveValue("Dave")
    await expect(control.input("@2PTwitterID")).toHaveValue("")
    await expect(control.input("Grand Final")).toHaveValue("Losers Finals")
    await expect(
      control.queueRows.filter({ hasText: "Losers Finals" }).getByRole("radio")
    ).toBeChecked()

    await control.apply()
    await expect
      .poll(() => dbGet<Score>(`tournaments/${id}/score`))
      .toMatchObject({
        round: "Losers Finals",
        p1: { team: "BLUE", playerName: "Carol", twitterID: "carol_tw" },
        p2: { team: "", playerName: "Dave" },
      })
  })

  test("「ラウンド名固定」をオンにすると試合を選んでもラウンド名が変わらない", async ({
    page,
  }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.input("Grand Final").fill("Top 8 Special")
    await control.refreshQueueButton.click()

    await control.checkboxLabel("ラウンド名固定").click()
    await control.queueRows.filter({ hasText: "Winners Semis" }).click()

    await expect(control.input("1P Player")).toHaveValue("Alice")
    await expect(control.input("Grand Final")).toHaveValue("Top 8 Special")
  })

  test("検索ボックスで試合一覧を絞り込める", async ({ page }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.refreshQueueButton.click()
    await expect(control.queueRows).toHaveCount(3)

    await control.panel.getByPlaceholder("検索").fill("carol")
    await expect(control.queueRows).toHaveCount(1)
    await expect(control.queueRows).toContainText("Losers Finals")

    await control.panel.getByPlaceholder("検索").fill("waiting")
    await expect(control.queueRows).toHaveCount(1)
    await expect(control.queueRows).toContainText("Frank")

    await control.panel.getByPlaceholder("検索").fill("")
    await expect(control.queueRows).toHaveCount(3)
  })

  test("Scoreタブの「自動反映」は一覧の先頭の試合を反映する", async ({
    page,
  }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.refreshQueueButton.click()
    await expect(control.queueRows).toHaveCount(3)

    await control.checkboxLabel("自動反映").click()

    await expect(control.input("1P Player")).toHaveValue("Alice")
    await expect(control.input("2P Player")).toHaveValue("Bob")
    await expect(control.input("Grand Final")).toHaveValue("Winners Semis")

    // 手で入力すると自動反映は解除される
    await control.input("1P Player").fill("Manual")
    await expect(control.checkbox("自動反映")).not.toBeChecked()
  })

  test("Intervalタブの「自動反映」は進行中ではない最初の試合を反映する", async ({
    page,
  }) => {
    const id = await seedIntegrated()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("Interval")
    await control.refreshQueueButton.click()
    await expect(control.queueRows).toHaveCount(3)

    await control.checkboxLabel("自動反映").click()

    await expect(control.input("1P Player")).toHaveValue("Carol")
    await expect(control.input("2P Player")).toHaveValue("Dave")
    await expect(control.input("Grand Final")).toHaveValue("Losers Finals")
  })

  test("APIがエラーを返しても画面は壊れず一覧が空になる", async ({
    page,
    startgg,
    allowConsoleError,
  }) => {
    allowConsoleError(/^JSHandle@array|mocked error|Array/)
    const id = await seedIntegrated()
    startgg.fail = true
    const control = new ControlPage(page)
    await control.goto(id)
    await control.refreshQueueButton.click()

    await expect
      .poll(() => startgg.callCount("StreamQueueOnTournament"))
      .toBe(1)
    await expect(control.queueRows).toHaveCount(0)
    await expect(control.input("1P Player")).toBeEditable()
  })
})
