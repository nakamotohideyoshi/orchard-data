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
                                                    span Date Created {{list1}}
                                    tbody
                                        tr(v-for="data in dbData")
                                            td 
                                                router-link(:to="`/report/${data.id}`").page-back {{data.id}}
                                            td
                                                router-link(:to="`/report/${data.id}`" v-bind:class="data.status === 1 ? 'p-table__status--waiting' : 'p-table__status--sucess'").p-table__status
                                                    i.icon(v-bind:class="data.status === 1 ? 'icon-status-waiting' : 'icon-status-success'")
                                                    span {{data.status === 1 ? 'Waiting' : 'Success'}}
                                            td {{moment(data.time).format('MM-DD-YYYY. HH:mm')}}
                                        
                                
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

const analysisLibModule = require('../../../../../analysis-lib/analysis-lib-module');
const dbInterface = new analysisLibModule.dbInterface();

export default {
  name: 'submissions-page',
  data () {
    return {
      dbData: []
    }
  },
  computed: {
    list1: function () {
      dbInterface.init();
      dbInterface.fetchDatasetMeta()
      .then((res) => {
        this.dbData = res
      })
      return ''
    }
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