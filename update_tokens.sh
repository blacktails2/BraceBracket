#!/bin/bash

# Array of branches to update
branches=(
  "delta"
  "seibugeki-rising"
  "beesmash"
  "ken-marime"
  "ku-ron"
  "jingi"
  "feature/ban.pick"
  "feature/remote.obs"
  "feature/telop"
  "feature/tohutohu/qr-code"
  "feature/tohutohu/online.customize"
)

OLD_TOKEN="b27e9778c425efba77751add00796217"
NEW_TOKEN="2d1a68f32b1baf8b2b25aae5569f9dca"

for branch in "${branches[@]}"; do
  echo "Processing branch: $branch"
  
  # Checkout and pull the branch
  git checkout "$branch" && git pull origin "$branch"
  
  # Update tokens in all files
  find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "$OLD_TOKEN" | while read file; do
    sed -i '' "s/$OLD_TOKEN/$NEW_TOKEN/g" "$file"
    echo "Updated: $file"
  done
  
  # Check if any files were modified
  if git diff --quiet; then
    echo "No changes needed in $branch"
  else
    # Commit and push
    git add -A
    git commit -m "chore: Start.gg APIトークンを更新" --no-verify
    git push origin "$branch"
    echo "Pushed changes to $branch"
  fi
  
  echo "---"
done

echo "All branches processed!"