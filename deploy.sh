#!/bin/bash
echo "Running deployment script..."

CURRENT_COMMIT=`git rev-parse HEAD`

npm install typescript@1.3.0 -g

echo "Cloning gh-pages branch..."

git clone -b gh-pages "https://${GH_TOKEN}@${GH_REF}" out > /dev/null 2>&1 || exit 1

rm -r out/*

echo "Compiling TSC"

tsc --sourcemap "./Src/game.ts" --out "./Src/game.js"

ls -a

echo "Copying built files"
cp -r Src/ out/
ls -a
cd out
rm Src.csproj

echo "Committing and pushing to GH"

git config user.name "Travis-CI"
git config user.email "travis@excaliburjs.com"
git add -A
git commit --allow-empty -m "Deploying game for $CURRENT_COMMIT" || exit 1
git push origin gh-pages > /dev/null 2>&1 || exit 1

echo "Pushed deployment successfully"
exit 0