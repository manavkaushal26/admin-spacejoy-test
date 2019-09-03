#!/bin/bash

yarn build

docker build -t 74c3e90e5bf5.dkr.ecr.ap-south-1.amazonaws.com/clip-pwa:$1 .

exit 0
