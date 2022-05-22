<img src="https://wolphtype.com/img/materials/bracebracket.png" style="width:auto;height:auto;">

# BraceBracket

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/blacktails2/BraceBracket?type-example-CCB280&include_prereleases)

<a href="https://github.com/blacktails2/BraceBracket/releases">ダウンロードページ</a>

<img src="https://wolphtype.com/img/materials/example.png" style="width:600px;height:auto;">

BraceBracketは格闘ゲームにおけるスコアボードを動的に表示するツールです。OBSなどのWebページを表示する配信ソフトで使うことができ、jsonおよびGoogleスプレッドシートを使ってデータを編集するためリモートでの編集が可能です。

中–大規模の大会よりも、小規模な大会や対戦会、窓対抗戦やサーバー内大会などをターゲットに制作しています。

### デモ

以下のURLをOBSに配置し、<a href="https://docs.google.com/spreadsheets/d/1EGa5Ha1ERYAZ_GW9ImiHcn19v29xSExyKtJCGGpDqXs/edit?usp=sharing">こちらのスプレッドシート</a>を編集してみてください。スコアの編集を試すことができます。
```bracebracket-demo.surge.sh```

### メリット
- jsonおよびGoogleスプレッドシートを使ってデータを編集するため、Mac、Windows、LinuxなどのOSに依存せず使用可能
- Googleスプレッドシートを用いた編集により、配信者ではなく遠隔の協力者や視聴者がデータを更新できる
- HTMLおよびCSSの知識があれば文字要素の追加やデザインの変更が可能
- デザインテンプレートを複数（ver.1.1現在17種）用意。Adobe Illustratorデータのサンプルを用いてオリジナルのデザインも製作可能

### デメリット
- HTML、CSS、Google Apps Scriptなどの複数ツールを使うため軽い前提知識が必要（手順通りにやればそんなに難しくないです）
- 現段階ではデータ更新時や試合開始時のアニメーション未実装
- Googleスプレッドシートを用いて複数人でデータを編集する場合、スプレッドシートの作成者および場合によっては編集者のGoogleアカウント名（本名）が他の編集者に見られてしまう可能性があります

## ダウンロード

<a href="https://github.com/blacktails2/BraceBracket/releases">リリースページ</a>よりダウンロードできます。正式版では使い方などを載せ、またWeb上でスコアボードを作成・編集できるWebサイトを製作予定です。

## チュートリアル

Youtubeに解説動画をアップロードしたのでこちらもご参照ください。

