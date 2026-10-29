// 大会ごとのカスタム設定
// 大会ブランチでは custom/ と public/custom/ 以外を編集しないことで、
// custom-template の更新をコンフリクトなく取り込めるようにする

export const customConfig = {
  // create画面のレイアウト選択肢に表示する名前
  label: "Custom Layout",
  // Adobe Fontsを使う場合のキットID（使わない場合は空文字）
  typekitKitId: "",
  // Next画面の文言
  next: {
    now: "NOW",
    next: "NEXT",
    localTime: "Local Time",
    timezone: "JST",
  },
  // Top8ブラケットの各枠の位置
  bracketPositions: {
    grandFinalReset: [{ top: "400px", left: "1498px" }],
    grandFinal: [{ top: "400px", left: "1498px" }],
    winnersFinal: [{ top: "199px", left: "807px" }],
    winnersSemiFinal: [
      { top: "122px", left: "117px" },
      { top: "276px", left: "117px" },
    ],
    losersFinal: [{ top: "601px", left: "1152px" }],
    losersSemiFinal: [{ top: "601px", left: "807px" }],
    losersQuarterFinal: [
      { top: "524px", left: "462px" },
      { top: "678px", left: "462px" },
    ],
    losersRound: [
      { top: "524px", left: "117px" },
      { top: "678px", left: "117px" },
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
