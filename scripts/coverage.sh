#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

truffle run coverage
cat coverage/lcov.info | npx coveralls
