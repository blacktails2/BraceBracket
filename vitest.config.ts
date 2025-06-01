import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    includeSource: [
      "libs/**/*.{js,ts}",
      "components/**/*.{tsx,ts}",
      "hooks/**/*.{ts,tsx}",
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
    "import.meta.vitest": undefined,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
