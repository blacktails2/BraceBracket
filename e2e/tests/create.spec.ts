import { Page } from "@playwright/test"

import { DEFAULT_TWEET_TEMPLATE, seedTournament } from "../support/data"
import { dbGet } from "../support/db"
import { expect, IMGUR_UPLOADED_LOGO, test } from "../support/fixtures"
import { imageSource } from "../support/obs"
import { BRACKET_URL, EVENT_NAME, TOURNAMENT_NAME } from "../support/startgg"

import type { Score, Setting } from "../../libs/const"

/**
 * スコアボードの作成・設定変更画面（/create）
 */

const LINKS_URL = /\/links\/\?id=([0-9a-zA-Z]{32})$/

// ラジオボタン・チェックボックスの input は display: none で、見た目はラベル側で作っている
const radio = (page: Page, name: string) =>
  page.getByRole("radio", { name: new RegExp(`${name}$`), includeHidden: true })

/** BigCheckBox は input が非表示なので、見出し（ラベル内）をクリックして切り替える */
const toggle = (page: Page, heading: string) =>
  page.getByRole("heading", { name: heading }).click()

const checkbox = (page: Page, heading: string) =>
  page.getByRole("checkbox", { name: heading, includeHidden: true })

const submit = (page: Page, text = "スコアボードを作成") =>
  page.getByRole("button", { name: text }).first().click()

const getSetting = (id: string) => dbGet<Setting>(`tournaments/${id}/setting`)

