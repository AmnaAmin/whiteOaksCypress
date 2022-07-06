#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to Dev..."

buildkite-agent artifact download output.zip .
unzip -o output.zip
cd output

echo "🚀 deploying to s3"
aws s3 sync . s3://woa-dev-ui/vendorportal/ --delete
