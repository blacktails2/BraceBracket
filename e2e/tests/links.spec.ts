import { seedTournament } from "../support/data"
import { expect, test } from "../support/fixtures"
import { imageSource } from "../support/obs"

/**
 * ダッシュボード（/links）
 * 配信担当者が OBS に設定するURLをコピーする画面。
 */

test.describe("ダッシュボード", () => {
  test("@cross-browser 編集画面と配信用ブラウザソースのURLが表示される", async ({
    page,
    baseURL,
  }) => {
    const id = await seedTournament({ setting: { name: "篝火 #14" } })
    await page.goto(`/links/?id=${id}`)

    await expect(page).toHaveTitle("BraceBracket | Control")
    await expect(
      page.getByRole("heading", { name: "ダッシュボード" })
    ).toBeVisible()
    await expect(page.getByText("篝火 #14を編集する")).toBeVisible()

    const urls = page.locator('input[type="text"][readonly]')
    await expect(urls).toHaveCount(5)
    await expect(urls.nth(0)).toHaveValue(`${baseURL}/control/?id=${id}`)
    await expect(urls.nth(1)).toHaveValue(`${baseURL}/obs/score/?id=${id}`)
    await expect(urls.nth(2)).toHaveValue(`${baseURL}/obs/next/?id=${id}`)
    await expect(urls.nth(3)).toHaveValue(`${baseURL}/obs/mc/?id=${id}`)
    await expect(urls.nth(4)).toHaveValue(`${baseURL}/obs/bracket/?id=${id}`)

    for (const heading of [
      "Score Layout",
      "Interval Layout",
      "MC Layout",
      "Top8 Layout",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible()
    }
  })

  test("Copyボタンでクリップボードにコピーされ、Copied! が一時的に表示される", async ({
    page,
    context,
    baseURL,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "クリップボード権限の付与は Chromium のみ"
    )
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    const id = await seedTournament()
    await page.goto(`/links/?id=${id}`)

    await page.getByRole("button", { name: "Copy" }).nth(1).click()
    const copied = page.getByText("Copied!").nth(1)
    await expect(copied).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      `${baseURL}/obs/score/?id=${id}`
    )
    await expect(copied).toBeHidden()
  })

  test("「編集画面を開く」で編集画面が別ウィンドウで開く", async ({ page }) => {
    const id = await seedTournament()
    await page.goto(`/links/?id=${id}`)

    const popupPromise = page.waitForEvent("popup")
    await page.getByRole("button", { name: "編集画面を開く" }).click()
    const popup = await popupPromise
    await expect(popup).toHaveURL(new RegExp(`/control/\\?id=${id}$`))
    await expect(
      popup.getByRole("button", { name: "適用する" }).first()
    ).toBeVisible()
  })

  test("「設定を変更」で設定変更画面に移動する", async ({ page }) => {
    const id = await seedTournament({ setting: { name: "Edit Me" } })
    await page.goto(`/links/?id=${id}`)

    await page.getByRole("button", { name: "設定を変更" }).click()
    await expect(page).toHaveURL(new RegExp(`/create/\\?id=${id}$`))
    await expect(
      page.getByRole("heading", { name: "スコアボードを更新", level: 2 })
    ).toBeVisible()
    await expect(page.getByPlaceholder("CompetitionName")).toHaveValue(
      "Edit Me"
    )
  })

  test("プレビューが大会のデザイン設定に合わせて表示される", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        scoreboard: {
          design: { layout: "simple", color: "black" },
          cameraAndLogo: { displayCameraAndTwitterID: true },
        },
      },
    })
    await page.goto(`/links/?id=${id}`)

    await expect
      .poll(() => imageSource(page.getByAltText("スコアボードプレビュー")))
      .toContain("/image/create/samples/layout/simple/simple_black.png")
    await expect
      .poll(() => imageSource(page.getByAltText("Nextプレビュー")))
      .toContain("/image/create/samples/next/upnext_simple_black.png")
    await expect
      .poll(() => imageSource(page.getByAltText("MCプレビュー")))
      .toContain("/image/create/samples/mc/MC_simple_2_black.png")
    await expect
      .poll(() => imageSource(page.getByAltText("Top8プレビュー")))
      .toContain("/image/create/samples/top8/brackets_simple.png")
    // カメラ表示がオンなのでカメラ枠のプレビューも出る
    await expect
      .poll(async () => {
        const sources = await Promise.all(
          (await page.getByAltText("カメラ").all()).map(imageSource)
        )
        return sources.some((s) =>
          s.includes("/image/create/samples/camera/simple_camera_black.png")
        )
      })
      .toBe(true)
  })
})
