gulp
git checkout -b tag-branch
git add -f ./dist
git commit -m "Add compiled files" -a

version=$1

if [[ -z $version ]]; then
  version='patch'
fi

echo $version
npm version $version

git push --tags

# npm publish

cp package.json package.bak.json
git reset HEAD~2

git checkout master

cp package.bak.json package.json
