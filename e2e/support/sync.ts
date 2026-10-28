import { expect, Page, WebSocket } from "@playwright/test"

export type DatabaseKey =
  | "setting"
  | "score"
  | "matchIntervalInfo"
  | "mc"
  | "loadBracket"

export const ALL_DATABASE_KEYS: DatabaseKey[] = [
  "setting",
  "score",
  "matchIntervalInfo",
  "mc",
  "loadBracket",
]

/**
 * ページが Realtime Database から大会の初期データを受け取り、画面に反映し終えるのを待つ
 *
 * Pages Router では最初の描画時に router.query が空のため、アプリは一瞬アプリの初期値で描画し、
 * DB のデータが届いてから描画し直す（hooks/useDatabaseValue.ts）。
 * その間に操作すると、入力が届いたデータで上書きされたりタイマーの登録が遅れたりするため、
 * 操作の前にこれを待つ。見た目では初期値と区別できないので、WebSocket の受信内容で判断する。
 *
 * page.goto() より前に呼び、返り値の関数を page.goto() の後に await する。
 */
export const watchDatabaseSync = (
  page: Page,
  id: string,
  keys: DatabaseKey[] = ALL_DATABASE_KEYS
) => {
  let pending = keys.map((key) => `"p":"tournaments/${id}/${key}"`)
  const onWebSocket = (ws: WebSocket) => {
    ws.on("framereceived", ({ payload }) => {
      const text = payload.toString()
      pending = pending.filter((path) => !text.includes(path))
    })
  }
  page.on("websocket", onWebSocket)

  return async () => {
    await expect
      .poll(() => pending, {
        message: "Realtime Database から初期データが届くのを待つ",
      })
      .toEqual([])
    page.off("websocket", onWebSocket)
    // 受け取ったデータでの再描画と useEffect（フォームの reset やタイマーの登録）が終わるのを待つ。
    // React のスケジューラーは MessageChannel でタスクを積むので、同じ仕組みで何周か待つ
    // （page.clock をインストールしていても MessageChannel は偽装されない）
    await page.evaluate(async () => {
      for (let i = 0; i < 5; i++) {
        await new Promise<void>((resolve) => {
          const channel = new MessageChannel()
          channel.port1.onmessage = () => resolve()
          channel.port2.postMessage(null)
        })
      }
    })
  }
}
