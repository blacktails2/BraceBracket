/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config")
const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (config) => config
const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  trailingSlash: true,
  i18n,
})

module.exports = nextConfig
