#!/usr/bin/env bash

set -eux

PARENT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

GIT_COMMIT=$(git rev-parse HEAD)

version_file_path=${PARENT_DIR}/../version.json
echo "Begin generate version, version_file_path: ${version_file_path}"

cat > "${version_file_path}" <<EOF
{
  "build":"${BUILD_VERSION}",
  "commit": "${GIT_COMMIT}",
  "build_url":"${BUILDKITE_BUILD_URL}"
}
EOF

cat "${version_file_path}"

if [ "dev" = $ENV ]; then
  aws s3 cp "${version_file_path}" s3://whiteoaks--manual-next-gen-versioning/version/dev/version.json
elif [ "qa" = $ENV ]; then
  aws s3 cp "${version_file_path}" s3://whiteoaks--manual-next-gen-versioning/version/qa/version.json
else # prod
  aws s3 cp "${version_file_path}" s3://whiteoaks--manual-next-gen-versioning-prod/version/prod/version.json
fi
