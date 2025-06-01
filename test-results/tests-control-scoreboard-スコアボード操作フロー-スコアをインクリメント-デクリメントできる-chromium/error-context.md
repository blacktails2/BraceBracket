# Test info

- Name: スコアボード操作フロー >> スコアをインクリメント/デクリメントできる
- Location: /Users/to-hutohu/workspace/BraceBracket/e2e/tests/control-scoreboard.spec.ts:48:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveValue(expected)

Locator: getByTestId('p1-score')
Expected string: "2"
Received string: "0"
Call log:
  - expect.toHaveValue with timeout 5000ms
  - waiting for getByTestId('p1-score')
    9 × locator resolved to <input type="number" id="p1.score" name="p1.score" data-testid="p1-score" class="NumberForm_input__XW6Iu"/>
      - unexpected value "0"

    at ControlPage.expectCurrentScores (/Users/to-hutohu/workspace/BraceBracket/e2e/pages/control.page.ts:154:53)
    at /Users/to-hutohu/workspace/BraceBracket/e2e/tests/control-scoreboard.spec.ts:60:23
```

# Page snapshot

```yaml
- text: Score Interval MC Bracket
- button "適用する"
- button "変更をリセット"
- heading "ROUND" [level=6]
- textbox "Grand Final": Pools
- text: Winners Losers Pools Grand Friendlies Finals
- heading "SET INFO" [level=6]
- textbox "Best of 3"
- text: Best of 3 Best of 5 全て大文字にする
- separator
- heading "1P" [level=6]
- combobox "1P Team": P1 Team
- combobox "1P Player": P1 Name
- heading "ALL RESET" [level=6]
- spinbutton: "0"
- spinbutton: "0"
- heading "SCORE RESET" [level=6]
- heading "2P" [level=6]
- combobox "2P Team": P2 Team
- combobox "2P Player": P2 Name
- alert
```

# Test source

```ts
   54 |     await this.page.getByTestId("p1-score-increment").click()
   55 |   }
   56 |
   57 |   async decrementPlayer1Score() {
   58 |     await this.page.getByTestId("p1-score-decrement").click()
   59 |   }
   60 |
   61 |   async incrementPlayer2Score() {
   62 |     await this.page.getByTestId("p2-score-increment").click()
   63 |   }
   64 |
   65 |   async decrementPlayer2Score() {
   66 |     await this.page.getByTestId("p2-score-decrement").click()
   67 |   }
   68 |
   69 |   async swapPlayers() {
   70 |     await this.page.getByTestId("swap-players").click()
   71 |   }
   72 |
   73 |   async resetScores() {
   74 |     await this.page.getByTestId("reset-scores").click()
   75 |   }
   76 |
   77 |   async submitScoreChanges() {
   78 |     await this.page.getByTestId("score-submit").click()
   79 |     // tooltip "Changed!" が表示されるのを待つ
   80 |     await this.page.getByText("Changed!").waitFor({ timeout: 3000 })
   81 |   }
   82 |
   83 |   // ラウンド選択
   84 |   async selectRound(round: string) {
   85 |     await this.selectOption('select[name="round"]', round)
   86 |   }
   87 |
   88 |   // マッチタイプ選択
   89 |   async selectMatchType(type: "ft2" | "ft3" | "ft5" | "ft10") {
   90 |     await this.click(`button[data-match-type="${type}"]`)
   91 |   }
   92 |
   93 |   // MC機能
   94 |   async setMCText(line: number, text: string) {
   95 |     await this.fill(`input[name="mcLine${line}"]`, text)
   96 |   }
   97 |
   98 |   async clearMCText() {
   99 |     await this.click('button[data-action="clear-mc"]')
  100 |   }
  101 |
  102 |   // Next Match機能
  103 |   async setNextMatch(matchIndex: number) {
  104 |     await this.click(`button[data-next-match="${matchIndex}"]`)
  105 |   }
  106 |
  107 |   // Start.gg Stream Queue
  108 |   async refreshStreamQueue() {
  109 |     await this.click('button[data-action="refresh-queue"]')
  110 |   }
  111 |
  112 |   async selectStreamQueueMatch(index: number) {
  113 |     await this.click(`tr[data-queue-index="${index}"]`)
  114 |   }
  115 |
  116 |   async getStreamQueueCount() {
  117 |     const rows = await this.page.$$("tr[data-queue-index]")
  118 |     return rows.length
  119 |   }
  120 |
  121 |   // Top8ブラケット
  122 |   async updateBracketPlayer(position: string, name: string) {
  123 |     await this.fill(`input[name="bracket-${position}"]`, name)
  124 |   }
  125 |
  126 |   async updateBracketScore(matchId: string, player: 1 | 2, score: number) {
  127 |     await this.fill(
  128 |       `input[name="bracket-${matchId}-p${player}"]`,
  129 |       score.toString()
  130 |     )
  131 |   }
  132 |
  133 |   // 現在の値を取得
  134 |   async getCurrentScores() {
  135 |     const p1Score = await this.page.getByTestId("p1-score").inputValue()
  136 |     const p2Score = await this.page.getByTestId("p2-score").inputValue()
  137 |     return {
  138 |       player1: parseInt(p1Score || "0"),
  139 |       player2: parseInt(p2Score || "0"),
  140 |     }
  141 |   }
  142 |
  143 |   async getCurrentPlayerNames() {
  144 |     const p1Name = await this.page.getByTestId("p1-name").inputValue()
  145 |     const p2Name = await this.page.getByTestId("p2-name").inputValue()
  146 |     return {
  147 |       player1: p1Name || "",
  148 |       player2: p2Name || "",
  149 |     }
  150 |   }
  151 |
  152 |   // Auto-waitingを活用したアサーション
  153 |   async expectCurrentScores(player1Score: number, player2Score: number) {
> 154 |     await expect(this.page.getByTestId("p1-score")).toHaveValue(player1Score.toString())
      |                                                     ^ Error: Timed out 5000ms waiting for expect(locator).toHaveValue(expected)
  155 |     await expect(this.page.getByTestId("p2-score")).toHaveValue(player2Score.toString())
  156 |   }
  157 |
  158 |   async expectCurrentPlayerNames(player1Name: string, player2Name: string) {
  159 |     await expect(this.page.getByTestId("p1-name")).toHaveValue(player1Name)
  160 |     await expect(this.page.getByTestId("p2-name")).toHaveValue(player2Name)
  161 |   }
  162 |
  163 |   async getCurrentRound() {
  164 |     return await this.page.evaluate(() => {
  165 |       const select = document.querySelector(
  166 |         'select[name="round"]'
  167 |       ) as HTMLSelectElement
  168 |       return select?.value || ""
  169 |     })
  170 |   }
  171 |
  172 |   // エラーメッセージ
  173 |   async getErrorMessage() {
  174 |     const errorElement = await this.page.$(".error-message")
  175 |     if (errorElement) {
  176 |       return await errorElement.textContent()
  177 |     }
  178 |     return null
  179 |   }
  180 |
  181 |   // 成功メッセージ
  182 |   async getSuccessMessage() {
  183 |     const successElement = await this.page.$(".success-message")
  184 |     if (successElement) {
  185 |       return await successElement.textContent()
  186 |     }
  187 |     return null
  188 |   }
  189 | }
  190 |
```