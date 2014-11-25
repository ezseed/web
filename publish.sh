gulp
git checkout -b tag-branch
git add -f ./dist
git commit -m "Add compiled files" -a

version=$1

if [[ -z $version ]]; then
  version='patch'
fi

new=$(npm version $version)

git push --tags

git reset HEAD~2

git checkout master

git branch -D tag-branch

git add package.json

git commit -m "$new"

git push
