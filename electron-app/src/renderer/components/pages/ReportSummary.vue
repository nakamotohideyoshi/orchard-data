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

                                // page back
                                router-link(:to="'/submissions'").page-back
                                    .icon.icon-arrow-back
                                    span Report Summary

                                // report box
                                .p-box.report
                                    // Summary
                                    report-summary-header(
                                      v-if="item"
                                      :time="item.time"
                                      :id="item.rowid"
                                      :status="item.status")

                                    router-view
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE
} from '@/constants/types'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'ReportSummary',
  components: {
    AppHeader,
    AppFooter
  },
  computed: {
    ...mapGetters({
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION
    })
  },
  async created () {
    await this.$store.dispatch('fetchDataset', this.$route.params.id)
  },
  // TODO: Update header title and CSV link on change
  beforeRouteEnter(to, from, next) {
    console.log(to, from, 'enter')
    next()
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, 'update')
    next()
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
