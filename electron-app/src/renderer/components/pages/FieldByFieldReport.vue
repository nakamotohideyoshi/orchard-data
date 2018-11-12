<template lang="pug">
include _mixins
div
    table.p-table.p-table--full(js-stacktable v-if="items.length")
        thead
            tr
                td Dataset Row ID
                td Description
        tbody
            tr(v-for="(data, index) in items" @click="show(data, index)")
                td {{data.id}}
                td {{getFilter(data.criteria)}}

    empty-state(
        v-if="!loading && !items.length && error"
        title="No fields found"
        :message="error.message"
    )
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

import {
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META,
  FIELD_BY_FIELD_REPORT
} from '@/constants/types'

export default {
  name: 'field-by-field',
  computed: {
    ...mapState({
      items: state => state.Reports[FIELD_BY_FIELD_REPORT]
    }),
    ...mapGetters({
      error: FIELDS_FAILURE,
      loading: FIELDS_REQUEST,
      // items: FIELDS,
      filters: FILTERS_META
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
      this.fetchFieldByFieldReport({ batchId: id })
    } else {
      // GOTCHA: mocha seems to have problems when checking if an object
      // is instance of a native type (e.g. Array, Error), let's find a better
      // way to unit test this and to properly make it through Karma all
      // the way down to where mocha is executed
      this.$store.commit(FIELDS_FAILURE, new Error('No dataset ID defined'))
    }
  },
  methods: {
    show (data, index) {
      this.$modal.show('field-modal', {
        ...data,
        fieldByFieldRowId: index + 1,
        batchId: this.$route.params.id
      })
    },
    hide () {
      this.$modal.hide('field-modal')
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
    ...mapActions(['fetchFieldByFieldReport'])
  }
}
</script>
