#!/bin/bash

cd analysis-lib
yarn run test:unit || exit

cd ../electron-app
yarn run test || exit

npm run lint:fix

