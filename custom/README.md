# カスタムレイアウト

大会ごとのカスタムデザインは、このブランチ（custom-template）から大会用のブランチを切って作成する。
大会ブランチでは以下だけを編集し、それ以外は custom-template から merge で取り込む。

| ファイル | 内容 |
| --- | --- |
| `custom/config.ts` | create画面の表示名、Next画面の文言、Top8ブラケットの枠の位置、Adobe FontsのキットID |
| `custom/styles/_fonts.scss` | 各画面で使うフォントとウェイト |
| `custom/styles/font-face.scss` | 追加するフォントの `@font-face` |
| `custom/styles/score.scss` | スコアボードの配置・文字色 |
| `custom/styles/mc.scss` | MC画面の配置・文字色 |
| `custom/styles/next.scss` | Next画面の配置・文字色 |
| `custom/styles/bracket.scss` | Top8ブラケットの文字色など |
| `public/custom/` | オーバーレイ画像（1920x1080）とフォントファイル |

`public/custom/` の画像:

- `thumbnail.png`: create画面のレイアウト選択肢のサムネイル（274x80）
- `scoreboard.png`, `camera.png`: スコアボードとカメラ枠
- `mc/MC_1.png` 〜 `mc/MC_4.png`: MCの人数ごとの背景
- `next.png`: Next画面
- `bracket.png`: Top8ブラケット

Firebaseに保存されたレイアウト・カラーの設定は使わず、常にこのカスタムデザインで表示される。
