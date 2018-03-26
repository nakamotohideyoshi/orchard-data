<template lang="pug">
include _mixins
// table
div
    table.p-table.p-table--full(js-stacktable v-if="results.length")
        thead
            tr
                td Dataset Row ID
                td Count of Errors
                td Count of Warnings
                td Overall Status

        tbody
            tr.p-table__status-warn(v-for="result in results")
                td {{ result.rowID }}
                td {{ result.errors }}
                td {{ result.warnings }}
                td
                  span(v-bind:style="{ color: result.acceptability }") &#8226;

    empty-state(
        v-if="!loading && !results.length && error"
        title="No rows found"
        :message="error.message"
    )
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  ACTIVE_REPORT_CATEGORY,
  ROW_BY_ROW_REPORT
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

    batchId () {
      return this.$route.params.id
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
    }
  }
}
</script>
