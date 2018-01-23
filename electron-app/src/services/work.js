//const csv = require('csv-streamify')
const fs = require('fs')
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('db.sqlite')

export const createItem = (lastIndex, file) => {
    let tsvContent = []


    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function(f){
        const tsvData = f.target.result;
        const allTextLines = tsvData.split(/\r\n|\n/)
        const headers = allTextLines[0].split("\t")

        for ( let i = 0; i < allTextLines.length; i++) {
            const data = allTextLines[i].split("\t")
            if (data.length == headers.length) {
                let tarr = []
                for ( let j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                tsvContent.push(tarr)
            }
        }
        writeCSVInfo(lastIndex, tsvContent)
        
    }
}

export const writeCSVInfo = (lastIndex, tsvContent) => {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('db.sqlite')
    db.serialize(function () {
        db.run(
            'CREATE TABLE IF NOT EXISTS orchard_dataset_contents (  \
            ROWID INTEGER PRIMARY KEY AUTOINCREMENT, dataset_id foreign_key, release_name text, release_meta_language text, \
            orchard_artist text, artist_country text, subaccount_name text, \
            artist_url text, release_artists_primary_artist text, release_artists_featuring text, \
            release_artists_remixer text, release_artists_composer text, release_artists_orchestra text, \
            release_artists_ensemble text, release_artists_conductor text, release_date text, sale_start_date text, \
            itunes_preorder text, itunes_preorder_date text, preorder_preview text, release_itunes_pricing text, \
            release_amazon_pricing text, format text, imprint text, genre text, sub_genre text, copyright_information text, \
            digital_upc text, manufacturers_upc text, label_catalog_number text, release_version text, file_name text, \
            volume text, track_no text, track_name text, meta_language text, version text, track_artist text, \
            track_artist_featuring text, track_artist_remixer text, track_artist_composer text, track_artist_orchestra text, \
            track_artist_ensemble text, track_artist_conductor text, track_itunes_pricing text, track_amazon_pricing text, \
            explicit text, isrc text, third_party_publisher text, p_information text, songwriters text, publishers text, \
            only_include_exclude text, territories text )'
        )
        let query = "INSERT INTO orchard_dataset_contents VALUES (", i;
        for(i = 0; i <= tsvContent[0].length + 1; i++) {
            query += '?, ';
        }
        query = query.substring(0, query.length - 2);
        query += ')';
        const tsvtmt = db.prepare(query);
        for(i = 1; i < tsvContent.length; i++) {
            tsvtmt.run(null, lastIndex, ...tsvContent[i]);
        }
        tsvtmt.finalize(function () {
            updateStatus(lastIndex)
            
        })
    })

    db.close()
}

export const updateStatus = (lastIndex) => {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('db.sqlite')

    const data = [2, lastIndex]
    const sql  = `UPDATE data SET status = ? WHERE ROWID = ?`;
    db.run(sql, data, (err) => {
        if(err) {          
            console.log(err)
        }
    })
    db.close()
}

export const getFileInfo = () => {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('db.sqlite')

    const sql = `SELECT ROWID, file FROM dataset_meta WHERE status = ?`
    const statusId = 1
    db.all(sql, [statusId], (err, rows) => {
        rows.map(row => {
            let allData = []
            const parser = csv({ objectMode: true }, function (err, result) {
                if (err) throw err
                result.forEach(function (lines) {
                    let tsvContent = []
                    const headers = lines[0].split("\t")
                    for ( let i = 0; i < lines.length; i++) {
                        const data = lines[i].split("\t")
                        if (data.length == headers.length) {
                            let tarr = []
                            for ( let j = 0; j < headers.length; j++) {
                                tsvContent.push(data[j]);
                            }                            
                        }
                    }
                    allData.push(tsvContent)                   
                })
                writeCSVInfo(row.ROWID, allData)

            })
             
            // now pipe some data into it 
            fs.createReadStream(row.file).pipe(parser)
        })
    })

    db.close()
}

export const getAllItems = (callback) => {
    var that = this
    db.all('SELECT  * FROM dataset_meta ORDER BY time DESC', function (err, rows) {
        if (err) {
            console.log(err)
            callback(err)
        }
        if (rows) {
            callback(rows)
        }
    })
}