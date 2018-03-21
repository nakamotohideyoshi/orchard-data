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
                            
                                .p-box.report
                                    .report__tabs.report__tabs--disabled(js-scrollbar)
                                        a(href="#").report__tab.is-active {{ categoryOverallText }}
                                        a(href="#").report__tab {{ categoryItunesText }}
                                        a(href="#").report__tab {{ categoryCustomText }}

                                    // report blank
                                    .report-blank
                                        .report-blank__title Your report is being generated
                                        .report-blank__description 
                                        .report-blank__image
                                            img(src='~@/assets/img/report-blank.png' srcset='img/report-blank@2x.png 2x')

        block footer
            AppFooter
</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'
import {
  CUSTOM_CATEGORY,
  ITUNES_CATEGORY,
  OVERALL_CATEGORY
} from '@/constants/report-category'

export default {
  name: 'report-progress-page',
  components: {
    AppHeader,
    AppFooter
  },

  data () {
    return {
      categoryOverallText: OVERALL_CATEGORY,
      categoryItunesText: ITUNES_CATEGORY,
      categoryCustomText: CUSTOM_CATEGORY
    }
  },

  methods: {}
}
</script>
