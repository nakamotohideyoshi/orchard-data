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
                                      :category="category"
                                      :has-download-link="!!downloadLink")
                                      a(
                                        :href="downloadLink"
                                        download
                                        slot="download-link"
                                        @click.prevent="openTSV"
                                      ).report-summary__text
                                        +icon('ico-download')

                                    // keep-alive
                                    router-view(v-if="item")
        block footer
            AppFooter
</template>

<script>
import { mapGetters } from 'vuex'
import { remote } from 'electron'
import {
  SUBMISSION,
  SUBMISSIONS_REQUEST,
  SUBMISSIONS_FAILURE,
  ACTIVE_REPORT_CATEGORY
} from '@/constants/types'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

const { BrowserWindow } = remote

export default {
  name: 'ReportSummary',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      title: '',
      downloadLink: '',
      canGoBack: false,
      win: null
    }
  },
  computed: {
    ...mapGetters({
      fieldByFieldDownloadLink: 'fieldByFieldDownloadLink',
      errorByErrorDownloadLink: 'errorByErrorDownloadLink',
      rowByRowDownloadLink: 'rowByRowDownloadLink',
      summaryDownloadLink: 'summaryDownloadLink',
      error: SUBMISSIONS_FAILURE,
      loading: SUBMISSIONS_REQUEST,
      item: SUBMISSION,
      category: ACTIVE_REPORT_CATEGORY
    }),
    batchId () {
      return this.$route.params.id
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    setTitles (name) {
      switch (name) {
        case 'row-by-row':
          this.title = 'Errors Per Row'
          this.downloadLink = this.rowByRowDownloadLink(this.batchId)
          this.canGoBack = true
          break
        case 'field-by-field':
          this.title = 'Every Row'
          this.downloadLink = this.fieldByFieldDownloadLink(this.batchId)
          this.canGoBack = true
          break
        case 'error-by-error':
          this.title = 'Count Per Row'
          this.downloadLink = this.errorByErrorDownloadLink(this.batchId)
          this.canGoBack = true
          break
        default:
          this.title = 'Report Summary'
          this.downloadLink = this.summaryDownloadLink(this.batchId)
          this.canGoBack = false
      }
    },
    openTSV () {
      const { batchId } = this
      const winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/#tsv/${batchId}`
        : `file://${__dirname}/index.html/#tsv/${batchId}`

      this.win = new BrowserWindow({
        title: `Dataset TSV (${batchId})`,
        show: false
      })
      this.win.on('closed', () => {
        this.win = null
      })
      this.win.loadURL(winURL)
      this.win.show()
    }
  },
  async created () {
    await this.$store.dispatch('fetchDataset', this.$route.params.id)
    this.setTitles(this.$route.name)
  },
  beforeRouteUpdate (to, from, next) {
    this.setTitles(to.name)
    next()
  }
}
</script>
