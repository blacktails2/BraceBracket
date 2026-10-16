/** E2E で Next.js を起動するポート（開発サーバーの 3000 番と衝突しないようにする） */
export const E2E_PORT = Number(process.env.E2E_PORT ?? 3100)

/** Firebase Realtime Database エミュレータのホスト（firebase.json の emulators.database と合わせる） */
export const DATABASE_EMULATOR_HOST =
  process.env.FIREBASE_DATABASE_EMULATOR_HOST ?? "127.0.0.1:9410"

/** アプリが接続するデータベースの namespace（libs/firebase.ts の databaseURL から決まる） */
export const DATABASE_NAMESPACE = "bracebracket-24d9f-default-rtdb"
