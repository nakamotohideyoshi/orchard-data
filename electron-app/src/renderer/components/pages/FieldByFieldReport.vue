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
                                            .report-summary__text.report-summary__title.report-summary__text--red Every Error
                                        report-summary-label(:status="item.status")
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text {{batchDate}}
                                        .report-summary__col
                                            .report-summary__head download
                                            a(:href="downloadLink", download).report-summary__text
                                                +icon('ico-download')
                                    table.p-table.p-table--subm(js-stacktable)
                                        thead
                                            tr
                                                td Row ID
                                                td Test Data Row ID
                                                td Description
                                        tbody
                                            tr(v-for="data in results" v-on:click="show(data)" @before-open="beforeOpen")
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

                //- include components/_modal
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions, mapState } from 'vuex'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'
import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE,
  FILTERS_META,
  ACTIVE_REPORT_CATEGORY,
  FIELD_BY_FIELD_REPORT,
  DATE_FORMAT,
  SUBMISSION
} from '@/constants/types'

export default {
  name: 'FieldByFieldReport',
  components: {
    AppHeader,
    AppFooter,
    ReportSummaryLabel
  },
  computed: {
    ...mapGetters({
      downloadLinkFunc: 'fieldByFieldDownloadLink',
      error: FIELDS_FAILURE,
      loading: FIELDS_REQUEST,
      filters: FILTERS_META,
      item: SUBMISSION
    }),
    ...mapState([ACTIVE_REPORT_CATEGORY]),
    ...mapState({
      results: state => state.Reports[FIELD_BY_FIELD_REPORT]
    }),
    batchDate () {
        return moment(this.item.time).format(DATE_FORMAT)
    },

    batchId () {
      return this.$route.params.id
    },

    downloadLink () {
      return this.downloadLinkFunc(this.batchId)
    }
  },
  data () {
    return {
      detailData: ''
    }
  },
  created: function () {

    if (this.batchId) {
      this.fetchFieldByFieldReport({batchId: this.batchId})
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

      return ''
    },
    ...mapActions(['fetchFieldByFieldReport'])

  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
