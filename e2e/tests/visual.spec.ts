import { Page } from "@playwright/test"

import { ScoreboardColorsMap } from "../../libs/const"
import { ControlPage } from "../support/control"
import { buildSetting, seedTournament, TournamentSeed } from "../support/data"
import { dbSet, dbUpdate } from "../support/db"
import { expect, test } from "../support/fixtures"
import { expectImageLoaded, imageBySrc, OBS_VIEWPORT } from "../support/obs"
import { BRACKET_URL } from "../support/startgg"

/**
 * 見た目の回帰テスト（@visual）
 *
 * ライブラリ更新などで配信画面・操作画面の見た目が変わっていないことをスクリーンショットで確認する。
 * スクリーンショットはOS・ブラウザごとに異なるため、基準画像は e2e/tests/visual.spec.ts-snapshots/ に
 * プラットフォーム名付きで保存される。基準画像の更新は `yarn test:e2e:visual --update-snapshots`。
 */

test.describe.configure({ mode: "parallel" })

const score = {
  round: "Winners Finals",
  matchType: "Best of 5",
  p1: { team: "RED", playerName: "Alice", score: 2, twitterID: "alice_tw" },
  p2: { team: "BLUE", playerName: "Bob", score: 1, twitterID: "bob_tw" },
}

const FIXED_TIME = new Date("2026-10-17T19:05:00+09:00")

/** 遅延読み込みの画像も含めてページ内の画像をすべて読み込ませる */
const loadAllImages = async (page: Page) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await expect
    .poll(() =>
      page.evaluate(() =>
        Array.from(document.images).every((img) => img.complete)
      )
    )
    .toBe(true)
}

const obsShot = async (
  page: Page,
  path: string,
  seed: TournamentSeed,
  name: string,
  ready: (page: Page) => Promise<void>
) => {
  await page.setViewportSize(OBS_VIEWPORT)
  const id = await seedTournament(seed)
  await page.goto(`${path}?id=${id}`)
  await ready(page)
  await loadAllImages(page)
  await expect(page).toHaveScreenshot(name)
  return id
}

test.describe("@visual 配信画面", () => {
  for (const [layout, colors] of Object.entries(ScoreboardColorsMap)) {
    for (const color of colors) {
      test(`スコアボード ${layout} ${color}`, async ({ page }) => {
        await obsShot(
          page,
          "/obs/score/",
          { setting: { scoreboard: { design: { layout, color } } }, score },
          `score-${layout}-${color}.png`,
          async (p) => {
            await expectImageLoaded(
              imageBySrc(
                p,
                `/image/scoreboards/${layout}/${layout}_${color}.png`
              )
            )
            await expect(p.getByText("Alice", { exact: true })).toBeVisible()
          }
        )
      })
    }
  }

  for (const [layout, color] of [
    ["dual", "dark_color"],
    ["single", "light_mono"],
    ["simple", "white"],
    ["simple", "black"],
  ]) {
    test(`スコアボード カメラ・Twitter ID表示 ${layout} ${color}`, async ({
      page,
    }) => {
      await obsShot(
        page,
        "/obs/score/",
        {
          setting: {
            scoreboard: {
              design: { layout, color },
              cameraAndLogo: { displayCameraAndTwitterID: true },
            },
          },
          score: { ...score, uppercase: true },
        },
        `score-camera-${layout}-${color}.png`,
        async (p) => {
          await expect(p.getByText("@alice_tw")).toBeVisible()
        }
      )
    })
  }

  for (const dropShadow of ["none", "light", "dark"] as const) {
    test(`スコアボード ロゴ表示 ドロップシャドウ ${dropShadow}`, async ({
      page,
    }) => {
      await obsShot(
        page,
        "/obs/score/",
        {
          setting: {
            scoreboard: {
              cameraAndLogo: {
                useLogo: true,
                logoURLs: ["/image/symbol.svg"],
                dropShadow,
              },
            },
          },
          score,
        },
        `score-logo-${dropShadow}.png`,
        async (p) => {
          await expectImageLoaded(imageBySrc(p, "/image/symbol.svg"))
        }
      )
    })
  }

  for (const [layout, color] of [
    ["dual", "dark_color"],
    ["single", "light_color"],
    ["solid", "beige"],
    ["simple", "white"],
    ["simple", "black"],
  ]) {
    test(`Interval ${layout} ${color}`, async ({ page }) => {
      await page.clock.setFixedTime(FIXED_TIME)
      await obsShot(
        page,
        "/obs/next/",
        {
          setting: { scoreboard: { design: { layout, color } } },
          matchIntervalInfo: {
            round: "Losers Semis",
            matchType: "Best of 3",
            p1: { team: "RED", playerName: "Carol" },
            p2: { team: "", playerName: "Dave" },
          },
        },
        `next-${layout}-${color}.png`,
        async (p) => {
          await expect(p.getByText("19:05")).toBeVisible()
          await expect(p.getByText("Carol", { exact: true })).toBeVisible()
        }
      )
    })
  }

  test("Interval NOW表示", async ({ page }) => {
    await page.clock.setFixedTime(FIXED_TIME)
    await obsShot(
      page,
      "/obs/next/",
      {
        matchIntervalInfo: { isNow: true },
        score: { ...score, uppercase: true },
      },
      "next-now.png",
      async (p) => {
        await expect(p.getByText("NOW", { exact: true })).toBeVisible()
        await expect(p.getByText("19:05")).toBeVisible()
      }
    )
  })

  for (const [layout, color] of [
    ["dual", "dark_color"],
    ["single", "light_mono"],
    ["simple", "white"],
  ]) {
    for (const count of [1, 2, 3, 4]) {
      test(`MC ${layout} ${color} ${count}人`, async ({ page }) => {
        await obsShot(
          page,
          "/obs/mc/",
          {
            setting: { scoreboard: { design: { layout, color } } },
            mc: [
              { team: "RED", playerName: "Mike", twitterID: "mike_tw" },
              { playerName: "Nancy", twitterID: "@nancy_tw" },
              { team: "BLUE", playerName: "Oscar" },
              { playerName: "Peggy", twitterID: "peggy" },
            ].slice(0, count),
          },
          `mc-${layout}-${color}-${count}.png`,
          async (p) => {
            await expect(p.getByText("Mike", { exact: true })).toBeVisible()
          }
        )
      })
    }
  }

  for (const [layout, color, file] of [
    ["dual", "dark_color", "brackets.png"],
    ["simple", "white", "brackets_simple.png"],
  ]) {
    test(`Top8 ${layout} ${color}`, async ({ page }) => {
      await page.setViewportSize(OBS_VIEWPORT)
      const id = await seedTournament({
        setting: {
          integrateStartGG: { enabled: true, url: BRACKET_URL },
          scoreboard: { design: { layout, color } },
        },
        loadBracket: { lastRequestedAt: 1 },
      })
      await page.goto(`/obs/bracket/?id=${id}`)
      await expectImageLoaded(imageBySrc(page, `/image/bracket/${file}`))
      await dbUpdate(`tournaments/${id}/loadBracket`, {
        lastRequestedAt: Date.now(),
      })
      await expect(page.getByText("Heidi", { exact: true })).toBeVisible()
      await loadAllImages(page)
      await expect(page).toHaveScreenshot(`bracket-${layout}-${color}.png`)
    })
  }
})