test.describe("スコアボード作成画面", () => {
  test("@cross-browser 初期表示ではデフォルトの設定が選択されている", async ({
    page,
  }) => {
    await page.goto("/create/")

    await expect(page).toHaveTitle("BraceBracket | Setting")
    await expect(
      page.getByRole("heading", { name: "スコアボードを作成", level: 2 })
    ).toBeVisible()
    for (const layout of ["Dual", "Single", "Solid", "Simple"]) {
      await expect(radio(page, `${layout} Layout`)).toBeAttached()
    }
    await expect(radio(page, "Dual Layout")).toBeChecked()
    // Dual のカラーは5種類
    for (const color of [
      "Dark / Color",
      "Dark / Mono",
      "Light / Color",
      "Light / Mono",
      "Gradient",
    ]) {
      await expect(radio(page, color)).toBeAttached()
    }
    await expect(radio(page, "Dark / Color")).toBeChecked()
    await expect(page.getByPlaceholder("CompetitionName")).toHaveValue("")
    await expect(
      checkbox(page, "カメラ及び選手のTwitter IDを表示する")
    ).not.toBeChecked()
    await expect(checkbox(page, "start.ggと連携する")).not.toBeChecked()
    await expect(
      page.getByPlaceholder(/^https:\/\/www\.start\.gg\/tournament/)
    ).toBeDisabled()
    await expect(page.locator("textarea")).toBeDisabled()
    // ロゴの設定はチェックを入れたときだけ出る
    await expect(
      page.getByText("ロゴにドロップシャドウを追加する")
    ).toHaveCount(0)
  })

  test("レイアウトを選ぶとカラーの選択肢とプレビューが切り替わる", async ({
    page,
  }) => {
    await page.goto("/create/")
    const preview = page.getByAltText("スコアボードプレビュー")
    await expect
      .poll(() => imageSource(preview))
      .toContain("/image/create/samples/layout/dual/dual_dark_color.png")

    await page.getByText("Simple Layout").click()
    await expect(radio(page, "Simple Layout")).toBeChecked()
    await expect(radio(page, "White")).toBeChecked()
    await expect(radio(page, "Black")).toBeAttached()
    await expect(radio(page, "Gradient")).toHaveCount(0)
    await expect
      .poll(() => imageSource(preview))
      .toContain("/image/create/samples/layout/simple/simple_white.png")

    await page.getByText("Black", { exact: true }).click()
    await expect
      .poll(() => imageSource(preview))
      .toContain("/image/create/samples/layout/simple/simple_black.png")
    // Interval・Top8 のプレビューもデザインに追従する
    await expect
      .poll(() => imageSource(page.getByAltText("Nextプレビュー")))
      .toContain("upnext_simple_black.png")
    await expect
      .poll(() => imageSource(page.getByAltText("Top8プレビュー")))
      .toContain("brackets_simple.png")

    await page.getByText("Single Layout").click()
    await expect(radio(page, "Dark / Color")).toBeChecked()
    await expect(radio(page, "Beige")).toBeAttached()
  })

  test("カメラ表示をオンにするとプレビューにカメラ枠が出る", async ({
    page,
  }) => {
    await page.goto("/create/")
    // サンプル画像（Score / Interval / Top8）の3枚
    await expect(page.getByAltText("カメラ")).toHaveCount(3)
    await toggle(page, "カメラ及び選手のTwitter IDを表示する")
    await expect(
      checkbox(page, "カメラ及び選手のTwitter IDを表示する")
    ).toBeChecked()
    await expect(page.getByAltText("カメラ")).toHaveCount(4)
  })

  test("@cross-browser 設定を入力して作成するとDBに保存されダッシュボードに移動する", async ({
    page,
  }) => {
    await page.goto("/create/")

    await page.getByText("Single Layout").click()
    await page.getByText("Beige", { exact: true }).click()
    await page.getByPlaceholder("CompetitionName").fill("篝火 #14")
    await toggle(page, "カメラ及び選手のTwitter IDを表示する")
    await toggle(page, "対戦カードをツイートする")
    await expect(page.locator("textarea")).toBeEnabled()
    await page
      .locator("textarea")
      .fill("{{round}} {{p1.playerName}} vs {{p2.playerName}}")

    await submit(page)

    await expect(page).toHaveURL(LINKS_URL)
    const id = LINKS_URL.exec(page.url())?.[1] as string
    await expect(
      page.getByRole("heading", { name: "ダッシュボード" })
    ).toBeVisible()

    const setting = await getSetting(id)
    expect(setting).toMatchObject({
      name: "篝火 #14",
      scoreboard: {
        design: { layout: "single", color: "beige" },
        cameraAndLogo: {
          displayCameraAndTwitterID: true,
          useLogo: false,
          dropShadow: "none",
        },
      },
      integrateStartGG: { enabled: false, url: "" },
      tweetMatch: {
        enabled: true,
        template: "{{round}} {{p1.playerName}} vs {{p2.playerName}}",
      },
    })
    expect(typeof setting?.createdAt).toBe("number")
    expect(typeof (await dbGet<number>(`tournaments/${id}/createdAt`))).toBe(
      "number"
    )
  })

  test("作成直後の大会を開くと各データの初期値が作られる", async ({ page }) => {
    await page.goto("/create/")
    await submit(page)
    await expect(page).toHaveURL(LINKS_URL)
    const id = LINKS_URL.exec(page.url())?.[1] as string

    await page.goto(`/control/?id=${id}`)
    await expect(page.getByPlaceholder("1P Player").first()).toHaveValue(
      "P1 Name"
    )
    await expect
      .poll(() => dbGet<Score>(`tournaments/${id}/score`))
      .toMatchObject({
        round: "Pools",
        matchType: "Best of 3",
        p1: { playerName: "P1 Name", team: "P1 Team", score: 0 },
        p2: { playerName: "P2 Name", team: "P2 Team", score: 0 },
      })
    await expect
      .poll(() => dbGet(`tournaments/${id}/matchIntervalInfo`))
      .toMatchObject({ isNow: false, round: "Pools", matchType: "Best of 5" })
    await expect
      .poll(() => dbGet(`tournaments/${id}/loadBracket`))
      .toMatchObject({ autoUpdate: false, lastRequestedAt: 0 })
    await expect
      .poll(
        async () =>
          (
            await dbGet<{ mcList: unknown[] }>(`tournaments/${id}/mc`)
          )?.mcList
      )
      .toHaveLength(4)
  })

  test("ロゴを使う設定でロゴが未登録のときはエラーになり作成されない", async ({
    page,
  }) => {
    await page.goto("/create/")
    await toggle(page, "大会及びスポンサーのロゴを設定する")
    await expect(
      page.getByText("ロゴにドロップシャドウを追加する")
    ).toBeVisible()

    await submit(page)

    await expect(page.getByText("ロゴが登録されていません。")).toBeVisible()
    await expect(page).toHaveURL(/\/create\/$/)
  })

  test("ロゴをアップロードして保存できる", async ({ page }) => {
    await page.goto("/create/")
    await toggle(page, "大会及びスポンサーのロゴを設定する")

    await page
      .locator('input[type="file"]')
      .setInputFiles("public/image/logo.png")
    const uploaded = page.getByAltText("logo")
    await expect(uploaded).toHaveAttribute("src", IMGUR_UPLOADED_LOGO)
    await expect(uploaded).toBeVisible()

    // 削除ボタンで取り消せる
    await page.getByRole("button", { name: "削除" }).click()
    await expect(uploaded).toHaveCount(0)

    // 同じファイルを選び直すと change イベントが起きないので別のファイルを選ぶ
    await page
      .locator('input[type="file"]')
      .setInputFiles("public/image/img.png")
    await expect(uploaded).toBeVisible()
    await page.getByText("シャドウ（黒）").click()

    await submit(page)
    await expect(page).toHaveURL(LINKS_URL)
    const id = LINKS_URL.exec(page.url())?.[1] as string
    expect((await getSetting(id))?.scoreboard.cameraAndLogo).toMatchObject({
      useLogo: true,
      logoURLs: [IMGUR_UPLOADED_LOGO],
      dropShadow: "dark",
    })
  })

  test("start.ggと連携するとURLを検証して大会名を表示する", async ({
    page,
    startgg,
  }) => {
    await page.goto("/create/")
    await toggle(page, "start.ggと連携する")
    const url = page.getByPlaceholder(/^https:\/\/www\.start\.gg\/tournament/)
    await expect(url).toBeEnabled()

    await url.fill(BRACKET_URL)
    await expect(
      page.getByText(`「${TOURNAMENT_NAME} ${EVENT_NAME}」の情報を取得します。`)
    ).toBeVisible()
    expect(startgg.callCount("Events")).toBeGreaterThanOrEqual(1)

    await submit(page)
    await expect(page).toHaveURL(LINKS_URL)
    const id = LINKS_URL.exec(page.url())?.[1] as string
    expect((await getSetting(id))?.integrateStartGG).toEqual({
      enabled: true,
      url: BRACKET_URL,
    })
  })

  test("start.ggのURLが正しくないときはエラーを表示して作成しない", async ({
    page,
  }) => {
    await page.goto("/create/")
    await toggle(page, "start.ggと連携する")
    const url = page.getByPlaceholder(/^https:\/\/www\.start\.gg\/tournament/)

    await url.fill("https://example.com/tournament/foo")
    await expect(page.getByText("URLの形式が正しくありません。")).toBeVisible()

    await submit(page)
    await expect(
      page.getByText("トーナメントのURLが正しくありません。")
    ).toBeVisible()
    await expect(page).toHaveURL(/\/create\/$/)

    // URLが空のまま
    await url.fill("")
    await submit(page)
    await expect(
      page.getByText("URLを入力してください。", { exact: true })
    ).toBeVisible()
  })

  test("Grand Final を含まないトーナメント表のURLは注意を表示する", async ({
    page,
    startgg,
  }) => {
    startgg.includesGrandFinal = false
    await page.goto("/create/")
    await toggle(page, "start.ggと連携する")
    await page
      .getByPlaceholder(/^https:\/\/www\.start\.gg\/tournament/)
      .fill(BRACKET_URL)
    await expect(
      page.getByText("Grand Finalが含まれたBracketのURLを入力してください。")
    ).toBeVisible()
  })
})

