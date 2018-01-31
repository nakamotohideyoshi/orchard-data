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
                                    h1 All Submissions ({{dbData.length}})
                                    .page-title__num {{dbData.length}}


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
                                        tr(v-for="data in dbData")
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

export default {
  name: 'submissions-page',
  data () {
    return {
      dbData: []
    }
  },
  created () {
    this.$http
      .post('http://localhost:3000/api/fetch-dataset-meta', {
        'headers': {
          'content-type': 'application/json'
        }
      })
      .then((res) => {
        console.log(res)
        this.dbData = res.data
      })
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