test.describe("@visual 操作画面", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  const seed: TournamentSeed = {
    setting: {
      integrateStartGG: { enabled: true, url: BRACKET_URL },
      scoreboard: { cameraAndLogo: { displayCameraAndTwitterID: true } },
      tweetMatch: { enabled: true },
    },
    score,
    mc: [{ team: "RED", playerName: "Mike", twitterID: "mike_tw" }],
  }

  test("Scoreタブ（試合一覧あり・未適用の変更あり）", async ({ page }) => {
    const control = new ControlPage(page)
    await control.goto(await seedTournament(seed))
    await control.refreshQueueButton.click()
    await expect(control.queueRows).toHaveCount(3)
    await control.input("1P Player").fill("Changed")
    await control.chip("Winners").hover()
    await page.mouse.move(0, 0)
    await expect(page).toHaveScreenshot("control-score.png")
  })

  for (const tab of ["Interval", "MC", "Bracket"] as const) {
    test(`${tab}タブ`, async ({ page }) => {
      const control = new ControlPage(page)
      await control.goto(await seedTournament(seed))
      await control.openTab(tab)
      await page.mouse.move(0, 0)
      await expect(page).toHaveScreenshot(`control-${tab.toLowerCase()}.png`)
    })
  }
})

test.describe("@visual 作成画面・ダッシュボード・静的ページ", () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test("作成画面", async ({ page }) => {
    await page.goto("/create/")
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible()
    await loadAllImages(page)
    await expect(page).toHaveScreenshot("create.png", { fullPage: true })
  })

  test("作成画面（ロゴ・start.gg・ツイート設定を開いた状態）", async ({
    page,
  }) => {
    const id = await seedTournament({
      setting: {
        name: "篝火 #14",
        scoreboard: {
          design: { layout: "simple", color: "white" },
          cameraAndLogo: {
            displayCameraAndTwitterID: true,
            useLogo: true,
            logoURLs: ["/image/symbol.svg"],
            dropShadow: "light",
          },
        },
        integrateStartGG: { enabled: true, url: BRACKET_URL },
        tweetMatch: { enabled: true },
      },
    })
    await page.goto(`/create/?id=${id}`)
    await expect(page.getByPlaceholder("CompetitionName")).toHaveValue(
      "篝火 #14"
    )
    await loadAllImages(page)
    await expect(page).toHaveScreenshot("create-edit.png", { fullPage: true })
  })

  test("ダッシュボード", async ({ page }) => {
    // URLの表示を固定するため、固定のIDで大会を作る
    const id = "0123456789abcdef0123456789abcdef"
    await dbSet(`tournaments/${id}`, {
      createdAt: 1,
      setting: buildSetting({ name: "篝火 #14" }),
    })
    await page.goto(`/links/?id=${id}`)
    await expect(page.getByText("篝火 #14を編集する")).toBeVisible()
    await loadAllImages(page)
    await expect(page).toHaveScreenshot("links.png", { fullPage: true })
  })

  for (const [path, name] of [
    ["/", "top"],
    ["/usage/", "usage"],
    ["/help/", "help"],
  ]) {
    test(`静的ページ ${path}`, async ({ page }) => {
      await page.goto(path)
      await loadAllImages(page)
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: true,
        mask: [page.locator("video")],
      })
    })
  }
})
