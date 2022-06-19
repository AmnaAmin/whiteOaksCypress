#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🛠 Building project..."

if [[ ! -z "${BUILD_VERSION}" ]]; then
  npm install

if [ "dev2" = $ENV ]; then
  ls build
  mkdir output2
  cp -r build/* output2
  zip -r output2.zip output2
  buildkite-agent artifact upload output2.zip
elif [ "preprod" = $ENV ]; then
  npm run build:prod
elif [ "prod" = $ENV ]; then
  npm run build:prod
else
  npm run webpack:build
fi

  ls build
  mkdir output
  cp -r build/* output
  zip -r output.zip output
  buildkite-agent artifact upload output.zip

else
  echo "Must provide environment BUILD_NUMBER"
  exit 1
fi
