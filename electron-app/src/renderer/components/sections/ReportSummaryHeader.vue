<template lang="pug">
include ../pages/_mixins
// Summary
.report-summary
    .report-summary__col
        .report-summary__head {{ category }}
        .report-summary__text(:class="{'report-summary__text--red': status === 2}") {{ title }}
    report-summary-label(:status="status")
    .report-summary__col
        .report-summary__head Batch ID
        .report-summary__text {{ id }}
    .report-summary__col
        .report-summary__head Date
        .report-summary__text {{ date }}
    .report-summary__col
        .report-summary__head download
        a(href="#").report-summary__text
            +icon('ico-download')
</template>

<script>
import moment from 'moment'
import ReportSummaryLabel from '@/components/sections/ReportSummaryLabel'

export default {
    name: 'report-summary-header',
    components: {
        ReportSummaryLabel
    },
    props: {
        status: {
            type: Number,
            required: true,
            default: 0,
        },
        time: {
            type: [String, Number],
            required: true,
        },
        id: {
            type: [String, Number],
            required: true,
            default: 0
        },
        category: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    computed: {
         date() {
             return moment(this.time).format('dddd MMM Do YYYY HH:mmA')
         }
    }
}
</script>
<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>