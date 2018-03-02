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
                                                .report-summary__head risk analysis
                                                .report-summary__text.report-summary__text--red Errors Per Row
                                            report-summary-label(:status="item.status")
                                            .report-summary__col
                                                .report-summary__head batch id
                                                .report-summary__text {{ batchId }}
                                            .report-summary__col
                                                .report-summary__head batch
                                                .report-summary__text {{ formattedDate }}
                                            .report-summary__col
                                                .report-summary__head download
                                                a(href="#").report-summary__text
                                                    +icon('ico-download')


                                        // table
                                        table.p-table.p-table--full(js-stacktable)
                                            thead
                                                tr
                                                    td #
                                                    td Row ID
                                                    td Count of Errors
                                                    td Count of Warnings
                                                    td Overall Status

                                            tbody
                                                tr.p-table__status-warn(v-for="result in results")
                                                    td #
                                                    td {{ result.rowID }}
                                                    td {{ result.errors }}
                                                    td {{ result.warnings }}
                                                    td {{ overallStatusMap[result.grade] }}

                                    .p-container__more
                                        a(href="#" js-load-more).btn.btn-more
                                            span Load more

                    //- include components/_modal
            block footer
                AppFooter
</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import ReportSummaryLabel from '@/components/ReportSummaryLabel'

import axios from 'axios'
import moment from 'moment'

import { API_URL } from '@/constants/config'
import { mapGetters } from 'vuex'
import {
    SUBMISSION,
    SUBMISSIONS_REQUEST,
    SUBMISSIONS_FAILURE
} from '@/constants/types'

export default {
    name: 'RowByRowReport',
    components: {
        AppHeader,
        AppFooter,
        ReportSummaryLabel
    },

    data () {
        return {
            results: [],
            overallStatusMap: {
                PASS: 'Success',
                ERROR: 'Error',
                WARNING: 'Warning'
            }
        }
    },

    computed: {
        ...mapGetters({
            error: SUBMISSIONS_FAILURE,
            loading: SUBMISSIONS_REQUEST,
            item: SUBMISSION
        }),

        batchId () {
            return this.$route.params.id
        },

        formattedDate () {
            return moment(this.item.time).format('MM-DD-YYYY. HH:mm')
        },
    },


    created () {
        this.fetchReport()
    },

    methods: {

        /**
         * Fetch the report results based on the `batchId`
         * @returns {Promise<void>}
         */
        async fetchReport () {
            this.results = (await axios.get(`${API_URL}row-by-row/${this.batchId}`)).data
        },

        goBack () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="sass" scoped>
    @import "../../assets/styles/app.sass";
</style>
