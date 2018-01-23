<template lang="pug">
include _mixins
#barba-wrapper
	.page(class=outClass)
		block header
			AppHeader
		.page__content
			block content
				.p-container
					.container
						.p-container__wrapper
							.container.container--smaller
								
								// page back
								router-link(:to="'/submissions'").page-back
									.icon.icon-arrow-back
									span Submissions
								
								// upload form
								form.p-box.upload(action="#")
									.upload__title
										+icon('ico-upload')
										h1 Upload new dataset
										
									// group
									.upload__group
										.upload__group-name
											+icon('ico-market-music')
											span Choose a dataset (required)
										
										.ui-group
											label Dataset
											.uploader(js-uploader data-validate="csv")
												.uploader__btn
													label Choose file
														input(type="file" id="file" name="file" v-on:change="processFile")
														
												.uploader__current
													.uploader__current-filename
													+icon('ico-close')
													
									// group
									.upload__group
										.upload__group-name
											+icon('ico-market-music')
											span Parameters
										
										.ui-group
											label Artist blacklist
											textarea(placeholder="Artist 1" v-on:keydown="countdownArtistList" v-model="artistList")
										.ui-group
											label Keyword blacklist
											textarea(placeholder="keywords" v-on:keydown="countdownKeywords" value="Garbage, gangster, gangstar, gang" v-model="keywordList")
										.ui-group
											label Duplicates threshold
											input(v-bind:placeholder="dbData.threshold1" v-model="threshold1")
										.ui-group
											label Various Artists threshold
											input(v-bind:placeholder="dbData.threshold2" v-model="threshold2")
										.ui-group
											label Language
											.ui-checkbox-row
												.ui-checkbox
													input(type="radio" name="cb" id="cb_2" value="en-US" v-model="lang")
													label(for="cb_2")
														span English
												.ui-checkbox
													input(type="radio" name="cb" id="cb_3" value="en-ES" v-model="lang")
													label(for="cb_3")
														span Spanish
												.ui-checkbox
													input(type="radio" name="cb" id="cb_1" value="pt-BR" v-model="lang")
													label(for="cb_1") 
														span Brazilian Portugese
										// CTA
										.upload__cta
											button(type="submit" v-on:click="submitForm" v-bind:disabled="buttonDisabled" v-bind:class="btnClass").btn.btn--filled
												span Start Testing
		block footer
			AppFooter
