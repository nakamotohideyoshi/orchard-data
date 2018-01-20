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
                                router-link(:to="'/submissions'").page-back
                                    .icon.icon-arrow-back
                                    span Report Summary
                                    
                                // report box
                                .p-box.report
                                    // summary
                                    .report-summary
                                        .report-summary__col
                                            .report-summary__head risk analysis
                                            .report-summary__text.report-summary__text--red Errors Per Row 
                                        .report-summary__label.report-summary__label--red failed
                                        .report-summary__col
                                            .report-summary__head batch id
                                            .report-summary__text 1020
                                        .report-summary__col
                                            .report-summary__head batch
                                            .report-summary__text Monday June 12th 2017 11:00AM PST
                                        .report-summary__col
                                            .report-summary__head download
                                            a(href="#").report-summary__text
                                                +icon('ico-download')
                                    
                                    // tabs
                                    .report__tabs.report__tabs--left(js-scrollbar)
                                        button(v-on:click='showOverallRistk()' v-bind:class="{ 'is-active': overallRiskFlag == true }").report__tab Overall Risk Assessment
                                        button(v-on:click='showAppleTab()' v-bind:class="{ 'is-active': appleTabFlag == true }").report__tab Apple & Itunes Guidelines
                                        button(v-on:click='showCustom()' v-bind:class="{ 'is-active': customFlag == true }").report__tab Custom Parameters
                                    

                                    // summary
                                    .report-container(v-if="appleTabFlag")
                                        .report__top
                                            .report__top-col
                                                .report__top-percent 37%
                                                .report__top-description Total percent of rows with errors
                                            .report__top-col
                                                .report__top-stars
                                                    +icon('ico-star-filled')
                                                    +icon('ico-star-filled')
                                                    +icon('ico-star-filled')
                                                    +icon('ico-star-empty')
                                                    +icon('ico-star-empty')
                                                .report__top-description Overall data quality
                                        
                                        // report view
                                        .report__view
                                            .report__view-title What are the biggest problems with the dataset?
                                            a(href="#").report__view-link
                                                +icon('ico-document')
                                                span View the test criteria scores
                                        .report__view
                                            .report__view-title What is the sum of problems in each row?
                                            a(href="#").report__view-link
                                                +icon('ico-document')
                                                span View the input row scores
                                        .report__view
                                            .report__view-title Which fields in the dataset failed?
                                            a(href="#").report__view-link
                                                +icon('ico-document')
                                                span View the field level issues

                                    .report-container(v-if="overallRiskFlag")
                                        .report__top
                                            h1 This page not yet implemented

                                    .report-container(v-if="customFlag")
                                        .report__top
                                            h1 This is Custom page
        block footer
            AppFooter
</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'report-page',
  components: {
    AppHeader,
    AppFooter
  },
  data: function() {
    return {
      overallRiskFlag: false,
      appleTabFlag: true,
      customFlag: false
    }
    
  },
  methods: {
    showOverallRistk: function () {
      this.overallRiskFlag = true
      this.appleTabFlag = false
      this.customFlag = false
    },
    showAppleTab: function () {
      this.appleTabFlag = true
      this.overallRiskFlag = false
    },
    showCustom: function () {
      this.customFlag = true
      this.overallRiskFlag = false
      this.appleTabFlag = false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../../assets/styles/app.sass";
</style>