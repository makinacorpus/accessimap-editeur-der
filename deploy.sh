#!/bin/bash

# Enable error reporting to the console.
set -e

# Checkout `master` and remove everything.
git clone https://${GH_TOKEN}@github.com/makinacorpus/accessimap-editeur-der.git accessimap-editeur-der-gh-pages
cd accessimap-editeur-der-gh-pages
git checkout gh-pages
# rm -rf *

# Copy generated HTML site from source branch in original repository.
# Now the `master` branch will contain only the contents of the _site directory.
cp -R ../dist/* .

# Make sure we have the updated .travis.yml file so tests won't run on master.
git config user.email "$COMMIT_AUTHOR_EMAIL"
git config user.name "Travis CI"

# Commit and push generated content to `master` branch.
git status
git add -A .
git status
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER / ${SHA}"
git push --quiet origin gh-pages
