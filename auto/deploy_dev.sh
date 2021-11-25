#!/usr/bin/env bash

set -eux

buildkite-agent artifact download output.zip .
unzip -o output.zip
cd output
echo "🚀 deploying to dev-s3"
aws s3 sync . s3://wo-manual-next-gen-ui-dev --delete