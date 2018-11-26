<template lang="pug">
include _mixins
.report-summary__container
    // table
    table.p-table.p-table--full.p-table--fixed(js-stacktable v-if="items.length")
        thead
            tr
                td.explanation Explanation
                td.count
                    a(@click.prevent="toggleSort('count')" href="#") Count
        tbody
            tr(js-modal data-mfp-src='#modal-1' v-for="(item, i) in items")
                td {{ item.description }}
                td {{ item.count }}
    empty-state(
        v-if="!loading && !items.length && error"
        title="No errors found"
        :message="error.message"
    )
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import _ from 'lodash'
import {
  SUBMISSION_ERRORS,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  FILTERS_META,
  ERROR_BY_ERROR_REPORT_FAILURE,
  ERROR_BY_ERROR_REPORT
} from '@/constants/types'

export default {
  name: 'error-by-error',
  methods: {
    ...mapActions(['fetchErrorByErrorReport']),
    // TODO: Create sort directive
    toggleSort (name) {
      const { sort } = this

      if (sort[name]) {
        if (sort[name] === 'desc') {
          this.sort[name] = 'asc'
        } else {
          this.sort[name] = 'desc'
        }
      }

      return false
    }
  },
  data () {
    return {
      sort: {
        count: 'desc'
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: SUBMISSIONS_REQUEST,
      error: SUBMISSIONS_FAILURE,
      filters: FILTERS_META
    }),
    ...mapState({
      results: state => state.Reports[ERROR_BY_ERROR_REPORT]
    }),
    items () {
      const items = this.results
      // This can be easily extended with a directive, leaving like this for now
      if (this.sort.count === 'desc') {
        return _.sortBy(items, ['count']).reverse()
      } else {
        return _.sortBy(items, ['count'])
      }
    }
  },
  created () {
    const id = this.$route.params.id

    if (id) {
      this.fetchErrorByErrorReport({ batchId: id })
    } else {
      this.$store.commit(ERROR_BY_ERROR_REPORT_FAILURE, new Error('No dataset ID defined'))
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit(SUBMISSION_ERRORS, [])
    })
  }
}
</script>

<style scoped>
a:hover {
  cursor: pointer;
}
</style>

