<template lang="pug">
include ../pages/_mixins
.report__top
    .report__top-col
        .report__top-percent {{percentage}} %
        .report__top-description Total percent of rows with errors
    .report__top-col
        .report__top-stars
            .success(v-for="stars in filledStars")
                +icon('ico-star-filled')
            .failed(v-for="stars in emptyStarts")
                +icon('ico-star-empty')
        .report__top-description Overall data quality
    .report__top-col(v-if="vacount_percent !== null")
        .report__top-percent {{vacount_percent}} %
        .report__top-description Various Artists
</template>

<script>
  export default {
    name: 'report-summary-quality',
    props: {
      reportSummary: {
        type: Object,
        required: true
      }
    },

    computed: {
      vacount_percent () {
        if (this.reportSummary.hasOwnProperty('vacount_percent')) {
          return (this.reportSummary.vacount_percent * 100).toFixed(2)
        }

        return null
      },
      percentage () {
        return (this.reportSummary.error_percent * 100).toFixed(2)
      },
      filledStars () {
        return this.reportSummary.error_stars
      },

      emptyStarts () {
        return (5 - this.reportSummary.error_stars)
      }
    }
  }
</script>

<style scoped>
</style>