<template lang="pug">
include _mixins
div
    table.p-table.p-table--full(js-stacktable)
        thead
            tr
                td #
                td Test Data Row ID
                td Description
        tbody
            tr(v-for="data in items" v-on:click="show(data)" @before-open="beforeOpen")
                td {{data.id}}
                td {{data.criteria}}
                td {{getFilter(data.criteria)}}

    modal(name="hello-world" height="auto" @before-open="beforeOpen").modal
        button.close-button(v-on:click="hide()")
            +icon('ico-close')
        label Description
        .description this is test
        label Row Id in field-by-field report
        .description {{detailData.rowid}}
        label Row id in Dataset
        .description {{detailData.dataset_id}}
        label Data fields
        .description {{detailData.test_data_field_ids}}
        .description {{detailData.test_data_field_values}}
        .btn-group
          router-link(:to="`/csv/${detailData.dataset_id}`").btn.btn-view-detail View Row
          button(v-on:click="showParams()").btn.btn-view-detail View Test Paramters
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions, mapState } from 'vuex'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META,
  ACTIVE_REPORT_CATEGORY,
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
    }),
    ...mapState([ACTIVE_REPORT_CATEGORY]),
    batchDate () {
      let date = new Date()

      if (this.batchData && this.batchData.batchDate) {
        date = this.batchData.batchDate
      }

      return moment(date).format('MM-DD-YYYY. HH:mm')
    }
  },
  data () {
    return {
      detailData: ''
    }
  },
  created: function () {
    const { id } = this.$route.params

    if (id) {
      this.fetchDataset(id) // We need to remove this
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

    goBack () {
      this.$router.go(-1)
    },

    show (data) {
      this.detailData = data
      this.$modal.show('hello-world')
    },
    hide () {
      this.$modal.hide('hello-world')
    },
    beforeOpen (/* event */) {
      this.detailData = 'asdasdas'
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

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
