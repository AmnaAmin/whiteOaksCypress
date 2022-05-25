#!/usr/bin/env bash

set -eux

buildkite-agent artifact download output.zip .
unzip -o output.zip
cd output
echo "🚀 deploying to dev-s3"
aws s3 sync . s3://woa-bucket-dev2-ui/vendorportal/ --delete

echo "🚀 deploying to dev-v2-s3"
aws s3 sync . s3://woa-dev-v2-ui/vendorportal/ --delete

# echo "🚀 deploying to us-west-1-s3Bucket"
# aws s3 sync . s3://woa-fo-bucket-one-ui/vendorportal/ --delete

# echo "🚀 deploying to us-east-1-s3Bucket"
# aws s3 sync . s3://woa-fo-bucket-two-ui/vendorportal/ --delete
