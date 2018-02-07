#!/bin/bash

pushd analysis-lib
npm install
mkdir db
sqlite3 db/analysis-lib.db < ./src/db-scripts/tables/reset-tables.sql
popd

cd electron-app
npm install && npm run postinstall:deps && yarn run test && yarn run dev

