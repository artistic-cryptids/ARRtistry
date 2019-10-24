#!/usr/bin/env bash

ganache::port() {
  if [ "$SOLIDITY_COVERAGE" = true ]; then
    echo "8555"
  else
    echo "8545"
  fi
}

ganache::is_running() {
  nc -z localhost "$(ganache::port)"
}

ganache::start() {
  local acctKeys=$1
  local accounts=(
    # 10 accounts with balance 1M ether, needed for high-value tests.
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"
    --account="0x956b91cb2344d7863ea89e6945b753ca32f6d74bb97a59e59e04903ded14ad02,1000000000000000000000000"
  )

  npx ganache-cli --gasLimit 0xfffffffffff --port "$(ganache::port)" "${accounts[@]}" --acctKeys "$acctKeys" > /dev/null &

  echo $!
}

ganache::wait_for_launch() {
  echo "Waiting for ganache to launch on port "$(ganache::port)"..."

  while ! ganache::is_running; do
    sleep 0.1 # wait for 1/10 of the second before check again
  done

  echo "Ganache launched!"
}
