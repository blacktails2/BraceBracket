import path from "path"
import { fileURLToPath } from 'url'

import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

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
    "import.meta.vitest": "undefined",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
