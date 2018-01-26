module.exports = function() {

  let sqlite3 = require('sqlite3').verbose();

  this.loadDB = function(dbPath) {

    // stores db name
    this.dbName = dbPath.split("/").reverse()[0];

    this.db = new sqlite3.Database(dbPath, (err) => {

      if(err) { console.log("\n", err.message, "\n"); }
      else { console.log(`\nConnected to the ${dbPath} database\n`); }

    });

  };

  this.insertRowOnTable = function(values, tableName) {

    let placeholders = values.map((val) => '(?)').join(',');
    let query = `INSERT INTO ${tableName} VALUES (${placeholders})`;

    this.db.run(query, values, function(err) {

      if(err) { console.log(err.code); console.log(err.message); }
      else { console.log(`Rows inserted: ${this.changes}`); }

    });

  };

  // get function to retrieve database
  this.DB = function() {

    if(!this.db) { console.log("\n *** No Database Loaded *** \n"); }
    else { return this.db; }

  };

  this.getDatabaseName = function() {
    return this.dbName;
  };

  // Closes connection to database
  this.closeDB = function() {

    if(!this.db) { console.log("\n *** No Database Loaded *** \n"); }

    else {

      this.db.close(err => {

        if(err) { console.log(err.message); }
        else { console.log(`\n Connection to ${this.databaseName} database closed. \n`); }

      });

    }

  };

};

