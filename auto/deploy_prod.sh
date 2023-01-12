#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to Prod..."

buildkite-agent artifact download output-prod.zip .
unzip -o output-prod.zip
cd output-prod

echo "🚀 deploying to s3"
aws s3 sync . s3://whiteoaks-ui/ --delete
