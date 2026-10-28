import path from "path"
import { fileURLToPath } from "url"

import react from "@vitejs/plugin-react"
import { configDefaults, defineConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    includeSource: [
      "libs/**/*.{js,ts}",
      "components/**/*.{tsx,ts}",
      "hooks/**/*.{ts,tsx}",
      "stories/helper/**/*.{js,ts}",
    ],
    setupFiles: ["./test/setup.ts"],
    // e2e/ 配下は Playwright のテストなので Vitest の対象から除外する
    exclude: [...configDefaults.exclude, "e2e/**"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.stories.*",
        ".next/",
      ],
    },
  },
  define: {
    "import.meta.vitest": undefined,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
