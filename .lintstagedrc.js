module.exports = {
  "**/*.{git ts,tsx}": [
    (filenames) =>
      `next lint --fix --max-warnings 0 --file ${filenames
        .map((file) => file.split(process.cwd())[1])
        .join(" --file ")}`,
    "prettier --write",
  ],
}
