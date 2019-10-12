#!/usr/bin/env bash

set -o errexit -o pipefail

log() {
  echo "$*" >&2
}

SOLIDITY_COVERAGE=true scripts/test.sh || log "Test run failed"
