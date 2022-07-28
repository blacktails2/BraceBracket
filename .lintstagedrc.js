module.exports = {
  "**/*.{ts,tsx}": [
    (filenames) =>
      `next lint --fix --no-cache --max-warnings 0 --file ${filenames
        .map((file) => file.split(process.cwd())[1])
        .join(" --file ")}`,
    "prettier --write",
  ],
  "**/*.scss": ["stylelint --fix --max-warnings 0", "prettier --write"],
}
