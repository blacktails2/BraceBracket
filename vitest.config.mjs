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
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*"
    ],
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
        "e2e/",
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
