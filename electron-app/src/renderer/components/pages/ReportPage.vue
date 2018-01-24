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
                                            .report-summary__head risk analysis
                                            .report-summary__text.report-summary__text--red Errors Per Row 
                                        .report-summary__label.report-summary__label--red failed
                                        .report-summary__col
                                            .report-summary__head batch id
                                            .report-summary__text(v-if="dbData.length>0") {{dbData[0].id}}
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text(v-if="dbData.length>0") {{moment(dbData[0].time).format('MM-DD-YYYY. HH:mm')}}
                                        .report-summary__col
                                            .report-summary__head download
                                            a(href="#").report-summary__text
                                                +icon('ico-download')
                                    
                                    // tabs
                                    .report__tabs.report__tabs--left(js-scrollbar)
                                        button(v-on:click='showOverallRistk()' v-bind:class="{ 'is-active': overallRiskFlag == true }").report__tab Overall Risk Assessment
                                        button(v-on:click='showAppleTab()' v-bind:class="{ 'is-active': appleTabFlag == true }").report__tab Apple & Itunes Guidelines
                                        button(v-on:click='showCustom()' v-bind:class="{ 'is-active': customFlag == true }").report__tab Custom Parameters
                                    

                                    // summary
                                    .report-container(v-if="appleTabFlag") {{list1}}
                                        .report__top
                                            .report__top-col
                                                .report__top-percent {{(1-successPercent) * 100}} %
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
                                        router-link(:to="`/csv/${dbData[0].id}`").report__view-link
                                            +icon('ico-document')
                                            span {{dbData[0].file_name}}
                                        .upload__group
                                            .upload__group-name
                                                +icon('ico-market-music')
                                                span Parameters
                                            
                                            .ui-group
                                                label Artist blacklist
                                                ul
                                                    li(v-for="data in dbData")
                                                        .item {{data.artistlist}}
                                            .ui-group
                                                label Keyword blacklist
                                                ul
                                                    li(v-for="data in dbData")
                                                        .item {{data.keywordlist}}
                                            .ui-group
                                                label Duplicates threshold
                                                ul
                                                    li(v-for="data in dbData")
                                                        .item {{data.threshold1}}
                                            .ui-group
                                                label Various Artists threshold
                                                ul
                                                    li(v-for="data in dbData")
                                                        .item {{data.threshold2}}
                                            .ui-group
                                                label Language
                                                ul
                                                  li(v-for="data in dbData")
                                                    span(v-if="data.lang == 'en-US'") English
                                                    span(v-if="data.lang == 'en-ES'") Brazilian
                                                    span(v-if="data.lang == 'pt-BR'") Portuguese
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
  data: function () {
    return {
      overallRiskFlag: false,
      appleTabFlag: true,
      customFlag: false,
      dbData: [],
      successPercent: 0,
      artistList: '',
      keywordList: '',
      threshold1: '',
      threshold2: '',
      lang: ''
    }
  },
  computed: {
    list1: function () {
      var sqlite3 = require('sqlite3').verbose()
      var db = new sqlite3.Database('db.sqlite')
      var that = this
      db.all('SELECT  * FROM dataset_meta ORDER BY time DESC ', function (err, rows) {
        if (err) {
          console.log('error', err)
        }
        if (rows) {
          console.log(rows)
          let successData = 0
          that.dbData = rows
          rows.map(row => {
            if (row.success_flag === 'true') {
              successData = successData + 1
            }
          })
          that.successPercent = successData / (rows.length)
        }
      })
      return ''
    }
  },
  created: function () {
    console.log(this.id)
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
    },
    props: ['id']
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>