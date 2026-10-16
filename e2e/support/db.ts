import { randomBytes } from "crypto"

import { DATABASE_EMULATOR_HOST, DATABASE_NAMESPACE } from "./env"

/**
 * Realtime Database エミュレータを REST API で直接読み書きするヘルパー
 *
 * "Bearer owner" はエミュレータ専用の管理者トークンで、セキュリティルールを無視して読み書きできる。
 * テストデータの投入と、画面操作の結果がDBに反映されたかの確認に使う。
 */
const url = (path: string) =>
  `http://${DATABASE_EMULATOR_HOST}/${path}.json?ns=${DATABASE_NAMESPACE}`

const adminHeaders = {
  Authorization: "Bearer owner",
  "Content-Type": "application/json",
}

const request = async (method: string, path: string, body?: unknown) => {
  const res = await fetch(url(path), {
    method,
    headers: adminHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(
      `Database emulator ${method} ${path} failed: ${
        res.status
      } ${await res.text()}`
    )
  }
  return res.json()
}

export const dbGet = <T = unknown>(path: string): Promise<T | null> =>
  request("GET", path)

export const dbSet = (path: string, value: unknown) =>
  request("PUT", path, value)

export const dbUpdate = (path: string, value: Record<string, unknown>) =>
  request("PATCH", path, value)

/**
 * セキュリティルールを適用した状態（＝ブラウザと同じ未認証クライアント）で書き込む。
 * ルールの回帰確認に使う。
 */
export const dbSetAsGuest = async (path: string, value: unknown) => {
  const res = await fetch(url(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  })
  return res.status
}

/** アプリと同じ形式（32文字の英数字）の大会IDを生成する */
export const newTournamentId = () => randomBytes(16).toString("hex")
