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
import { mapGetters, mapMutations } from 'vuex'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  SET_ACTIVE_CATEGORY
} from '@/constants/types'

import {
    CUSTOM_CATEGORY,
    ITUNES_CATEGORY,
    OVERALL_CATEGORY
} from '@/constants/report-category'

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
  methods: {
    ...mapMutations({setReportCategory: SET_ACTIVE_CATEGORY}),

    showOverallRistk: function () {
      this.setReportCategory(OVERALL_CATEGORY)
      this.overallRiskFlag = true
      this.appleTabFlag = false
      this.customFlag = false
    },
    showAppleTab: function () {
      this.setReportCategory(ITUNES_CATEGORY)
      this.appleTabFlag = true
      this.overallRiskFlag = false
      this.customFlag = false
    },
    showCustom: function () {
        this.setReportCategory(CUSTOM_CATEGORY)
      this.customFlag = true
      this.overallRiskFlag = false
      this.appleTabFlag = false
    }
  },
  props: ['id'],
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
