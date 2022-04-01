<img src="https://wolphtype.com/img/materials/bracebracket.png" style="width:150px;height:auto;margin-left: auto;margin-right: auto;display: block;">

# BraceBracket

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/blacktails2/BraceBracket?type-example-CCB280&include_prereleases)

<img src="https://wolphtype.com/img/materials/example.png" style="width:600px;height:auto;">

BraceBracketは格闘ゲームにおけるスコアボードを動的に表示するツールです。OBSなどのWebページを表示する配信ソフトで使うことができ、jsonおよびGoogleスプレッドシートを使ってデータを編集するためリモートでの編集が可能です。

### メリット
- jsonおよびGoogleスプレッドシートを使ってデータを編集するため、Mac、Windows、LinuxなどのOSに依存せず使用可能
- Googleスプレッドシートを用いた編集により、配信者ではなく遠隔の協力者や視聴者がデータを更新できる
- HTMLおよびCSSの知識があれば文字要素の追加やデザインの変更が可能
- デザインテンプレートを複数（ver.0.1現在9種）用意。Adobe Illustratorデータのサンプルを用いてオリジナルのデザインも製作可能

### デメリット
- HTML、CSS、Google Apps Scriptなどの複数ツールを使うため軽い前提知識が必要（手順通りにやればそんなに難しくないです）
- 現段階ではデータ更新時や試合開始時のアニメーション未実装
- Googleスプレッドシートを用いて複数人でデータを編集する場合、スプレッドシートの作成者および場合によっては編集者のGoogleアカウント名（本名）が他の編集者に見られてしまう可能性があります

## ダウンロード

<a href="https://github.com/blacktails2/BraceBracket/releases">リリースページ</a>よりダウンロードできます。正式版ではチュートリアルなどを含めたWebサイトを製作予定です。

## チュートリアル

### 導入方法

特に内容のカスタマイズを行わない場合の設定方法を解説します。

#### 2種類のレイアウトについて

ダウンロードしたzipを解凍します。その中の`index.html`, `single.html`, `image`フォルダが主に扱うものになります。
BraceBracketでは大きく分けて**Dualレイアウト**（画像上）と**Singleレイアウト**（画像下）があり、`index.html`を指定するとDualレイアウトを、`single.html`を指定するとSingleレイアウトを使うことができます。（データは同じものを参照します。）そのため、OBSでの指定やカスタマイズは使用したいレイアウトのhtmlを扱ってください。

<img src="https://wolphtype.com/img/materials/dual_single.png" style="width:auto;height:auto;">

#### データの更新方法の設定

BraceBracketではjsonとGoogleスプレッドシートを扱いデータの更新ができます。optionの欄では、`<br>`を入れることで改行できます。

##### A.配信者がデータを編集する場合（ローカルでjsonデータを編集）

フォルダ内にある`localscore.json`を編集することでデータの更新ができます。
```json
[
{
  "name": "1Pのプレイヤー名",
  "team": "1Pのチーム名（なしでもOK）",
  "score": "1Pのスコア（数字）",
  "status": "1P側、singleレイアウトでは上に表示される大会ステータス（Winners Semiなど）",
  "option": "スコアボード中央に表示される大会名、企画名（ロゴ画像を配置する場合はなし）"
},
{
  "name": "2Pのプレイヤー名",
  "team": "2Pのチーム名（なしでもOK）",
  "score": "2Pのスコア（数字）",
  "status": "2P側、singleレイアウトでは下に表示される大会ステータス（Best of 3など）",
  "option": "こちらは使用しないため記入なし"
}]
```

##### B.遠隔でデータを編集する場合（リモートでGoogleスプレッドシートを編集）

Googleスプレッドシートでデータの編集をする場合はいくつか作業が必要です。

<a href="https://docs.google.com/spreadsheets">Googleスプレッドシート</a>で空白新規スプレッドシートを作成します。もしくは、<a href="https://docs.google.com/spreadsheets/d/1EGa5Ha1ERYAZ_GW9ImiHcn19v29xSExyKtJCGGpDqXs/edit?usp=sharing">こちらのデモ</a>を複製でもOKです。

<img src="https://wolphtype.com/img/materials/spreadsheets.png" style="width:800px;height:auto;">

上記の画像のように入力します。1行目の内容（name, team, score, status, option）は変更しないでください。

次に、Googleスプレッドシートのツールバーから`拡張機能>Apps Script`を選択します。Apps Scriptのページが開くので、デフォルトで入力されている`function myFunction() {}`を削除し、フォルダ内にある`appsscript.gs`、もしくは下のコードをコピーペーストします。
```javascript
function getData(sheetName) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  var rows = sheet.getDataRange().getValues();
  var keys = rows.splice(0, 1)[0];
  return rows.map(function(row) {
    var obj = {};
    row.map(function(item, index) {
      obj[String(keys[index])] = String(item);
    });
    return obj;
  });
}
function doGet() {
  var data = getData('sh1');
  return ContentService.createTextOutput(JSON.stringify(data, null, 2))
  .setMimeType(ContentService.MimeType.JSON);
}
```

<img src="https://wolphtype.com/img/materials/appsscript.png" style="width:800px;height:auto;">

右上のデプロイボタンを選択し、左上の「種類の選択」からウェブアプリを選択します。

<img src="https://wolphtype.com/img/materials/deploy.png" style="width:800px;height:auto;">

