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
                  span Submissions {{list1}}

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
                          span {{fileName}}

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
                      input(placeholder="Please input integers between 0 and 100" v-model="threshold1")
                    .ui-group
                      label Various Artists threshold
                      input(placeholder="Please input integers greater than -1" type="number" v-model="threshold2")
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
      fileName: '',
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
  computed: {
    list1: function() {
      this.$http
      .post('http://localhost:3000/api/fetch-dataset-meta', {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        this.dbData = res.data[res.data.length - 1]
        this.artistList = this.dbData.artist_blacklist
        this.keywordList = this.dbData.keyword_blacklist
        this.lang = this.dbData.lang
        this.threshold1 = this.dbData.duplicates_threshold
        this.threshold2 = this.dbData.various_artists_threshold
      })
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
      this.thresValue1 = parseFloat(String(this.threshold1).replace('%', ''))
      this.thresValue2 = parseFloat(this.threshold2)
      if (this.threshold1 === '') {
        this.thresValue1 = 0
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

      // Saves metadata
      const datasetMeta = {
        source: this.filePath,
        artist_blacklist: this.artistList,
        keyword_blacklist: this.keywordList,
        duplicates_threshold: this.thresValue1,
        various_artists_threshold: this.thresValue2,
        lang: this.lang,
        status: 1,
        time: Date.now()
      }

      this.$http
        .post('http://localhost:3000/api/save-and-run-filters', datasetMeta, {
          'headers': {
            'content-type': 'application/json'
          }
        })
        .then((res) => {
          const submittedId = res.data['dataset-id']
          this.$router.push(`/report/${submittedId}`)
        });
    },
    processFile: function (e) {
      this.file = event.target.files[0]
      this.fileName = this.file.name
      this.filePath = this.file.path
      this.buttonDisabled = false
      this.btnClass = 'btn-primary'
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>"../../assets/styles/app.sass";
</style>
