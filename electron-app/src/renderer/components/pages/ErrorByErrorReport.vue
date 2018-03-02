<template lang="pug">
include _mixins
// table
table.p-table.p-table--full(js-stacktable)
    thead
        tr
            td #
            td Criteria ID and Link
            td Short Explanation
            td Count

    tbody
        tr(js-modal data-mfp-src='#modal-1' v-for="(item, i) in items")
            td {{ i + 1 }}
            td {{ item.criteriaId }}
            td {{ getFilter(item.criteriaId) }}
            td {{ item.count }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
    SUBMISSION_ERRORS,
    SUBMISSIONS_REQUEST,
    SUBMISSIONS_FAILURE,
    FILTERS_META
} from '@/constants/types'

export default {
    name: 'ErrorByErrorReport',
    methods: {
        ...mapActions([
            'fetchErrors'
        ]),
        getFilter (id) {
            if (this.filters && this.filters[id] && this.filters[id].userExplanation) {
                return this.filters[id].userExplanation
            }

            return 'N/A'
        },
        goBack () {
            this.$router.go(-1)
        }
    },
    computed: {
        ...mapGetters({
            items: SUBMISSION_ERRORS,
            loading: SUBMISSIONS_REQUEST,
            error: SUBMISSIONS_FAILURE,
            filters: FILTERS_META,
        })
    },
    async created() {
        await this.fetchErrors(this.$route.params.id)
    }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
