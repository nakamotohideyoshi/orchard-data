<template lang="pug">
include _mixins
div
    table.p-table.p-table--full(js-stacktable v-if="items.length")
        thead
            tr
                td #
                td Test Data Row ID
                td Description
        tbody
            tr(v-for="data in items" @click="show(data)")
                td {{data.id}}
                td {{data.criteria}}
                td {{getFilter(data.criteria)}}

    empty-state(
        v-if="!loading && !items.length && error"
        title="No fields found"
        :message="error.message"
    )
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions, mapState } from 'vuex'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import Modal from '@/components/sections/FieldModal'

import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META,
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE
} from '@/constants/types'

export default {
  name: 'FieldByFieldReport',
  computed: {
    ...mapGetters({
      error: FIELDS_FAILURE,
      loading: FIELDS_REQUEST,
      items: FIELDS,
      filters: FILTERS_META
    })
  },
  data () {
    return {
      detailData: ''
    }
  },
  created: function () {
    const { id } = this.$route.params

    if (id) {
      this.fetchFields(id)
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
      console.log(data, 'data', this.$modal)
      this.$modal.show('field-modal', {
        ...data,
        rowid: this.$route.params.id
      })
    },
    hide () {
      this.$modal.hide('field-report-modal')
    },
    getFilter (id) {
      if (this.filters && this.filters[id] && this.filters[id].userExplanation) {
        return this.filters[id].userExplanation
      }

      return 'N/A'
    },
    ...mapActions([
      'fetchFields',
      'fetchDataset'
    ])
  }
}
</script>
