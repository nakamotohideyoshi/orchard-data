<template lang="pug">
include _mixins
.header-wrapper
    // HEADER
    header.header
        .container
            .header__wrapper
                .header__logo
                    router-link(v-if="lastOpendRowId < 0" :to="'/'")
                        i.icon.icon-logo
                    router-link(v-else :to="`/report/${lastOpendRowId}`")
                        i.icon.icon-logo
                    span(v-if="isSalesDemoMode") *
                ul.header__menu
                    li
                        router-link(:to="'/submissions'").is-active
                            +icon('ico-home')
                            span Submissions ({{ submissions && submissions.length }})
                    li
                        router-link(:to="'/new-batch'").btn.btn-primary
                            span Add new dataset

                //- .header__hamburger(js-hamburger)
                //-     .hamburger.hamburger--squeeze
                //-         .hamburger-box
                //-         .hamburger-inner

    // header user dropdown
    // should be positioned outside header to prevent z-index conflicts
    ul.header__user-drop__options(js-header-dropdown-list)
        li
            a(href="#") Profile
        li
            a(href="#") Settings
        hr
        li
            a(href="#") Log Out  

    // MOBILE MENU
    .mobile-navi
        ul.mobile-navi__menu
            li
                router-link(:to="'/submissions'").is-active Submissions (20)
            li
                router-link(:to="'/new-batch'") Add new dataset
            li
                a(href="#") Profile
            li
                a(href="#") Settings
            li
                a(href="#") Log Out

</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { LAST_OPENED_ROW_ID, SUBMISSIONS, SALES_DEMO_MODE } from '@/constants/types'

export default {
  computed: {
    ...mapState({
      isSalesDemoMode: state => state[SALES_DEMO_MODE]
    }),
    ...mapGetters({
      lastOpendRowId: LAST_OPENED_ROW_ID,
      submissions: SUBMISSIONS
    })
  },
  name: 'app-header'
}
</script>
