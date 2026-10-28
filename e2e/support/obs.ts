import { expect, Locator, Page } from "@playwright/test"

/**
 * 配信画面（OBS のブラウザソース）用のヘルパー
 * OBS では 1920x1080 のブラウザソースとして読み込む前提。
 */
export const OBS_VIEWPORT = { width: 1920, height: 1080 }

/** src が一致する画像が表示され、実際に読み込めていること */
export const expectImageLoaded = async (image: Locator) => {
  await expect(image).toBeVisible()
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
      )
    )
    .toBe(true)
}

export const imageBySrc = (page: Page, src: string) =>
  page.locator(`img[src="${src}"]`)

/** 要素の左端のX座標（1P / 2P の左右の配置確認に使う） */
export const leftOf = async (locator: Locator) => {
  const box = await locator.boundingBox()
  if (!box) throw new Error("要素が表示されていません")
  return box.x
}

/**
 * next/image で表示している画像の実際の読み込み元
 * （/_next/image?url=... の形式でも、元の画像パスが含まれる文字列を返す）
 */
export const imageSource = async (image: Locator) => {
  await image.scrollIntoViewIfNeeded()
  return image.evaluate((img: HTMLImageElement) =>
    decodeURIComponent(img.complete ? img.currentSrc || img.src : "")
  )
}
