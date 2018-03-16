<template lang="pug">
include _mixins
div
    table.p-table.p-table--full(js-stacktable v-if="results.length")
        thead
            tr
                td Row Id
                td Test Data Row ID
                td Description
        tbody
            tr(v-for="data in results" @click="show(data)")
                td {{data.id}}
                td {{data.criteria}}
                td {{getFilter(data.criteria)}}

    empty-state(
        v-if="!loading && !results.length && error"
        title="No fields found"
        :message="error.message"
    )
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META,
  FIELD_BY_FIELD_REPORT
} from '@/constants/types'

export default {
  name: 'field-by-field',
  computed: {
    ...mapGetters({
      error: FIELDS_FAILURE,
      loading: FIELDS_REQUEST,
      items: FIELDS,
      filters: FILTERS_META
    }),
    ...mapState({
      results: state => state.Reports[FIELD_BY_FIELD_REPORT]
    })
  },
  data () {
    return {
      detailData: ''
    }
  },
  created: function () {
    const id = this.$route.params.id

    if (id) {
      this.fetchFieldByFieldReport({batchId: id})
    } else {
      // GOTCHA: mocha seems to have problems when checking if an object
      // is instance of a native type (e.g. Array, Error), let's find a better
      // way to unit test this and to properly make it through Karma all
      // the way down to where mocha is executed
      this.$store.commit(FIELDS_FAILURE, new Error('No dataset ID defined'))
    }
  },
  methods: {
    show (data) {
      // console.log(data, 'data', this.$modal)
      this.$modal.show('field-modal', {
        ...data,
        rowid: this.$route.params.id
      })
    },
    hide () {
      this.$modal.hide('field-report-modal')
    },
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
    ...mapActions(['fetchFields', 'fetchFieldByFieldReport', 'fetchDataset'])
  }
}
</script>
