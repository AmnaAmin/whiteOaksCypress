#!/usr/bin/env bash

set -eux
# account # 324351813761
PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

echo "🚀 Deploying project to QA..."

buildkite-agent artifact download output.zip .
unzip -o output.zip
cd output
echo "🚀 deploying to s3"
aws s3 sync . s3://wo-ui-qa/vendorportal/ --delete
