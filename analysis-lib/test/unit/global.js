// Setup
const { spawnSync, execSync } = require('child_process');
const os = require('os');
const { unlinkSync, existsSync } = require('fs');
const path = require('path');
const config = require('config');
const { DATABASE } = require('../../src/scripts/constants');

const dbPath = path.resolve(__dirname, '..', '..', 'db', `${DATABASE}.db`);
const dbScript = path.resolve(__dirname, '..', '..', 'src', 'db-scripts', 'tables', 'create-all-tables.sql');

function wipeDB() {
  return unlinkSync(dbPath);
}

function createDB() {
  // Run create tables in case no tables were found
  if (os.platform() === "win32") {
    return execSync(`sqlite3 "${dbPath}" < "${dbScript}"`);
  }

  return spawnSync('sqlite3', [
    dbPath,
    '<',
    dbScript
  ], {
    shell: true
  });
}

before(() => {

  // Reset all tables if these exist
  if (existsSync(dbPath)) {
    console.log('***********\n');
    console.log(`WIPING DATABASE: ${dbPath}\n`);
    console.log('***********\n');

    wipeDB();
  }

  console.log('***********\n');
  console.log(`CONFIGURING DATABASE: ${dbPath}`);
  console.log(`WITH SCRIPT: ${dbScript}\n`);
  console.log('***********\n');

  createDB();

});

after(() => {
  if (process.env.KEEP_DB !== 'true') {

    console.log('***********\n');
    console.log(`WIPING DATABASE: ${dbPath}\n`);
    console.log('***********\n');

    wipeDB();
  }
});

module.exports = {

  'createDB': createDB,
  'wipeDB': wipeDB,

}
