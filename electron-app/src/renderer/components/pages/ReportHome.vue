<template   lang="pug">
include _mixins
// tabs
.report-home
    .report__tabs.report__tabs--left(js-scrollbar)
        button.overall-tab(v-on:click='showOverallRisk()' v-bind:class="{ 'is-active': overallRiskFlag, 'is-disabled':status === 3 }" :disabled="status === 3").report__tab {{categoryOverallText}}
        button.apple-tab(v-on:click='showAppleTab()' v-bind:class="{ 'is-active': appleTabFlag, 'is-disabled': status === 3 }" :disabled="status === 3").report__tab {{categoryItunesText}}
        button.custom-tab(v-on:click='showCustom()' v-bind:class="{ 'is-active': customFlag }").report__tab {{categoryCustomText}}

    // summary
    .report-container.apple-tab(v-show="appleTabFlag" :class="{ 'is-active': appleTabFlag }")
        report-summary-quality(:report-summary="itunesQualityData")
        report-links
    .report-container.overall-tab(v-show="overallRiskFlag" :class="{ 'is-active': overallRiskFlag }")
        report-summary-quality(:report-summary="riskQualityData")
        report-links
    .report-container.custom-tab(v-show="customFlag" :class="{ 'is-active': customFlag }")
        // group
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
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  SET_ACTIVE_CATEGORY,
  REPORT_SUMMARY,
  ACTIVE_REPORT_CATEGORY
} from '@/constants/types'

import {
  CUSTOM_CATEGORY,
  ITUNES_CATEGORY,
  OVERALL_CATEGORY
} from '@/constants/report-category'

import ReportLinks from '@/components/sections/ReportLinks'
import ReportSummaryQuality from '@/components/sections/ReportSummaryQuality'

export default {
  name: 'report-home',
  data () {
    return {
      categoryOverallText: OVERALL_CATEGORY,
      categoryItunesText: ITUNES_CATEGORY,
      categoryCustomText: CUSTOM_CATEGORY,
      overallRiskFlag: false,
      appleTabFlag: true,
      customFlag: false,
      artistList: '',
      keywordList: '',
      threshold1: '',
      threshold2: '',
      lang: ''
    }
  },
  computed: {
    itunesQualityData () {
      let value = {}
      if (this.summaryData.hasOwnProperty('category')) {
        value = this.summaryData.category.itunes
      }
      return value
    },

    riskQualityData () {
      let value = {}
      if (this.summaryData.hasOwnProperty('category')) {
        value = this.summaryData.category.risk
      }
      return value
    },

    batchId () {
      return this.$route.params.id
    },
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
    ...mapState({
      summaryData: state => state.Reports[REPORT_SUMMARY]
    }),
    ...mapGetters({
      category: ACTIVE_REPORT_CATEGORY,
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION
    })
  },
  methods: {
    ...mapActions(['fetchSummary']),
    ...mapMutations({setReportCategory: SET_ACTIVE_CATEGORY}),

    setInitialCategory () {
      if (this.category === OVERALL_CATEGORY) {
        this.showOverallRisk()
      } else if (this.category === ITUNES_CATEGORY) {
        this.showAppleTab()
      } else if (this.category === CUSTOM_CATEGORY) {
        this.showCustom()
      } else {
        this.showAppleTab()
      }
    },

    showOverallRisk: function () {
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
  created () {
    this.fetchSummary({batchId: this.batchId})
    if (this.item.status === 3) {
      this.showCustom()
    } else {
      this.setInitialCategory()
    }
  },
  components: {
    ReportLinks,
    ReportSummaryQuality
  }
}
</script>
