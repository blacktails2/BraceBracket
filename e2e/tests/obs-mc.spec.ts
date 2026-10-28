import { seedTournament } from "../support/data"
import { dbSet } from "../support/db"
import { expect, test } from "../support/fixtures"
import { expectImageLoaded, imageBySrc, OBS_VIEWPORT } from "../support/obs"

/**
 * 配信画面: MC（/obs/mc）
 */

test.use({ viewport: OBS_VIEWPORT })

test.describe("配信画面 MC", () => {
  test("MCが未入力のときは何も表示しない", async ({ page }) => {
    const id = await seedTournament()
    await page.goto(`/obs/mc/?id=${id}`)

    await expect(page).toHaveTitle("BraceBracket | Title Layout")
    await expect(page.locator("#__next > *")).not.toHaveCount(0)
    await expect(page.getByAltText("背景画像")).toHaveCount(0)
  })

  test("MCの名前・チーム・Twitter IDを表示し、@を補う", async ({ page }) => {
    const id = await seedTournament({
      mc: [
        { team: "RED", playerName: "Mike", twitterID: "mike_tw" },
        { playerName: "Nancy", twitterID: "@nancy_tw" },
      ],
    })
    await page.goto(`/obs/mc/?id=${id}`)

    await expect(page.getByText("Mike", { exact: true })).toBeVisible()
    await expect(page.getByText("RED", { exact: true })).toBeVisible()
    await expect(page.getByText("@mike_tw", { exact: true })).toBeVisible()
    await expect(page.getByText("Nancy", { exact: true })).toBeVisible()
    await expect(page.getByText("@nancy_tw", { exact: true })).toBeVisible()
  })

  for (const count of [1, 2, 3, 4]) {
    for (const [layout, color, file] of [
      ["dual", "dark_color", `MC_${count}_dark.png`],
      ["single", "light_color", `MC_${count}_light.png`],
      ["simple", "white", `MC_simple_${count}_white.png`],
      ["simple", "black", `MC_simple_${count}_black.png`],
    ]) {
      test(`${layout}/${color} でMCが${count}人のときは ${file} を使う`, async ({
        page,
      }) => {
        const mc = Array.from({ length: count }, (_, i) => ({
          playerName: `MC${i + 1}`,
        }))
        const id = await seedTournament({
          setting: { scoreboard: { design: { layout, color } } },
          mc,
        })
        await page.goto(`/obs/mc/?id=${id}`)

        await expectImageLoaded(imageBySrc(page, `/image/mc/${file}`))
        for (const m of mc) {
          await expect(
            page.getByText(m.playerName, { exact: true })
          ).toBeVisible()
        }
      })
    }
  }

  test("空欄のMCは詰めて表示し、人数に応じた背景を使う", async ({ page }) => {
    const id = await seedTournament({
      mc: [{ playerName: "First" }, {}, { twitterID: "only_id" }, {}],
    })
    await page.goto(`/obs/mc/?id=${id}`)

    await expectImageLoaded(imageBySrc(page, "/image/mc/MC_2_dark.png"))
    await expect(page.getByText("First", { exact: true })).toBeVisible()
    await expect(page.getByText("@only_id", { exact: true })).toBeVisible()
  })

  test("DBの値が変わるとリロードせずに表示が更新される", async ({ page }) => {
    const id = await seedTournament({ mc: [{ playerName: "Mike" }] })
    await page.goto(`/obs/mc/?id=${id}`)
    await expectImageLoaded(imageBySrc(page, "/image/mc/MC_1_dark.png"))

    await dbSet(`tournaments/${id}/mc/mcList/1`, {
      team: "",
      playerName: "Nancy",
      twitterID: "",
      score: 0,
    })
    await expect(page.getByText("Nancy", { exact: true })).toBeVisible()
    await expectImageLoaded(imageBySrc(page, "/image/mc/MC_2_dark.png"))
  })
})
