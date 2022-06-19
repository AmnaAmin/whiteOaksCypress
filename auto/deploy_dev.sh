#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to Dev..."

if [ "dev" = $ENV ]; then
buildkite-agent artifact download output.zip .
unzip -o output.zip
cd output

echo "🚀 deploying to s3"
aws s3 sync . s3://woa-dev-v2-ui/vendorportal/ --delete
else
  echo "Dev Env. 404"
  exit 1
fi



if [ "dev2" = $ENV ]; then
buildkite-agent artifact download output.zip .
unzip -o output.zip
cd output

echo "🚀 deploying to s3"
aws s3 sync . s3://woa-dev-ui/vendorportal/ --delete
else
  echo "Dev2 Env. 404"
  exit 1
fi
