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
                                a(href="", @click.prevent="goBack" v-if="canGoBack").page-back
                                    .icon.icon-arrow-back
                                    span Report Summary

                                // report box
                                .p-box.report
                                    // Summary
                                    report-summary-header(
                                      v-if="item"
                                      :time="item.time"
                                      :id="item.rowid"
                                      :status="item.status"
                                      :title="title"
                                      :category="category")

                                    router-view(v-if="item")
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
  data() {
      return {
        title: '',
        category: '',
        canGoBack: false
      }
  },
  computed: {
    ...mapGetters({
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION
    })
  },
  props: ['id'],
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
    },
    goBack () {
      this.$router.go(-1)
    },
    setTitles(name) {
      this.category = 'Risk Analysis'

      switch(name) {
        case 'row-by-row':
            this.title = 'Errors Per Row'
            this.canGoBack = true
        break;
        case 'field-by-field':
            this.title = 'Every Row'
            this.canGoBack = true
        break;
        case 'error-by-error':
            this.title = 'Count Per Row'
            this.canGoBack = true
        break;
        default:
            this.title = 'Report Summary'
            this.canGoBack = false
      }
    } 
  },
  async created () {
    await this.$store.dispatch('fetchDataset', this.$route.params.id)
    this.setTitles(this.$route.name)
  },
  beforeRouteUpdate(to, from, next) {
    this.setTitles(to.name)
    next()
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>
