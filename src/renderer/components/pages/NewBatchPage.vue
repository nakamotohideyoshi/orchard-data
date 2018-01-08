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
											span Choose a dataset (csv only)
										
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
													input(type="checkbox" name="cb" id="cb_1" v-model="brazilian")
													label(for="cb_1") 
														span Brazilian Portugese
												.ui-checkbox
													input(type="checkbox" name="cb" id="cb_2" v-model="english")
													label(for="cb_2")
														span English
												.ui-checkbox
													input(type="checkbox" name="cb" id="cb_3" v-model="spanish")
													label(for="cb_3")
														span Spanish
									
										// CTA
										.upload__cta
											button(type="submit" v-on:click="submitForm").btn.btn-primary.btn--filled
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
      brazilian: '',
      english: '',
      textareaMax: 1000,
      thresValue1: 0,
      thresValue2: 0,
      dbData: {}
    }
  },
  computed: {
    spanish: function () {
      var sqlite3 = require('sqlite3').verbose()
      var db = new sqlite3.Database('db.sqlite')
      var that = this
      db.all('SELECT rowid as id, * FROM data', function (err, rows) {
        if (err) {
          console.log('error')
        }
        if (rows) {
          that.dbData = rows[rows.length - 1]
        }
      })
      return ''
    }
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
      var sqlite3 = require('sqlite3').verbose()
      var db = new sqlite3.Database('db.sqlite')
      if (this.filePath === '') {
        alert('Please select Dataset file')
        return
      }
      if (this.artistList.length === 0) {
        alert('Please input Artist Blacklist')
        return
      }
      if (this.keywordList.length === 0) {
        alert('Please input Keyword Blacklist')
        return
      }
      this.thresValue1 = parseInt(this.threshold1.replace('%', '')) ? parseInt(this.threshold1.replace('%', '')) : 0
      this.thresValue2 = parseInt(this.threshold2) ? parseInt(this.threshold2) : 0
      if (this.thresValue1 > 100 || this.thresValue1 < 0) {
        alert('Wrong Duplicates threshold')
        return
      }
      if (this.thresValue2 < 0) {
        alert('Wrong Duplicates threshold')
        return
      }
      var lang = 0
      if (this.brazilian) { lang += 100 }
      if (this.english) { lang += 10 }
      if (this.spanish) { lang += 1 }
      if (lang === 0) {
        alert('Please select at least one language')
        return
      }
      var that = this
      db.serialize(function () {
        db.run('CREATE TABLE IF NOT EXISTS data (file TEXT, artistlist TEXT, keywordlist TEXT, threshold1 INTEGER, threshold2 INTEGER, lang INTEGER, status INTEGER, time INTEGER)')
        var stmt = db.prepare('INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        stmt.run(that.filePath, that.artistList, that.keywordList, that.thresValue1, that.thresValue2, lang, 1, Date.now())
        stmt.finalize()
        // db.each('SELECT rowid as id, * FROM data', function (err, row) {
        //   if (err) {
        //     console.log('error')
        //   }
        //   console.log(row)
        // })
      })
      db.close()
      console.log('clicked', this.artistList, this.keywordList, this.thresValue1, this.thresValue2, this.brazilian, this.english, this.spanish)
    },
    processFile: function (e) {
      var file = event.target.files[0]
      this.filePath = file.path
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>