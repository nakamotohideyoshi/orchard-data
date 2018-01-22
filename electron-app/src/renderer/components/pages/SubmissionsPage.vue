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
                                            td {{data.id}}
                                            td
                                                div.p-table__status(v-bind:class="data.status === 1 ? 'p-table__status--waiting' : 'p-table__status--sucess'")
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

export default {
  name: 'submissions-page',
  data () {
    return {
      dbData: []
    }
  },
  computed: {
    list1: function () {
      var sqlite3 = require('sqlite3').verbose()
      var db = new sqlite3.Database('db.sqlite')
      var that = this
      db.all('SELECT  * FROM data ORDER BY time DESC', function (err, rows) {
        if (err) {
          console.log('error')
        }
        if (rows) {
          that.dbData = rows
          console.log(rows)
        }
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