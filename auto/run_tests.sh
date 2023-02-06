#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🛠 Running Integration Tests..."

if [[ ! -z "${BUILD_VERSION}" ]]; then

  echo "--- Node version"
  node --version

  echo "--- NPM version"
  npm --version

  echo "--- Install NPM dependencies"
  npm install
  export NODE_OPTIONS=--max-old-space-size=5120 
  node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
  echo "+++ Run ESLint"
  npm run ci:lint

  echo "+++ Run ci:typescript"
  npm run ci:typescript

  echo "+++ Run ci:test"
  npm run ci:test

else
  echo "Must provide environment BUILD_NUMBER"
  exit 1
fi