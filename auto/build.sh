#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🛠 Building project..."

<<<<<<< HEAD
export NODE_OPTIONS=--max_old_space_size=6144
=======
>>>>>>> 5ae53d330325a4a7a0b55631ac04645a531c7569

if [[ ! -z "${BUILD_VERSION}" ]]; then
#  npm i npm@latest
  npm install

if [ "prod" = $ENV ]; then
  npm run build:prod
else 
<<<<<<< HEAD
  npm run webpack:build
fi
=======
  npm run build  
fi

>>>>>>> 5ae53d330325a4a7a0b55631ac04645a531c7569
  ls build
  mkdir output
  cp -r build/* output
  zip -r output.zip output
  buildkite-agent artifact upload output.zip
else
  echo "Must provide environment BUILD_NUMBER"
  exit 1
fi
