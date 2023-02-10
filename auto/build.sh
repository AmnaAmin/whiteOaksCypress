#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🛠 Building project..."

if [[ ! -z "${BUILD_VERSION}" ]]; then
  npm install
  
if [ "preprod" = $ENV ]; then
  export NODE_OPTIONS=--max-old-space-size=8192 
  npm run build:prod

  ls build
  mkdir output-preprod
  cp -r build/* output-preprod
  zip -r output-preprod.zip output-preprod
  buildkite-agent artifact upload output-preprod.zip

elif [ "prod" = $ENV ]; then
  export NODE_OPTIONS=--max-old-space-size=8192 
  npm run build:prod

  ls build
  mkdir output-prod
  cp -r build/* output-prod
  zip -r output-prod.zip output-prod
  buildkite-agent artifact upload output-prod.zip
else
  npm run webpack:build

  ls build
  mkdir output
  cp -r build/* output
  zip -r output.zip output
  buildkite-agent artifact upload output.zip
fi

else
  echo "Must provide environment BUILD_NUMBER"
  exit 1
fi
