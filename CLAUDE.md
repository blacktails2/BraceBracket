# BraceBracket テスト実装計画

## 概要

このドキュメントでは、BraceBracketプロジェクトにおけるテスト実装の包括的な計画を記述します。
単体テストにはvitest（In-Source Testing方式）、E2EテストにはPlaywrightを使用します。

## プロジェクト概要

- **技術スタック**: Next.js 12.1.6 + React 18.1.0 + TypeScript
- **目的**: 格闘ゲームのスコアボード表示ツール（OBS連携）
- **データベース**: Firebase Realtime Database
- **外部API**: Start.gg API

## テスト戦略

### 1. 単体テスト (vitest + In-Source Testing)

#### 1.1 セットアップ

```json
// 必要なパッケージ
{
  "devDependencies": {
    "vitest": "^latest",
    "@testing-library/react": "^latest",
    "@testing-library/user-event": "^latest",
    "@testing-library/react-hooks": "^latest",
    "jsdom": "^latest",
    "@vitest/ui": "^latest",
    "happy-dom": "^latest"
  }
}
```

#### 1.2 vitest設定 (vitest.config.ts)

```typescript
import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    includeSource: ['libs/**/*.{js,ts}', 'components/**/*.{tsx,ts}', 'hooks/**/*.{ts,tsx}'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.stories.*',
        '.next/'
      ]
    }
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

#### 1.3 テスト対象と優先順位

**最優先（純粋関数）**

1. `libs/utils.ts`
    - `sha1()` - SHA-1ハッシュ生成
    - `getNameAndTeamtag()` - プレイヤー名とチームタグの解析
    - `capitalize()` - 文字列の大文字変換
    - `getTournarySlug()`, `getEventSlug()`, `getPhaseId()`, `getPhaseGroupId()` - URL解析関数

2. `stories/helper/deepCopy.ts`
    - `deepCopy()` - オブジェクトのディープコピー

**高優先（基本コンポーネント）**

1. フォームコンポーネント
    - `components/parts/NumberForm.tsx`
    - `components/parts/TextForm.tsx`
    - `components/parts/SelectForm.tsx`
    - `components/parts/CheckBoxForm.tsx`

2. UIコンポーネント
    - `components/parts/Button.tsx`
    - `components/parts/IconButton.tsx`
    - `components/parts/TextboxWithCopy.tsx`

**中優先（カスタムフック）**

1. `hooks/useOrigin.ts` - Firebaseに依存しない
2. `hooks/useDatabaseValue.ts` - 汎用Firebaseフック（要モック）
3. `hooks/useScore.ts`, `hooks/useMC.ts`, `hooks/useMatchIntervalInfo.ts` - ビジネスロジック

**低優先（複雑なコンポーネント）**

1. OBS表示用コンポーネント（`Scoreboard`, `MC`, `Bracket`）
2. 設定画面（`Create`, `Control`）

#### 1.4 In-Source Testing 実装例

```typescript
// libs/utils.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// In-Source Test
if (import.meta.vitest) {
  const {describe, it, expect} = import.meta.vitest

  describe('capitalize', () => {
    it('should capitalize first letter and lowercase the rest', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
      expect(capitalize('hELLo WoRLD')).toBe('Hello world')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
      expect(capitalize('Z')).toBe('Z')
    })
  })
}
```

### 2. E2Eテスト (Playwright)

#### 2.1 セットアップ

```json
// 必要なパッケージ
{
  "devDependencies": {
    "@playwright/test": "^latest",
    "playwright": "^latest"
  }
}
```

#### 2.2 Playwright設定 (playwright.config.ts)

```typescript
import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: {...devices['Desktop Firefox']},
    },
    {
      name: 'webkit',
      use: {...devices['Desktop Safari']},
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

#### 2.3 E2Eテストシナリオ

**最優先シナリオ**

1. **スコアボード作成フロー**
    - `/create`にアクセス
    - 設定フォームに入力
    - プレビュー確認
    - OBS用URLの生成と確認

2. **スコアボード操作フロー**
    - `/control`でスコア操作
    - リアルタイム更新の確認
    - プレイヤー名変更
    - スコアリセット

3. **Start.gg連携フロー**
    - URLからトーナメント情報取得
    - Stream Queueの表示
    - 自動プレイヤー名設定

**中優先シナリオ**

1. **OBS表示確認**
    - 各OBSページ（`/obs/score`, `/obs/mc`, `/obs/bracket`, `/obs/next`）の表示
    - リアルタイム更新の動作確認

2. **レスポンシブ対応**
    - モバイル表示の確認
    - タブレット表示の確認

### 3. モック戦略

#### 3.1 Firebase モック (test/mocks/firebase.ts)

```typescript
import {vi} from 'vitest'

export const mockDatabase = {
  ref: vi.fn(() => mockRef),
  get: vi.fn(() => Promise.resolve(mockSnapshot)),
  set: vi.fn(() => Promise.resolve()),
  onValue: vi.fn((ref, callback) => {
    callback(mockSnapshot)
    return () => {
    } // unsubscribe function
  }),
  off: vi.fn(),
}

export const mockRef = {
  child: vi.fn(() => mockRef),
}

export const mockSnapshot = {
  val: vi.fn(() => ({})),
  exists: vi.fn(() => true),
}

vi.mock('@/libs/firebase', () => ({
  database: mockDatabase,
}))
```

#### 3.2 Start.gg API モック

MSWを使用したAPIモックの実装を推奨：

```typescript
import {rest} from 'msw'
import {setupServer} from 'msw/node'

export const handlers = [
  rest.post('https://api.start.gg/gql/alpha', (req, res, ctx) => {
    return res(ctx.json({ /* mock response */}))
  }),
]

export const server = setupServer(...handlers)
```

### 4. CI/CD設定

#### 4.1 GitHub Actions (.github/workflows/test.yml)

```yaml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn test:unit
      - run: yarn test:coverage

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: npx playwright install --with-deps
      - run: yarn test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 5. package.json スクリプト追加

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### 6. 実装スケジュール（推奨）

**Phase 1: 基盤構築（1週間）**

- vitestとPlaywrightのセットアップ
- テスト環境の設定
- CI/CDパイプラインの構築

**Phase 2: 純粋関数のテスト（1週間）**

- `libs/utils.ts`の全関数テスト
- helperファイルのテスト
- カバレッジ目標: 100%

**Phase 3: コンポーネントテスト（2週間）**

- 基本フォームコンポーネント
- UIコンポーネント
- カバレッジ目標: 80%

**Phase 4: カスタムフックテスト（1週間）**

- Firebaseモックの実装
- 各フックのテスト
- カバレッジ目標: 70%

**Phase 5: E2Eテスト（2週間）**

- 主要シナリオの実装
- クロスブラウザテスト
- パフォーマンステスト

### 7. テストコマンド

```bash
# 単体テスト実行
yarn test

# 単体テスト（ウォッチモード）
yarn test:watch

# 単体テスト（UIモード）
yarn test:ui

# カバレッジレポート生成
yarn test:coverage

# E2Eテスト実行
yarn test:e2e

# E2Eテスト（UIモード）
yarn test:e2e:ui

# E2Eテスト（デバッグモード）
yarn test:e2e:debug

# 全テスト実行
yarn test:unit && yarn test:e2e
```

### 8. ベストプラクティス

1. **In-Source Testing**
    - テストはプロダクションコードの直下に記述
    - `if (import.meta.vitest)`ブロックで囲む
    - プロダクションビルドでは自動的に除外

2. **テストの命名規則**
    - 単体テスト: 関数名やコンポーネント名を使用
    - E2Eテスト: ユーザーシナリオを説明する名前

3. **モックの使用**
    - 外部依存（Firebase, API）は必ずモック化
    - モックは`test/mocks/`に集約
    - 実装の詳細ではなく、インターフェースをモック

4. **アサーション**
    - 1テストケース1アサーションを基本とする
    - エラーケースも必ずテスト
    - 境界値のテストを含める

5. **E2Eテスト**
    - ページオブジェクトパターンの採用
    - 待機処理は明示的に
    - スクリーンショットでビジュアルリグレッション検知