説明文は適当に記入し、実行するユーザーは「自分」、アクセスできるユーザーは「全員」にしデプロイします。するとウェブアプリのURLが表示されるため、こちらをコピーします。（試しにこのURLを開いてみるとスプレッドシートの内容がjsonで出力されているはずです）

最後に、`index.html`もしくは`single.html`をエディタで開き、下部にある`const endpoint = "localscore.json";`の`localscore`部分をコピーしたGoogle Apps ScriptのURLをペーストし保存します。これで設定は完了です。

##### 注意点
Googleスプレッドシートを複数人で編集する場合、リンクでアクセスする人は匿名として表示されますが、**スプレッドシートの製作者はアカウント名が表示されてしまいます**。そのため、複数人で編集する場合は他人に見られても問題ないアカウント名のGoogleアカウントでスプレッドシートを作成すると良いでしょう。

```javascript
const endpoint = "localscore.json";
↓
const endpoint = "https://script.google.com/macros/…";
```

#### OBSへの配置

次にOBSおよび他配信ソフトへスコアボードを配置します。

##### A.htmlファイルを直接指定する

ソースからブラウザ（Webページ）を追加し、ローカルファイルにチェックを入れます。フォルダ内の`index.html`もしくは`single.html`を選択し、幅を1920px、高さを1080pxにして配置します。

##### B.サーバーにアップロードして指定する

フォルダをサーバーにアップロードします。（npmやyarnを使っているならば<a href="https://surge.sh">Surge</a>などが良いでしょう）配信ソフトでソースからブラウザ（Webページ）を追加し、アップロードしたURLを指定します。（`http://xxx.xxx/index.html`もしくは`http://xxx.xxx/single.html`のようになります。）幅を1920px、高さを1080pxにして配置します。

この方法は、視聴者が設定やデータの更新を行い、配信者にはOBSの設定だけを行ってもらうなど、配信者に手間をかけたくない場合に有効です。

### デモ

以下のURLをOBSに配置し、<a href="https://docs.google.com/spreadsheets/d/1EGa5Ha1ERYAZ_GW9ImiHcn19v29xSExyKtJCGGpDqXs/edit?usp=sharing">こちらのスプレッドシート</a>を編集してみてください。スコアの編集を試すことができます。
```bracebracket-demo.surge.sh```

### カスタマイズ

デザインのカスタマイズや要素の追加をする場合はscssのコンパイルが必要になります。yarnもしくはnpmを導入し、`npm run`や`yarn watch`を使いながら確認すると良いでしょう。

#### スコアボードのデザイン

##### 既存デザインテンプレートを利用する

<img src="https://wolphtype.com/img/materials/variations.png" style="width:auto;height:auto;">

`image/scoreboards`に入っているデザインを利用することができます。使用したいデザインを`image`フォルダにコピーし、`dualmain.png`および`singlemain.png`にファイル名を変更してください。（既存の`dualmain.png`および`singlemain.png`は削除してください。）

<img src="https://wolphtype.com/img/materials/maindesign.png" style="width:800px;height:auto;">

デザインによっては文字の色の変更が必要です。`scss/_dual.scss`および`scss/_single.scss`の変数を編集することで文字色が変更できます。

```scss
$darkgray: #111111;
$white: #ffffff;
// スコア色:ダークグレー、プレイヤー名:ダークグレー、ステータス:白の場合
$single_scorecolor: $darkgray;
$single_playercolor: $darkgray;
$single_statuscolor: $white;
```
デフォルトで用意された`$white`と`$darkgray`およびHEXでの指定ができます。

```scss
$darkgray: #111111;
$white: #ffffff;
// スコア色:ベージュ、プレイヤー名:白、ステータス:ダークグレーの場合
$single_scorecolor: #CCB280;
$single_playercolor: $white;
$single_statuscolor: $darkgray;
```

##### オリジナルのデザインを制作する

オリジナルのデザインを制作する場合は`image/design_sample.ai`をベースに制作することができます。ボックスのサイズや位置を変更する場合は後述するSCSSの編集も必要となります。
また、`Sample Text`レイヤーと`Sample Image`レイヤーはプレビュー用のレイヤーなので書き出す際は`Design(Export)`レイヤーのみを表示して書き出してください。書き出しの際は三階ラボさんの<a href="https://onthehead.com/ais/export001/">Artboard Exporter</a>を使い、倍率100%の透過pngで書き出すのが便利です。

#### 要素の追加、スタイルの編集

情報を追加したり文字情報のフォントや位置情報を変更する場合は`index.html, single.html, _dual.scss, _single.scss`を編集してください。位置の指定は全て`position: fixed;`の絶対値指定が便利です。

### 大会ロゴ

大会のロゴをスコアボードの中央に表示することができます。透過pngのロゴのファイル名を`logo.png`にして`image`フォルダに配置することで、自動でサイズと位置の調整を行なわれ配置されます。デフォルトでドロップシャドウがかかっている状態になっており、細かい調整はSCSSから行うことができます。

大会ロゴを非表示にしたい場合は、`image/logo.png`を削除するか`index.html, single.html`内の`<div class='xxx_logobox'>`に`disable`クラスを追加してください。

## 開発への参加

本ソフトウェアは現在ベータ版です。開発に参加してくださる方は<a href="https://github.com/blacktails2/BraceBracket/blob/main/contribution.md">こちらのページ</a>を参照してください。

## ライセンス

本プロジェクトは<a href="https://github.com/blacktails2/BraceBracket/blob/main/LICENSE">Apache License 2.0</a>でライセンスされています。