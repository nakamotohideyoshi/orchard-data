<template lang="pug">
include _mixins
#barba-wrapper
    .page(class=outClass)
        block header
            AppHeader
        .page__content
            block content
                // add this class to make header static (not sticky)
                // sticky might break header layout on this page
                .header-static
                    
                // CSV container with white BG
                .p-csv
                    .container
                        // summary
                        .report-summary.report-summary--csv
                            router-link(:to="'/submissions'").page-back
                                .icon.icon-arrow-back
                                span back to report
                            .report-summary__col
                                .report-summary__head batch id
                                .report-summary__text {{id}}
                            .report-summary__col
                                .report-summary__head batch
                                .report-summary__text(v-if="datasetMeta.length>0") {{moment(datasetMeta[0].time).format('MM-DD-YYYY. HH:mm')}}
                                    a(href="../../../../tests/data/test.tsv" download).report-summary__text
                                        +icon('ico-download')
                            .report-summary__label.report-summary__label--green success
                .table-responsive 
                    table.p-table.p-table--subm(js-stacktable)
                        thead
                            tr
                                td(v-for="header in headers")
                                    span.table-header {{header.replace(/_/g, " ")}}
                        tbody
                            tr(v-for="batch in batches")
                                td(v-for="header in headers")
                                    span {{batch[header]}}

            
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'csv-page',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      batches: [],
      headers: [],
      datasetMeta: []
    }
  },
  created: function () {
    const data = {
      'dataset-id': this.id
    }
    this.$http
      .post('http://localhost:3000/api/fetch-tsv-dataset', data, {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        this.batches = res.data
        this.headers = Object.keys(this.batches[0])
      })
  },
  methods: {
    moment: function () {
      return moment()
    }
  },
  props: ['id']
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>