test.describe("スコアボード設定変更画面", () => {
  test("@cross-browser 保存済みの設定がフォームに表示される", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        name: "Saved Cup",
        scoreboard: {
          design: { layout: "solid", color: "light_mono" },
          cameraAndLogo: { displayCameraAndTwitterID: true },
        },
        tweetMatch: { enabled: true, template: "saved template" },
      },
    })
    await page.goto(`/create/?id=${id}`)

    await expect(
      page.getByRole("heading", { name: "スコアボードを更新", level: 2 })
    ).toBeVisible()
    await expect(page.getByPlaceholder("CompetitionName")).toHaveValue(
      "Saved Cup"
    )
    await expect(radio(page, "Solid Layout")).toBeChecked()
    await expect(
      checkbox(page, "カメラ及び選手のTwitter IDを表示する")
    ).toBeChecked()
    await expect(checkbox(page, "対戦カードをツイートする")).toBeChecked()
    await expect(page.locator("textarea")).toHaveValue("saved template")
  })

  test("保存済みのカラーがフォームに表示される", async ({ page }) => {
    // 既知の不具合: 設定の読み込み後にレイアウトが変わると Color コンポーネントの useEffect が
    // カラーを各レイアウトの先頭の色に上書きしてしまう（Next.js 12 の時点から発生）。
    // 修正されたらこの test.fail を外す。
    test.fail()
    const id = await seedTournament({
      setting: {
        scoreboard: { design: { layout: "solid", color: "light_mono" } },
      },
    })
    await page.goto(`/create/?id=${id}`)
    await expect(radio(page, "Solid Layout")).toBeChecked()
    await expect(radio(page, "Light / Mono")).toBeChecked({ timeout: 3_000 })
  })

  test("設定を更新しても他のデータや作成日時は変わらない", async ({ page }) => {
    const id = await seedTournament({
      setting: { name: "Before" },
      score: { p1: { playerName: "Keep Score" } },
    })
    const before = await getSetting(id)
    await page.goto(`/create/?id=${id}`)
    await expect(page.getByPlaceholder("CompetitionName")).toHaveValue("Before")

    await page.getByPlaceholder("CompetitionName").fill("After")
    await page.getByText("Dual Layout").click()
    await page.getByText("Gradient", { exact: true }).click()
    await submit(page, "スコアボードを更新")

    await expect(page).toHaveURL(new RegExp(`/links/\\?id=${id}$`))
    const after = await getSetting(id)
    expect(after).toMatchObject({
      name: "After",
      scoreboard: { design: { layout: "dual", color: "gradient" } },
      tweetMatch: { template: DEFAULT_TWEET_TEMPLATE },
    })
    expect(after?.createdAt).toBe(before?.createdAt)
    expect((await dbGet<Score>(`tournaments/${id}/score`))?.p1.playerName).toBe(
      "Keep Score"
    )
  })
})
