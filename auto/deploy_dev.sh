#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to Dev..."

buildkite-agent artifact download output-dev.zip .
unzip -o output-dev.zip
cd output-dev

echo "🚀 deploying to s3"
aws s3 sync . s3://woa-dev2-ui/ --delete
