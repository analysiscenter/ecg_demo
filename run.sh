#!/bin/bash

trap terminate_server INT

terminate_server(){
    trap "" INT TERM
    printf "Terminating\n"
    kill -TERM 0
    wait
}

script_path=$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P)

printf "Launching server backend\n"
cd "$script_path"
python3 backend/server.py &

printf "Launching server frontend\n"
cd "$script_path/frontend"
yarn start  > /dev/null 2>&1 &

printf "Press Ctrl+C to terminate the server\n"
cat
