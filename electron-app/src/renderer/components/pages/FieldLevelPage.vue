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
                                modal(name="hello-world").modal
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
                                      button(v-on:click="goCSVPage()").btn.btn-view-detail View Row
                                      button(v-on:click="showParams()").btn.btn-view-detail View Test Paramters

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