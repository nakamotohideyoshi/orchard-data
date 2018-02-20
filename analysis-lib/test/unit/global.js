// Setup
const { spawnSync } = require('child_process');
const { unlinkSync, existsSync } = require('fs');
const path = require('path');
const config = require('config');
const { DATABASE } = require('../../src/scripts/constants');

function wipeDB() {
    const dbPath = path.resolve(__dirname, '..', '..', 'db', `${DATABASE}.db`);

    console.log('***********\n');
    console.log(`WIPING DATABASE: ${dbPath}\n`);
    console.log('***********\n');
    
    // Reset all tables
    return unlinkSync(dbPath);
}

before(() => {
    const dbPath = path.resolve(__dirname, '..', '..', 'db', `${DATABASE}.db`);
    const dbScript = path.resolve(__dirname, '..', '..', 'src', 'db-scripts', 'tables', 'create-all-tables.sql');
    
    console.log('***********\n');
    console.log(`CONFIGURING DATABASE: ${dbPath}`);
    console.log(`WITH SCRIPT: ${dbScript}\n`);
    console.log('***********\n');
    
    // Reset all tables if these exist
    if (existsSync(dbPath)) {
        wipeDB();
    }

    // Run create tables in case no tables were found
    spawnSync('sqlite3', [
        dbPath,
        '<',
        dbScript
    ], {
        shell: true
    });
});

after(() => {
    if (process.env.KEEP_DB !== 'true') {
        wipeDB();
    }
});