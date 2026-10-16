import { ScoreboardColorsMap } from "../../libs/const"
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
 * 配信画面: スコアボード（/obs/score）
 */

test.use({ viewport: OBS_VIEWPORT })

const players = {
  round: "Winners Finals",
  matchType: "Best of 5",
  p1: { team: "RED", playerName: "Alice", score: 2, twitterID: "" },
  p2: { team: "BLUE", playerName: "Bob", score: 1, twitterID: "" },
}

test.describe("配信画面 スコアボード", () => {
  test("タイトルとプレイヤー・スコア・ラウンドが表示される", async ({
    page,
  }) => {
    const id = await seedTournament({ score: players })
    await page.goto(`/obs/score/?id=${id}`)

    await expect(page).toHaveTitle("BraceBracket | Score Layout")
    await expect(page.getByText("Alice", { exact: true })).toBeVisible()
    await expect(page.getByText("RED", { exact: true })).toBeVisible()
    await expect(page.getByText("Bob", { exact: true })).toBeVisible()
    await expect(page.getByText("BLUE", { exact: true })).toBeVisible()
    await expect(page.getByText("2", { exact: true })).toBeVisible()
    await expect(page.getByText("1", { exact: true })).toBeVisible()
    await expect(page.getByText("Winners Finals")).toBeVisible()
    await expect(page.getByText("Best of 5")).toBeVisible()
  })

  test("1Pは左側、2Pは右側に表示される", async ({ page }) => {
    const id = await seedTournament({ score: players })
    await page.goto(`/obs/score/?id=${id}`)

    const alice = page.getByText("Alice", { exact: true })
    const bob = page.getByText("Bob", { exact: true })
    await expect(alice).toBeVisible()
    await expect(bob).toBeVisible()
    expect(await leftOf(alice)).toBeLessThan(OBS_VIEWPORT.width / 2)
    expect(await leftOf(bob)).toBeGreaterThan(OBS_VIEWPORT.width / 2)
    expect(await leftOf(page.getByText("2", { exact: true }))).toBeLessThan(
      await leftOf(page.getByText("1", { exact: true }))
    )
  })

  test("チーム名が空のときはチーム名を表示しない", async ({ page }) => {
    const id = await seedTournament({
      score: { p1: { team: "", playerName: "Solo" } },
    })
    await page.goto(`/obs/score/?id=${id}`)

    const name = page.getByText("Solo", { exact: true })
    await expect(name).toBeVisible()
    // 名前の span だけが入っている
    await expect(name.locator("xpath=..").locator("span")).toHaveCount(1)
  })

  for (const [layout, colors] of Object.entries(ScoreboardColorsMap)) {
    for (const color of colors) {
      test(`${layout} レイアウト / ${color} の画像が読み込まれる`, async ({
        page,
      }) => {
        const id = await seedTournament({
          setting: { scoreboard: { design: { layout, color } } },
          score: players,
        })
        await page.goto(`/obs/score/?id=${id}`)

        await expectImageLoaded(
          imageBySrc(
            page,
            `/image/scoreboards/${layout}/${layout}_${color}.png`
          )
        )
        await expect(page.getByText("Alice", { exact: true })).toBeVisible()
        await expect(page.getByText("Winners Finals")).toBeVisible()
        await expect(page.getByText("Best of 5")).toBeVisible()
      })
    }
  }

  test("Dualレイアウトではロゴ未設定のとき大会名が表示される", async ({
    page,
  }) => {
    const id = await seedTournament({ setting: { name: "Kagaribi #14" } })
    await page.goto(`/obs/score/?id=${id}`)
    await expect(page.getByText("Kagaribi #14")).toBeVisible()
  })

  for (const layout of ["single", "solid", "simple"]) {
    test(`${layout} レイアウトでは大会名を表示しない`, async ({ page }) => {
      const id = await seedTournament({
        setting: {
          name: "Kagaribi #14",
          scoreboard: {
            design: { layout, color: ScoreboardColorsMap[layout][0] },
          },
        },
      })
      await page.goto(`/obs/score/?id=${id}`)
      await expect(page.getByText("P1 Name")).toBeVisible()
      await expect(page.getByText("Kagaribi #14")).toHaveCount(0)
    })
  }

  for (const layout of ["dual", "single"]) {
    test(`「全て大文字にする」で ${layout} レイアウトのラウンドとセット情報が大文字になる`, async ({
      page,
    }) => {
      const id = await seedTournament({
        setting: {
          scoreboard: {
            design: { layout, color: ScoreboardColorsMap[layout][0] },
          },
        },
        score: { ...players, uppercase: true },
      })
      await page.goto(`/obs/score/?id=${id}`)
      await expect(page.getByText("Winners Finals")).toHaveCSS(
        "text-transform",
        "uppercase"
      )
      await expect(page.getByText("Best of 5")).toHaveCSS(
        "text-transform",
        "uppercase"
      )
    })
  }

  test("大文字設定がオフのときはそのまま表示される", async ({ page }) => {
    const id = await seedTournament({ score: players })
    await page.goto(`/obs/score/?id=${id}`)
    await expect(page.getByText("Winners Finals")).toHaveCSS(
      "text-transform",
      "none"
    )
  })

  test("カメラ表示が無効のときはカメラ枠とTwitter IDを表示しない", async ({
    page,
  }) => {
    const id = await seedTournament({
      score: {
        p1: { twitterID: "alice_tw" },
        p2: { twitterID: "bob_tw" },
      },
    })
    await page.goto(`/obs/score/?id=${id}`)
    await expect(page.getByText("P1 Name")).toBeVisible()
    await expect(page.locator('img[src^="/image/camera/"]')).toHaveCount(0)
    await expect(page.getByText("@alice_tw")).toHaveCount(0)
  })

  for (const [layout, color, file] of [
    ["dual", "dark_color", "camera_black.png"],
    ["simple", "white", "simple_camera_white.png"],
    ["simple", "black", "simple_camera_black.png"],
  ]) {
    test(`カメラ表示が有効なとき ${layout}/${color} のカメラ枠とTwitter IDを表示する`, async ({
      page,
    }) => {
      const id = await seedTournament({
        setting: {
          scoreboard: {
            design: { layout, color },
            cameraAndLogo: { displayCameraAndTwitterID: true },
          },
        },
        score: {
          p1: { twitterID: "alice_tw" },
          p2: { twitterID: "@bob_tw" },
        },
      })
      await page.goto(`/obs/score/?id=${id}`)

      await expectImageLoaded(imageBySrc(page, `/image/camera/${file}`))
      // @ が無いIDには @ を付けて表示する
      await expect(page.getByText("@alice_tw", { exact: true })).toBeVisible()
      await expect(page.getByText("@bob_tw", { exact: true })).toBeVisible()
      expect(await leftOf(page.getByText("@alice_tw"))).toBeLessThan(
        await leftOf(page.getByText("@bob_tw"))
      )
    })
  }

  for (const [dropShadow, filter] of [
    ["none", "none"],
    ["light", "drop-shadow(rgba(255, 255, 255, 0.7) 0px 0px 6px)"],
    ["dark", "drop-shadow(rgba(0, 0, 0, 0.3) 0px 0px 4px)"],
  ]) {
    test(`ロゴを設定するとロゴを表示し（ドロップシャドウ: ${dropShadow}）、大会名は表示しない`, async ({
      page,
    }) => {
      const id = await seedTournament({
        setting: {
          name: "Hidden Name",
          scoreboard: {
            cameraAndLogo: {
              useLogo: true,
              logoURLs: ["/image/logo.png"],
              dropShadow: dropShadow as "none" | "light" | "dark",
            },
          },
        },
      })
      await page.goto(`/obs/score/?id=${id}`)

      const logo = imageBySrc(page, "/image/logo.png")
      await expectImageLoaded(logo)
      await expect(logo).toHaveCSS("filter", filter)
      await expect(page.getByText("Hidden Name")).toHaveCount(0)
    })
  }

  test("ロゴを複数設定すると5秒ごとに切り替わる", async ({ page }) => {
    const id = await seedTournament({
      setting: {
        scoreboard: {
          cameraAndLogo: {
            useLogo: true,
            logoURLs: ["/image/logo.png", "/image/symbol.svg"],
          },
        },
      },
    })
    await page.clock.install()
    await page.goto(`/obs/score/?id=${id}`)

    await expectImageLoaded(imageBySrc(page, "/image/logo.png"))
    await expect(imageBySrc(page, "/image/symbol.svg")).toHaveCount(0)

    await page.clock.runFor(5_500)
    await expectImageLoaded(imageBySrc(page, "/image/symbol.svg"))

    await page.clock.runFor(5_500)
    await expectImageLoaded(imageBySrc(page, "/image/logo.png"))
  })

  test("ロゴ設定がオフのときは登録済みのロゴがあっても表示しない", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        name: "Visible Name",
        scoreboard: {
          cameraAndLogo: { useLogo: false, logoURLs: ["/image/logo.png"] },
        },
      },
    })
    await page.goto(`/obs/score/?id=${id}`)
    await expect(page.getByText("Visible Name")).toBeVisible()
    await expect(imageBySrc(page, "/image/logo.png")).toHaveCount(0)
  })

  test("DBの値が変わるとリロードせずに表示が更新される", async ({ page }) => {
    const id = await seedTournament({ score: players })
    await page.goto(`/obs/score/?id=${id}`)
    await expect(page.getByText("Alice", { exact: true })).toBeVisible()

    await dbUpdate(`tournaments/${id}/score`, {
      round: "Grand Finals",
      p1: { ...players.p1, playerName: "Carol", score: 3 },
    })
    await expect(page.getByText("Carol", { exact: true })).toBeVisible()
    await expect(page.getByText("Alice", { exact: true })).toHaveCount(0)
    await expect(page.getByText("3", { exact: true })).toBeVisible()
    await expect(page.getByText("Grand Finals")).toBeVisible()

    // デザインの変更も即座に反映される
    await dbUpdate(`tournaments/${id}/setting/scoreboard/design`, {
      layout: "simple",
      color: "white",
    })
    await expectImageLoaded(
      imageBySrc(page, "/image/scoreboards/simple/simple_white.png")
    )
  })

  test("存在しない大会IDではデフォルトのスコアボードが表示され、エラーにならない", async ({
    page,
  }) => {
    await page.goto(`/obs/score/?id=${"0".repeat(32)}`)
    await expectImageLoaded(
      imageBySrc(page, "/image/scoreboards/dual/dual_dark_color.png")
    )
    await expect(page.getByText("P1 Name")).toBeVisible()
    await expect(page.getByText("P2 Name")).toBeVisible()
  })
})
