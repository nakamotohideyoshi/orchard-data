<template lang="pug">
include _mixins
// table
table.p-table.p-table--full(js-stacktable)
    thead
        tr
            td #
            td Explanation
            td
                a(@click.prevent="toggleSort('count')" href="#") Count

    tbody
        tr(js-modal data-mfp-src='#modal-1' v-for="(item, i) in items")
            td {{ i + 1 }}
            td {{ getFilter(item.criteriaId) }}
            td {{ item.count }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import {
  SUBMISSION_ERRORS,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  FILTERS_META,
  ERROR_BY_ERROR_REPORT_FAILURE
} from '@/constants/types'

export default {
  name: 'error-by-error',
  methods: {
    ...mapActions(['fetchErrors']),
    getFilter (id) {
      if (
        this.filters &&
        this.filters[id] &&
        this.filters[id].userExplanation
      ) {
        return this.filters[id].userExplanation
      }

      return 'N/A'
    },
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
    items () {
      const items = this.$store.getters[SUBMISSION_ERRORS]
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
      this.fetchErrors(id)
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

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>

<style scoped>
a:hover {
  cursor: pointer;
}
</style>

