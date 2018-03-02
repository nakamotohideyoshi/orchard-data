<template lang="pug">
include ../pages/_mixins
// Summary
.report-summary
    .report-summary__col
        .report-summary__head risk analysis
        .report-summary__text(:class="{'report-summary__text--red': status === 2}") Errors Per Row
    .report-summary__label.report-summary__label--red
        span(v-if="status === 1") Success
        span(v-if="status === 2") Fail
        span(v-if="status === 3") IN PROGRESS
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

export default {
    name: 'report-summary-header',
    props: {
        status: {
            type: Number,
            required: true,
            default: 0,
        },
        time: {
            type: [String, Date, Number],
            required: true,
        },
        id: {
            type: [String, Number],
            required: true,
            default: 0
        }
    },
    computed: {
         date() {
             return moment(this.time).format('MM-DD-YYYY. HH:mm')
         }
    }
}
</script>
<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>