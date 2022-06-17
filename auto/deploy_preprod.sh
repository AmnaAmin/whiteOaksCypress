#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to Pre-Prod..."

cd output

echo "🚀 deploying to s3"
aws s3 sync . s3://woa-preprod-ui --delete
