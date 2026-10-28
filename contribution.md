# 開発への参加方法

本ページをご覧いただきありがとうございます！
BraceBracketのアップデートのためのコントリビューションを歓迎します。

## セットアップ

このプロジェクトでは`yarn`をパッケージマネージャーに採用しています。

```shell
$ yarn
```

## 開発

```shell
$ yarn dev
```

`yarn dev`を使うことで変更をリアルタイムで更新しながら編集できます。

ブラウザで`localhost:3000`を参照してください。

## テスト

```shell
$ yarn test:unit        # Vitest によるユニットテスト
$ yarn test:e2e         # Playwright による E2E テスト（Chromium / Firefox / WebKit）
$ yarn test:e2e:visual  # 見た目の回帰テスト（スクリーンショット比較）
```

E2E テストは本番のデータベースを使わず、Firebase Realtime Database のエミュレータ（`firebase.json` で設定）と
本番ビルドの Next.js をテストの開始時に自動で起動します。エミュレータの実行には Java（21 以上）が必要です。
start.gg・Imgur などの外部サービスへの通信はテスト内でモックしています。

- `E2E_SKIP_BUILD=1` を付けると既存のビルド成果物を使い、`next build` を省略します
- `E2E_DEV=1` を付けると開発サーバー（`next dev`）に対してテストします
- 見た目の回帰テストの基準画像は OS ごとに `e2e/tests/visual.spec.ts-snapshots/` に保存されています。
  意図してデザインを変えたときは `yarn test:e2e:visual --update-snapshots` で更新してください

## ブランチ

`BraceBracket`ではgit flowブランチモデルを採用しています。
`main`がリリース用ブランチ、`develop`が開発用ブランチになっており、機能の追加は適宜`feature`ブランチを切って制作します。

## 今後の開発予定

### 改善点

- データの更新を5秒ごとにjsonをXMLHttpRequestするやり方から変更（賢くなさそうなので）
```js
window.setInterval(remoteScore, 3000);
```
- カスタマイズのしやすさ、設定のしやすさを見据えたコードの整理

### 機能追加

- 複数行のスコアレイアウト、および3on3、団体戦のレイアウトの追加
- データ更新時のアニメーション
- 試合開始時のアニメーションなど

### その他

- 正式版になったら配布用のWebサイトの制作
