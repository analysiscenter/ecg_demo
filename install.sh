#!/bin/bash

script_path=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)

printf "Installing backend dependencies...\n"
cd "$script_path/backend"
pip3 install -r requirements.txt
printf "\n"

printf "Installing frontend dependencies...\n"
cd "$script_path/frontend"
yarn install
printf "\n"

printf "All dependencies have been successfully installed\n"
