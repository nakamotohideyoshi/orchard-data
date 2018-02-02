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
                                    span Submissions
                        
                                .p-box.report
                                    .report__tabs.report__tabs--disabled(js-scrollbar)
                                        a(href="#").report__tab.is-active Overall Risk Assessment
                                        a(href="#").report__tab Apple & Itunes Guidelines
                                        a(href="#").report__tab Custom Parameters
                                    
                                    // report blank
                                    .report-blank
                                        .report-blank__title Your report is being generated
                                        .report-blank__description We will send you an email at <a href="mailto">email@emailaddress.com</a> as soon as the report is ready for review.
                                        .report-blank__image
                                            img(src='~@/assets/img/report-blank.png' srcset='img/report-blank@2x.png 2x')

        block footer
            AppFooter
</template> 

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'report-progress-page',
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>