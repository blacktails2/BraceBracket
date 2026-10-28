import { createRequire } from "node:module"
import path from "node:path"

import type { StorybookConfig } from "@storybook/nextjs"

const require = createRequire(import.meta.url)
const packageDir = (name: string) =>
  path.dirname(require.resolve(`${name}/package.json`))

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    // @storybook/nextjs は React を Next.js 同梱の React（19系）に差し替えるが、
    // Pages Router のアプリはインストール済みの React（18系）で動くため、本番と同じものを使う
    const react = packageDir("react")
    const reactDom = packageDir("react-dom")
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...config.resolve.alias,
      react,
      "react-dom$": reactDom,
      "react-dom/client": path.join(reactDom, "client"),
      "react-dom/server": path.join(reactDom, "server"),
    }
    return config
  },
}

export default config
