#!/bin/bash

ABS_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEIL="c:/Keil_v5/UV4/UV4.exe"
PROJECT=rssi_pca10040.uvprojx

# Display an error message
function error () {
    printf "\e[1;31m[ERROR] $1\e[0;0m\r\n"
}

# Display a fatal error and exit
function fatal () {
    error "$@"
    exit
}

# Check if the required program are available
function check_requirements () {
    command -v $KEIL >/dev/null 2>&1 || { fatal "KEIL is not available"; }
}

check_requirements

$ABS_PATH/bootstrap.sh \
    -l "http://developer.nordicsemi.com/nRF5_SDK/nRF5_SDK_v13.x.x/nRF5_SDK_13.0.0_04a0bfd.zip" \
    -d "./sdk"

command $KEIL -b $PROJECT
