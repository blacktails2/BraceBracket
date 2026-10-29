// 大会ごとのカスタム設定
// 大会ブランチでは custom/ と public/custom/ 以外を編集しないことで、
// custom-template の更新をコンフリクトなく取り込めるようにする

export const customConfig = {
  // create画面のレイアウト選択肢に表示する名前
  label: "SMASH NEXT",
  // Adobe Fontsを使う場合のキットID（使わない場合は空文字）
  typekitKitId: "",
  // Next画面の文言
  next: {
    now: "NOW",
    next: "NEXT",
    localTime: "Local Time",
    timezone: "JST",
  },
  // 操作画面のラウンド選択ボタン
  // キーが1段目のボタン、値が2段目のボタン（"区分 選択肢" の形でラウンド名になる）
  rounds: {
    Winners: [
      "Top256",
      "Top192",
      "Top128",
      "Top96",
      "Top64",
      "Top48",
      "Top32",
      "Top24",
      "Top16",
      "Top12",
      "Top8",
      "Quarters",
      "Semis",
      "Finals",
    ],
    Losers: [
      "Top256",
      "Top192",
      "Top128",
      "Top96",
      "Top64",
      "Top48",
      "Top32",
      "Top24",
      "Top16",
      "Top12",
      "Top8",
      "Quarters",
      "Semis",
      "Finals",
    ],
    Pools: ["Finals"],
    Grand: ["Finals", "Finals Reset"],
    True: ["Finals"],
    Friendlies: [],
  } as Record<string, string[]>,
  // Top8ブラケットの各枠の位置
  bracketPositions: {
    grandFinalReset: [{ top: "438px", left: "1505px" }],
    grandFinal: [{ top: "438px", left: "1505px" }],
    winnersFinal: [{ top: "217px", left: "801px" }],
    winnersSemiFinal: [
      { top: "120px", left: "110px" },
      { top: "314px", left: "110px" },
    ],
    losersFinal: [{ top: "780px", left: "1146px" }],
    losersSemiFinal: [{ top: "780px", left: "801px" }],
    losersQuarterFinal: [
      { top: "683px", left: "456px" },
      { top: "877px", left: "456px" },
    ],
    losersRound: [
      { top: "683px", left: "110px" },
      { top: "877px", left: "110px" },
    ],
  } as { [key: string]: { top: string; left: string }[] },
}

// オーバーレイ画像（public/custom/ 配下）
export const customImage = {
  // create画面のレイアウト選択肢のサムネイル
  thumbnail: "/custom/thumbnail.png",
  scoreboard: "/custom/scoreboard.png",
  camera: "/custom/camera.png",
  mc: (count: number) => `/custom/mc/MC_${count}.png`,
  next: "/custom/next.png",
  bracket: "/custom/bracket.png",
}
