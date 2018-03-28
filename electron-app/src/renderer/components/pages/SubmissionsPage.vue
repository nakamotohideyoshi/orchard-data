<template lang="pug">
#barba-wrapper
    .page(class=outClass)
        block header
            app-header
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
                                            td
                                    tbody
                                        tr(v-for="data in items")
                                            td
                                                router-link(v-if="data.status === 2" :to="`/report-error`").page-back {{data.rowid}}
                                                router-link(v-else :to="`/report/${data.rowid}`").page-back {{data.rowid}}
                                            td
                                                router-link(v-if="data.status === 1" :to="`/report/${data.rowid}`").p-table__status--sucess.p-table__status
                                                    i.icon.icon-status-success
                                                    span Success
                                                router-link(v-if="data.status === 2" :to="`/report-error`").p-table__status--failed.p-table__status
                                                    i.icon.icon-status-failed
                                                    span Fail
                                                router-link(v-if="data.status === 3" :to="`/report/${data.rowid}`").p-table__status--waiting.p-table__status
                                                    i.icon.icon-status-waiting
                                                    span In Progress
                                            td {{new Date(data.time).toString().slice(0, -14)}}
                                            td
                                                a(class="delete" @click.prevent.stop="deleteSubmission(data.rowid)" href="" title="delete")
                                                    img(src="/src/renderer/assets/icons/axe.png")

        block footer
            app-footer
</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

import { SUBMISSIONS, SUBMISSIONS_FAILURE, SUBMISSIONS_REQUEST } from '@/constants/types'
import { mapActions } from 'vuex'

export default {
  name: 'SubmissionsPage',
  methods: {
    ...mapActions(['deleteSubmission'])
  },
  computed: {
    items () {
      return this.$store.getters[SUBMISSIONS]
    },
    error () {
      return this.$store.getters[SUBMISSIONS_FAILURE]
    },
    loading () {
      return this.$store.getters[SUBMISSIONS_REQUEST]
    }
  },
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style scoped>
    .delete {
        color: red;
    }
</style>
