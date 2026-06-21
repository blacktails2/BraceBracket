import { test, expect } from "@playwright/test"

test("基本的な動作確認", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/BraceBracket/)
})
