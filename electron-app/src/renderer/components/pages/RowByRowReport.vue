<template lang="pug">
include _mixins
// table
div
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
</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

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
        AppFooter
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
        }
    }
}
</script>

<style lang="sass" scoped>
    @import "../../assets/styles/app.sass";
</style>
