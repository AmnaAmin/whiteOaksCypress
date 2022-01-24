#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🛠 Building project..."

if [[ ! -z "${BUILD_VERSION}" ]]; then
  aws --version
  npm install
  npm run webpack:prod  
  ls target/classes/static
  mkdir output
  cp -r target/classes/static/* output
  zip -r output.zip output
  buildkite-agent artifact upload output.zip
else
  echo "Must provide environment BUILD_NUMBER"
  exit 1
fi
