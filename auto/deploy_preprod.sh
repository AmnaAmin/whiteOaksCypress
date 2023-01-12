#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to Pre-Prod..."

buildkite-agent artifact download output-preprod.zip .
unzip -o output-preprod.zip
cd output-preprod

echo "🚀 deploying to s3"
aws s3 sync . s3://woa-preprod-ui/ --delete
