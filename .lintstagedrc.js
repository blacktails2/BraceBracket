module.exports = {
  "**/*.{ts,tsx}": [
    "eslint --fix --no-warn-ignored --max-warnings 0",
    "prettier --write",
  ],
  "**/*.scss": ["stylelint --fix --max-warnings 0", "prettier --write"],
}
