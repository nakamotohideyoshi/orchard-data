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

                                    a(href="", @click.prevent="goBack").page-back
                                        .icon.icon-arrow-back
                                        span Report Summary

                                    .p-box.report
                                        // summary
                                        .report-summary
                                            .report-summary__col
                                                .report-summary__head {{ ACTIVE_REPORT_CATEGORY }}
                                                .report-summary__text.report-summary__title.report-summary__text--red Errors Per Row
                                            report-summary-label(:status="item.status")
                                            .report-summary__col
                                                .report-summary__head batch id
                                                .report-summary__text {{ batchId }}
                                            .report-summary__col
                                                .report-summary__head batch
                                                .report-summary__text {{ formattedDate }}
                                            .report-summary__col
                                                .report-summary__head download
                                                a(:href="downloadLink", download).report-summary__text.report-summary__download
                                                    +icon('ico-download')


                                        // table
                                        table.p-table.p-table--full(js-stacktable)
                                            thead
                                                tr
                                                    td #
                                                    td Row ID
                                                    td Count of Errors
                                                    td Count of Warnings
                                                    td Overall Status

                                            tbody
                                                tr.p-table__status-warn(v-for="result in results")
                                                    td #
                                                    td {{ result.rowID }}
                                                    td {{ result.errors }}
                                                    td {{ result.warnings }}
                                                    td {{ overallStatusMap[result.grade] }}

                    //- include components/_modal
            block footer
                AppFooter

</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import moment from 'moment'
import { mapGetters, mapState, mapActions } from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  ACTIVE_REPORT_CATEGORY,
  ROW_BY_ROW_REPORT,
  DATE_FORMAT
} from '@/constants/types'

export default {
  name: 'RowByRowReport',
  components: {
    AppHeader,
    AppFooter,
    ReportSummaryLabel
  },

  data () {
    return {
      overallStatusMap: {
        PASS: 'Success',
        ERROR: 'Error',
        WARNING: 'Warning'
      }
    }
  },

  computed: {
    ...mapGetters({
      downloadLinkFunc: 'rowByRowDownloadLink',
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION
    }),

    ...mapState([ACTIVE_REPORT_CATEGORY]),
    ...mapState({
      results: state => state.Reports[ROW_BY_ROW_REPORT]
    }),

    batchId () {
      return this.$route.params.id
    },

    downloadLink () {
      return this.downloadLinkFunc(this.batchId)
    },

    formattedDate () {
      return moment(this.item.time).format(DATE_FORMAT)
    }
  },

  created () {
    this.fetchReport()
  },

  methods: {
    ...mapActions(['fetchRowByRowReport']),

    /**
         * Fetch the report results based on the `batchId`
         * @returns {Promise<void>}
         */
    async fetchReport () {
      await this.fetchRowByRowReport({batchId: this.batchId})
    },

    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="sass" scoped>
    @import "../../assets/styles/app.sass";
</style>
