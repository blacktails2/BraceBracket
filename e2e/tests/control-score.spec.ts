import { ControlPage, DIRTY_STYLE } from "../support/control"
import { seedTournament } from "../support/data"
import { dbGet } from "../support/db"
import { expect, test } from "../support/fixtures"

import type { Score } from "../../libs/const"

/**
 * 操作画面: Score タブ
 * 配信中に最も頻繁に触る画面なので、ボタン1つ1つの挙動とDBへの反映を確認する。
 */

const getScore = (id: string) => dbGet<Score>(`tournaments/${id}/score`)

test.describe("操作画面 Scoreタブ", () => {
  test("@cross-browser 保存済みのスコアがフォームに表示される", async ({
    page,
  }) => {
    const id = await seedTournament({
      score: {
        round: "Winners Finals",
        matchType: "Best of 5",
        p1: { team: "RED", playerName: "Alice", score: 2 },
        p2: { team: "BLUE", playerName: "Bob", score: 1 },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    await expect(control.input("1P Team")).toHaveValue("RED")
    await expect(control.input("1P Player")).toHaveValue("Alice")
    await expect(control.input("2P Team")).toHaveValue("BLUE")
    await expect(control.input("2P Player")).toHaveValue("Bob")
    await expect(control.scoreInput("p1")).toHaveValue("2")
    await expect(control.scoreInput("p2")).toHaveValue("1")
    await expect(control.input("Grand Final")).toHaveValue("Winners Finals")
    await expect(control.input("Best of 3")).toHaveValue("Best of 5")
    await expect(control.checkbox("全て大文字にする")).not.toBeChecked()
  })

  test("@cross-browser 入力して「適用する」を押すとDBに保存される", async ({
    page,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await control.input("1P Team").fill("RED")
    await control.input("1P Player").fill("Alice")
    await control.input("2P Team").fill("")
    await control.input("2P Player").fill("Bob")
    await control.input("Grand Final").fill("Grand Finals")
    await control.input("Best of 3").fill("Best of 5")
    await control.scoreInput("p1").fill("3")
    await control.scoreInput("p2").fill("2")
    await control.checkboxLabel("全て大文字にする").click()
    await expect(control.checkbox("全て大文字にする")).toBeChecked()

    await control.apply()

    await expect
      .poll(() => getScore(id))
      .toMatchObject({
        round: "Grand Finals",
        matchType: "Best of 5",
        uppercase: true,
        p1: { team: "RED", playerName: "Alice", score: 3 },
        p2: { team: "", playerName: "Bob", score: 2 },
      })
    // 適用後しばらくするとツールチップは消える
    await expect(control.appliedTooltip).toBeHidden({ timeout: 5_000 })
  })

  test("適用前の変更は入力欄がハイライトされ、適用すると解除される", async ({
    page,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    const p1Name = control.input("1P Player")
    await expect(p1Name).not.toHaveAttribute("style", DIRTY_STYLE)
    await p1Name.fill("Changed")
    await expect(p1Name).toHaveAttribute("style", DIRTY_STYLE)
    // 変更していない欄はハイライトされない
    await expect(control.input("2P Player")).not.toHaveAttribute(
      "style",
      DIRTY_STYLE
    )

    await control.apply()
    await expect(p1Name).not.toHaveAttribute("style", DIRTY_STYLE)
    await expect(p1Name).toHaveValue("Changed")
  })

  test("「変更をリセット」で適用前の変更が破棄される", async ({ page }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await control.input("1P Player").fill("Temporary")
    await control.plusButton("p1").click()
    await expect(control.scoreInput("p1")).toHaveValue("1")

    await control.resetButton.click()

    await expect(control.input("1P Player")).toHaveValue("P1 Name")
    await expect(control.scoreInput("p1")).toHaveValue("0")
    expect((await getScore(id))?.p1.playerName).toBe("P1 Name")
  })

  test("+1 / -1 ボタンでスコアが増減する", async ({ page }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await control.plusButton("p1").click()
    await control.plusButton("p1").click()
    await control.plusButton("p2").click()
    await expect(control.scoreInput("p1")).toHaveValue("2")
    await expect(control.scoreInput("p2")).toHaveValue("1")

    await control.minusButton("p1").click()
    await expect(control.scoreInput("p1")).toHaveValue("1")

    // 押しただけではDBに反映されない
    expect((await getScore(id))?.p1.score).toBe(0)

    await control.apply()
    await expect
      .poll(() => getScore(id))
      .toMatchObject({ p1: { score: 1 }, p2: { score: 1 } })
  })

  test("入れ替えボタンで1Pと2Pの情報がスコアごと入れ替わる", async ({
    page,
  }) => {
    const id = await seedTournament({
      score: {
        p1: { team: "RED", playerName: "Alice", score: 2 },
        p2: { team: "BLUE", playerName: "Bob", score: 1 },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    await control.swapButton.click()

    await expect(control.input("1P Team")).toHaveValue("BLUE")
    await expect(control.input("1P Player")).toHaveValue("Bob")
    await expect(control.scoreInput("p1")).toHaveValue("1")
    await expect(control.input("2P Team")).toHaveValue("RED")
    await expect(control.input("2P Player")).toHaveValue("Alice")
    await expect(control.scoreInput("p2")).toHaveValue("2")

    await control.apply()
    await expect
      .poll(() => getScore(id))
      .toMatchObject({
        p1: { team: "BLUE", playerName: "Bob", score: 1 },
        p2: { team: "RED", playerName: "Alice", score: 2 },
      })
  })

  test("ALL RESETでプレイヤー情報とスコアが空になる", async ({ page }) => {
    const id = await seedTournament({
      score: {
        p1: { team: "RED", playerName: "Alice", score: 2 },
        p2: { team: "BLUE", playerName: "Bob", score: 1 },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    await control.allResetButton.click()

    for (const placeholder of [
      "1P Team",
      "1P Player",
      "2P Team",
      "2P Player",
    ]) {
      await expect(control.input(placeholder)).toHaveValue("")
    }
    await expect(control.scoreInput("p1")).toHaveValue("0")
    await expect(control.scoreInput("p2")).toHaveValue("0")
  })

  test("SCORE RESETでスコアだけが0になる", async ({ page }) => {
    const id = await seedTournament({
      score: {
        p1: { team: "RED", playerName: "Alice", score: 2 },
        p2: { team: "BLUE", playerName: "Bob", score: 1 },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    await control.scoreResetButton.click()

    await expect(control.scoreInput("p1")).toHaveValue("0")
    await expect(control.scoreInput("p2")).toHaveValue("0")
    await expect(control.input("1P Player")).toHaveValue("Alice")
    await expect(control.input("2P Player")).toHaveValue("Bob")
  })

  test("ラウンドのクイック選択ボタンでラウンド名を組み立てられる", async ({
    page,
  }) => {
    const id = await seedTournament({ score: { round: "" } })
    const control = new ControlPage(page)
    await control.goto(id)
    const round = control.input("Grand Final")

    await control.chip("Winners").click()
    await expect(round).toHaveValue("Winners")

    // 種別を選ぶと詳細の選択肢が出る（Top8 は「8」と表示される）
    await control.chip("8").click()
    await expect(round).toHaveValue("Winners Top8")
    await control.chip("Semis").click()
    await expect(round).toHaveValue("Winners Semis")
    // 選択中の詳細をもう一度押すと解除される
    await control.chip("Semis").click()
    await expect(round).toHaveValue("Winners")

    await control.chip("Grand").click()
    await expect(round).toHaveValue("Grand")
    await control.chip("Finals Reset").click()
    await expect(round).toHaveValue("Grand Finals Reset")

    // 選択中の種別をもう一度押すと空になる
    await control.chip("Grand").click()
    await expect(round).toHaveValue("")

    await control.chip("Pools").click()
    await expect(round).toHaveValue("Pools")
    await control.chip("Friendlies").click()
    await expect(round).toHaveValue("Friendlies")

    await control.apply()
    await expect
      .poll(async () => (await getScore(id))?.round)
      .toBe("Friendlies")
  })

  test("セット情報のクイック選択ボタンで Best of 3 / 5 を切り替えられる", async ({
    page,
  }) => {
    const id = await seedTournament({ score: { matchType: "Best of 3" } })
    const control = new ControlPage(page)
    await control.goto(id)
    const matchType = control.input("Best of 3")

    await control.chip("Best of 5").click()
    await expect(matchType).toHaveValue("Best of 5")
    await control.chip("Best of 5").click()
    await expect(matchType).toHaveValue("")
    await control.chip("Best of 3").click()
    await expect(matchType).toHaveValue("Best of 3")
  })

  test("カメラ表示が無効な大会ではTwitter IDの入力欄が出ない", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        scoreboard: { cameraAndLogo: { displayCameraAndTwitterID: false } },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    await expect(control.input("1P Player")).toBeVisible()
    await expect(control.input("@1PTwitterID")).toHaveCount(0)
    await expect(control.input("@2PTwitterID")).toHaveCount(0)
  })

  test("カメラ表示が有効な大会ではTwitter IDを入力・保存できる", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        scoreboard: { cameraAndLogo: { displayCameraAndTwitterID: true } },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    await control.input("@1PTwitterID").fill("alice_tw")
    await control.input("@2PTwitterID").fill("@bob_tw")
    await control.apply()

    await expect
      .poll(() => getScore(id))
      .toMatchObject({
        p1: { twitterID: "alice_tw" },
        p2: { twitterID: "@bob_tw" },
      })
  })

  test("ツイート連携が無効な大会ではツイートボタンが出ない", async ({
    page,
  }) => {
    const id = await seedTournament()
    const control = new ControlPage(page)
    await control.goto(id)

    await expect(
      control.panel.getByRole("button", { name: "対戦カードをツイート" })
    ).toHaveCount(0)
  })

  test("対戦カードをツイートするとテンプレートを埋めたツイート画面が開く", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        tweetMatch: {
          enabled: true,
          template:
            "{{round}}\n{{p1.team}} {{p1.playerName}} {{p1.twitterID}} vs {{p2.playerName}} {{p2.twitterID}} #BraceBracket",
        },
      },
      score: {
        round: "Grand Finals",
        p1: { team: "RED", playerName: "Alice & Co", twitterID: "alice_tw" },
        p2: { team: "", playerName: "Bob", twitterID: "@bob_tw" },
      },
    })
    const control = new ControlPage(page)
    await control.goto(id)

    const popupPromise = page.waitForEvent("popup")
    await control.panel
      .getByRole("button", { name: "対戦カードをツイート" })
      .click()
    const popup = await popupPromise

    const url = new URL(popup.url())
    expect(url.origin + url.pathname).toBe("https://twitter.com/intent/tweet")
    // @が無いIDには@が補われ、HTMLエスケープはされない
    expect(url.searchParams.get("text")).toBe(
      "Grand Finals\nRED Alice & Co @alice_tw vs Bob @bob_tw #BraceBracket"
    )
  })

  test("IDが指定されていない場合は作成画面に移動する", async ({ page }) => {
    await page.goto("/control/")
    await expect(page).toHaveURL(/\/create\/?$/)
    await expect(
      page.getByRole("heading", { name: "スコアボードを作成" })
    ).toBeVisible()
  })
})
