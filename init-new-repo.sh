#!/bin/bash

pushd analysis-lib
npm install
popd

cd electron-app
npm install && npm run postinstall:deps && yarn run test && yarn run dev

