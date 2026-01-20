git add .
git commit -m "Describe your change"
git push origin develop
Test changes locally before merging to main.

Merge to main only when stable:

bash

git checkout main
git pull origin main
git merge develop
git push origin main

git log --oneline


