#!/usr/bin/env bash

SCRIPT_PATH=$(dirname ${BASH_SOURCE[0]})
source "$SCRIPT_PATH/ganache.sh"

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

if ganache::is_running; then
  echo "Using existing ganache instance"
else
  echo "Starting our own ganache instance"
  ganache_pid=$(ganache::start "$(dirname $SCRIPT_PATH)/acctKeys.json")

  ganache::wait_for_launch
fi

npx truffle version
npx truffle test "$@"
