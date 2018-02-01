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

                                router-link(:to="'/submissions'").page-back
                                    .icon.icon-arrow-back
                                    span Report Summary
                        
                                .p-box.report
                                    // summary
                                    .report-summary
                                        .report-summary__col
                                            .report-summary__head risk analysis
                                            .report-summary__text.report-summary__text--red Errors Per Row 
                                        .report-summary__label.report-summary__label--red failed
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text {{moment(batchData.batchDate).format('MM-DD-YYYY. HH:mm')}}
                                        .report-summary__col
                                            .report-summary__head download
                                            a(href="../../../../tests/data/test.tsv" download).report-summary__text
                                                +icon('ico-download')
                                    table.p-table.p-table--subm(js-stacktable)
                                        thead
                                            tr
                                                td Row ID
                                                td Test Data Row ID
                                                td Description
                                        tbody
                                            tr(v-for="data in dbData" v-on:click="show(data)" @before-open="beforeOpen")
                                                td {{data.rowid}}
                                                td {{data.test_data_row_id}}
                                                td This is a test
                                
                                // more btn
                                .p-container__more
                                    a(href="#" js-load-more).btn.btn-more
                                        span Load more
                                modal(name="hello-world")
                                    span {{detailData.criteria_id}}
                                    span {{detailData.dataset_id}}
                                    span {{detailData.filter_id}}
                                    span {{detailData.rowid}}
                                    span {{detailData.test_data_field_id}}
                                    span {{detailData.test_data_field_value}}
                                    span {{detailData.test_data_row_id}}
                                // v-dialog

                //- include components/_modal
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'field-level-page',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      batchData: {
        batchDate: new Date()
      },
      dbData: {},
      detailData: ''
    }
  },
  created: function () {
    this.$http
      .post('http://localhost:3000/api/fetch-field-by-field-report', {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        console.log(res)
        this.dbData = res.data
      })
  },
  methods: {
    moment: function () {
      return moment()
    },
    show (data) {
      console.log(data)
      this.detailData = data;
      this.$modal.show('hello-world');
    },
    hide () {
      this.$modal.hide('hello-world');
    },
    beforeOpen (event) {
      console.log(12312312)
      console.log(event)
      this.detailData = 'asdasdas'
    },
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>