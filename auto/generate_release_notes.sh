#!/usr/bin/env bash

set -eux

#the latest Git commit which is head
GIT_COMMIT_TO=$(git rev-parse HEAD)

if [ "dev" = $ENV ]; then
  version_file=$(curl https://dev.woaharvest.com/version/dev/version.json)
elif [ "qa" = $ENV ]; then
  version_file=$(curl https://qa.woaharvest.com/version/qa/version.json)
else # prod
  version_file=$(curl https://woaharvest.com/version/prod/version.json)
fi

#Old git commit which is last ref point
GIT_COMMIT_FROM=$(echo $version_file | jq -r .commit)


if [ "$GIT_COMMIT_FROM" == "$GIT_COMMIT_TO" ];
then
  echo 'Rebuilding from same commit. Release notes not generated.'
  exit 0
fi

git-release-notes ${GIT_COMMIT_FROM}..${GIT_COMMIT_TO} html > releasenotes.html

buildkite-agent artifact upload releasenotes.html

if [ "dev" = $ENV ]; then
  aws s3 cp releasenotes.html s3://whiteoaks-manual-next-gen-versioning/version/dev/releasenotes.html
elif [ "qa" = $ENV ]; then
  aws s3 cp releasenotes.html s3://whiteoaks-manual-next-gen-versioning/version/qa/releasenotes.html
else # prod
  aws s3 cp releasenotes.html s3://whiteoaks-manual-next-gen-versioning-prod/version/prod/releasenotes.html
fi
