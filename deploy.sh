#!/bin/bash

# Enable error reporting to the console.
set -e

# Make sure we have the updated .travis.yml file so tests won't run on master.

# Checkout `master` and remove everything.
git clone https://${GH_TOKEN}@github.com/makinacorpus/accessimap-editeur-der.git accessimap-editeur-der-gh-pages
cd accessimap-editeur-der-gh-pages
git checkout gh-pages

echo $COMMIT_AUTHOR_EMAIL

export COMMITTER_EMAIL="$(git log -1 $TRAVIS_COMMIT --pretty="%cE")"
export AUTHOR_NAME="$(git log -1 $TRAVIS_COMMIT --pretty="%aN")"

echo $COMMITTER_EMAIL
echo $AUTHOR_NAME

git config user.email "$COMMITTER_EMAIL"
git config --global user.email "$COMMITTER_EMAIL"
git config --global user.name "Travis CI"
git config -l
# rm -rf *

# Copy generated HTML site from source branch in original repository.
# Now the `master` branch will contain only the contents of the _site directory.
cp -R ../dist/* .

# Commit and push generated content to `master` branch.
git status
git add -A .
git status
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER / ${SHA}"
git push --quiet origin gh-pages

curl https://intake.opbeat.com/api/v1/organizations/43f4c77b74f64097ab04194c87d98086/apps/7bcd582124/releases/ \
-H "Authorization: Bearer 74226300ea03e7a064bbea3a4d20616fad6f6aef" \
-d rev=`git log -n 1 --pretty=format:%H` \
-d branch=`git rev-parse --abbrev-ref HEAD` \
-d status=completed
