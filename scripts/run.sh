#!/usr/bin/env bash

function arrtistry::truffle() {
    truffle migrate
}

function arrtistry::docker() {
    docker-compose up -d
}

function arrtistry::webapp() {
    cd app && npm start
}

arrtistry::docker && arrtistry::truffle && arrtistry::webapp