[![](https://img.youtube.com/vi/wnK_T8ZJjTk/0.jpg)](https://www.youtube.com/watch?v=wnK_T8ZJjTk)


### 導入方法

特に内容のカスタマイズを行わない場合の設定方法を解説します。

#### 2種類のレイアウトについて

ダウンロードしたzipを解凍します。その中の`index.html`, `single.html`, `solid.html`, `simple.html`, `image`フォルダが主に扱うものになります。
BraceBracketでは大きく分けて**Dualレイアウト**と**Singleレイアウト**、**Solidレイアウト**、**Simpleレイアウト**があり、`index.html`を指定するとDualレイアウトを、`single.html`を指定するとSingleレイアウト、`solid.html`を指定するとSolidレイアウト、`simple.html`を指定するとSimpleレイアウトを使うことができます。そのため、OBSでの指定やカスタマイズは使用したいレイアウトのhtmlを扱ってください。

<img src="https://wolphtype.com/img/materials/dual_single.png" style="width:auto;height:auto;">

#### データの更新方法の設定

BraceBracketではjsonとGoogleスプレッドシートを扱いデータの更新ができます。optionの欄では、`<br>`を入れることで改行できます。

##### A.配信者がデータを編集する場合（ローカルでjsonデータを編集）

フォルダ内にある`localscore.json`を編集することでデータの更新ができます。`""`は削除せず記入・保存してください。テキストエディタを持っていない場合は <a href="https://azure.microsoft.com/ja-jp/products/visual-studio-code/">VSCode</a>などをインストールすると良いでしょう。
```json
[
{
  "name": "1Pのプレイヤー名",
  "team": "1Pのチーム名（なしでもOK）",
  "score": "1Pのスコア（数字）",
  "id": "1PのTwitterID（カメラレイアウトを使用する場合）",
  "status": "1P側、singleレイアウトでは上に表示される大会ステータス（Winners Semiなど）",
  "option": "スコアボード中央に表示される大会名、企画名（ロゴ画像を配置する場合はなし）"
},
{
  "name": "2Pのプレイヤー名",
  "team": "2Pのチーム名（なしでもOK）",
  "score": "2Pのスコア（数字）",
  "id": "2PのTwitterID（カメラレイアウトを使用する場合）",
  "status": "2P側、singleレイアウトでは下に表示される大会ステータス（Best of 3など）",
  "option": "使用しません"
}]
```

##### B.やや上級者向け・遠隔でデータを編集する場合（リモートでGoogleスプレッドシートを編集）

Googleスプレッドシートでデータの編集をする場合はいくつか作業が必要です。

<img src="https://wolphtype.com/img/materials/copy.png" style="width:800px;height:auto;">

まず、<a href="https://docs.google.com/spreadsheets/d/1EGa5Ha1ERYAZ_GW9ImiHcn19v29xSExyKtJCGGpDqXs/edit?usp=sharing">こちらのスプレッドシート</a>を開き`ファイル>コピーを作成`を選択してください。

<img src="https://wolphtype.com/img/materials/spreadsheets.png" style="width:800px;height:auto;">

次に、Googleスプレッドシートのツールバーから`拡張機能>Apps Script`を選択します。Apps Scriptのページが開くので、下記のコードが入力されていることを確認してください。
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

右上の「デプロイ」→「新しいデプロイ」を選択し、左上の「種類の選択」からウェブアプリを選択します。

<img src="https://wolphtype.com/img/materials/deploy.png" style="width:800px;height:auto;">

実行するユーザーは「自分」、アクセスできるユーザーは「全員」にしデプロイします。

場合によっては**「このウェブアプリケーションを使用するには、データへのアクセスを許可する必要があります」**というダイアログが出てくるので、画像の通り「アクセスの承認」をクリックし、次に「このアプリは Googleで確認されていません」という画面が出てきたら左下の「詳細」→「xxx（安全ではないページ）に移動」をクリックします。すると認証画面が出てくるので、右下の「許可」をクリックします。

<img src="https://wolphtype.com/img/materials/accept.png" style="width:800px;height:auto;">

するとウェブアプリのURLが表示されるため、こちらをコピーします。（試しにこのURLを開いてみるとスプレッドシートの内容がjsonで出力されているはずです）

最後に、`index.html`もしくは`single.html`、`solid.html`、`simple.html`をエディタで開き、下部にある`const endpoint = "localscore.json";`の`localscore`部分をコピーしたGoogle Apps ScriptのURLをペーストし保存します。これで設定は完了です。

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

ソースからブラウザ（Webページ）を追加し、ローカルファイルにチェックを入れます。フォルダ内の`index.html`もしくは`single.html`、`solid.html`、`simple.html`を選択し、幅を1920px、高さを1080pxにして配置します。

<img src="https://wolphtype.com/img/materials/obs.png" style="width:800px;height:auto;">

##### B.上級者向け・サーバーにアップロードして指定する

フォルダをサーバーにアップロードします。（npmやyarnを使っているならば<a href="https://surge.sh">Surge</a>などが良いでしょう）配信ソフトでソースからブラウザ（Webページ）を追加し、アップロードしたURLを指定します。（`http://xxx.xxx/index.html`もしくは`http://xxx.xxx/single.html`、`http://xxx.xxx/solid.html`、`http://xxx.xxx/simple.html`のようになります。）幅を1920px、高さを1080pxにして配置します。

この方法は、視聴者が設定やデータの更新を行い、配信者にはOBSの設定だけを行ってもらうなど、配信者に手間をかけたくない場合に有効です。

### カスタマイズ（上級者向け）

デザインのカスタマイズや要素の追加をする場合はscssのコンパイルが必要になります。yarnを導入し、`yarn watch`を使いながら確認すると良いでしょう。

#### スコアボードのデザイン

##### 既存デザインテンプレートを利用する

<img src="https://wolphtype.com/img/materials/variations.png" style="width:auto;height:auto;">

`image/scoreboards`に入っているデザインを利用することができます。使用したいデザインを`image`フォルダにコピーし、`dualmain.png`および`singlemain.png`、`solidmain.png`、`simplemain.png`にファイル名を変更してください。（既存の`dualmain.png`および`singlemain.png`、`solidmain.png`、`simplemain.png`は削除してください。）

<img src="https://wolphtype.com/img/materials/maindesign.png" style="width:800px;height:auto;">

デザインによっては文字の色の変更が必要です。`scss/_dual.scss`および`scss/_single.scss`、`scss/_solid.scss`、`scss/_simple.scss`の変数を編集することで文字色が変更できます。

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
また、`Sample Text`レイヤーと`Sample Image`レイヤーはプレビュー用のレイヤーなので書き出す際は`Design(Export)`レイヤーのみを表示して書き出してください。書き出しの際は三階ラボさんの<a href="https://onthehead.com/ais/export001/">Artboard Exporter</a>を使い、倍率200%の透過pngで書き出すのが便利です。

#### 要素の追加、スタイルの編集

情報を追加したり文字情報のフォントや位置情報を変更する場合は`index.html, single.html, solid.html, simple.html, _dual.scss, _single.scss, _solid.scss, _simple.scss`を編集してください。位置の指定は全て`position: fixed;`の絶対値指定が便利です。

### 大会ロゴ

大会のロゴをスコアボードの中央に表示することができます。透過pngのロゴのファイル名を`logo.png`にして`image`フォルダに配置することで、自動でサイズと位置の調整を行なわれ配置されます。デフォルトでドロップシャドウがかかっている状態になっており、細かい調整はSCSSから行うことができます。

大会ロゴを非表示にしたい場合は、`image/logo.png`を削除するか`index.html, single.html, solid.html, simple.html`内の`<div class='xxx_logobox'>`に`disable`クラスを追加してください。

## 開発への参加

本ソフトウェアは現在ベータ版です。開発に参加してくださる方は<a href="https://github.com/blacktails2/BraceBracket/blob/main/contribution.md">こちらのページ</a>を参照してください。

## コミュニティ

ユーザーサポートおよび開発コミュニティをDiscordサーバーとして設立しました。詳しくは<a href="https://twitter.com/wolphtype/status/1527251462421553154" title="">こちら</a>をご覧ください。

## ライセンス

本プロジェクトは<a href="https://github.com/blacktails2/BraceBracket/blob/main/LICENSE">Apache License 2.0</a>でライセンスされています。