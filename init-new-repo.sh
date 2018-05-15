#!/bin/bash

(cd analysis-lib; npm install; mkdir db; sqlite3 db/analysis-lib.db < ./src/db-scripts/tables/reset-tables.sql )&

(cd electron-app; npm install && yarn run test && yarn run dev)

