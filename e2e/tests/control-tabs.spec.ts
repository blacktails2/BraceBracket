import { ControlPage } from "../support/control"
import { seedTournament } from "../support/data"
import { dbGet } from "../support/db"
import { expect, test } from "../support/fixtures"

import type { LoadBracket, MatchIntervalInfo, MC } from "../../libs/const"

/**
 * 操作画面: Interval / MC / Bracket タブ
 */

test.describe("操作画面 タブ切り替え", () => {
  test("@cross-browser タブを切り替えると対応する編集フォームだけが表示される", async ({
    page,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    // 初期表示は Score タブ
    await expect(control.scoreInput("p1")).toBeVisible()

    await control.openTab("Interval")
    await expect(control.checkbox("現在の試合状況を表示する")).toBeAttached()
    await expect(control.scoreInput("p1")).toHaveCount(0)

    await control.openTab("MC")
    await expect(control.panel.getByText("MC NO.1")).toBeVisible()
    await expect(control.panel.getByText("MC NO.4")).toBeVisible()

    await control.openTab("Bracket")
    await expect(
      control.panel.getByRole("button", {
        name: "start.ggから情報を取得し更新",
      })
    ).toBeVisible()

    await control.openTab("Score")
    await expect(control.scoreInput("p1")).toBeVisible()
  })

  test("タブを切り替えても適用前の入力内容は保持される", async ({ page }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await control.input("1P Player").fill("Keep me")
    await control.openTab("MC")
    await control.openTab("Score")
    await expect(control.input("1P Player")).toHaveValue("Keep me")
  })
})

test.describe("操作画面 Intervalタブ", () => {
  const getInfo = (id: string) =>
    dbGet<MatchIntervalInfo>(`tournaments/${id}/matchIntervalInfo`)

  test("次の試合の情報を入力して適用するとDBに保存される", async ({ page }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("Interval")

    await expect(control.input("1P Player")).toHaveValue("Player1")
    await control.input("1P Team").fill("RED")
    await control.input("1P Player").fill("Carol")
    await control.input("2P Team").fill("")
    await control.input("2P Player").fill("Dave")
    await control.chip("Losers").click()
    await control.chip("Finals").click()
    await control.chip("Best of 3").click()
    await control.checkboxLabel("全て大文字にする").click()

    await control.apply()

    await expect
      .poll(() => getInfo(id))
      .toMatchObject({
        isNow: false,
        round: "Losers Finals",
        matchType: "Best of 3",
        uppercase: true,
        p1: { team: "RED", playerName: "Carol" },
        p2: { team: "", playerName: "Dave" },
      })
  })

  test("「現在の試合状況を表示する」をオンにすると入力欄が薄くなり、DBに保存される", async ({
    page,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("Interval")

    const detail = control.panel.locator('[style*="opacity"]').first()
    await expect(detail).toHaveCSS("opacity", "1")

    await control.checkboxLabel("現在の試合状況を表示する").click()
    await expect(control.checkbox("現在の試合状況を表示する")).toBeChecked()
    await expect(detail).toHaveCSS("opacity", "0.3")

    await control.apply()
    await expect.poll(async () => (await getInfo(id))?.isNow).toBe(true)
  })

  test("入れ替え・ALL RESETボタンが使える", async ({ page }) => {
    const id = await seedTournament({
      matchIntervalInfo: {
        p1: { team: "RED", playerName: "Carol" },
        p2: { team: "BLUE", playerName: "Dave" },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("Interval")

    await control.swapButton.click()
    await expect(control.input("1P Player")).toHaveValue("Dave")
    await expect(control.input("2P Player")).toHaveValue("Carol")

    await control.allResetButton.click()
    await expect(control.input("1P Player")).toHaveValue("")
    await expect(control.input("2P Player")).toHaveValue("")
    await expect(control.input("1P Team")).toHaveValue("")
  })

  test("Scoreタブとは独立して保存される", async ({ page }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await control.openTab("Interval")
    await control.input("1P Player").fill("Interval Only")
    await control.apply()
    await expect
      .poll(async () => (await getInfo(id))?.p1.playerName)
      .toBe("Interval Only")

    await control.openTab("Score")
    await expect(control.input("1P Player")).toHaveValue("P1 Name")
    expect(
      (await dbGet<{ p1: { playerName: string } }>(`tournaments/${id}/score`))
        ?.p1.playerName
    ).toBe("P1 Name")
  })
})

test.describe("操作画面 MCタブ", () => {
  test("MCの情報を入力して適用するとDBに保存される", async ({ page }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("MC")

    await control.input("Team").nth(0).fill("RED")
    await control.input("MC Name").nth(0).fill("Mike")
    await control.input("@TwitterID").nth(0).fill("mike_tw")
    await control.input("MC Name").nth(2).fill("Nancy")

    await control.apply()

    await expect
      .poll(async () => (await dbGet<MC>(`tournaments/${id}/mc`))?.mcList)
      .toEqual([
        { team: "RED", playerName: "Mike", twitterID: "mike_tw", score: 0 },
        { team: "", playerName: "", twitterID: "", score: 0 },
        { team: "", playerName: "Nancy", twitterID: "", score: 0 },
        { team: "", playerName: "", twitterID: "", score: 0 },
      ])
  })

  test("「変更をリセット」で保存済みの内容に戻る", async ({ page }) => {
    const id = await seedTournament({ mc: [{ playerName: "Saved MC" }] })
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("MC")

    const name = control.input("MC Name").nth(0)
    await expect(name).toHaveValue("Saved MC")
    await name.fill("Unsaved")
    await control.resetButton.click()
    await expect(name).toHaveValue("Saved MC")
  })
})

test.describe("操作画面 Bracketタブ", () => {
  const getLoadBracket = (id: string) =>
    dbGet<LoadBracket>(`tournaments/${id}/loadBracket`)

  test("更新ボタンを押すと更新要求の時刻と自動更新の設定がDBに保存される", async ({
    page,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("Bracket")

    const before = Date.now()
    await control.panel
      .getByRole("button", { name: "start.ggから情報を取得し更新" })
      .click()
    await expect
      .poll(async () => (await getLoadBracket(id))?.lastRequestedAt ?? 0)
      .toBeGreaterThanOrEqual(before)
    expect((await getLoadBracket(id))?.autoUpdate).toBe(false)

    await control.checkboxLabel("自動で更新する").click()
    await control.panel
      .getByRole("button", { name: "start.ggから情報を取得し更新" })
      .click()
    await expect
      .poll(async () => (await getLoadBracket(id))?.autoUpdate)
      .toBe(true)
  })

  test("保存済みの自動更新の設定がチェックボックスに反映される", async ({
    page,
  }) => {
    const id = await seedTournament({ loadBracket: { autoUpdate: true } })
    const control = new ControlPage(page)
    await control.goto(id)
    await control.openTab("Bracket")

    await expect(control.checkbox("自動で更新する")).toBeChecked()
  })
})
