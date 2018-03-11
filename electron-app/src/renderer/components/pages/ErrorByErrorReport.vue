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
                                            .report-summary__text.report-summary__title.report-summary__text--red Most Common Errors
                                        report-summary-label(:status="item.status")
                                        .report-summary__col
                                            .report-summary__head batch id
                                            .report-summary__text {{ batchId }}
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text {{ formattedDate }}
                                        .report-summary__col
                                            .report-summary__head download
                                            a(:href="downloadLink", download).report-summary__text
                                                +icon('ico-download')


                                    // table
                                    table.p-table.p-table--full(js-stacktable)
                                        thead
                                            tr
                                                td #
                                                td Criteria ID and Link
                                                td Short Explanation
                                                td Count

                                        tbody
                                            tr.p-table__status-warn(v-for="result in results")
                                                td #
                                                td {{ result.criteriaId }}
                                                td {{ result.description }}
                                                td {{ result.count }}

                //- include components/_modal
        block footer
            AppFooter
</template>

<script>
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import moment from 'moment'
import { mapState, mapActions, mapGetters } from 'vuex'
import {
  ACTIVE_REPORT_CATEGORY,
  ERROR_BY_ERROR_REPORT,
  SUBMISSIONS_FAILURE,
  SUBMISSIONS_REQUEST,
  SUBMISSION,
  DATE_FORMAT
} from '@/constants/types'

export default {
  name: 'ErrorByErrorReport',
  components: {
    AppHeader,
    AppFooter,
    ReportSummaryLabel
  },

  computed: {
    ...mapGetters({
      downloadLinkFunc: 'errorByErrorDownloadLink',
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION
    }),
    ...mapState([ACTIVE_REPORT_CATEGORY]),
    ...mapState({
      results: state => state.Reports[ERROR_BY_ERROR_REPORT]
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
    ...mapActions(['fetchErrorByErrorReport']),
    async fetchReport () {
      await this.fetchErrorByErrorReport({batchId: this.batchId})
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
