<template lang="pug">
include _mixins
// table
div
    table.p-table.p-table--full(js-stacktable)
        thead
            tr
                td #
                td Count of Errors
                td Count of Warnings
                td Overall Status

        tbody
            tr.p-table__status-warn(v-for="result in results")
                td {{ result.rowID }}
                td {{ result.errors }}
                td {{ result.warnings }}
                td {{ overallStatusMap[result.grade] }}


    .p-container__more
        a(href="#" js-load-more).btn.btn-more
            span Load more
</template>

<script>
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
      await this.fetchRowByRowReport({ batchId: this.batchId })
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
