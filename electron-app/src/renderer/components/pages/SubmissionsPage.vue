<template lang="pug">
#barba-wrapper
    .page(class=outClass)
        block header
            AppHeader
        .page__content
            block content
                .p-container
                    .container
                        .p-container__wrapper
                            .container.container--narrow
                                // page-title
                                .page-title
                                    i.icon.icon-list
                                    h1 All Submissions ({{items.length}})
                                    .page-title__num {{items.length}}


                                table.p-table.p-table--subm(js-stacktable)
                                    thead
                                        tr
                                            td Batch ID
                                            td Batch Status
                                            td
                                                .p-table__icon-td
                                                    i.icon.icon-calendar-grid
                                                    span Date Created
                                    tbody
                                        tr(v-for="data in items")
                                            td
                                                router-link(:to="`/report/${data.rowid}`").page-back {{data.rowid}}
                                            td
                                                router-link(:to="`/report/${data.rowid}`" v-bind:class="{ 'p-table__status--sucess': data.status === 1, 'p-table__status--waiting': data.status === 3, 'p-table__status--failed': data.status === 2}").p-table__status
                                                    i.icon(v-bind:class="{ 'icon-status-success': data.status === 1, 'icon-status-waiting': data.status === 3, 'icon-status-failed': data.status === 2}")
                                                    span(v-if="data.status === 1") Success
                                                    span(v-if="data.status === 2") Fail
                                                    span(v-if="data.status === 3") In Progress
                                            td {{new Date(data.time).toString().slice(0, -14)}}
                                            
                                .p-container__more
                                    a(href="#" js-load-more).btn.btn-more
                                        span Load more
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

import { SUBMISSIONS, SUBMISSIONS_FAILURE, SUBMISSIONS_REQUEST } from '@/constants/types';

export default {
  name: 'submissions-page',
  computed: {
    items() {
        return this.$store.getters[SUBMISSIONS];
    },
    error() {
        return this.$store.getters[SUBMISSIONS_FAILURE];
    },
    loading() {
        return this.$store.getters[SUBMISSIONS_REQUEST];
    }
  },
  created () {
    this.$store.dispatch('fetchSubmissions');
  },
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
    moment: function () {
      return moment()
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>