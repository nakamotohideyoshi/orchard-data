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
                                modal(name="hello-world" height="auto").modal
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
import { mapGetters } from 'vuex'
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import {
  FIELDS,
  FIELDS_REQUEST,
  FIELDS_FAILURE  
} from '@/constants/types';

export default {
  name: 'field-level-page',
  components: {
    AppHeader,
    AppFooter
  },
  computed: {
    ...mapGetters({
      error: FIELDS_FAILURE,
      loading: FIELDS_REQUEST,
      items: FIELDS
    })
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
    const { id } = this.$route.params;

    console.log(id, 'id');

    if (id) {
      this.$store.dispatch('fetchFields', id);
    } else {
      this.error = new Error('No dataset ID defined');
    }
  },
  methods: {
    moment: function () {
      return moment()
    },
    show (data) {
      console.log(data)
      this.detailData = data
      this.$modal.show('hello-world')
    },
    hide () {
      this.$modal.hide('hello-world')
    },
    beforeOpen (event) {
      console.log(12312312)
      console.log(event)
      this.detailData = 'asdasdas'
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