</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'new-batch-page',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      filePath: '',
      artistList: '',
      keywordList: '',
      threshold1: '',
      threshold2: '',
      btnClass: 'btn-disabled',
      textareaMax: 1000,
      thresValue1: 0,
      thresValue2: 0,
      buttonDisabled: true,
      lang: 'en-US',
      dbData: {},
      lastInsertedID: 0,
      file: {}
    }
  },
  created: function () {
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('db.sqlite')
    const that = this
    db.all('SELECT id, * FROM dataset_meta', function (err, rows) {
      if (err) {
        console.log('error')
      }
      if (rows) {
        that.dbData = rows[rows.length - 1]
        that.lang = rows[rows.length - 1].lang
      }
    })
  },
  methods: {
    countdownArtistList: function (evt) {
      if (this.artistList.length >= this.textareaMax) {
        evt.preventDefault()
      }
    },
    countdownKeywords: function (evt) {
      if (this.keywordList.length >= this.textareaMax) {
        evt.preventDefault()
      }
    },
    submitForm: function (e) {
      e.preventDefault()
      const sqlite3 = require('sqlite3').verbose()
      const db = new sqlite3.Database('db.sqlite')
      if (this.filePath === '') {
        alert('Please select Dataset file')
        return
      }
      this.thresValue1 = parseInt(this.threshold1.replace('%', ''))
      this.thresValue2 = parseInt(this.threshold2)
      if (this.threshold1 === '') {
        this.thresValue1 = null
      }
      if (this.threshold2 === '') {
        this.thresValue2 = null
      }
      if (this.thresValue1 > 100 || this.thresValue1 < 0 || isNaN(this.thresValue1)) {
        alert('Duplicates threshold must be between 0 and 100.')
        return
      }
      if (this.thresValue2 < 0 || isNaN(this.thresValue2)) {
        alert('Various Artists threshold must be greater than -1.')
        return
      }

      const that = this
      db.serialize(function () {
        db.run(`CREATE TABLE IF NOT EXISTS data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          file TEXT, 
          artistlist TEXT, 
          keywordlist TEXT, 
          threshold1 INTEGER, 
          threshold2 INTEGER, 
          lang TEXT, 
          status INTEGER, 
          time INTEGER)`
        )
        const stmt = db.prepare('INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        stmt.run(null, that.filePath, that.artistList, that.keywordList, that.thresValue1, that.thresValue2, that.lang, 1, Date.now(), function (err) {
          if (err) {
            console.log(err)
          } else {
            that.lastInsertedID = this.lastID
          }
        })
        stmt.finalize(function () {
          that.writeCSVInfo(this.lastID, that.file)
          that.$router.push('/')
        })
      })
      db.close()
    },
    processFile: function (e) {
      this.file = event.target.files[0]
      this.filePath = this.file.path
      this.buttonDisabled = false
      this.btnClass = 'btn-primary'
    },
    writeCSVInfo: function (lastId, file) {
      let tsvContent = []
      const that = this

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function (f) {
        const tsvData = f.target.result
        const allTextLines = tsvData.split(/\r\n|\n/)
        const headers = allTextLines[0].split('\t')

        for (let i = 0; i < allTextLines.length; i++) {
          const data = allTextLines[i].split('\t')
          if (data.length === headers.length) {
            let tarr = []
            for (let j = 0; j < headers.length; j++) {
              tarr.push(data[j])
            }
            tsvContent.push(tarr)
          }
        }

        const sqlite3 = require('sqlite3').verbose()
        const db = new sqlite3.Database('db.sqlite')
        db.serialize(function () {
          db.run(
            `CREATE TABLE IF NOT EXISTS orchard_dataset_contents (
            id INTEGER PRIMARY KEY AUTOINCREMENT, dataset_id foreign_key, release_name text, release_meta_language text,
            orchard_artist text, artist_country text, subaccount_name text, artist_url text, release_artists_primary_artist text,
            release_artists_featuring text, release_artists_remixer text, release_artists_composer text, release_artists_orchestra text,
            release_artists_ensemble text, release_artists_conductor text, release_date text, sale_start_date text, 
            itunes_preorder text, itunes_preorder_date text, preorder_preview text, release_itunes_pricing text, 
            release_amazon_pricing text, format text, imprint text, genre text, sub_genre text, copyright_information text, 
            digital_upc text, manufacturers_upc text, label_catalog_number text, release_version text, file_name text, 
            volume text, track_no text, track_name text, meta_language text, version text, track_artist text, 
            track_artist_featuring text, track_artist_remixer text, track_artist_composer text, track_artist_orchestra text, 
            track_artist_ensemble text, track_artist_conductor text, track_itunes_pricing text, track_amazon_pricing text, 
            explicit text, isrc text, third_party_publisher text, p_information text, songwriters text, publishers text, 
            only_include_exclude text, territories text )`
          )
          let query = 'INSERT INTO orchard_dataset_contents VALUES ('
          let i
          for (i = 0; i <= tsvContent[0].length + 1; i++) {
            query += '?, '
          }
          query = query.substring(0, query.length - 2)
          query += ')'
          const tsvtmt = db.prepare(query)
          for (i = 1; i < tsvContent.length; i++) {
            tsvtmt.run(null, lastId, ...tsvContent[i])
          }
          tsvtmt.finalize(function () {
            that.updateStatus(lastId)
          })
        })

        db.close()
      }
    },
    updateStatus: function (lastId) {
      const sqlite3 = require('sqlite3').verbose()
      const db = new sqlite3.Database('db.sqlite')

      const data = [2, lastId]
      const sql = `UPDATE data SET status = ? WHERE ROWID = ?`
      db.run(sql, data, (err) => {
        if (err) {
          console.log(err)
        }
      })

      db.close()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>