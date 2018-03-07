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

                                // report box
                                .p-box.report
                                    // Summary
                                    .report-summary
                                        .report-summary__col
                                            .report-summary__head risk analysis
                                            .report-summary__text(:class="{'report-summary__text--red': status === 2}") Report Summary
                                        report-summary-label(:status="status")

                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text {{ time }}

                                    // tabs
                                    .report__tabs.report__tabs--left(js-scrollbar)
                                        button.overall-tab(v-on:click='showOverallRistk()' v-bind:class="{ 'is-active': overallRiskFlag, 'is-disabled':status === 3 }" :disabled="status === 3").report__tab {{ categoryOverallText }}
                                        button.apple-tab(v-on:click='showAppleTab()' v-bind:class="{ 'is-active': appleTabFlag, 'is-disabled': status === 3 }" :disabled="status === 3").report__tab {{ categoryItunesText }}
                                        button.custom-tab(v-on:click='showCustom()' v-bind:class="{ 'is-active': customFlag }").report__tab {{ categoryCustomText }}


                                    // summary
                                    .report-container.apple-tab(v-if="appleTabFlag || overallRiskFlag" :class="{ 'is-active': appleTabFlag || overallRiskFlag }")
                                        .report__top
                                            .report__top-col
                                                .report__top-percent {{ formattedErrorPercent }}
                                                .report__top-description Total percent of rows with errors
                                            .report__top-col
                                                .report__top-stars
                                                  .success(v-for="star in goodStarsCount")
                                                    +icon('ico-star-filled')
                                                  .failed(v-for="star in badStarsCount")
                                                    +icon('ico-star-empty')
                                                .report__top-description Overall data quality

                                        // report view
                                        .report__view
                                            .report__view-title What are the biggest problems with the dataset?
                                            router-link(:to="`/ErrorByErrorReport/${itemid}`").report__view-link
                                                +icon('ico-document')
                                                span View the test criteria scores
                                        .report__view
                                            .report__view-title What is the sum of problems in each row?
                                            router-link(:to="`/RowByRowReport/${itemid}`").report__view-link
                                                +icon('ico-document')
                                                span View the input row scores
                                        .report__view
                                            .report__view-title Which fields in the dataset failed?
                                            router-link(:to="`/FieldByFieldReport/${itemid}`").report__view-link
                                                +icon('ico-document')
                                                span View the field level issues
                                    //.report-container.overall-tab(v-if="overallRiskFlag" :class="{ 'is-active': overallRiskFlag }")
                                      .report__view
                                        .report__view-title This page not yet implemented.
                                    .report-container.custom-tab(v-if="customFlag" :class="{ 'is-active': customFlag }")
                                        // group
                                        router-link(:to="`/csv/${itemid}`").report__view-link
                                            +icon('ico-document')
                                            span {{fileName}}
                                        .upload__group
                                            .upload__group-name
                                                +icon('ico-market-music')
                                                span Parameters

                                            .ui-group
                                                label Artist blacklist
                                                textarea.disabled(v-bind:placeholder="item.artist_blacklist" v-model="artistList" :disabled="true")
                                            .ui-group
                                                label Keyword blacklist
                                                textarea.disabled(v-bind:placeholder="item.keyword_blacklist" v-model="keywordList" :disabled="true")
                                            .ui-group
                                                label Duplicates threshold
                                                input(v-bind:placeholder="item.duplicates_threshold" type="number" v-model="threshold1" :disabled="true")
                                            .ui-group
                                                label Various Artists threshold
                                                input(v-bind:placeholder="item.various_artists_threshold" type="number" v-model="threshold2" :disabled="true")
                                            .ui-group
                                                label Language
                                                    .language(v-if="item.lang == 'en-US'") English
                                                    .language(v-if="item.lang == 'en-ES'") Spanish
                                                    .language(v-if="item.lang == 'pt-BR'") Brazilian Portugese
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  SET_ACTIVE_CATEGORY
} from '@/constants/types'
import {API_URL} from '@/constants/config'
import axios from 'axios'

import {
    CUSTOM_CATEGORY,
    ITUNES_CATEGORY,
    OVERALL_CATEGORY
} from '@/constants/report-category'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'

export default {
  name: 'ReportSummary',
  components: {
    AppHeader,
    AppFooter,
    ReportSummaryLabel
  },
  data () {
    return {
      categoryOverallText: OVERALL_CATEGORY,
      categoryItunesText: ITUNES_CATEGORY,
      categoryCustomText: CUSTOM_CATEGORY,
      overallRiskFlag: false,
      appleTabFlag: true,
      customFlag: false,
      errorPercent: 0,
      errorScore: 0,
      artistList: '',
      keywordList: '',
      threshold1: '',
      threshold2: '',
      lang: ''
    }
  },
  computed: {
    fileName () {
      if (this.item && this.item.source) {
        const splitted = this.item.source.split('/')
        const position = splitted.length - 1

        return splitted[position]
      }

      return ''
    },
    time () {
      let date = ''

      if (this.item && this.item.time) {
        date = new Date(this.item.time)
        return moment(date).format('MM-DD-YYYY. HH:mm')
      }

      return ''
    },
    status () {
      if (this.item && this.item.status >= 0) {
        return this.item.status
      }

      return -1
    },
    itemid () {
      if (this.item && this.item.rowid) {
        return this.item.rowid
      }

      return ''
    },

    formattedErrorPercent () {
      return `${(this.errorPercent * 100).toFixed(2)}%`
    },
    goodStarsCount () {
        const MAX_STARS = 5
        return MAX_STARS - Math.round(this.errorScore)

    },
    badStarsCount () {
        return Math.round(this.errorScore)
    },
    ...mapGetters({
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION
    })
  },
  methods: {
    ...mapMutations({setReportCategory: SET_ACTIVE_CATEGORY}),
    async fetchReportSummary () {
      const summary = (await axios.get(`${API_URL}report-summary/${this.id}`)).data

      this.errorPercent = summary[0].error_percent
      this.errorScore = summary[0].error_score
    },

    showOverallRistk: function () {
      this.setReportCategory(OVERALL_CATEGORY)
      this.overallRiskFlag = true
      this.appleTabFlag = false
      this.customFlag = false
    },
    showAppleTab: function () {
      this.setReportCategory(ITUNES_CATEGORY)
      this.appleTabFlag = true
      this.overallRiskFlag = false
      this.customFlag = false
    },
    showCustom: function () {
        this.setReportCategory(CUSTOM_CATEGORY)
      this.customFlag = true
      this.overallRiskFlag = false
      this.appleTabFlag = false
    }
  },
  props: ['id'],
  async created () {
    this.showAppleTab()

    this.fetchReportSummary()
    await this.$store.dispatch('fetchDataset', this.id)

    if (this.status === 3) {
      this.showCustom()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
