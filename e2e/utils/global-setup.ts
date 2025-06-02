import { FullConfig } from "@playwright/test"

async function globalSetup(config: FullConfig) {
  // グローバルセットアップでの処理は不要
  // 各テストでページレベルでリクエストをブロック
}

export default globalSetup
