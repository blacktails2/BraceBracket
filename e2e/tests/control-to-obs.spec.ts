import { ControlPage } from "../support/control"
import { seedTournament } from "../support/data"
import { expect, test } from "../support/fixtures"
import { expectImageLoaded, imageBySrc, OBS_VIEWPORT } from "../support/obs"
import { BRACKET_URL } from "../support/startgg"

/**
 * 操作画面 → 配信画面 の連携
 * 実際の配信と同じく、操作画面と配信画面（OBSのブラウザソース）を別々のページで開いて確認する。
 */

test.describe("操作画面から配信画面への反映", () => {
  test("@cross-browser Scoreタブで適用した内容がスコアボードに即座に反映される", async ({
    context,
  }) => {
    const id = await seedTournament()
    const obs = await context.newPage()
    await obs.setViewportSize(OBS_VIEWPORT)
    await obs.goto(`/obs/score/?id=${id}`)
    await expect(obs.getByText("P1 Name")).toBeVisible()

    const control = new ControlPage(await context.newPage())
    await control.goto(id)
    await control.input("1P Team").fill("RED")
    await control.input("1P Player").fill("Alice")
    await control.input("2P Player").fill("Bob")
    await control.input("Grand Final").fill("Grand Finals")
    await control.plusButton("p1").click()
    await control.plusButton("p1").click()
    await control.plusButton("p2").click()

    // 適用するまでは配信画面は変わらない
    await expect(obs.getByText("P1 Name")).toBeVisible()

    await control.apply()

    await expect(obs.getByText("Alice", { exact: true })).toBeVisible()
    await expect(obs.getByText("RED", { exact: true })).toBeVisible()
    await expect(obs.getByText("Bob", { exact: true })).toBeVisible()
    await expect(obs.getByText("Grand Finals")).toBeVisible()
    await expect(obs.getByText("2", { exact: true })).toBeVisible()
    await expect(obs.getByText("1", { exact: true })).toBeVisible()
    await expect(obs.getByText("P1 Name")).toHaveCount(0)
  })

  test("試合中の典型的な操作（スコア加算→入れ替え→リセット）がそのまま配信画面に出る", async ({
    context,
  }) => {
    const id = await seedTournament({
      score: {
        p1: { team: "", playerName: "Alice", score: 0 },
        p2: { team: "", playerName: "Bob", score: 0 },
      },
    })
    const obs = await context.newPage()
    await obs.setViewportSize(OBS_VIEWPORT)
    await obs.goto(`/obs/score/?id=${id}`)
    const control = new ControlPage(await context.newPage())
    await control.goto(id)

    await control.plusButton("p2").click()
    await control.apply()
    await expect(obs.getByText("1", { exact: true })).toBeVisible()
    await expect(obs.getByText("0", { exact: true })).toBeVisible()

    // サイド入れ替え
    await control.swapButton.click()
    await control.apply()
    const alice = obs.getByText("Alice", { exact: true })
    const bob = obs.getByText("Bob", { exact: true })
    await expect
      .poll(async () => {
        const [a, b] = await Promise.all([
          alice.boundingBox(),
          bob.boundingBox(),
        ])
        return a && b ? a.x > b.x : false
      })
      .toBe(true)

    // 次の試合に向けてスコアリセット
    await control.scoreResetButton.click()
    await control.apply()
    await expect(obs.getByText("0", { exact: true })).toHaveCount(2)
  })

  test("Intervalタブで適用した内容が試合間画面に反映される", async ({
    context,
  }) => {
    const id = await seedTournament()
    const obs = await context.newPage()
    await obs.setViewportSize(OBS_VIEWPORT)
    await obs.goto(`/obs/next/?id=${id}`)
    await expect(obs.getByText("Player1")).toBeVisible()

    const control = new ControlPage(await context.newPage())
    await control.goto(id)
    await control.openTab("Interval")
    await control.input("1P Player").fill("Carol")
    await control.input("2P Player").fill("Dave")
    await control.input("Grand Final").fill("Losers Finals")
    await control.apply()

    await expect(obs.getByText("Carol", { exact: true })).toBeVisible()
    await expect(obs.getByText("Dave", { exact: true })).toBeVisible()
    await expect(obs.getByText("Losers Finals")).toBeVisible()
    await expect(obs.getByText("NEXT", { exact: true })).toBeVisible()

    await control.checkboxLabel("現在の試合状況を表示する").click()
    await control.apply()
    await expect(obs.getByText("NOW", { exact: true })).toBeVisible()
    await expect(obs.getByText("P1 Name")).toBeVisible()
  })

  test("MCタブで適用した内容がMC画面に反映される", async ({ context }) => {
    const id = await seedTournament()
    const obs = await context.newPage()
    await obs.setViewportSize(OBS_VIEWPORT)
    await obs.goto(`/obs/mc/?id=${id}`)

    const control = new ControlPage(await context.newPage())
    await control.goto(id)
    await control.openTab("MC")
    await control.input("MC Name").nth(0).fill("Mike")
    await control.input("@TwitterID").nth(0).fill("mike_tw")
    await control.input("MC Name").nth(1).fill("Nancy")
    await control.apply()

    await expect(obs.getByText("Mike", { exact: true })).toBeVisible()
    await expect(obs.getByText("@mike_tw", { exact: true })).toBeVisible()
    await expect(obs.getByText("Nancy", { exact: true })).toBeVisible()
    await expectImageLoaded(imageBySrc(obs, "/image/mc/MC_2_dark.png"))
  })

  test("Bracketタブの更新ボタンでTop8画面が start.gg から取得し直す", async ({
    context,
    startgg,
  }) => {
    const id = await seedTournament({
      setting: { integrateStartGG: { enabled: true, url: BRACKET_URL } },
      loadBracket: { lastRequestedAt: 1 },
    })
    const obs = await context.newPage()
    await obs.setViewportSize(OBS_VIEWPORT)
    await obs.goto(`/obs/bracket/?id=${id}`)
    await expectImageLoaded(imageBySrc(obs, "/image/bracket/brackets.png"))

    const control = new ControlPage(await context.newPage())
    await control.goto(id)
    await control.openTab("Bracket")
    await control.panel
      .getByRole("button", { name: "start.ggから情報を取得し更新" })
      .click()

    await expect(obs.getByText("Grace", { exact: true })).toBeVisible()
    expect(startgg.callCount("PhaseGroupSets")).toBe(1)
  })

  test("複数人で操作しているとき、他の人が適用した内容が自分の画面にも反映される", async ({
    context,
  }) => {
    const id = await seedTournament()
    const operatorA = new ControlPage(await context.newPage())
    const operatorB = new ControlPage(await context.newPage())
    await operatorA.goto(id)
    await operatorB.goto(id)

    await operatorA.input("1P Player").fill("From A")
    await operatorA.plusButton("p1").click()
    await operatorA.apply()

    await expect(operatorB.input("1P Player")).toHaveValue("From A")
    await expect(operatorB.scoreInput("p1")).toHaveValue("1")
  })
})
