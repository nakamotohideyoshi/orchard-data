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
                                    span Report Summary
                                    
                                // report box
                                .p-box.report
                                    // summary
                                    .report-summary
                                        .report-summary__col
                                            .report-summary__head risk analysis {{list1}}
                                            .report-summary__text.report-summary__text--red Errors Per Row 
                                        .report-summary__label.report-summary__label--red(v-if="dbData.status == 1") IN PROGRESS
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text {{new Date(dbData.time).toString().slice(0, -14)}}
                                        .report-summary__col
                                            .report-summary__head download
                                            a(href="#" download).report-summary__text
                                                +icon('ico-download')
                                    
                                    // tabs
                                    .report__tabs.report__tabs--left(js-scrollbar)
                                        button(v-on:click='showOverallRistk()' v-bind:class="{ 'is-active': overallRiskFlag == true, 'is-disabled': dbData.status == 1 }" :disabled="dbData.status == 1").report__tab Overall Risk Assessment
                                        button(v-on:click='showAppleTab()' v-bind:class="{ 'is-active': appleTabFlag == true, 'is-disabled': dbData.status == 1 }" :disabled="dbData.status == 1").report__tab Apple & Itunes Guidelines
                                        button(v-on:click='showCustom()' v-bind:class="{ 'is-active': customFlag == true }").report__tab Custom Parameters
                                    

                                    // summary
                                    .report-container(v-if="appleTabFlag")
                                        .report__top
                                            .report__top-col
                                                .report__top-percent {{((1-successPercent) * 100).toFixed(2)}} %
                                                .report__top-description Total percent of rows with errors
                                            .report__top-col
                                                .report__top-stars
                                                  .success(v-for="data in Math.round(successPercent * 5)")
                                                    +icon('ico-star-filled')
                                                  .failed(v-for="data in (5 - Math.round(successPercent * 5))")
                                                    +icon('ico-star-empty')
                                                .report__top-description Overall data quality
                                        
                                        // report view
                                        .report__view
                                            .report__view-title What are the biggest problems with the dataset?
                                            router-link(:to="'/criteria-scores'").report__view-link
                                                +icon('ico-document')
                                                span View the test criteria scores
                                        .report__view
                                            .report__view-title What is the sum of problems in each row?
                                            router-link(:to="'/row-scores'").report__view-link
                                                +icon('ico-document')
                                                span View the input row scores
                                        .report__view
                                            .report__view-title Which fields in the dataset failed?
                                            router-link(:to="'/field-level'").report__view-link
                                                +icon('ico-document')
                                                span View the field level issues
                                    .report-container(v-if="overallRiskFlag")

                                    .report-container(v-if="customFlag")              
                                        // group
                                        router-link(:to="`/csv/${dbData.rowid}`").report__view-link
                                            +icon('ico-document')
                                            span {{fileName}}
                                        .upload__group
                                            .upload__group-name
                                                +icon('ico-market-music')
                                                span Parameters
                                            
                                            .ui-group
                                                label Artist blacklist
                                                textarea.disabled(v-bind:placeholder="dbData.artist_blacklist" v-model="artistList" :disabled="true")
                                            .ui-group
                                                label Keyword blacklist
                                                textarea.disabled(v-bind:placeholder="dbData.keyword_blacklist" v-model="keywordList" :disabled="true")
                                            .ui-group
                                                label Duplicates threshold
                                                input(v-bind:placeholder="dbData.duplicates_threshold" type="number" v-model="threshold1" :disabled="true")
                                            .ui-group
                                                label Various Artists threshold
                                                input(v-bind:placeholder="dbData.various_artists_threshold" type="number" v-model="threshold2" :disabled="true")
                                            .ui-group
                                                label Language
                                                    .language(v-if="dbData.lang == 'en-US'") English
                                                    .language(v-if="dbData.lang == 'en-ES'") Spanish
                                                    .language(v-if="dbData.lang == 'pt-BR'") Brazilian Portugese
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'report-page',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      overallRiskFlag: false,
      appleTabFlag: false,
      customFlag: true,
      dbData: {},
      successPercent: 0.7,
      artistList: '',
      keywordList: '',
      threshold1: '',
      threshold2: '',
      lang: '',
      fileName: ''
    }
  },
  created: function () {    
    this.$http
      .post('http://localhost:3000/api/fetch-batch-results-report', {
        'headers': {
          'content-type': 'application/json'
        }
      }).then((res) => {
        console.log(res)
      })
  },
  computed: {
    list1: function() {
      const data = {
        rowId: this.id
      }
      this.$http
      .post('http://localhost:3000/api/fetch-dataset-meta', data, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        console.log(res)
        const position = res.data[0].source.lastIndexOf('/')
        this.fileName = res.data[0].source.substr(position + 1, res.data[0].source.length)
        this.dbData = res.data[0]
        if(this.dbData.status == 1) {
          this.customFlag = true
          this.overallRiskFlag = false
          this.appleTabFlag = false
        }
      })
    }
  },
  methods: {
    showOverallRistk: function () {
      this.overallRiskFlag = true
      this.appleTabFlag = false
      this.customFlag = false
    },
    showAppleTab: function () {
      this.appleTabFlag = true
      this.overallRiskFlag = false
      this.customFlag = false
    },
    showCustom: function () {
      this.customFlag = true
      this.overallRiskFlag = false
      this.appleTabFlag = false
    },
    moment: function () {
      return moment()
    }
  },
  props: ['id']
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>