#!/bin/bash

rm -rf ./lib
tsc
sed -i "" "1 i\\ 
///<reference path=\"../node_modules/minapp-sdk-typings/types/baas.d.ts\" />
" lib/index.d.ts
