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
      percentage () {
        return (this.reportSummary.error_percent * 100).toFixed(2)
      },
      filledStars () {
        if (this.reportSummary && this.reportSummary.hasOwnProperty('error_percent')) {
          return Math.round((1 - this.reportSummary.error_percent) * 5)
        }

        return 0
      },

      emptyStarts () {
        return 5 - this.filledStars
      }
    }
  }
</script>

<style scoped>
</style>