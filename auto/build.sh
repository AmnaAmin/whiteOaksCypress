#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🛠 Building project..."

export NODE_OPTIONS=--max_old_space_size=6144

if [[ ! -z "${BUILD_VERSION}" ]]; then
  npm i npm@latest
  npm install

if [ "prod" = $ENV ]; then
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
