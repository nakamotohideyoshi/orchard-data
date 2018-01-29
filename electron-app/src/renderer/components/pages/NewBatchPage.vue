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

const AnalysisLibModule = require('../../../../../analysis-lib/analysis-lib-module');
const dbInterface = new AnalysisLibModule.dbInterface();

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
      
      dbInterface.init();
      dbInterface.saveDatasetMeta({
        source: this.filePath,
        artist_blacklist: this.artistList,
        keyword_blacklist: this.keywordList,
        duplicates_threshold: this.thresValue1,
        various_artists_threshold: this.thresValue2,
        lang: this.lang,
        status: 1,
        time: Date.now()
      });
    //  dbInterface.saveTsvIntoDB(this.filePath);
      this.$router.push('/submissions')
    },
    processFile: function (e) {
      this.file = event.target.files[0]
      this.filePath = this.file.path
      this.buttonDisabled = false
      this.btnClass = 'btn-primary'
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
</style>"../../assets/styles/app.sass";
</style>