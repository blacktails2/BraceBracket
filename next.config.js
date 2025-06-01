/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config")
const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (config) => config
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

const nextConfig = withMDX(
  withBundleAnalyzer({
    reactStrictMode: true,
    trailingSlash: true,
    i18n,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    compiler: {
      // React 19のjsxランタイムを使用
      reactRemoveProperties: true,
    },
    experimental: {
      // React 19の新しい機能を有効化
      reactCompiler: false,
    },
  })
)

module.exports = nextConfig
