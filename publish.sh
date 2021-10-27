#!/bin/bash

## Build img

version=$1

if [ $# = 0 ];then
    echo "version must provide. example: ./publish.sh 1.0.0"
    exit 1
fi

yarn install --ignore-engines

yarn run build

docker build --rm=true -t ccr.ccs.tencentyun.com/koderover-rc/zadig-portal:$version -f amd64.Dockerfile .

docker push ccr.ccs.tencentyun.com/koderover-rc/zadig-portal:$version




