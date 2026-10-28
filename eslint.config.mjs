import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"
import importPlugin from "eslint-plugin-import"
import tailwindcss from "eslint-plugin-tailwindcss"
import unusedImports from "eslint-plugin-unused-imports"
import { configs as tseslintConfigs } from "typescript-eslint"

/**
 * ESLint の設定（Next.js 16 で next lint が廃止されたため .eslintrc.json から移行）
 * 移行前の extends:
 *   next/core-web-vitals, plugin:@typescript-eslint/recommended,
 *   plugin:import/recommended, plugin:import/typescript,
 *   plugin:tailwindcss/recommended, prettier
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "storybook-static/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  // eslint-config-next が登録済みのプラグインを使い、ルールだけを追加する
  {
    name: "bracebracket/recommended-rules",
    rules: {
      ...tseslintConfigs.recommended
        .map((c) => c.rules ?? {})
        .reduce((acc, rules) => ({ ...acc, ...rules }), {}),
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
    },
    settings: importPlugin.flatConfigs.typescript.settings,
  },
  {
    name: "bracebracket/tailwindcss",
    plugins: { tailwindcss },
    rules: tailwindcss.configs.recommended.rules,
  },
  {
    name: "bracebracket/rules",
    plugins: { "unused-imports": unusedImports },
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
      // typescript-eslint v8 で recommended から外れたが、移行前と同じく有効にする
      "@typescript-eslint/no-empty-function": "error",
      // eslint-plugin-react-hooks v7 で追加された React Compiler 向けのルール。
      // 既存コードの書き方（useEffect 内での setState など）を変えずに移行するため無効にする
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/incompatible-library": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "off",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          // import groups の間 1行あける
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          // 大文字小文字関係なくアルファベット順にしたい
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "**/*.scss", group: "type", position: "before" },
          ],
        },
      ],
      "tailwindcss/no-custom-classname": [
        1,
        { whitelist: ["board", "delay-50"] },
      ],
      "tailwindcss/classnames-order": 0,
    },
  },
  {
    // Playwright のフィクスチャの use() が React Hooks と誤認されるため
    name: "bracebracket/e2e",
    files: ["e2e/**"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
  prettier,
]

export default config
