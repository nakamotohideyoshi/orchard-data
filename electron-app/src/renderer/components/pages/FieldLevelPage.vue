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

                                router-link(:to="'/submissions'").page-back
                                    .icon.icon-arrow-back
                                    span Report Summary
                        
                                .p-box.report
                                    // summary
                                    .report-summary
                                        .report-summary__col
                                            .report-summary__head risk analysis
                                            .report-summary__text.report-summary__text--red Errors Per Row 
                                        .report-summary__label.report-summary__label--red failed
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text {{moment(batchData.batchDate).format('MM-DD-YYYY. HH:mm')}}
                                        .report-summary__col
                                            .report-summary__head download
                                            a(href="../../../../tests/data/test.tsv" download).report-summary__text
                                                +icon('ico-download')
                                
                                // more btn
                                .p-container__more
                                    a(href="#" js-load-more).btn.btn-more
                                        span Load more

                //- include components/_modal
        block footer
            AppFooter
</template>

<script>
import moment from 'moment'

import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'field-level-page',
  components: {
    AppHeader,
    AppFooter
  },
  data () {
    return {
      batchData: {
        batchDate: new Date()
      }
    }
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